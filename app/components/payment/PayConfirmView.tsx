'use client'

/**
 * Confirmation form — "I Have Paid".
 *
 * Steps:
 *  1. (optional) Enter UPI reference / UTR.
 *  2. (optional) Upload payment screenshot — POST /api/payments/screenshots
 *  3. Submit -> PATCH /api/payments/sessions/[id] with txId + screenshotUrl.
 *
 * Both fields are optional so users in a hurry can just confirm.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Image as ImageIcon, Loader2, Send, X } from 'lucide-react'
import type { PaymentSession } from '../../lib/payments/types'

interface Props {
  session: PaymentSession
  onCancel: () => void
  onSubmitted: (updated: PaymentSession) => void
}

export default function PayConfirmView({ session, onCancel, onSubmitted }: Props) {
  const [txId, setTxId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleFile = (f: File | null) => {
    setError(null)
    if (!f) {
      setFile(null)
      setPreviewUrl(null)
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      setError('Only JPG, PNG, or WebP files are supported')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Screenshot must be smaller than 5 MB')
      return
    }
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      let screenshotUrl: string | undefined
      if (file) {
        setUploadProgress('uploading')
        const fd = new FormData()
        fd.append('file', file)
        fd.append('sessionId', session.id)
        const upRes = await fetch('/api/payments/screenshots', { method: 'POST', body: fd })
        const upJson = (await upRes.json()) as { ok: boolean; url?: string; error?: string }
        if (!upRes.ok || !upJson.ok) throw new Error(upJson.error || 'Upload failed')
        screenshotUrl = upJson.url
        setUploadProgress('done')
      }

      const res = await fetch(`/api/payments/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ txId, screenshotUrl, outcome: 'paid' }),
      })
      const data = (await res.json()) as { ok: boolean; session?: PaymentSession; error?: string }
      if (!res.ok || !data.ok || !data.session) throw new Error(data.error || 'Could not confirm')
      onSubmitted(data.session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4 border bg-white/[0.04] backdrop-blur-md"
        style={{ borderColor: 'rgba(96,165,250,0.18)' }}
      >
        <p className="text-[11px] uppercase tracking-wider text-white/55 mb-2">
          Confirm your payment
        </p>
        <p className="text-white/85 text-xs">
          Add a UPI reference and screenshot if you have them — both are optional but
          help us verify faster.
        </p>
      </div>

      {/* TX id */}
      <div
        className="rounded-2xl p-4 border bg-white/[0.04] backdrop-blur-md"
        style={{ borderColor: 'rgba(96,165,250,0.18)' }}
      >
        <label className="block text-[11px] uppercase tracking-wider text-white/55 mb-2">
          Transaction ID / UTR <span className="normal-case text-white/35">(optional)</span>
        </label>
        <input
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder="e.g. 412598412365"
          inputMode="numeric"
          className="w-full rounded-xl px-3 py-2.5 bg-black/30 border border-white/10 text-white text-sm font-mono outline-none focus:border-cyan-400/50 transition placeholder-white/25"
        />
      </div>

      {/* Screenshot upload */}
      <div
        className="rounded-2xl p-4 border bg-white/[0.04] backdrop-blur-md"
        style={{ borderColor: 'rgba(96,165,250,0.18)' }}
      >
        <label className="block text-[11px] uppercase tracking-wider text-white/55 mb-2">
          Payment screenshot <span className="normal-case text-white/35">(optional, max 5 MB)</span>
        </label>

        {previewUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="screenshot preview" className="w-full max-h-44 object-cover" />
            <button
              type="button"
              onClick={() => handleFile(null)}
              className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/65 backdrop-blur-md text-white/90 hover:bg-black/80"
              aria-label="Remove screenshot"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <label
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-black/20 hover:bg-black/30 transition cursor-pointer py-4 text-white/65 text-xs"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Tap to attach screenshot</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>

      {error && (
        <div className="rounded-xl px-3 py-2 border border-rose-400/30 bg-rose-500/10 text-rose-200 text-xs">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1 rounded-2xl py-2.5 text-sm font-semibold text-white/85 border border-white/12 bg-white/5 hover:bg-white/10 transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 rounded-2xl py-2.5 text-sm font-bold text-white inline-flex items-center justify-center gap-2 transition disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg, #A66A3F 0%, #8B6242 50%, #5E351F 100%)',
            boxShadow: '0 12px 26px -10px rgba(31,182,217,0.45)',
          }}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploadProgress === 'uploading' ? 'Uploading…' : 'Confirming…'}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
