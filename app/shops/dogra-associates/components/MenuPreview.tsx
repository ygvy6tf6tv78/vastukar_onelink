'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  Armchair,
  Landmark,
  KeyRound,
  Ruler,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import { servicesPreviewCards } from '../services'
import { setReturnSection } from '../../../lib/homeNavigation'

// Map preview-card key → Lucide icon. Keeps services.ts free of React imports
// while letting us swap emojis for crisp, consistent line icons.
const previewIconMap: Record<string, LucideIcon> = {
  taxGst: Landmark,
  compliance: Armchair,
  audit: KeyRound,
  planning: Ruler,
}

export default function MenuPreview() {
  return (
    <section id="services" className="w-full max-w-md mx-auto py-5">
      {/* Header — same treatment as Mango "Our Menu" (title + trailing accent line) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-5"
      >
        <div className="section-title-accent mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight text-left">
            Services
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-600 font-medium text-left tracking-wide">
          Architecture • Interiors • Turnkey Projects
        </p>
      </motion.div>

      {/* 4-card square grid — Mango "Our Menu" geometry */}
      <div className="grid grid-cols-2 gap-3.5 mb-5">
        {servicesPreviewCards.map((card, index) => {
          const Icon = previewIconMap[card.key] ?? Landmark
          return (
          <Link key={card.key} href={card.href} className="block">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
              className="relative aspect-square rounded-[24px] overflow-hidden cursor-pointer group border border-white/10 shadow-[0_16px_32px_rgba(15,23,42,0.32)] transition-all duration-300"
            >
              <Image
                src={card.image}
                alt={card.name}
                fill
                className="object-cover scale-[1.02] blur-[1px] group-hover:scale-[1.07] transition-transform duration-500"
                sizes="(max-width: 448px) 50vw, 224px"
              />

              {/* Inner hairline border – matches Mango */}
              <div className="absolute inset-[1px] rounded-[23px] border border-white/10 z-[1]" />

              {/* Subtle top sheen */}
              <div className="absolute inset-x-5 top-4 h-12 rounded-full bg-white/10 blur-2xl z-[1]" />

              {/* Clean black gradient — matches Mango "Our Menu" exactly */}
              <div
                className="absolute inset-0 z-[1]"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.9) 36%, rgba(0,0,0,0.56) 66%, rgba(0,0,0,0.22) 100%)',
                }}
              />

              {/* Glassy icon pill — top-right (Mango geometry, Lucide icon) */}
              <div
                className="absolute top-3 right-3 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center z-10 backdrop-blur-md"
                style={{
                  background: 'rgba(255,255,255,0.16)',
                  border: '1px solid rgba(255,255,255,0.30)',
                  boxShadow:
                    '0 8px 18px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.30)',
                }}
              >
                <Icon
                  className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white"
                  strokeWidth={2.2}
                />
              </div>

              {/* Title + subtitle + "View Services" pill (Mango layout) */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 z-10">
                <h3
                  className="text-white font-bold text-base sm:text-lg mb-0.5 leading-tight line-clamp-2"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}
                >
                  {card.name}
                </h3>
                <p
                  className="text-slate-300 text-xs sm:text-sm font-medium leading-snug mb-2.5 line-clamp-2"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}
                >
                  {card.shortDescription}
                </p>
                <span className="inline-flex items-center gap-1.5 text-slate-100 font-semibold text-xs sm:text-sm bg-white/14 hover:bg-white/22 px-3 py-1.5 rounded-full transition-colors border border-white/20 backdrop-blur-md">
                  View Services
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>
            </motion.div>
          </Link>
          )
        })}
      </div>

      {/* Single full-width primary CTA (Mango "View Full Menu" geometry, indigo brand) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="pt-1"
      >
        <Link
          href="/services"
          onClick={() => setReturnSection('services')}
          className="block w-full text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #5E351F 0%, #A66A3F 100%)',
            boxShadow: '0 18px 34px rgba(94, 53, 31, 0.34)',
          }}
        >
          View All Services
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  )
}
