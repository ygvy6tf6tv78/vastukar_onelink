/**
 * Per-device identifier helpers — server-side cookie that augments the
 * client-side `localStorage` device key with an httpOnly cookie that the
 * client can't forge or accidentally clear.
 *
 * Pairing both keys gives us defence-in-depth:
 *   1. Client localStorage (`onelink_ca_review_device_key`) → sent in body.
 *   2. Server-set httpOnly cookie (`ol_dk`) → also persisted on the server.
 *
 * If a user clears localStorage but cookies remain (or vice-versa), we still
 * recognise them. The DB-level UNIQUE constraint on `device_key` is the
 * unbeatable third layer.
 */

import type { NextResponse } from 'next/server'

export const DEVICE_COOKIE_NAME = 'ol_dk'
export const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2 // 2 years

const UUID_RE =
  /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i

export function isValidDeviceKey(v: unknown): v is string {
  return typeof v === 'string' && UUID_RE.test(v)
}

/** Read the deviceKey cookie from a Next.js Request (does not require
 *  pulling in `cookies()` so it works in route handlers cleanly). */
export function readDeviceCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${DEVICE_COOKIE_NAME}=([^;]+)`)
  )
  if (!match) return null
  try {
    const value = decodeURIComponent(match[1])
    return isValidDeviceKey(value) ? value : null
  } catch {
    return null
  }
}

/** Set the httpOnly device cookie on an outgoing NextResponse. */
export function writeDeviceCookie(response: NextResponse, deviceKey: string) {
  if (!isValidDeviceKey(deviceKey)) return
  response.cookies.set(DEVICE_COOKIE_NAME, deviceKey, {
    path: '/',
    maxAge: DEVICE_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
    // Vercel always serves the deployed app over HTTPS.
    secure: process.env.NODE_ENV === 'production',
  })
}

/** Returns the unique set of valid device keys from cookie + provided value. */
export function collectDeviceKeys(
  cookieValue: string | null,
  candidate?: string | null
): string[] {
  const out = new Set<string>()
  if (cookieValue && isValidDeviceKey(cookieValue)) out.add(cookieValue)
  if (candidate && isValidDeviceKey(candidate)) out.add(candidate)
  return Array.from(out)
}
