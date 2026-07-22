# Vastukar Architects — OneLink

Mobile-first OneLink card for Vastukar Architects, Jammu. Built with Next.js 14 and ready for Vercel.

## Local development

```bash
pnpm install
pnpm dev
```

## Production

```bash
pnpm build
pnpm start
```

## Google Reviews on Vercel

The Vastukar Google Place ID is already configured. Add this server-side variable in **Vercel → Project Settings → Environment Variables** and redeploy:

```text
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

Until the key is added, the site shows a safe reviews fallback. Once the key is available, the same review section automatically displays the live Google rating and reviews.

Optional Place ID override:

```text
NEXT_PUBLIC_GOOGLE_PLACE_ID=ChIJ0WlgzNWFHjkRNMeCKOoknOY
```

## Vercel

Import `ygvy6tf6tv78/vastukar_onelink` in Vercel. The included `vercel.json` uses pnpm and the standard Next.js build output.
