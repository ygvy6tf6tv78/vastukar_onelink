'use client'

/**
 * Desktop payment view — Scan & Pay with a freshly-generated QR.
 *
 * - Uses the `qrcode` package (already in deps) to render the same
 *   `upi://pay?...` URL the mobile flow uses, so amount + note are baked in.
 * - Generated as a Data URL on the client (no extra API call needed).
 * - Falls back gracefully if QR generation fails (rare).
 */

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check, Copy, Download, Loader2 } from 'lucide-react'
import type { PaymentSession } from '../../lib/payments/types'

interface Props {
  session: PaymentSession
  onIHavePaid: () => void
}

export default function PayDesktopView({ session, onIHavePaid }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrError, setQrError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let alive = true
    QRCode.toDataURL(session.upiLink, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
      color: { dark: '#0A0F1A', light: '#FFFFFF' },
    })
      .then((url) => {
        if (alive) setQrDataUrl(url)
      })
      .catch((e: unknown) => {
        if (alive) setQrError(e instanceof Error ? e.message : 'QR generation failed')
      })
    return () => {
      alive = false
    }
  }, [session.upiLink])

  const copyVpa = async () => {
    try {
      await navigator.clipboard.writeText(session.assignedUpi.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
    }
  }

  const downloadQR = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `upi-${session.id}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-4">
      {/* Amount + payee */}
      <div
        className="rounded-2xl p-4 border bg-white/[0.04] backdrop-blur-md"
        style={{ borderColor: 'rgba(96,165,250,0.18)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider text-white/55">Paying</span>
          {session.amount && (
            <span className="text-2xl font-black text-white tabular-nums">
              ₹{session.amount.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <p className="text-white text-sm font-bold truncate">{session.assignedUpi.name}</p>
        <div className="flex items-center justify-between gap-2 mt-1">
          <code className="text-cyan-300/95 text-[12px] font-mono truncate">
            {session.assignedUpi.id}
          </code>
          <button
            onClick={copyVpa}
            className="shrink-0 inline-flex items-center gap-1 text-[11px] text-white/80 px-2 py-1 rounded-full border border-white/12 bg-white/5 hover:bg-white/10"
            aria-label="Copy UPI ID"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* QR card */}
      <div
        className="rounded-3xl p-4 border bg-white/[0.04] backdrop-blur-md flex flex-col items-center"
        style={{ borderColor: 'rgba(96,165,250,0.18)' }}
      >
        <p className="text-[11px] uppercase tracking-wider text-white/55 mb-3">Scan & Pay</p>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl overflow-hidden bg-white p-2"
          style={{
            boxShadow:
              '0 24px 60px -20px rgba(31,182,217,0.45), inset 0 0 0 1px rgba(0,0,0,0.06)',
          }}
        >
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt="Scan to pay via UPI"
              width={240}
              height={240}
              unoptimized
              className="block w-[220px] h-[220px] sm:w-[240px] sm:h-[240px]"
            />
          ) : qrError ? (
            <div className="w-[220px] h-[220px] flex items-center justify-center text-rose-500 text-xs px-3 text-center">
              {qrError}
            </div>
          ) : (
            <div className="w-[220px] h-[220px] flex items-center justify-center text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </motion.div>

        <p className="text-white/60 text-[11px] text-center mt-3 max-w-[240px]">
          Open any UPI app (GPay, PhonePe, Paytm, BHIM) and scan this code
        </p>

        <button
          onClick={downloadQR}
          disabled={!qrDataUrl}
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-white/70 hover:text-white px-2.5 py-1 rounded-full border border-white/12 bg-white/5 hover:bg-white/10 transition disabled:opacity-40"
        >
          <Download className="w-3 h-3" /> Download QR
        </button>
      </div>

      <button
        onClick={onIHavePaid}
        className="w-full rounded-2xl py-2.5 px-6 text-sm font-semibold text-white/90 border border-emerald-400/25 bg-emerald-500/10 hover:bg-emerald-500/15 transition inline-flex items-center justify-center gap-2"
      >
        <Check className="w-4 h-4 text-emerald-300" />
        I Have Paid
      </button>
    </div>
  )
}
