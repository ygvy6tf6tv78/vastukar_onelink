'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

import { getWhatsAppLink } from '../../../lib/phone'
import { playClickSound } from '../../../lib/playClickSound'
import { pricingPackages } from '../pricing'
import { shopConfig } from '../config'

export default function UrgencyCTA() {
  const previewPackages = pricingPackages.slice(0, 3)

  return (
    <motion.section
      id="packages"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto py-6 scroll-mt-5"
    >
      <div className="mb-6">
        <div className="section-title-accent mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 text-left">
            Featured Projects
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-600 font-normal text-left">
          Selected work by Vastukar Architects
        </p>
      </div>

      <div className="grid gap-4">
        {previewPackages.map((pkg, index) => {
          return (
            <Link key={pkg.id} href="/portfolio" onClick={() => playClickSound()} className="block">
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: index * 0.04, duration: 0.28 }}
              className="relative min-h-[178px] overflow-hidden rounded-[26px] border border-white/15 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.26)]"
            >
              <Image src={pkg.image} alt={pkg.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="448px" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/76 to-black/42" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/20" />
              <div className="relative flex min-h-[138px] flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <p className="rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md">
                      {pkg.category}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/92 px-3 py-1.5 text-[10px] font-black text-[#5E351F]">0{index + 1}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5E351F] shadow-lg"><ArrowRight className="h-4 w-4 -rotate-45" /></span>
                  </div>
                </div>
                <div className="max-w-[82%]">
                  <h3 className="text-xl font-black leading-tight text-white">{pkg.title}</h3>
                  <p className="mt-2 flex items-start gap-1.5 text-xs font-semibold leading-5 text-white/78">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D6A66D]" /> {pkg.timeline}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-[11px] font-medium leading-5 text-white/65">{pkg.description}</p>
                </div>
              </div>
            </motion.article>
            </Link>
          )
        })}
      </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href="/portfolio"
            onClick={() => playClickSound()}
            className="inline-flex py-4 px-6 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white shadow-[0_18px_34px_rgba(94, 53, 31,0.28)]"
            style={{
              background:
                'linear-gradient(135deg, #5E351F 0%, #A66A3F 72%, #8B6242 100%)',
            }}
          >
            View Portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={getWhatsAppLink(
              shopConfig.contact.clientPhoneE164,
              'Hello Vastukar Architects, I would like to discuss a project after viewing your portfolio.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClickSound()}
            className="inline-flex py-4 px-6 items-center justify-center rounded-2xl bg-[#F7F2EA] text-sm font-bold text-[#5E351F] shadow-[0_10px_22px_rgba(94, 53, 31,0.08)] ring-1 ring-[#E5D1B8]"
          >
            Enquire
          </Link>
        </div>

    </motion.section>
  )
}
