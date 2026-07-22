'use client'

import { motion } from 'framer-motion'
import { Award, DraftingCompass, ScanLine, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

const whyChooseUs = [
  {
    id: 'why-1',
    icon: Award,
    title: 'Context-Driven Design',
    description: 'Every plan responds to the site, purpose and people.',
    image: '/vastukar/service-architecture.jpg',
  },
  {
    id: 'why-2',
    icon: ScanLine,
    title: 'Complete Design',
    description: 'Architecture, interiors and execution come together as one clear vision.',
    image: '/vastukar/service-interiors.jpg',
  },
  {
    id: 'why-3',
    icon: ShieldCheck,
    title: 'Detail-Led Execution',
    description: 'Clear drawings and careful coordination protect every built detail.',
    image: '/vastukar/service-planning.jpg',
  },
  {
    id: 'why-4',
    icon: DraftingCompass,
    title: 'End-to-End Solutions',
    description: 'One clear process from consultation to turnkey handover.',
    image: '/vastukar/service-turnkey.jpg',
  },
]

export default function Services() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto py-6"
    >
      <div className="mb-6">
        <div className="section-title-accent mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 text-left">
            Why Choose Vastukar?
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-600 font-normal text-left">
          Creative • Functional • Built with Precision
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {whyChooseUs.map((service, index) => {
          const IconComponent = service.icon
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
              className="group relative rounded-[25px] p-5 overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, #FFFFFF 0%, #FCF8F2 58%, #F2E7D9 100%)',
                border: '1px solid #E5D1B8',
                boxShadow:
                  '0 14px 32px rgba(94, 53, 31,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
              }}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[64%] overflow-hidden" aria-hidden>
                <Image src={service.image} alt="" fill className="scale-110 object-cover opacity-[0.30] blur-[1px] saturate-[0.85]" sizes="280px" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/60 to-[#FCF8F2]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/50" />
              </div>
              {/* Top white sheen */}
              <div className="absolute inset-x-0 top-0 h-20 opacity-70 pointer-events-none bg-gradient-to-b from-[#F1E7DB] to-transparent" />

              {/* Number badge top-right */}
              <div className="absolute right-4 top-4 text-[10px] font-bold tracking-[0.22em] text-[#5E351F]/30">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="relative z-10 flex items-start gap-4 transition-all duration-300 group-hover:-translate-y-0.5">
                {/* Icon pill — white-to-blue gradient */}
                <div
                  className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      'linear-gradient(145deg, #5E351F 0%, #A66A3F 100%)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    boxShadow:
                      '0 10px 22px rgba(94, 53, 31,0.22), inset 0 1px 0 rgba(255,255,255,0.24)',
                  }}
                >
                  <IconComponent
                    className="w-7 h-7 relative z-10"
                    style={{ color: '#FFFFFF' }}
                    strokeWidth={2}
                  />
                </div>

                <div className="flex-1 relative z-10 pr-7">
                  <h3
                    className="font-bold text-base mb-1.5 leading-tight"
                    style={{ color: '#0F172A' }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#64748B' }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
