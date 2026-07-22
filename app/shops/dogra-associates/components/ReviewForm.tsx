'use client'

/**
 * ReviewForm — inline OneLink review submission card.
 *
 * Pure server-driven. No localStorage. No body deviceKey. The server
 * issues an httpOnly cookie (`ol_dk`) on the first POST and uses it on
 * every subsequent request to identify the device. The DB-level UNIQUE
 * constraint on `device_key` is the final guarantee.
 *
 * States rendered (in order):
 *   1. Checking — first paint, while we ask the server "have I reviewed?"
 *   2. AlreadySubmitted — the user's review is shown back to them.
 *   3. Idle — the form.
 *   4. Submit — spinner on the button.
 *   5. After successful submit, we transition straight to AlreadySubmitted.
 */

import { FormEvent, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Loader2, CheckCircle2 } from 'lucide-react'

interface SavedReview {
  id: string
  authorName: string
  rating: number
  text: string
  createdAt: string
  relativeTime?: string
}

interface ReviewFormProps {
  onSubmitted?: () => void
}

const CARD_BORDER = '#E5ECF6'
const PRIMARY = '#0F2A44'
const ACCENT = '#A66A3F'
const SOFT_BG = '#F1E7DB'
const MUTED = '#6B7A90'
const INPUT_BG = '#F6F9FD'

