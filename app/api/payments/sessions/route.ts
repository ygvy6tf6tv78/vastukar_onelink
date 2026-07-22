/**
 * POST /api/payments/sessions
 *
 * Creates a new payment session.
 *   - Server picks a UPI account via the rotation strategy.
 *   - Server builds the canonical UPI deep link (so the client never has
 *     a chance to tamper with the VPA / amount mapping).
 *   - Returns the session id, assigned UPI account, and the upi:// link.
 *
 * Request body (all optional):
 *   { amount?: number, note?: string, metadata?: Record<string, unknown> }
 *
 * Response:
 *   { ok: true, session: PaymentSession }
 */

import { NextResponse } from 'next/server'
import { getPaymentStore } from '../../../lib/payments/store'
import type { CreateSessionInput } from '../../../lib/payments/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_AMOUNT = 100000 // ₹1,00,000 hard cap — adjust per business needs

export async function POST(req: Request) {
  let body: CreateSessionInput = {}
  try {
    if (req.headers.get('content-type')?.includes('application/json')) {
      body = (await req.json()) as CreateSessionInput
    }
  } catch {
  }

  const amount = typeof body.amount === 'number' && Number.isFinite(body.amount) ? body.amount : undefined

  if (amount !== undefined) {
    if (amount <= 0) {
      return NextResponse.json({ ok: false, error: 'Amount must be > 0' }, { status: 400 })
    }
    if (amount > MAX_AMOUNT) {
      return NextResponse.json({ ok: false, error: `Amount exceeds ₹${MAX_AMOUNT}` }, { status: 400 })
    }
  }

  const note = typeof body.note === 'string' ? body.note.slice(0, 80) : undefined

  try {
    const session = await getPaymentStore().create({
      amount,
      note,
      metadata: body.metadata,
    })
    return NextResponse.json({ ok: true, session })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Failed to create session' },
      { status: 500 },
    )
  }
}
