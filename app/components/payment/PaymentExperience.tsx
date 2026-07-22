'use client'

/**
 * PaymentExperience — premium UPI payment flow.
 *
 * State machine:
 *   idle      -> user just opened the screen, optionally enters amount
 *   creating  -> POST /api/payments/sessions in flight
 *   ready     -> session created, mobile sees Pay Now / desktop sees QR
 *   confirming-> user clicked "I Have Paid", form is open
 *   success   -> attempt recorded; thank-you screen
 *   error     -> network/validation issue (recoverable)
 *
 * Drop-in replacement for the legacy PaymentFace inside the Hero card flip.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Lock, Shield, AlertTriangle, RefreshCw, Loader2, IndianRupee, ReceiptText } from 'lucide-react'
import { useDevice } from '../../lib/payments/deviceDetect'
import type { PaymentSession } from '../../lib/payments/types'
import PayMobileView from './PayMobileView'
import PayDesktopView from './PayDesktopView'
import PayConfirmView from './PayConfirmView'
import PaySuccessView from './PaySuccessView'

type Phase = 'idle' | 'creating' | 'ready' | 'confirming' | 'success' | 'error'

export interface PaymentExperienceProps {
  /** Display name shown above the amount input */
  payeeName: string
  /** Default amount; user can edit unless `lockAmount` */
  defaultAmount?: number
  /** Default note for the UPI payment */
  defaultNote?: string
  /** If true, hides the amount editor */
  lockAmount?: boolean
  /** Optional metadata persisted on the session (service ids, etc.) */
  metadata?: Record<string, unknown>
  /** Called when the user taps the Back button */
  onBack: () => void
}

