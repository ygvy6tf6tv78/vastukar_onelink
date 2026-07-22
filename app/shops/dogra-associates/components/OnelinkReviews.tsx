'use client'

/**
 * OnelinkReviews — homepage section that previews reviews stored in our
 * own Supabase-backed `reviews` table (branded as "Google Reviews"
 * instead of Google).
 *
 * - Fetches `/api/reviews` (server-side it talks to Supabase).
 * - Shows aggregate rating + the two most recent approved reviews.
 * - Empty / loading / unconfigured states all render gracefully.
 * - "View All Reviews" → /reviews
 * - "Write a Review"   → /reviews#write-review (the form lives there)
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, ArrowRight, ChevronRight } from 'lucide-react'
import { setReturnSection } from '../../../lib/homeNavigation'

interface ReviewDTO {
  id: string
  authorName: string
  rating: number
  text: string
  createdAt: string
  relativeTime: string
}

interface ReviewsResponse {
  configured: boolean
  rating: number
  totalReviews: number
  reviews: ReviewDTO[]
  error?: string
}

const CARD_BG = '#FFFFFF'
const CARD_BORDER = '#E5ECF6'
const CARD_SHADOW = '0 8px 20px rgba(15,42,68,0.06)'
const PRIMARY = '#0F2A44'
const ACCENT = '#A66A3F'
const ACCENT_DEEP = '#5E351F'
const MUTED = '#6B7A90'
const SOFT_BG = '#F1E7DB'

/** Same deterministic palette as /reviews so the same author always
 *  gets the same avatar gradient across the app. */
const AVATAR_PAIRS = [
  ['#A66A3F', '#5E351F'],
  ['#6366F1', '#312E81'],
  ['#0EA5E9', '#075985'],
  ['#A66A3F', '#8B6242'],
  ['#8B5CF6', '#4C1D95'],
  ['#0F2A44', '#A66A3F'],
] as const

function avatarGradient(name: string) {
  const seed = name.charCodeAt(0) + name.length
  const i = seed % AVATAR_PAIRS.length
  const [a, b] = AVATAR_PAIRS[i]
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function OnelinkReviews() {
  const [data, setData] = useState<ReviewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/reviews', { cache: 'no-store' })
        const json = (await res.json()) as ReviewsResponse
        if (cancelled) return
        if (!res.ok) {
          setError(json.error || 'Failed to load reviews')
          return
        }
        setData(json)
      } catch {
        if (!cancelled) setError('Failed to load reviews')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <section id="reviews" className="w-full max-w-md mx-auto pt-8 pb-6">
        <div className="mb-5">
          <div className="section-title-accent">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 text-left">
              Google Reviews
            </h2>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 animate-pulse border"
              style={{ height: '120px', background: CARD_BG, borderColor: CARD_BORDER }}
            />
          ))}
        </div>
      </section>
    )
  }

  const hasReviews = !!data && data.totalReviews > 0
  const previewReviews = data?.reviews.slice(0, 2) ?? []

  return (
    <section id="reviews" className="w-full max-w-md mx-auto pt-8 pb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="section-title-accent">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 text-left">
            Google Reviews
          </h2>
        </div>
        <Link
          href="/reviews"
          onClick={() => setReturnSection('reviews')}
          className="text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Rating Summary — Mango-style flat white card with badge on the right */}
      {hasReviews && data && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-5 rounded-2xl p-5 flex items-center justify-between gap-3"
          style={{
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            boxShadow: CARD_SHADOW,
          }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(data.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-extrabold text-2xl leading-none" style={{ color: PRIMARY }}>
                {data.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm" style={{ color: MUTED }}>
              Based on {data.totalReviews.toLocaleString()} Google review
              {data.totalReviews === 1 ? '' : 's'}
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-bold flex-shrink-0"
            style={{
              background: '#FFF8DB',
              color: PRIMARY,
              border: '1px solid rgba(234,179,8,0.35)',
            }}
          >
            <Star className="w-3.5 h-3.5" style={{ color: '#EAB308' }} fill="#EAB308" />
            Google
          </span>
        </motion.div>
      )}

      {/* Empty / unconfigured / error states share the same friendly card */}
      {!hasReviews && (
        <div
          className="rounded-2xl p-6 text-center border mb-5"
          style={{ background: CARD_BG, borderColor: CARD_BORDER, boxShadow: CARD_SHADOW }}
        >
          <div
            className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
            style={{ background: SOFT_BG, color: ACCENT }}
          >
            <Star className="w-6 h-6 fill-current" />
          </div>
          <p className="font-semibold mb-1" style={{ color: PRIMARY }}>
            Be the first to review us
          </p>
          <p className="text-xs mb-4" style={{ color: MUTED }}>
            {error
              ? 'Reviews could not be loaded right now.'
              : 'Share your experience to help others discover our work.'}
          </p>
        </div>
      )}

      {/* Review Cards — Mango-style flat white card */}
      {previewReviews.length > 0 && (
        <div className="space-y-3">
          {previewReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
              whileHover={{ y: -2 }}
              className="rounded-[22px] p-4 backdrop-blur-md"
              style={{
                background: 'rgba(255,255,255,0.92)',
                border: `1px solid ${CARD_BORDER}`,
                boxShadow:
                  '0 10px 26px rgba(15,42,68,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ring-2 ring-white relative overflow-hidden"
                  style={{
                    background: avatarGradient(review.authorName),
                    boxShadow: '0 8px 18px rgba(15,42,68,0.20)',
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl opacity-50"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)',
                    }}
                  />
                  <span className="relative font-extrabold text-[14px] text-white tracking-wide">
                    {initials(review.authorName)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm truncate" style={{ color: PRIMARY }}>
                      {review.authorName}
                    </h3>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                    {review.relativeTime}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#1E293B' }}>
                {review.text}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-5 space-y-3"
      >
        <Link
          href="/reviews"
          onClick={() => setReturnSection('reviews')}
          className="block w-full font-semibold py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2"
          style={{
            background: CARD_BG,
            color: PRIMARY,
            border: `1px solid ${CARD_BORDER}`,
            boxShadow: CARD_SHADOW,
          }}
        >
          View All Reviews
          <ArrowRight className="w-4 h-4" style={{ color: ACCENT }} />
        </Link>
        <Link
          href="/reviews#write-review"
          onClick={() => setReturnSection('reviews')}
          className="block w-full font-bold py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-white"
          style={{
            background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT_DEEP} 60%, ${ACCENT} 100%)`,
            boxShadow: '0 14px 30px rgba(15,42,68,0.28)',
          }}
        >
          Write a Review
          <Star className="w-4 h-4 fill-white text-white" />
        </Link>
      </motion.div>
    </section>
  )
}
