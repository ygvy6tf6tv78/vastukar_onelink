/**
 * Shared types for the payment system.
 *
 * Architecture:
 * - PaymentSession is created when the user opens the payment screen.
 *   The server assigns a UPI ID (rotation), stores a session id, and returns
 *   the deep link + QR-friendly URL.
 * - PaymentAttempt records every "I have paid" submission (with optional
 *   transaction id and screenshot reference). A session can have multiple
 *   attempts (e.g. user retries) — the latest one becomes the canonical record.
 *
 * Backend-agnostic — the same shapes are used by the in-memory store
 * (default) and the MongoDB adapter (when MONGODB_URI is set).
 */

export type PaymentStatus =
  | 'pending'    // session created, no attempt yet
  | 'submitted'  // user clicked "I Have Paid"
  | 'verified'   // (manual / merchant) verified — out of scope for now
  | 'failed'     // user reported failure
  | 'expired'    // session timed out

export interface UpiAccount {
  /** UPI virtual address e.g. "abc@okhdfcbank" */
  id: string
  /** Display name for the payee */
  name: string
  /** Short label for analytics ("primary" / "fallback" / "personal") */
  label?: string
}

export interface PaymentSession {
  /** Server-assigned, opaque, URL-safe session id */
  id: string
  /** Amount in INR (rupees, not paise). Optional — can be left blank for "any amount". */
  amount?: number
  /** Note shown in the UPI app */
  note?: string
  /** UPI account assigned to this session via rotation */
  assignedUpi: UpiAccount
  /** Built UPI deep link `upi://pay?...` */
  upiLink: string
  /** Current lifecycle status */
  status: PaymentStatus
  /** ISO timestamp */
  createdAt: string
  /** ISO timestamp */
  updatedAt: string
  /** ISO timestamp — when the session is no longer valid */
  expiresAt: string
  /** Latest attempt summary (denormalized for quick reads) */
  lastAttempt?: PaymentAttempt
  /** Free-form metadata (e.g. service ids inquired about) */
  metadata?: Record<string, unknown>
}

export interface PaymentAttempt {
  /** Random short id */
  id: string
  /** When the user submitted */
  at: string
  /** User-provided transaction reference (UPI ref id / UTR) — optional */
  txId?: string
  /** URL/key for the uploaded screenshot — optional */
  screenshotUrl?: string
  /** User-reported outcome */
  outcome: 'paid' | 'failed'
  /** Optional note from the user */
  note?: string
}

export interface CreateSessionInput {
  amount?: number
  note?: string
  metadata?: Record<string, unknown>
}

export interface ConfirmAttemptInput {
  txId?: string
  screenshotUrl?: string
  outcome?: 'paid' | 'failed'
  note?: string
}
