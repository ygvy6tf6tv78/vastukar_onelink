# Section-Aware Back Navigation

How "Back" knows whether to drop you on the **hero card** or scroll you to
the **section you came from** (Gallery / Services / Reviews).

Use this doc as a copy-paste prompt for Cursor in any future OneLink
shop card site that wants the same UX.

## Goals

1. From a homepage **section** (e.g. "View Gallery", "View All
   Services", "View All Reviews") → inner page (`/gallery`,
   `/services`, `/reviews`) → **Back** lands on **that section** of the
   homepage, scrolled into view.
2. From the **hero card** (ActionsRow buttons inside the rotating 3D
   card, or any card-level CTA) → inner page → **Back** lands on the
   **hero card front face** at the top.
3. No loading screen flash on either back path — the home page mounts
   immediately.
4. No stale `#hash` lingering in the URL.

## Files involved

```
app/lib/homeNavigation.ts                       ← single source of truth
app/page.tsx                                    ← consumes the flag on mount
app/shops/<shop>/components/Gallery.tsx         ← sets section flag
app/shops/<shop>/components/OnelinkReviews.tsx  ← sets section flag
app/shops/<shop>/components/MenuPreview.tsx     ← sets section flag
app/shops/<shop>/components/ServicesOverview.tsx← sets section flag
app/shops/<shop>/components/ActionsRow.tsx      ← prepares hero-card return
app/shops/<shop>/components/UrgencyCTA.tsx      ← prepares hero-card return
app/services/page.tsx                           ← back button → "/"
app/reviews/page.tsx                            ← back button → "/"
app/gallery/page.tsx                            ← back button → "/"
```

## Two return modes (mutually exclusive)

```ts
// app/lib/homeNavigation.ts
export type HomeReturnSection = 'gallery' | 'services' | 'reviews'

export function prepareReturnToHeroCard(): void { /* ... */ }
export function setReturnSection(section: HomeReturnSection): void { /* ... */ }
export function consumeReturnSection(): HomeReturnSection | null { /* ... */ }
export function consumeSkipLoad(): boolean { /* ... */ }
```

Storage keys used in `sessionStorage`:

| Key                  | Purpose                                                       |
| -------------------- | ------------------------------------------------------------- |
| `homeReturnSection`  | `'gallery'` / `'services'` / `'reviews'` — scroll-to target   |
| `forceHeroFront`     | Set by hero-card flow → flips 3D card back to front face      |
| `homeBackSkipLoad`   | Either flow sets this so the splash screen is skipped on back |

The two helpers are **mutually exclusive** by design: setting the section
clears `forceHeroFront`, and setting hero-card return clears the section.
Use whichever one matches the user intent — never both.

## Wiring rules

### A. Section "View All" CTAs → set the section flag

```tsx
import { setReturnSection } from '../../../lib/homeNavigation'

<Link
  href="/gallery"
  onClick={() => setReturnSection('gallery')}
>
  View Gallery
</Link>
```

Apply the same pattern to:

- Gallery thumbnails / "View Gallery" → `setReturnSection('gallery')`
- "View All Services" buttons (MenuPreview, ServicesOverview)        → `setReturnSection('services')`
- "View All Reviews" / "Write a Review" buttons (OnelinkReviews)     → `setReturnSection('reviews')`

### B. Hero card actions → prepare hero-card return

```tsx
import { prepareReturnToHeroCard } from '../../../lib/homeNavigation'

<Link
  href="/services"
  onClick={(e) => {
    e.stopPropagation()
    prepareReturnToHeroCard()
  }}
>
  Our Services
</Link>
```

Apply to every link inside `ActionsRow.tsx` (Our Services, Reviews,
Gallery) and to UrgencyCTA's `router.push('/services')`.

### C. Inner-page back buttons → just navigate to `/`

The back buttons on `/services`, `/reviews`, `/gallery` do **not** need
to call any helper — they simply `<Link href="/" />`. Whichever flag
was set when the user originally navigated away is still in
sessionStorage; the home page consumes it.

```tsx
import Link from 'next/link'

<Link href="/" prefetch>
  <ArrowLeft />
</Link>
```

### D. Home page consumes both flags on mount

```tsx
// app/page.tsx (excerpt)
const [restoreSection, setRestoreSection] = useState<HomeReturnSection | null>(null)

useEffect(() => {
  if (typeof window === 'undefined') return
  const section = consumeReturnSection()
  const skipLoad = consumeSkipLoad() || section !== null
  if (section) setRestoreSection(section)
  if (skipLoad) {
    setShowLoading(false)
    if (!section) window.scrollTo(0, 0)   // hero-card return
    return
  }
  // …show loading splash on cold loads…
}, [])

useEffect(() => {
  if (showLoading) return
  if (restoreSection) {
    const id = restoreSection
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
      setRestoreSection(null)
    }, 50)            // wait one paint so DOM is in place
    return () => clearTimeout(t)
  }
  // strip stale hashes
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname)
  }
}, [showLoading, restoreSection])
```

### E. Section components must use stable `id` attributes

Each homepage section needs an `id` matching the value passed to
`setReturnSection(...)`:

```tsx
<section id="gallery" /* ... */>     {/* matches setReturnSection('gallery')  */}
<section id="reviews" /* ... */>     {/* matches setReturnSection('reviews')  */}
<section id="services" /* ... */>    {/* matches setReturnSection('services') */}
```

If `document.getElementById(id)` returns null on the home page, scrolling
silently no-ops. Always grep for `id="<section>"` after wiring.

## iOS Safari pull-to-refresh — also covered

The "page mysteriously refreshes when I scroll" bug on iOS Safari is
**pull-to-refresh** firing when the user swipes down at the top. Fix:

```css
/* app/globals.css — global, top of file */
html,
body {
  overscroll-behavior-y: contain;
}
```

This neutralises the refresh gesture without breaking native momentum
scroll. Verified on iOS Safari 17+.

## Quick prompt for Cursor (paste into a new shop card project)

> Add section-aware back navigation to my Next.js card site.
> Follow the pattern in
> `https://github.com/onelinkcards/Dogra-Associates-Onelink/blob/main/docs/NAVIGATION.md`:
>
> 1. Create `app/lib/homeNavigation.ts` with
>    `prepareReturnToHeroCard`, `setReturnSection`, `consumeReturnSection`,
>    `consumeSkipLoad`.
> 2. Wire each homepage section's "View All" CTA to call
>    `setReturnSection('<section-id>')`.
> 3. Wire each hero-card link to call `prepareReturnToHeroCard()`.
> 4. Make the inner-page back buttons plain `<Link href="/" />`.
> 5. Make `app/page.tsx` consume the flags on mount and `scrollIntoView`
>    the requested section after one paint.
> 6. Add `overscroll-behavior-y: contain` on `html, body` in
>    `app/globals.css` to disable iOS pull-to-refresh.

## Pitfalls to avoid

- **Don't use `window.history.back()`** for the back button. It can
  navigate the user to an external referrer. Always `<Link href="/" />`.
- **Don't use `behavior: 'smooth'`** for the section restore — it
  competes with the fade-in animation and can land the user partway
  between sections. Use `'auto'`.
- **Don't read the flags during render** — only inside `useEffect`,
  otherwise SSR mismatches occur.
- **Always wrap `sessionStorage` access in try/catch** — Safari Private
  Browsing throws.
- **Don't set both `forceHeroFront` and `homeReturnSection`** — they
  conflict. The helpers in `homeNavigation.ts` already enforce this.
