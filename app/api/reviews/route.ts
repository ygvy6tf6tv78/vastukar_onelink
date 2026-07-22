/**
 * OneLink Reviews API
 *
 *   GET  /api/reviews   → returns approved reviews + aggregate rating
 *   POST /api/reviews   → submits a new review (author_name, rating, text)
 *
 * Persistence is via Supabase (see `app/lib/supabase/server.ts`). When
 * Supabase env vars are not configured the GET endpoint responds with a
 * graceful empty-state payload and POST returns a 503, so the UI keeps
 * working in local development before keys are added.
 */

import { NextResponse } from 'next/server'
import { getSupabaseServer, OneLinkReviewRow } from '../../lib/supabase/server'
import {
  isValidDeviceKey,
  readDeviceCookie,
  writeDeviceCookie,
} from '../../lib/reviews/deviceCookie'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ReviewDTO {
  id: string
  authorName: string
  rating: number
  text: string
  createdAt: string
  relativeTime: string
}

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

function toDTO(row: OneLinkReviewRow): ReviewDTO {
  return {
    id: row.id,
    authorName: row.author_name,
    rating: row.rating,
    text: row.text,
    createdAt: row.created_at,
    relativeTime: relativeTime(row.created_at),
  }
}

const LIST_NO_STORE = { 'Cache-Control': 'no-store, max-age=0' } as const

export async function GET() {
  const supabase = getSupabaseServer()
  if (!supabase) {
    return NextResponse.json(
      {
        configured: false,
        rating: 0,
        totalReviews: 0,
        reviews: [] as ReviewDTO[],
      },
      { headers: LIST_NO_STORE }
    )
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[reviews] GET error', error)
    return NextResponse.json(
      { configured: true, error: 'Failed to load reviews' },
      { status: 500, headers: LIST_NO_STORE }
    )
  }

  const rows = (data || []) as OneLinkReviewRow[]
  const totalReviews = rows.length
  const rating =
    totalReviews === 0
      ? 0
      : Math.round(
          (rows.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews) *
            10
        ) / 10

  return NextResponse.json(
    {
      configured: true,
      rating,
      totalReviews,
      reviews: rows.map(toDTO),
    },
    { headers: LIST_NO_STORE }
  )
}

interface SubmitBody {
  authorName?: string
  rating?: number
  text?: string
}

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' } as const

export async function POST(request: Request) {
  const supabase = getSupabaseServer()
  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      },
      { status: 503, headers: NO_STORE }
    )
  }

  let body: SubmitBody
  try {
    body = (await request.json()) as SubmitBody
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400, headers: NO_STORE }
    )
  }

  const authorName = (body.authorName || '').toString().trim()
  const text = (body.text || '').toString().trim()
  const rating = Number(body.rating)
  const cookieDeviceKey = readDeviceCookie(request)

  console.log('[reviews] POST', {
    cookiePresent: !!cookieDeviceKey,
    authorLen: authorName.length,
    rating,
    textLen: text.length,
  })

  // If the user already has a cookie, look up the DB first — duplicate
  // catch before we waste an INSERT round-trip. We pull the FULL row so
  // the client can render the "thanks" UI immediately without a 2nd
  // round-trip — important for flaky mobile networks where the second
  // /api/reviews/me call sometimes drops on iOS Safari / in-app browsers.
  if (cookieDeviceKey && isValidDeviceKey(cookieDeviceKey)) {
    const { data: existingRows } = await supabase
      .from('reviews')
      .select('*')
      .eq('device_key', cookieDeviceKey)
      .limit(1)
    if (existingRows && existingRows.length > 0) {
      const existing = existingRows[0] as OneLinkReviewRow
      const res = NextResponse.json(
        {
          ok: false,
          alreadySubmitted: true,
          error: 'You have already submitted a review from this device.',
          review: toDTO(existing),
        },
        { status: 409, headers: NO_STORE }
      )
      writeDeviceCookie(res, cookieDeviceKey)
      return res
    }
  }

  if (!authorName || authorName.length < 2 || authorName.length > 60) {
    return NextResponse.json(
      { ok: false, error: 'Name must be 2–60 characters' },
      { status: 400, headers: NO_STORE }
    )
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { ok: false, error: 'Rating must be between 1 and 5' },
      { status: 400, headers: NO_STORE }
    )
  }
  if (!text || text.length < 10 || text.length > 1000) {
    return NextResponse.json(
      { ok: false, error: 'Review must be 10–1000 characters' },
      { status: 400, headers: NO_STORE }
    )
  }

  // Use the cookie key if present, otherwise mint a fresh one server-side.
  const persistedKey =
    cookieDeviceKey && isValidDeviceKey(cookieDeviceKey)
      ? cookieDeviceKey
      : crypto.randomUUID()

  const insertPayload = {
    author_name: authorName,
    rating: Math.round(rating),
    text,
    approved: true,
    source: 'onelink',
    device_key: persistedKey,
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert(insertPayload)
    .select('*')
    .single()

  if (error) {
    console.error('[reviews] POST insert error', error.code, error.message)
    const dup =
      error.code === '23505' ||
      /duplicate key|unique constraint/i.test(error.message || '')
    if (dup) {
      // Race / second submit — fetch the existing row so the client can
      // render the same friendly thanks UI as a fresh submit.
      const { data: existingRows } = await supabase
        .from('reviews')
        .select('*')
        .eq('device_key', persistedKey)
        .limit(1)
      const existing = existingRows && existingRows.length > 0
        ? (existingRows[0] as OneLinkReviewRow)
        : null
      const res = NextResponse.json(
        {
          ok: false,
          alreadySubmitted: true,
          error: 'You have already submitted a review from this device.',
          review: existing ? toDTO(existing) : null,
        },
        { status: 409, headers: NO_STORE }
      )
      writeDeviceCookie(res, persistedKey)
      return res
    }
    return NextResponse.json(
      { ok: false, error: 'Could not save review. Please try again.' },
      { status: 500, headers: NO_STORE }
    )
  }

  console.log('[reviews] POST inserted ok', { rowId: (data as { id: string })?.id })
  const res = NextResponse.json(
    {
      ok: true,
      review: toDTO(data as OneLinkReviewRow),
    },
    { headers: NO_STORE }
  )
  writeDeviceCookie(res, persistedKey)
  return res
}
