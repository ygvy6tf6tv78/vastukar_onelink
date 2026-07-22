'use client'

/**
 * Success view — final state after the user confirms payment.
 *
 * - Animated check ring (Framer Motion).
 * - Renders the assigned UPI ID + amount + the user's transaction id (if any).
 * - "Done" button calls `onClose` (which exits the payment face).
 */

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import type { PaymentSession } from '../../lib/payments/types'

interface Props {
  session: PaymentSession
  onClose: () => void
}

export default function PaySuccessView({ session, onClose }: Props) {
  return (
    <div className="flex flex-col items-center text-center gap-4 pt-2">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background:
            'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(16,185,129,0.05) 70%)',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.18, type: 'spring', stiffness: 260, damping: 14 }}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 14px 30px -8px rgba(16,185,129,0.55)',
          }}
        >
          <Check className="w-7 h-7 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>

      <div>
        <h3 className="text-xl font-black text-white inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          Thanks — payment received
        </h3>
        <p className="text-white/65 text-xs mt-1 max-w-[280px]">
          We&apos;ll verify and confirm shortly. Keep this reference for your records.
        </p>
      </div>

      <div
        className="w-full rounded-2xl p-4 border bg-white/[0.04] backdrop-blur-md text-left"
        style={{ borderColor: 'rgba(96,165,250,0.18)' }}
      >
        <Row label="Reference" value={session.id} mono />
        {session.amount && <Row label="Amount" value={`₹${session.amount.toLocaleString('en-IN')}`} />}
        <Row label="Paid to" value={session.assignedUpi.id} mono />
        {session.lastAttempt?.txId && <Row label="Your UTR" value={session.lastAttempt.txId} mono />}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-2xl py-2.5 text-sm font-bold text-white inline-flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #A66A3F 0%, #8B6242 50%, #5E351F 100%)',
          boxShadow: '0 12px 26px -10px rgba(31,182,217,0.45)',
        }}
      >
        Done
      </button>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 first:pt-0 last:pb-0 border-b border-white/[0.06] last:border-b-0">
      <span className="text-[11px] uppercase tracking-wider text-white/45 shrink-0">{label}</span>
      <span
        className={`text-xs text-white/95 text-right break-all ${mono ? 'font-mono' : 'font-semibold'}`}
      >
        {value}
      </span>
    </div>
  )
}
