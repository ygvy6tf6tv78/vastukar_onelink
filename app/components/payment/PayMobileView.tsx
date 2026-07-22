'use client'

/**
 * Mobile payment view — "Pay Now" with one-tap UPI app launches.
 *
 * Behavior:
 *  - Primary CTA opens the OS UPI chooser (`upi://pay?...`).
 *    On Android Chrome this triggers the bank-level chooser (GPay, PhonePe,
 *    Paytm, BHIM, your bank app). On iOS Safari it asks the user to pick.
 *  - Secondary buttons launch each app directly via its scheme — useful
 *    when the user already knows their preferred app, and faster on iOS
 *    where the chooser sometimes doesn't fire.
 *  - "Smart fallback": if the app fails to open in 1.5s and the page
 *    still has focus, we re-try the canonical `upi://` link.
 */

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Copy, Check, Smartphone } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { PaymentSession } from '../../lib/payments/types'
import type { DeviceInfo } from '../../lib/payments/deviceDetect'
import { buildAppDeepLinks } from '../../lib/payments/upi'

interface Props {
  session: PaymentSession
  device: DeviceInfo
  onIHavePaid: () => void
}

const APPS: Array<{ key: 'gpay' | 'phonepe' | 'paytm'; label: string; logo: string; color: string }> = [
  { key: 'gpay', label: 'Google Pay', logo: '/logos/icons8-google-pay-48.png', color: 'rgba(66,133,244,0.18)' },
  { key: 'phonepe', label: 'PhonePe', logo: '/logos/icons8-phone-pe-48.png', color: 'rgba(94,32,143,0.22)' },
  { key: 'paytm', label: 'Paytm', logo: '/logos/icons8-paytm-48.png', color: 'rgba(0,186,241,0.18)' },
]

export default function PayMobileView({ session, onIHavePaid }: Props) {
  const [copied, setCopied] = useState(false)

  const links = buildAppDeepLinks({
    upi: session.assignedUpi,
    amount: session.amount,
    note: session.note,
    ref: session.id,
  })

  const launch = useCallback((url: string) => {
    // Use location.href so the OS sees a navigation, not a popup
    window.location.href = url
    // Smart fallback after 1.5s — re-try the universal UPI link
    setTimeout(() => {
      if (document.hasFocus() && url !== links.upi) {
        window.location.href = links.upi
      }
    }, 1500)
  }, [links.upi])

  const copyVpa = async () => {
    try {
      await navigator.clipboard.writeText(session.assignedUpi.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
    }
  }

  return (
    <div className="space-y-4">
      {/* Amount + payee summary */}
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

      {/* Primary Pay Now CTA */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.01 }}
        onClick={() => launch(links.upi)}
        className="w-full rounded-2xl py-3.5 px-6 font-bold text-white inline-flex items-center justify-center gap-2 transition"
        style={{
          background: 'linear-gradient(135deg, #A66A3F 0%, #8B6242 50%, #5E351F 100%)',
          boxShadow:
            '0 16px 32px -12px rgba(31,182,217,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
      >
        <Smartphone className="w-4 h-4" />
        Pay Now
      </motion.button>

      {/* App-specific shortcuts */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-white/45 text-center mb-2">
          Or choose your app
        </p>
        <div className="grid grid-cols-3 gap-2">
          {APPS.map((app) => (
            <motion.button
              key={app.key}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              onClick={() => launch(links[app.key])}
              className="flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 border bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md transition"
              style={{ borderColor: 'rgba(255,255,255,0.10)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: app.color }}
              >
                <Image
                  src={app.logo}
                  alt={app.label}
                  width={26}
                  height={26}
                  className="w-[26px] h-[26px] object-contain"
                  unoptimized
                />
              </div>
              <span className="text-[11px] font-semibold text-white/85">{app.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Confirm step */}
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