export default function ReviewForm({ onSubmitted }: ReviewFormProps) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const [savedReview, setSavedReview] = useState<SavedReview | null>(null)

  // On mount: ask the server (via cookie) if we've already reviewed.
  useEffect(() => {
    let cancelled = false

    const verify = async () => {
      try {
        const res = await fetch('/api/reviews/me', {
          cache: 'no-store',
          credentials: 'include',
        })
        if (!res.ok) return
        const json = await res.json().catch(() => null)
        if (cancelled || !json) return
        if (json.submitted && json.review) {
          setSavedReview({
            id: json.review.id,
            authorName: json.review.authorName,
            rating: json.review.rating,
            text: json.review.text,
            createdAt: json.review.createdAt,
            relativeTime: json.review.relativeTime,
          })
        }
      } catch {
        /* network blip — show the form, server will still reject duplicates */
      } finally {
        if (!cancelled) setChecking(false)
      }
    }
    verify()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (name.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }
    if (rating < 1) {
      setError('Please pick a star rating.')
      return
    }
    if (text.trim().length < 10) {
      setError('Tell us a bit more — at least 10 characters.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          authorName: name.trim(),
          rating,
          text: text.trim(),
        }),
      })
      const json = await res.json().catch(() => ({}))

      if (!res.ok || !json.ok) {
        // 409 = already submitted from this device. ALWAYS show the
        // friendly thanks UI (never a red error). Three layers of
        // fallback so this works even on flaky mobile networks:
        //
        //   1. Use the review the server inlined in the 409 body
        //      (most reliable — no second roundtrip needed).
        //   2. If absent, ask /api/reviews/me for it.
        //   3. If both fail, synthesise a thanks card from what the
        //      user just typed so they NEVER see a confusing error.
        if (res.status === 409 || json.alreadySubmitted) {
          setError(null)

          if (json.review) {
            setSavedReview({
              id: json.review.id,
              authorName: json.review.authorName,
              rating: json.review.rating,
              text: json.review.text,
              createdAt: json.review.createdAt,
              relativeTime: json.review.relativeTime,
            })
            onSubmitted?.()
            return
          }

          try {
            const r = await fetch('/api/reviews/me', {
              cache: 'no-store',
              credentials: 'include',
            })
            const me = await r.json().catch(() => ({}))
            if (me?.submitted && me.review) {
              setSavedReview({
                id: me.review.id,
                authorName: me.review.authorName,
                rating: me.review.rating,
                text: me.review.text,
                createdAt: me.review.createdAt,
                relativeTime: me.review.relativeTime,
              })
              onSubmitted?.()
              return
            }
          } catch {
            /* fall through to synthesised fallback */
          }

          setSavedReview({
            id: 'pending',
            authorName: name.trim() || 'You',
            rating: rating || 5,
            text: text.trim() || 'Thanks for your review!',
            createdAt: new Date().toISOString(),
            relativeTime: 'just now',
          })
          onSubmitted?.()
          return
        }
        setError(json.error || 'Could not submit review. Please try again.')
        return
      }

      if (json.review) {
        setSavedReview({
          id: json.review.id,
          authorName: json.review.authorName,
          rating: json.review.rating,
          text: json.review.text,
          createdAt: json.review.createdAt,
          relativeTime: json.review.relativeTime,
        })
        onSubmitted?.()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[28px] p-5"
      style={{
        background: '#FFFFFF',
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: '0 12px 30px rgba(15,42,68,0.06)',
      }}
    >
      <AnimatePresence mode="wait">
        {checking ? (
          <motion.div
            key="checking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-6 flex items-center justify-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: ACCENT }} />
            <span className="text-xs font-medium" style={{ color: MUTED }}>
              Loading…
            </span>
          </motion.div>
        ) : savedReview ? (
          <motion.div
            key="already"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-1"
          >
            <div
              className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ background: SOFT_BG, color: ACCENT }}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="font-bold text-base mb-1" style={{ color: PRIMARY }}>
              Thanks for your review!
            </p>
            <p className="text-xs mb-4" style={{ color: MUTED }}>
              You&apos;ve already shared your feedback from this device. One
              review per device keeps things fair.
            </p>

            <div
              className="text-left rounded-xl p-3.5 mt-2"
              style={{
                background: '#F8FAFC',
                border: `1px solid ${CARD_BORDER}`,
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <p
                  className="font-bold text-sm truncate"
                  style={{ color: PRIMARY }}
                >
                  {savedReview.authorName}
                </p>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= savedReview.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {savedReview.relativeTime && (
                <p className="text-[10px] mb-2" style={{ color: MUTED }}>
                  Posted {savedReview.relativeTime}
                </p>
              )}
              <p className="text-sm leading-relaxed" style={{ color: '#1E293B' }}>
                {savedReview.text}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3"
            noValidate
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star
                className="w-5 h-5"
                style={{ color: '#EAB308' }}
                fill="#EAB308"
              />
              <h3 className="font-bold text-lg" style={{ color: PRIMARY }}>
                Give Review
              </h3>
              <Star
                className="w-5 h-5"
                style={{ color: '#EAB308' }}
                fill="#EAB308"
              />
            </div>
            <p className="text-xs text-center" style={{ color: MUTED }}>
              Help others by sharing your experience with Vastukar Architects.
            </p>

            {/* Star rating */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: PRIMARY }}
              >
                Your rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 -m-1 active:scale-90 transition-transform"
                      aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          filled
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  )
                })}
                {rating > 0 && (
                  <span
                    className="ml-1 text-xs font-semibold"
                    style={{ color: MUTED }}
                  >
                    {rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="rev-name"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: PRIMARY }}
              >
                Your name
              </label>
              <input
                id="rev-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohit Sharma"
                maxLength={60}
                className="w-full px-3.5 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: INPUT_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  color: PRIMARY,
                  ['--tw-ring-color' as never]: 'rgba(58,123,213,0.30)',
                }}
              />
            </div>

            {/* Review text */}
            <div>
              <label
                htmlFor="rev-text"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: PRIMARY }}
              >
                Your review
              </label>
              <textarea
                id="rev-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share what made your experience great…"
                rows={4}
                maxLength={1000}
                className="w-full px-3.5 py-3 rounded-xl text-sm outline-none resize-none transition-all focus:ring-2"
                style={{
                  background: INPUT_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  color: PRIMARY,
                  ['--tw-ring-color' as never]: 'rgba(58,123,213,0.30)',
                }}
              />
              <div className="flex justify-end">
                <span className="text-[11px]" style={{ color: MUTED }}>
                  {text.length}/1000
                </span>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-medium px-3 py-2 rounded-lg"
                style={{ background: '#FEF2F2', color: '#B91C1C' }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.98 }}
              className="w-full font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-shadow"
              style={{
                background: '#FFFFFF',
                color: '#0F172A',
                border: `1px solid ${CARD_BORDER}`,
                boxShadow: '0 6px 18px rgba(15,23,42,0.10)',
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Star
                    className="w-4 h-4 fill-current"
                    style={{ color: '#EAB308' }}
                  />
                  Submit Review
                </>
              )}
            </motion.button>

            <p className="text-[10px] text-center pt-1" style={{ color: MUTED }}>
              One review per device — verified on our server.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
