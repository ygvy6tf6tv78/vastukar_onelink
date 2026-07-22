/**
 * GET   /api/payments/sessions/[id]   -> fetch a session (status polling)
 * PATCH /api/payments/sessions/[id]   -> record an attempt (I Have Paid / Failed)
 *
 * PATCH body:
 *   {
 *     txId?: string,         // user-typed UPI ref / UTR
 *     screenshotUrl?: string,// from the screenshot upload endpoint
 *     outcome?: 'paid' | 'failed',
 *     note?: string
 *   }
 */

import { NextResponse } from 'next/server'
import { getPaymentStore } from '../../../../lib/payments/store'
import type { ConfirmAttemptInput } from '../../../../lib/payments/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface RouteContext {
  params: { id: string }
}

export async function GET(_req: Request, { params }: RouteContext) {
  const session = await getPaymentStore().get(params.id)
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Session not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true, session })
}

export async function PATCH(req: Request, { params }: RouteContext) {
  let body: ConfirmAttemptInput = {}
  try {
    body = (await req.json()) as ConfirmAttemptInput
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const cleaned: ConfirmAttemptInput = {
    txId: typeof body.txId === 'string' ? body.txId.trim().slice(0, 64) : undefined,
    screenshotUrl: typeof body.screenshotUrl === 'string' ? body.screenshotUrl.slice(0, 1024) : undefined,
    outcome: body.outcome === 'failed' ? 'failed' : 'paid',
    note: typeof body.note === 'string' ? body.note.trim().slice(0, 280) : undefined,
  }

  const session = await getPaymentStore().recordAttempt(params.id, cleaned)
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Session not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true, session })
}
