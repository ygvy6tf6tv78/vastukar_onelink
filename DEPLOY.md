# Deploying Vastukar Architects OneLink to Vercel

Checklist to push this site live with **Reviews + strict
one-review-per-device** working out of the box.

## 1. Supabase setup (one-time)

1. Open your Supabase project (or create a new one).
2. Open **SQL Editor → + New query**.
3. Paste the entire contents of [`supabase/reviews.sql`](./supabase/reviews.sql)
   and click **Run**. This creates:
   - `public.reviews` table
   - **UNIQUE index on `device_key`** (the per-device guarantee)
   - RLS policies (anon can read approved + insert, nothing else)
   - 3 demo reviews (delete in production if you want a clean slate)
4. Verify under **Authentication → Policies** that the `reviews` table has:
   - **`Approved reviews are public`**  → SELECT, anon, `using (approved = true)`
   - **`Anyone can submit a review`**   → INSERT, anon
5. Copy two values from **Project Settings → API**:
   - `Project URL` → `SUPABASE_URL`
   - **service_role** JWT → `SUPABASE_SERVICE_ROLE_KEY` *(recommended)*
   - or **anon public** JWT → `SUPABASE_ANON_KEY` *(works as a fallback)*

> Use **service_role** in production whenever possible — it bypasses RLS,
> so the duplicate-check select still works even if you ever flip an
> existing review to `approved = false`.

## 2. Push the repo to GitHub

```bash
git push origin main
```

(`.env.local` and `public/uploads/` are git-ignored — no secrets leak.)

## 3. Import the repo in Vercel

1. https://vercel.com/new → **Import Git Repository** → pick this repo.
2. Vercel auto-detects **Next.js**. Leave the build settings at defaults
   (build = `next build`, output dir = `.next`).
3. Add the **Environment Variables** below (production scope) **before**
   clicking Deploy. **Any later change requires a redeploy** (Deployments
   → ⋯ → Redeploy → uncheck "use existing build cache"):

| Name                          | Required | Value                       | Notes                                       |
| ----------------------------- | -------- | --------------------------- | ------------------------------------------- |
| `SUPABASE_URL`                | yes      | `https://xxxx.supabase.co`  | trailing `/rest/v1` is auto-stripped        |
| `SUPABASE_SERVICE_ROLE_KEY`   | preferred| `eyJhbGciOi...`             | bypasses RLS — recommended                  |
| `SUPABASE_ANON_KEY`           | fallback | `eyJhbGciOi...`             | only needed if service-role isn't set       |
| `DIAG_TOKEN`                  | optional | random 32+ char string      | unlocks `/api/_internal/diag` (see §6)      |
| `GOOGLE_PLACES_API_KEY`       | recommended | Google Places API key   | enables live Google rating and reviews      |

> If both `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_ANON_KEY` are set,
> the service-role one wins.

4. Click **Deploy**. First build takes ~60s.

## 4. After first deploy

- Open `https://your-app.vercel.app/reviews` → you should see the demo
  reviews and the form.
- Fill the form and submit a real review. Refresh the page — the form
  must show your review back to you in the "Thanks for your review!"
  state and **not** let you submit again.
- Open **Supabase → Table Editor → reviews** to confirm the row landed
  with `device_key` populated.

## 5. How "one review per device" works (live)

Server-driven, no localStorage:

| Layer | Mechanism                                              | Survives                              |
| ----- | ------------------------------------------------------ | ------------------------------------- |
| 1     | `httpOnly` `ol_dk` cookie set by the server (2 years)  | refresh, new tab, app reopen          |
| 2     | Postgres `UNIQUE(device_key)` on the row               | races, retries, direct DB writes      |

On every POST `/api/reviews` the server:

1. Reads the `ol_dk` cookie. If absent, **mints a UUID server-side**.
2. Checks the DB for that `device_key`. If a row exists → **HTTP 409**.
3. Inserts the new row, sets `Set-Cookie: ol_dk=<uuid>; HttpOnly; Secure;
   SameSite=Lax; Max-Age=63072000`.

On every page load `ReviewForm` calls `GET /api/reviews/me` with
`credentials: 'include'`. The endpoint reads the cookie and returns
either `{ submitted: true, review: { … } }` or `{ submitted: false }`.
The form renders the matching state — never localStorage.

### Limits (be honest with the user)

