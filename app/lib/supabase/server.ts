/**
 * Server-side Supabase client (used by API route handlers).
 *
 * Prefers the SERVICE ROLE key (bypasses RLS, recommended for production).
 * Falls back to the public ANON key — that works only if RLS is disabled
 * on the `reviews` table OR you've added explicit policies allowing
 * select/insert for the `anon` role.
 *
 * NEVER use this module from client components — only API routes.
 *
 * Required env vars (any one combination):
 *
 *   SUPABASE_URL=https://YOUR-PROJECT.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # preferred
 *   SUPABASE_ANON_KEY=eyJhbGciOi...           # fallback (RLS off / open policy)
 *
 * Full schema + demo seed SQL lives at: `supabase/reviews.sql`
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

/**
 * Sanitize a Supabase project URL pasted from the dashboard. Handles the
 * three common mistakes:
 *   - trailing whitespace / newlines
 *   - trailing `/rest/v1` or trailing slash
 *   - missing `https://` scheme
 */
function normalizeUrl(raw: string): string {
  let url = (raw || '').trim()
  if (!url) return ''
  url = url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`
  return url
}

export function getSupabaseServer(): SupabaseClient | null {
  if (cached) return cached
  const url = normalizeUrl(process.env.SUPABASE_URL || '')
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim()
  if (!url || !key) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[supabase] missing env vars',
        { hasUrl: !!url, hasKey: !!key }
      )
    }
    return null
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

/**
 * Returns a non-secret diagnostic snapshot of which env vars are visible
 * to the running process. Used by /api/reviews/health.
 */
export function getSupabaseConfigStatus() {
  const rawUrl = (process.env.SUPABASE_URL || '').trim()
  const normalised = normalizeUrl(rawUrl)
  return {
    hasUrl: !!rawUrl,
    urlNormalisedHost: normalised
      ? normalised.replace(/^https?:\/\//, '').split('/')[0]
      : null,
    hasServiceRoleKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
    hasAnonKey: !!(process.env.SUPABASE_ANON_KEY || '').trim(),
    configured: !!getSupabaseServer(),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || null,
  }
}

/**
 * Shape of a row stored in `public.reviews`.
 */
export interface OneLinkReviewRow {
  id: string
  author_name: string
  rating: number
  text: string
  approved: boolean
  source: string
  device_key?: string | null
  created_at: string
}
