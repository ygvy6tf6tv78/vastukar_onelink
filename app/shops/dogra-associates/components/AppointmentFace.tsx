'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { shopConfig } from '../config'

const STORAGE_KEY_SERVICES = 'appointmentSelectedServices'

const REASON_OPTIONS = [
  'Residential Architecture',
  'Commercial Architecture',
  'Institutional Project',
  'Interior Design',
  'Turnkey Project',
  'Renovation Planning',
  'General Project Enquiry',
]

const TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
]


interface AppointmentFaceProps {
  onBack: () => void
}

function formatDateForDisplay(date: Date) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const days: Date[] = []
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  // Pad start so first day aligns to weekday (0 = Sun, 1 = Mon, ...)
  const startPad = first.getDay()
  return { days, startPad }
}

const inputBase =
  'w-full min-w-0 bg-white rounded-xl px-4 py-3.5 text-[16px] text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all duration-200 border-2 border-slate-200/90 focus:border-[#A66A3F] focus:shadow-[0_0_0_3px_rgba(166, 106, 63,0.2)] shadow-[4px_4px_12px_rgba(15,42,68,0.08),-2px_-2px_8px_rgba(255,255,255,0.8)]'

export default function AppointmentFace({ onBack }: AppointmentFaceProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [reason, setReason] = useState('')
  const [selectedServicesFromPage, setSelectedServicesFromPage] = useState<string[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_SERVICES)
      if (raw) {
        const parsed = JSON.parse(raw) as string[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedServicesFromPage(parsed)
          sessionStorage.removeItem(STORAGE_KEY_SERVICES)
        }
      }
    } catch (_) {}
  }, [])

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) setCalendarOpen(false)
  }

  const buildMessage = (): string => {
    const dateStr = selectedDate ? formatDateForDisplay(selectedDate) : ''
    const hasServiceList = selectedServicesFromPage.length > 0
    const serviceBlock = hasServiceList
      ? `Consultation regarding:\n${selectedServicesFromPage.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : `Project / Service: ${reason}`
    return `Hi Vastukar Architects,

I would like to book a project consultation.

Name: ${name.trim()}
${serviceBlock}
Date: ${dateStr}
Time: ${selectedTime || ''}

Please confirm the consultation.`
  }

  const handleSubmit = () => {
    const hasServiceOrReason = reason !== '' || selectedServicesFromPage.length > 0
    if (!name.trim() || !hasServiceOrReason || !selectedDate || !selectedTime) return
    const msg = buildMessage()
    const e164 = shopConfig.contact.clientPhoneE164 || '919419181622'
    window.open(`https://wa.me/${e164}?text=${encodeURIComponent(msg)}`, '_blank')
    onBack()
  }

  const isValid =
    name.trim() !== '' &&
    (reason !== '' || selectedServicesFromPage.length > 0) &&
    selectedDate !== undefined &&
    selectedTime !== null

  const today = useMemo(() => startOfDay(new Date()), [])
  const [calendarMonth, setCalendarMonth] = useState(() => new Date())
  const { days, startPad } = useMemo(() => {
    const y = calendarMonth.getFullYear()
    const m = calendarMonth.getMonth()
    return getDaysInMonth(y, m)
  }, [calendarMonth])

  return (
    <div
      className="absolute inset-0 rounded-[24px] overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(160deg, #E5D1B8 0%, #F2E7D9 42%, #A66A3F 100%)',
        padding: 22,
        minHeight: '580px',
        boxSizing: 'border-box',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.78), 0 4px 20px rgba(94, 53, 31,0.20)',
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <h2 className="font-bold mb-1.5" style={{ fontSize: 22, color: '#5E351F' }}>
          Book Consultation
        </h2>
        <p className="text-base font-medium mb-5 leading-snug" style={{ color: '#334155' }}>
          with Vastukar Architects
        </p>

        {selectedServicesFromPage.length > 0 && (
          <p className="text-sm font-semibold mb-3" style={{ color: '#334155' }}>
            Including: {selectedServicesFromPage.join(', ')}
          </p>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-[15px] font-semibold mb-1.5" style={{ color: '#5E351F' }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputBase}
            />
          </div>

          <div>
            <label className="block text-[15px] font-semibold mb-1.5" style={{ color: '#5E351F' }}>Project / Service</label>
            <div className="relative">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`${inputBase} pr-10 appearance-none bg-white cursor-pointer`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                <option value="">Select reason</option>
                {REASON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2.5">
            <div className="min-w-0">
              <label className="block text-[13px] font-bold mb-1.5" style={{ color: '#5E351F' }}>Date</label>
              <button
                type="button"
                onClick={() => setCalendarOpen(true)}
                className={`${inputBase} flex items-center justify-between gap-2 text-left cursor-pointer px-3 py-3.5 overflow-hidden`}
              >
                <span className={`min-w-0 truncate text-[13px] ${selectedDate ? 'font-bold text-slate-900' : 'font-semibold text-slate-500'}`}>
                  {selectedDate ? formatDateForDisplay(selectedDate) : 'Select date'}
                </span>
                <CalendarIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </button>
            </div>

            <div className="min-w-0">
              <label className="block text-[13px] font-bold mb-1.5" style={{ color: '#5E351F' }}>Time</label>
              <div className="relative min-w-0">
                <select
                  value={selectedTime ?? ''}
                  onChange={(e) => setSelectedTime(e.target.value || null)}
                  className={`${inputBase} pr-8 appearance-none bg-white cursor-pointer px-3 py-3.5 text-[13px] font-bold truncate`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                  }}
                >
                  <option value="">Select time</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full rounded-xl py-3.5 font-semibold text-[16px] text-white border border-[#A66A3F]/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all touch-manipulation active:scale-[0.99] hover:brightness-[1.04]"
            style={{
              background: 'linear-gradient(135deg, #5E351F 0%, #A66A3F 100%)',
              boxShadow: '0 6px 16px rgba(166, 106, 63, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
              // Helps the button look "button-y" on light gradients too.
              outline: '1px solid rgba(255,255,255,0.18)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Confirm Slot
          </button>

          {/* Back button: only below Confirm Appointment (no top back) */}
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-xl py-3 font-semibold text-[15px] text-[#5E351F] border border-[#A66A3F]/25 bg-white/35 hover:bg-white/55 backdrop-blur-sm transition-all touch-manipulation active:scale-[0.99] flex items-center justify-center gap-2"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            Back
          </button>
        </div>
      </div>

      {/* Apple-style calendar sheet */}
      <AnimatePresence>
        {calendarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[9996] backdrop-blur-sm"
              onClick={() => setCalendarOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 right-0 bottom-0 z-[9997] bg-white rounded-t-[20px] shadow-[0_-4px 24px rgba(0,0,0,0.12)]"
              style={{ maxHeight: '85vh' }}
            >
              <div className="sticky top-0 bg-white rounded-t-[20px] pt-4 pb-3 px-4 border-b border-slate-200/80">
                <div className="w-9 h-1 rounded-full bg-slate-300 mx-auto mb-4" aria-hidden />
                <div className="flex items-center justify-between">
                  <span className="text-[17px] font-semibold text-slate-900">
                    {calendarMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
                      className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
                      className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarOpen(false)}
                      className="ml-2 text-[15px] font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((wd, i) => (
                    <div key={i} className="text-[12px] font-semibold text-slate-500 py-2">
                      {wd}
                    </div>
                  ))}
                  {Array.from({ length: startPad }, (_, i) => (
                    <div key={`pad-${i}`} />
                  ))}
                  {days.map((day) => {
                    const isPast = day < today
                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
                    return (
                      <button
                        key={day.getTime()}
                        type="button"
                        disabled={isPast}
                        onClick={() => !isPast && handleSelectDate(day)}
                        className="aspect-square flex items-center justify-center rounded-full text-[15px] font-medium transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                        style={{
                          background: isSelected ? '#5E351F' : 'transparent',
                          color: isSelected ? '#fff' : isPast ? '#94a3b8' : '#0f172a',
                        }}
                      >
                        {day.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
