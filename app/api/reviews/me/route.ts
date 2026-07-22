/**
 * GET /api/reviews/me?deviceKey=<uuid>
 *
 * Returns whether the visitor has already submitted a review, plus the
 * review itself if it exists. Defence-in-depth: looks up by **either** the
 * server-set httpOnly cookie OR the localStorage deviceKey passed in the
 * query string. Whichever one matches an approved row wins.
 *
 * Used by ReviewForm on mount so a refresh / new tab / cleared
 * localStorage all keep the "thank you" state instead of showing the form
 * again.
 */

import { NextResponse } from 'next/server'
import {
  getSupabaseServer,
  OneLinkReviewRow,
} from '../../../lib/supabase/server'
import {
  collectDeviceKeys,
  readDeviceCookie,
  writeDeviceCookie,
} from '../../../lib/reviews/deviceCookie'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - then)
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
  const month = Math.floor(day / 30)
  if (month < 12) return `${month} month${month === 1 ? '' : 's'} ago`
  const year = Math.floor(month / 12)
  return `${year} year${year === 1 ? '' : 's'} ago`
}

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' } as const

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queryKey = (searchParams.get('deviceKey') || '').trim()
  const cookieKey = readDeviceCookie(request)

  const candidates = collectDeviceKeys(cookieKey, queryKey)

  // Brief, non-secret server log for Vercel function logs. Helps debug
  // "form shows on refresh" issues without exposing the cookie value.
  console.log('[reviews/me]', {
    cookiePresent: !!cookieKey,
    queryPresent: !!queryKey,
    candidates: candidates.length,
  })

  if (candidates.length === 0) {
    return NextResponse.json(
      { ok: true, submitted: false, configured: true },
      { headers: NO_STORE }
    )
  }

  const supabase = getSupabaseServer()
  if (!supabase) {
    return NextResponse.json(
      { ok: true, submitted: false, configured: false },
      { headers: NO_STORE }
    )
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .in('device_key', candidates)
    .limit(1)

  if (error) {
    console.error('[reviews/me] supabase error', error.code, error.message)
    return NextResponse.json(
      { ok: false, error: 'Failed to look up review.' },
      { status: 500, headers: NO_STORE }
    )
  }

  if (!data || data.length === 0) {
    console.log('[reviews/me] no row matched device_key candidates')
    return NextResponse.json(
      { ok: true, submitted: false, configured: true },
      { headers: NO_STORE }
    )
  }

  const row = data[0] as OneLinkReviewRow
  const res = NextResponse.json(
    {
      ok: true,
      submitted: true,
      configured: true,
      review: {
        id: row.id,
        authorName: row.author_name,
        rating: row.rating,
        text: row.text,
        createdAt: row.created_at,
        relativeTime: relativeTime(row.created_at),
      },
    },
    { headers: NO_STORE }
  )

  // Re-affirm the device cookie so future visits are resilient.
  if (row.device_key) writeDeviceCookie(res, row.device_key)
  return res
}
