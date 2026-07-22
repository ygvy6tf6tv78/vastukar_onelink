'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { shopConfig } from '../config'
import { getTelLink } from '../../../lib/phone'

/** Reusable premium card surface for each contact block (Mango "Get in Touch" treatment, blue) */
const CARD_BG =
  'linear-gradient(135deg, #ffffff 0%, #F8FAFC 55%, #F5EBDD 100%)'
const CARD_BORDER = '1px solid rgba(226, 232, 240, 0.95)'
const CARD_SHADOW =
  '0 10px 26px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.95)'

/** Reusable icon pill (white → blue gradient with blue border) – mirrors Mango's white→yellow pill */
const ICON_PILL_STYLE: React.CSSProperties = {
  background: 'linear-gradient(145deg, #0B2239 0%, #6B4430 100%)',
  border: '1px solid rgba(214, 166, 109, 0.62)',
  boxShadow: '0 6px 14px rgba(11, 34, 57, 0.22)',
}

/** Reusable solid-blue CTA button class (mirrors Mango's bg-mango-green CTA) */
const CTA_CLASSES =
  'w-full h-10 text-white font-semibold rounded-xl border-0 shadow-md hover:opacity-95 transition-opacity'
const CTA_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #5E351F 0%, #A66A3F 100%)',
}

export default function ContactCard() {
  const sectionRef = useRef<HTMLElement | null>(null)

  const openMap = () => {
    window.open(
      `https://www.google.com/maps?q=${encodeURIComponent(shopConfig.contact.mapQuery)}`,
      '_blank',
    )
  }

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto py-5"
    >
      <div
        className="rounded-[30px] border p-3.5 shadow-[0_18px_40px_rgba(94, 53, 31,0.18)]"
        style={{
          background: 'linear-gradient(145deg, #5E351F 0%, #A66A3F 58%, #6F3E24 100%)',
          borderColor: 'rgba(255,255,255,0.14)',
        }}
      >
        <div
          className="relative overflow-hidden rounded-[26px] p-3.5"
          style={{
            background:
              'linear-gradient(145deg, #5E351F 0%, #A66A3F 58%, #6F3E24 100%)',
          }}
        >
          {/* Soft brand glow accents */}
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#A66A3F]/22 blur-3xl" />
          <div className="absolute left-[-2rem] bottom-[-2rem] h-24 w-24 rounded-full bg-white/[0.08] blur-3xl" />

          <div className="section-title-accent mb-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-left">
              Get in Touch
            </h2>
          </div>

          <div className="space-y-4">
            {/* Phone — multi-person list with Call buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.05, duration: 0.3, ease: 'easeOut' }}
              className="rounded-[24px] p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              style={{ willChange: 'opacity', background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1/2 rounded-t-[24px] pointer-events-none opacity-60"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)' }}
              />
              <div className="flex items-start gap-3 mb-3 relative z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={ICON_PILL_STYLE}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ color: '#FFFFFF' }} fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 mb-2 text-base">Phone</h3>
                  <div className="space-y-2">
                    {shopConfig.contactPersons.map((person) => (
                      <div key={person.label} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{person.label}</div>
                          <div className="text-xs text-slate-600">{person.phoneDisplay}</div>
                        </div>
                        <Button
                          onClick={() => (window.location.href = getTelLink(person.phoneE164))}
                          className="h-8 px-3 text-white text-xs font-semibold rounded-full border-0 shadow-md hover:opacity-95"
                          style={CTA_STYLE}
                        >
                          Call
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* LinkedIn */}
            {shopConfig.social?.linkedin && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
                className="rounded-[24px] p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                style={{ willChange: 'opacity', background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1/2 rounded-t-[24px] pointer-events-none opacity-60"
                  style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)' }}
                />
                <div className="flex items-start gap-3 mb-3 relative z-10">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={ICON_PILL_STYLE}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ color: '#FFFFFF' }} fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1.5 text-base">LinkedIn</h3>
                    <p className="text-sm text-slate-600 break-all">Get in touch on LinkedIn</p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(shopConfig.social.linkedin, '_blank', 'noopener,noreferrer')}
                  className={CTA_CLASSES}
                  style={CTA_STYLE}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2 fill-current" aria-hidden>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Connect on LinkedIn
                </Button>
              </motion.div>
            )}

            {/* Enquiry */}
            {shopConfig.contact?.email && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: 0.12, duration: 0.3, ease: 'easeOut' }}
                className="rounded-[24px] p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                style={{ willChange: 'opacity', background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1/2 rounded-t-[24px] pointer-events-none opacity-60"
                  style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)' }}
                />
                <div className="flex items-start gap-3 mb-3 relative z-10">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={ICON_PILL_STYLE}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ color: '#FFFFFF' }} fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1.5 text-base">Enquiry</h3>
                    <p className="text-sm text-slate-600 break-all">{shopConfig.contact.email}</p>
                  </div>
                </div>
                <Button asChild className={CTA_CLASSES} style={CTA_STYLE}>
                  <a
                    href={`mailto:${shopConfig.contact.email}?subject=${encodeURIComponent(
                      'Project Enquiry - Vastukar Architects',
                    )}&body=${encodeURIComponent(
                      'Hello,\n\nI would like to discuss an architecture or interior project.\n\nPlease reply at your convenience.\n\nThank you.',
                    )}`}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Enquiry
                  </a>
                </Button>
              </motion.div>
            )}

            {/* Address with Map */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
              className="rounded-[24px] overflow-hidden hover:shadow-xl transition-all duration-300 relative"
              style={{ willChange: 'opacity', background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}
            >
              <div
                className="absolute inset-x-0 top-0 h-20 rounded-t-[24px] pointer-events-none opacity-60 z-10"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)' }}
              />
              <div className="p-4 relative z-10">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={ICON_PILL_STYLE}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ color: '#FFFFFF' }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1.5 text-base">Location</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                      {shopConfig.contact.address}
                    </p>
                  </div>
                </div>
                <Button onClick={openMap} className={CTA_CLASSES} style={CTA_STYLE}>
                  <MapPin className="w-4 h-4 mr-2 text-white" />
                  Open in Maps
                </Button>
              </div>

              {/* Embedded Map */}
              <div className="h-48 bg-slate-800/50 backdrop-blur-sm">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(shopConfig.contact.mapQuery)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.2, duration: 0.3, ease: 'easeOut' }}
              className="rounded-[24px] p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              style={{ willChange: 'opacity', background: CARD_BG, border: CARD_BORDER, boxShadow: CARD_SHADOW }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1/2 rounded-t-[24px] pointer-events-none opacity-60"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)' }}
              />
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={ICON_PILL_STYLE}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ color: '#FFFFFF' }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 mb-1.5 text-base">Office Hours</h3>
                  <p className="text-sm text-slate-600">
                    {shopConfig.contact.storeHours}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
