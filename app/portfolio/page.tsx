'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Briefcase, Building2, FileText, Heart, Home, Landmark, MapPin, PencilRuler, Phone } from 'lucide-react'

import { getWhatsAppLink } from '../lib/phone'
import { prepareReturnToHeroCard } from '../lib/homeNavigation'
import { shopConfig } from '../shops/dogra-associates/config'

const categories = ['All Projects', 'Institutional', 'Cultural', 'Wellness', 'Education'] as const
const categoryIcons = {
  'All Projects': Briefcase,
  Institutional: Building2,
  Cultural: Landmark,
  Wellness: Heart,
  Education: FileText,
}

const projects = [
  { name: 'J&K Service Selection Board', category: 'Institutional', location: 'Jammu, J&K', image: '/vastukar/jkssb.jpg', description: 'Purpose-led workplace planning supporting daily operations, visitors and long-term institutional use.' },
  { name: 'Chib Devsthan Gate', category: 'Cultural', location: 'Jammu Region', image: '/vastukar/chib-gate.jpg', description: 'A distinctive arrival marker designed to express place, tradition and a memorable sense of entry.' },
  { name: 'Kargil Bhawan', category: 'Institutional', location: 'Jammu & Kashmir', image: '/vastukar/kargil-bhawan.jpg', description: 'A durable, practical institutional environment developed through disciplined planning and detailing.' },
  { name: 'Yoga Hall for Ayush Gram', category: 'Wellness', location: 'Jammu & Kashmir', image: '/vastukar/yoga-hall.jpg', description: 'A calm collective space planned around natural light, openness and the rhythm of wellness practice.' },
  { name: 'School Building Secondary Block', category: 'Education', location: 'Jammu & Kashmir', image: '/vastukar/school-building.jpg', description: 'An education-focused block designed for intuitive circulation, learning and reliable everyday use.' },
] as const

function WhatsAppMark({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#25D366" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function PortfolioPage() {
  const [active, setActive] = useState<(typeof categories)[number]>('All Projects')
  const categoryScrollRef = useRef<HTMLDivElement>(null)
  const visibleProjects = useMemo(
    () => active === 'All Projects' ? projects : projects.filter((project) => project.category === active),
    [active],
  )

  const selectCategory = (category: (typeof categories)[number]) => {
    setActive(category)
    window.setTimeout(() => {
      categoryScrollRef.current
        ?.querySelector<HTMLElement>(`[data-portfolio-category="${category}"]`)
        ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }, 0)
  }

  return (
    <main className="min-h-screen bg-[#FBF8F4] px-3 pb-10 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mx-auto w-full max-w-md">
        <header
          className="mb-4 overflow-hidden rounded-[28px] border border-white/20 p-3.5 text-white shadow-[0_14px_30px_rgba(94,53,31,0.20)]"
          style={{ background: 'linear-gradient(135deg, #5E351F 0%, #A66A3F 100%)' }}
        >
          <div className="relative flex items-center justify-between">
            <Link
              href="/"
              onClick={() => prepareReturnToHeroCard()}
              className="z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/12 text-white ring-1 ring-white/20"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="absolute left-0 right-0 flex items-center justify-center gap-2 px-12">
              <Image src="/vastukar/vastukar-logo-new.png" alt="" width={32} height={32} className="h-8 w-8 rounded-full bg-white object-contain p-0.5" />
              <h1 className="text-[1.4rem] font-black tracking-tight text-white">Portfolio</h1>
            </div>
            <Link href="/book-consultation" className="z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/14 ring-1 ring-white/20" aria-label="Book consultation">
              <PencilRuler className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-3 px-1 text-sm leading-6 text-white/82">
            Selected architecture and design work by Vastukar Architects.
          </p>
          <nav className="mt-3 grid grid-cols-3 gap-2 rounded-2xl border border-white/15 bg-black/10 p-1.5 backdrop-blur-md" aria-label="Portfolio navigation">
            <Link href="/" onClick={() => prepareReturnToHeroCard()} className="flex h-9 items-center justify-center gap-1 rounded-xl text-[11px] font-bold text-white/90 hover:bg-white/10"><Home className="h-3.5 w-3.5" /> Home</Link>
            <Link href="/services" className="flex h-9 items-center justify-center rounded-xl text-[11px] font-bold text-white/90 hover:bg-white/10">Services</Link>
            <Link href="/book-consultation" className="flex h-9 items-center justify-center rounded-xl bg-white text-[11px] font-black text-[#5E351F]">Consult</Link>
          </nav>
          <div ref={categoryScrollRef} className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((category) => {
              const Icon = categoryIcons[category]
              return (
              <button
                key={category}
                type="button"
                data-portfolio-category={category}
                onClick={() => selectCategory(category)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-bold transition-colors"
                style={{
                  background: active === category ? '#FFFFFF' : 'rgba(255,255,255,0.12)',
                  color: active === category ? '#5E351F' : '#FFFFFF',
                  borderColor: active === category ? '#FFFFFF' : 'rgba(255,255,255,0.22)',
                }}
              >
                <Icon className="h-3.5 w-3.5" /> {category}
              </button>
              )
            })}
          </div>
        </header>

        <div className="grid gap-5">
          {visibleProjects.map((project, index) => (
            <motion.article
              key={project.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              className="overflow-hidden rounded-[30px] border border-[#EADBC9] bg-white p-2 shadow-[0_20px_44px_rgba(94,53,31,0.12)]"
            >
              <div className="relative block aspect-[16/11] w-full overflow-hidden rounded-[24px] bg-[#EEE7DE]">
                <Image src={project.image} alt={project.name} fill className="object-cover" sizes="448px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />
                <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md">{project.category}</span>
              </div>
              <div className="px-3 pb-3 pt-4">
                <h2 className="text-[1.2rem] font-black leading-tight text-slate-950">{project.name}</h2>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#A66A3F]"><MapPin className="h-3.5 w-3.5" /> {project.location}</p>
                <p className="mt-3 text-[13px] font-medium leading-6 text-slate-600">{project.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:+${shopConfig.contact.clientPhoneE164}`}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl text-[12px] font-black text-white"
                    style={{
                      background: 'linear-gradient(135deg, #5E351F 0%, #A66A3F 100%)',
                      boxShadow: '0 8px 20px rgba(94,53,31,0.34), 0 4px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.20)',
                      transform: 'translateY(-1px)',
                    }}
                  ><Phone className="h-4 w-4" /> Call Now</a>
                  <Link
                  href={getWhatsAppLink(shopConfig.contact.clientPhoneE164, `Hello Vastukar Architects, I would like to enquire about ${project.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white text-[12px] font-black text-slate-900"
                  style={{
                    border: '1px solid rgba(15,23,42,0.08)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.86)',
                    transform: 'translateY(-1px)',
                  }}
                >
                    <WhatsAppMark className="h-[18px] w-[18px]" /> WhatsApp
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>

    </main>
  )
}
