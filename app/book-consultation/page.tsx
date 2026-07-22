'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, CheckCircle2, ChevronDown, Clock, Phone, ScanLine, User } from 'lucide-react'
import { shopConfig } from '../shops/dogra-associates/config'
import { serviceCategories } from '../shops/dogra-associates/services'
import { getWhatsAppLink } from '../lib/phone'
import { prepareReturnToHeroCard } from '../lib/homeNavigation'

const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

function todayDateValue() {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}

function formatDateForDisplay(value: string) {
  if (!value) return 'Select date'
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function BookConsultationPage() {
  const searchParams = useSearchParams()
  const initialService = searchParams.get('service') || ''
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState(initialService)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const services = useMemo(
    () => Object.values(serviceCategories).flatMap((category) => category.items.map((item) => item.name)),
    []
  )

  const canSubmit = name.trim().length > 1 && service.trim().length > 0 && date && time
  const whatsappPhone = shopConfig.contactPersons[0]?.whatsappE164 || '919419181622'

  const message = `Hello Sir,

I would like to book a project consultation with Vastukar Architects.

Name: ${name.trim()}
Phone: ${phone.trim()}
Project / Service: ${service}
Date: ${date}
Time: ${time}

Please confirm the consultation.`

  return (
    <main
      className="min-h-screen px-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
      style={{
        background: 'linear-gradient(180deg, #eef7ff 0%, #ffffff 42%, #f8fbff 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-md pb-6">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-4 overflow-hidden rounded-[28px] border border-white/25 p-3.5 shadow-[0_24px_54px_rgba(94, 53, 31,0.22),0_8px_18px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.25)]"
          style={{ background: 'linear-gradient(135deg, #5E351F 0%, #A66A3F 72%, #8B6242 100%)' }}
        >
          <div className="relative flex items-center justify-between">
            <Link
              href="/"
              onClick={() => prepareReturnToHeroCard()}
              className="z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-[#5E351F] shadow-[0_10px_22px_rgba(0,0,0,0.18)] ring-1 ring-white/40 backdrop-blur-md transition-transform active:scale-95"
              aria-label="Back to card"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="absolute left-0 right-0 px-12 text-center text-[1.24rem] font-black leading-tight tracking-tight text-white">
              Book Consultation
            </h1>
            <span className="z-10 h-10 w-10" aria-hidden />
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
          className="rounded-[30px] border border-[#A66A3F]/15 bg-white p-4 shadow-[0_22px_52px_rgba(94, 53, 31,0.12),0_8px_18px_rgba(166, 106, 63,0.05),inset_0_1px_0_rgba(255,255,255,0.98)]"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF5EE 100%)' }}
        >
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#0F2A44]">
                <User className="h-4 w-4 text-[#A66A3F]" />
                Name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="h-12 w-full rounded-2xl border border-[#E5D1B8] bg-white px-4 text-[16px] font-semibold text-slate-950 shadow-[0_6px_14px_rgba(94, 53, 31,0.04),inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none focus:border-[#A66A3F] focus:ring-4 focus:ring-[#A66A3F]/10"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#0F2A44]">
                <Phone className="h-4 w-4 text-[#A66A3F]" />
                Phone
              </span>
              <div className="relative flex items-center">
                <div className="absolute left-0 top-0 bottom-0 z-10 flex w-20 items-center justify-center rounded-l-2xl border-r border-[#E5D1B8] bg-[#F7F2EA] text-[14px] font-black text-[#5E351F]">
                  🇮🇳 +91
                </div>
                <input
                  value={phone}
                  onChange={(event) => {
                    const val = event.target.value.replace(/\D/g, '')
                    if (val.length <= 10) setPhone(val)
                  }}
                  placeholder="10-digit mobile number"
                  inputMode="tel"
                  className="h-12 w-full rounded-2xl border border-[#E5D1B8] bg-white pl-24 pr-4 text-[16px] font-semibold text-slate-950 shadow-[0_6px_14px_rgba(94, 53, 31,0.04),inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none focus:border-[#A66A3F] focus:ring-4 focus:ring-[#A66A3F]/10"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#0F2A44]">
                <ScanLine className="h-4 w-4 text-[#A66A3F]" />
                Project / Service
              </span>
              <div className="relative">
                <select
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-[#E5D1B8] bg-white px-4 pr-11 text-[16px] font-semibold text-slate-950 shadow-[0_6px_14px_rgba(94, 53, 31,0.04),inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none focus:border-[#A66A3F] focus:ring-4 focus:ring-[#A66A3F]/10"
                >
                  <option value="">Select service</option>
                  {services.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                  <option value="General Project Enquiry">General Project Enquiry</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A66A3F]" />
              </div>
            </label>

            <div className="grid grid-cols-2 gap-3 w-full">
              <label className="block w-full">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#0F2A44]">
                  <Calendar className="h-4 w-4 text-[#A66A3F]" />
                  Date
                </span>
                <div className="relative w-full">
                  <input
                    type="date"
                    onClick={(e) => {
                      if (typeof e.currentTarget.showPicker === 'function') {
                        try { e.currentTarget.showPicker() } catch (err) {}
                      }
                    }}
                    onFocus={(e) => {
                      if (typeof e.currentTarget.showPicker === 'function') {
                        try { e.currentTarget.showPicker() } catch (err) {}
                      }
                    }}
                    min={todayDateValue()}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="booking-date-input block h-12 w-full cursor-pointer appearance-none rounded-2xl border border-[#E5D1B8] bg-white pl-3 pr-8 text-[16px] font-semibold shadow-[0_6px_14px_rgba(94, 53, 31,0.04),inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none focus:border-[#A66A3F] focus:ring-4 focus:ring-[#A66A3F]/10 m-0"
                    style={{
                      lineHeight: 'normal',
                      color: 'transparent',
                      WebkitTextFillColor: 'transparent',
                    }}
                  />
                  <span className="pointer-events-none absolute left-3 right-8 top-1/2 -translate-y-1/2 truncate text-[16px] font-semibold leading-none text-slate-950">
                    {formatDateForDisplay(date)}
                  </span>
                  <Calendar className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A66A3F]" />
                </div>
              </label>
              <label className="block w-full">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#0F2A44]">
                  <Clock className="h-4 w-4 text-[#A66A3F]" />
                  Time
                </span>
                <div className="relative w-full">
                  <select
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-[#E5D1B8] bg-white pl-3 pr-8 text-[16px] font-semibold text-slate-950 shadow-[0_6px_14px_rgba(94, 53, 31,0.04),inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none focus:border-[#A66A3F] focus:ring-4 focus:ring-[#A66A3F]/10"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A66A3F]" />
                </div>
              </label>
            </div>

          </div>

          <a
            href={canSubmit ? getWhatsAppLink(whatsappPhone, message) : undefined}
            target={canSubmit ? '_blank' : undefined}
            rel="noreferrer"
            aria-disabled={!canSubmit}
            className="mt-5 flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-[0_14px_30px_rgba(166, 106, 63,0.28)]"
            style={{
              background: canSubmit
                ? 'linear-gradient(135deg, #A66A3F 0%, #8B6242 100%)'
                : 'linear-gradient(135deg, #94A3B8 0%, #CBD5E1 100%)',
              pointerEvents: canSubmit ? 'auto' : 'none',
            }}
          >
            <Calendar className="h-4 w-4" />
            Book Consultation
          </a>
        </motion.section>

        <div className="mt-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
          {['Mon-Sat studio consultation slots', 'Project requirements discussed after confirmation', 'Architecture, interiors and turnkey project support'].map((item) => (
            <div key={item} className="flex items-center gap-2 py-1.5 text-sm font-semibold text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-[#8B6242]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