| Bypass            | Result                                                            |
| ----------------- | ----------------------------------------------------------------- |
| Refresh           | Blocked. Cookie + DB still match.                                 |
| New tab / window  | Blocked. Cookie is shared across tabs in the same browser.        |
| App restart       | Blocked. Cookie persists for 2 years.                             |
| Clear ALL cookies | Allowed. No identifier survives — counts as a "new" device.       |
| Incognito         | Allowed. Incognito has its own cookie jar.                        |
| Different browser | Allowed. Different cookie jar.                                    |
| Different phone   | Allowed.                                                          |
| Embedded iframe   | **Blocked-but-different**. Some browsers (Safari, Firefox strict, Brave) block 3rd-party cookies — see §7. |

If you need *true* one-account-one-review (one human across devices),
flip on Supabase Auth (email/phone OTP) and use `auth.uid()` instead of a
device key — upgrade SQL is at the bottom of `supabase/reviews.sql`.

## 6. Diagnostic endpoint (gated, hard to find)

When something breaks in production, hit:

```
https://your-app.vercel.app/api/_internal/diag?token=<DIAG_TOKEN>
```

> Without the right token (or if `DIAG_TOKEN` env var is unset), this
> route returns **404** — to outsiders it looks like the route doesn't
> exist. The path is intentionally not under `/api/reviews/*` so it
> isn't trivially guessable.

It returns:

```json
{
  "configured": true,
  "hasUrl": true,
  "hasServiceRoleKey": false,
  "hasAnonKey": true,
  "dbReachable": true,
  "dbError": null,
  "totalApprovedReviews": 4,
  "cookie": {
    "present": true,                 ← KEY: must be true after a submit
    "value": "uuid-here",
    "rawCookieKeys": ["ol_dk", "..."]
  },
  "myReviewMatch": "found"           ← "found" / "not_found" / "skipped"
}
```

**Debugging the "form shows again on refresh" bug:**

| What you see                                | Means                                          | Fix                                                                              |
| ------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------- |
| `cookie.present: false` after a submit      | Browser refused / blocked the cookie           | Check 3rd-party cookie blocking — see §7                                         |
| `cookie.present: true`, `myReviewMatch: not_found` | DB lookup is failing                    | RLS policy missing — re-run the SELECT policy in `supabase/reviews.sql`          |
| `dbReachable: false`                        | Env vars missing on Vercel                     | Add `SUPABASE_URL` + key, redeploy                                                |
| `myReviewMatch: found`                      | Server is correctly identifying you            | The bug is on the **client** — see browser DevTools steps below                  |

## 7. Browser-side debugging (for the user, not the developer)

If `/api/_internal/diag` shows everything is fine but the form still
re-appears for the user, the cookie isn't surviving the browser
round-trip.

1. Open the site in **the same browser the user is testing in**.
2. DevTools → **Application** → **Cookies** → `https://your-app...`.
3. Submit a review. The `ol_dk` cookie should appear immediately with:
   - Name: `ol_dk`
   - Value: a UUID
   - HttpOnly: ✓
   - Secure: ✓
   - SameSite: `Lax`
   - Expires: 2 years out

If the cookie is **missing** after a submit, the browser is blocking it.
Most common causes:

- **Embedded in an iframe under a different parent domain** (the OneLink
  card site loaded via `<iframe>` from another origin). Safari, Firefox
  strict mode, and Brave block 3rd-party cookies by default. Solution:
  serve the site from the same eTLD+1 as the parent (CNAME or subdomain
  like `dogra.onelink.cards`), don't iframe it across origins.
- **Browser extension blocking cookies** (privacy extensions, etc.).
- **iOS Safari "Prevent Cross-Site Tracking"** — only matters in iframes;
  first-party access is unaffected.

If the cookie **is present** but `/api/reviews/me` still returns
`submitted: false` — share the diag JSON output and the **Network** tab
screenshot of `/api/reviews/me` (with the request **and** response
headers visible) and we'll diagnose from there.

## 8. Custom domain

In Vercel → **Project → Settings → Domains** point your CNAME at the
deployed URL. The httpOnly cookie is set with `secure: true`
automatically because `NODE_ENV === 'production'` on Vercel. If you
serve the site from `dogra.onelink.cards` (subdomain of `onelink.cards`),
cookies stay first-party and survive everywhere.

## 9. Troubleshooting

- **`/api/reviews` returns 503** → env vars missing on Vercel. Set
  `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_ANON_KEY`)
  and redeploy.
- **Form shows even after submitting on production** → run the diag
  endpoint (§6) and follow the table.
- **`23505 duplicate key`** in Vercel function logs is *normal* — that's
  Layer 2 working. The API converts it to a 409 and the form switches to
  "already submitted".
- **Browser console error mentions CORS** → the API and the page must be
  served from the **same origin**. Don't fetch the API from a different
  domain.
- **iOS Safari "page reloads when I scroll"** → fixed in `app/globals.css`
  via `overscroll-behavior-y: contain` on `html, body`.
