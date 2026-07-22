'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  PencilRuler,
  FileCheck2,
  CalendarCheck,
  DraftingCompass,
} from 'lucide-react'

import { playClickSound } from '../../../lib/playClickSound'

const visitTips = [
  {
    icon: PencilRuler,
    title: 'Discover',
    description: 'We understand your site, vision, lifestyle, requirements and budget.',
    image: '/vastukar/service-consultation.jpg',
  },
  {
    icon: DraftingCompass,
    title: 'Design',
    description: 'Concepts, plans and visual direction turn the brief into a clear proposal.',
    image: '/vastukar/service-planning.jpg',
  },
  {
    icon: FileCheck2,
    title: 'Detail & Deliver',
    description: 'Working drawings, coordination and execution carry the design through to handover.',
    image: '/vastukar/service-turnkey.jpg',
  },
]

export default function ClinicInfoSections() {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md mx-auto py-6"
      >
        <div className="mb-6">
          <div className="section-title-accent mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 text-left">
              Our Design Process
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-normal text-left">
            Discover • Design • Detail • Deliver
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-[28px] border p-4 shadow-[0_18px_38px_rgba(94,53,31,0.13)]"
          style={{
            background:
              'linear-gradient(145deg, #FFFDF9 0%, #FAF4EB 56%, #F1E4D5 100%)',
            borderColor: '#E5D1B8',
          }}
        >
          <div className="absolute right-[-3rem] top-[-3rem] h-32 w-32 rounded-full bg-[#A66A3F]/10 blur-3xl" />
          <div className="relative grid grid-cols-1 gap-3">
          {visitTips.map((tip, index) => {
            const Icon = tip.icon
            return (
              <motion.article
                key={tip.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: index * 0.04, duration: 0.28 }}
                className="relative flex items-start gap-3 overflow-hidden rounded-[22px] border p-4 shadow-[0_9px_22px_rgba(94,53,31,0.09)]"
                style={{
                  background: 'rgba(255,255,255,0.94)',
                  borderColor: '#EADBC9',
                }}
              >
                <div className="pointer-events-none absolute inset-y-0 right-0 w-[46%]" aria-hidden>
                  <Image src={tip.image} alt="" fill className="object-cover opacity-[0.18] saturate-75" sizes="180px" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/72 to-white/15" />
                </div>
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5E351F] to-[#A66A3F] shadow-[0_10px_22px_rgba(94,53,31,0.22)]">
                  <Icon className="h-5 w-5 text-white" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-black text-[#5E351F] shadow ring-1 ring-[#E5D1B8]">{index + 1}</span>
                </div>
                <div className="relative">
                  <h3 className="text-base font-black leading-tight text-slate-950">
                    {tip.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{tip.description}</p>
                </div>
              </motion.article>
            )
          })}
          <Link
            href="/book-consultation"
            onClick={() => playClickSound()}
            className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5E351F] to-[#A66A3F] text-sm font-black text-white shadow-[0_14px_28px_rgba(94,53,31,0.22)]"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Consultation
          </Link>
          </div>
        </div>
      </motion.section>
    </>
  )
}
