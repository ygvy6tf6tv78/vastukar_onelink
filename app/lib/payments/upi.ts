/**
 * UPI URL helpers.
 *
 * The UPI Linking Specification (https://www.npci.org.in/PDF/upi/Linking-Specs.pdf)
 * defines `upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...`.
 *
 * - `pa` = Payee Address (UPI VPA)
 * - `pn` = Payee Name
 * - `am` = Amount (rupees, dot-decimal)
 * - `cu` = Currency (always "INR")
 * - `tn` = Transaction Note
 * - `tr` = Transaction Reference (we use the session id so refs are traceable)
 *
 * Why `URLSearchParams`:
 * - Properly percent-encodes `@` in the VPA, spaces in names, etc.
 * - GPay and PhonePe will silently fail if the URL is malformed.
 */

import type { UpiAccount } from './types'

export interface BuildUpiLinkInput {
  upi: UpiAccount
  amount?: number
  note?: string
  /** Transaction ref - we pass the payment session id for traceability */
  ref?: string
}

/**
 * Build a generic `upi://pay` URL. This is the URL Android intents use,
 * and the URL we encode into the QR for desktop scans.
 */
export function buildUpiLink({ upi, amount, note, ref }: BuildUpiLinkInput): string {
  const params = new URLSearchParams({
    pa: upi.id,
    pn: upi.name,
    cu: 'INR',
  })
  if (amount && amount > 0) {
    // UPI spec: amount must be a string with at most 2 decimal places.
    params.set('am', amount.toFixed(2))
  }
  if (note) params.set('tn', note)
  if (ref) params.set('tr', ref)
  return `upi://pay?${params.toString()}`
}

/**
 * App-specific deep links. Some Android phones don't open the chooser
 * for `upi://`, so we offer per-app deep links as a faster path.
 *
 * - GPay: `tez://upi/pay?...` (legacy "Tez" scheme still works)
 * - PhonePe: `phonepe://pay?...`
 * - Paytm: `paytmmp://pay?...`
 * - BHIM: `bhim://pay?...`
 */
export function buildAppDeepLinks(input: BuildUpiLinkInput) {
  const qs = new URLSearchParams({
    pa: input.upi.id,
    pn: input.upi.name,
    cu: 'INR',
  })
  if (input.amount && input.amount > 0) qs.set('am', input.amount.toFixed(2))
  if (input.note) qs.set('tn', input.note)
  if (input.ref) qs.set('tr', input.ref)
  const tail = qs.toString()
  return {
    upi: `upi://pay?${tail}`,
    gpay: `tez://upi/pay?${tail}`,
    phonepe: `phonepe://pay?${tail}`,
    paytm: `paytmmp://pay?${tail}`,
    bhim: `bhim://pay?${tail}`,
  }
}

/** Quick validator — basic VPA shape check. */
export function isValidVpa(vpa: string): boolean {
  return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(vpa)
}
