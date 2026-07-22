/**
 * Canonical public site URL (no trailing slash).
 * Used for: vCard URL (Save contact), Open Graph, metadataBase, JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL on Vercel for the final public domain.
 */
export const PUBLIC_SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vastukararchitects.com').replace(/\/$/, '')
