/**
 * GET /api/_internal/diag?token=$DIAG_TOKEN
 *
 * Token-gated diagnostic endpoint. Returns no secret values — only:
 *   - whether Supabase env vars are visible
 *   - whether the DB is reachable
 *   - what the `ol_dk` cookie holds for THIS browser
 *   - whether a row exists for that cookie's device_key
 *
 * Use this when "I submitted a review but refresh shows the form again"
 * happens on production. The endpoint will tell us exactly whether the
 * cookie is being persisted and whether the DB lookup matches.
 *
 * Setup:
 *   1. Add an env var on Vercel:    DIAG_TOKEN=<long-random-string>
 *   2. Visit            /api/_internal/diag?token=<that-string>
 *   3. Without the right token → 404 (looks like the route doesn't exist).
 *
 * The path is intentionally not under /api/reviews/* and not named
 * "health" — random scanners can't trivially find it.
 */

import { NextResponse } from 'next/server'
import {
  getSupabaseServer,
  getSupabaseConfigStatus,
} from '../../../lib/supabase/server'
import { readDeviceCookie } from '../../../lib/reviews/deviceCookie'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function notFound() {
  return new NextResponse('Not Found', { status: 404 })
}

export async function GET(request: Request) {
  const expected = (process.env.DIAG_TOKEN || '').trim()
  if (!expected) return notFound()

  const { searchParams } = new URL(request.url)
  const provided = (searchParams.get('token') || '').trim()
  if (!provided || provided !== expected) return notFound()

  const status = getSupabaseConfigStatus()
  const cookieKey = readDeviceCookie(request)
  const cookieHeader = request.headers.get('cookie') || ''

  let dbReachable = false
  let dbError: string | null = null
  let totalApprovedReviews: number | null = null
  let myReviewMatch: 'found' | 'not_found' | 'skipped' = 'skipped'
  let myReview: { id: string; created_at: string } | null = null

  if (status.configured) {
    const supabase = getSupabaseServer()
    if (supabase) {
      const total = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
      if (total.error) {
        dbError = `${total.error.code || ''} ${total.error.message || ''}`.trim()
      } else {
        dbReachable = true
        totalApprovedReviews = total.count ?? 0
      }

      if (cookieKey) {
        const lookup = await supabase
          .from('reviews')
          .select('id, created_at')
          .eq('device_key', cookieKey)
          .limit(1)
        if (lookup.error) {
          dbError = `${lookup.error.code || ''} ${lookup.error.message || ''}`.trim()
        } else if (lookup.data && lookup.data.length > 0) {
          myReviewMatch = 'found'
          myReview = lookup.data[0]
        } else {
          myReviewMatch = 'not_found'
        }
      }
    }
  }

  return NextResponse.json(
    {
      ...status,
      dbReachable,
      dbError,
      totalApprovedReviews,
      cookie: {
        present: !!cookieKey,
        value: cookieKey,
        rawCookieHeaderLength: cookieHeader.length,
        rawCookieKeys: cookieHeader
          .split(';')
          .map((c) => c.split('=')[0]?.trim())
          .filter(Boolean),
      },
      myReviewMatch,
      myReview,
      now: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  )
}