export default function PaymentExperience({
  payeeName,
  defaultAmount,
  defaultNote,
  lockAmount = false,
  metadata,
  onBack,
}: PaymentExperienceProps) {
  const device = useDevice()
  const [phase, setPhase] = useState<Phase>('idle')
  const [amount, setAmount] = useState<string>(defaultAmount ? String(defaultAmount) : '')
  const [note] = useState<string>(defaultNote ?? `Payment to ${payeeName}`)
  const [session, setSession] = useState<PaymentSession | null>(null)
  const [error, setError] = useState<string | null>(null)

  const numericAmount = useMemo(() => {
    const n = Number(amount.replace(/[^0-9.]/g, ''))
    return Number.isFinite(n) && n > 0 ? n : undefined
  }, [amount])

  const createSession = useCallback(async () => {
    setError(null)
    setPhase('creating')
    try {
      const res = await fetch('/api/payments/sessions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount: numericAmount, note, metadata }),
      })
      const data = (await res.json()) as { ok: boolean; session?: PaymentSession; error?: string }
      if (!res.ok || !data.ok || !data.session) {
        throw new Error(data.error || 'Could not start payment')
      }
      setSession(data.session)
      setPhase('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      setPhase('error')
    }
  }, [numericAmount, note, metadata])

  const handleConfirmed = useCallback((updated: PaymentSession) => {
    setSession(updated)
    setPhase('success')
  }, [])

  const handleResetFromError = useCallback(() => {
    setError(null)
    setPhase('idle')
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBack])

  return (
    <div
      className="rounded-[28px] overflow-hidden border relative w-full"
      style={{
        background:
          'radial-gradient(120% 120% at 0% 0%, rgba(31,182,217,0.18) 0%, rgba(14,116,144,0.08) 35%, rgba(8,12,16,0.0) 70%), linear-gradient(180deg, #0B1220 0%, #0A0F1A 50%, #07090F 100%)',
        borderColor: 'rgba(96,165,250,0.18)',
        boxShadow:
          '0 30px 60px -20px rgba(0,0,0,0.6), 0 10px 30px -10px rgba(31,182,217,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
      }}
    >
      {/* soft corner glow accents (premium fintech vibe) */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(31,182,217,0.35) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)' }}
      />
      {/* subtle grain — adds tactile feel like the legacy face */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex flex-col min-h-[580px] p-5 sm:p-6">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-white/85 hover:text-white text-xs font-semibold rounded-full px-3 py-1.5 border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur-md transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300/90 rounded-full px-2.5 py-1 border border-emerald-400/20 bg-emerald-400/5">
            <Lock className="w-3 h-3" />
            Encrypted
          </div>
        </div>

        {/* Title block */}
        <div className="mb-5 text-center">
          <h2 className="text-[22px] sm:text-2xl font-black text-white tracking-tight">Pay {payeeName}</h2>
          <p className="text-white/55 text-xs mt-1">Native UPI payments — no app install required</p>
        </div>

        {/* Amount + start CTA — visible only in idle / error phase */}
        <AnimatePresence mode="wait">
          {(phase === 'idle' || phase === 'error') && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              {!lockAmount && (
                <div
                  className="rounded-2xl p-4 border bg-white/5 backdrop-blur-md"
                  style={{ borderColor: 'rgba(96,165,250,0.22)' }}
                >
                  <label className="block text-[11px] uppercase tracking-wider text-white/55 mb-2">
                    Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(31,182,217,0.18)', color: '#7DD3FC' }}
                    >
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <input
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="flex-1 bg-transparent outline-none text-white text-2xl font-black placeholder-white/30"
                    />
                    <span className="text-white/40 text-sm font-semibold">INR</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[500, 1000, 2500, 5000].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setAmount(String(q))}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/12 bg-white/5 hover:bg-white/10 text-white/80 transition"
                      >
                        ₹{q.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/40 mt-2 flex items-center gap-1">
                    <ReceiptText className="w-3 h-3" /> Leave blank to enter amount in your UPI app
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-xl p-3 border border-rose-400/30 bg-rose-500/10 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-300 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-rose-200 text-xs font-semibold">Couldn&apos;t start payment</p>
                    <p className="text-rose-200/80 text-[11px]">{error}</p>
                  </div>
                  <button
                    onClick={handleResetFromError}
                    className="text-[11px] text-rose-100 underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                onClick={createSession}
                disabled={(phase as Phase) === 'creating'}
                className="w-full rounded-2xl py-3.5 px-6 font-bold text-white inline-flex items-center justify-center gap-2 transition disabled:opacity-60"
                style={{
                  background:
                    'linear-gradient(135deg, #A66A3F 0%, #8B6242 50%, #5E351F 100%)',
                  boxShadow:
                    '0 16px 32px -12px rgba(31,182,217,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
              >
                Continue to Payment
              </motion.button>
            </motion.div>
          )}

          {phase === 'creating' && (
            <motion.div
              key="creating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-white/80 gap-3"
            >
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-semibold">Preparing secure session…</p>
              <p className="text-xs text-white/50">Selecting UPI ID and generating link</p>
            </motion.div>
          )}

          {phase === 'ready' && session && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {device.kind === 'mobile' ? (
                <PayMobileView
                  session={session}
                  device={device}
                  onIHavePaid={() => setPhase('confirming')}
                />
              ) : (
                <PayDesktopView session={session} onIHavePaid={() => setPhase('confirming')} />
              )}
            </motion.div>
          )}

          {phase === 'confirming' && session && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <PayConfirmView
                session={session}
                onCancel={() => setPhase('ready')}
                onSubmitted={handleConfirmed}
              />
            </motion.div>
          )}

          {phase === 'success' && session && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PaySuccessView session={session} onClose={onBack} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spacer pushes branding to the bottom for the start screens too */}
        <div className="flex-1" />

        {/* Trust footer */}
        <div className="mt-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="w-3.5 h-3.5 text-cyan-300" />
            <p className="text-white/65 text-[11px] font-medium">Secure payment gateway</p>
          </div>
          {phase === 'ready' && session && (
            <button
              onClick={createSession}
              className="mx-auto inline-flex items-center gap-1.5 text-[11px] text-white/45 hover:text-white/70 transition"
              title="Generate a fresh session"
            >
              <RefreshCw className="w-3 h-3" /> New session
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
