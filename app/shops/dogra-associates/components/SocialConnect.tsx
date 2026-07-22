'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Linkedin, Mail, Download } from 'lucide-react'
import { shopConfig } from '../config'
import { getWhatsAppLink } from '../../../lib/phone'
import { downloadVCard, generateVCard } from '../../../lib/vcard'
import { playClickSound } from '../../../lib/playClickSound'

export default function SocialConnect() {
  const hasLinkedIn = !!shopConfig.social?.linkedin
  const hasEmail = !!shopConfig.contact?.email
  const whatsappPhone = shopConfig.contactPersons?.[0]?.whatsappE164 || shopConfig.whatsapp?.defaultPhone || ''
  const hasWhatsApp = !!whatsappPhone

  const emailBody = `Hello,\n\nI would like to discuss an architecture or interior project.\n\nPlease reply at your convenience.\n\nThank you.`
  const emailSubject = 'Project Enquiry - Vastukar Architects'

  const handleShare = async () => {
    playClickSound()
    if (!shopConfig.contact?.email) return
    const shareText = `Check out ${shopConfig.name}.\nContact: ${shopConfig.contact.email}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: shopConfig.name,
          text: shareText,
          url: window.location.href,
        })
      } catch {
        // User cancelled share or share not available; no-op.
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleSaveContact = () => {
    playClickSound()
    if (!shopConfig.contact?.email) return
    const vCard = generateVCard({
      name: shopConfig.name,
      organization: shopConfig.name,
      phones: shopConfig.contactPersons.map((p) => p.phoneE164.replace(/^91/, '')),
      email: shopConfig.contact.email,
      address: shopConfig.contact.address,
      website: shopConfig.url,
    })
    downloadVCard(vCard, `${shopConfig.name.replace(/\s+/g, '-')}-contact.vcf`)
  }

  if (!hasLinkedIn && !hasEmail && !hasWhatsApp) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-md mx-auto px-2 py-6"
    >
      <div
        className="rounded-3xl p-6 shadow-xl text-center overflow-hidden border border-white/10"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 35%, #1d4ed8 60%, #3b82f6 85%, #93c5fd 100%)',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center justify-center gap-4 mb-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/20"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
          >
            <Image
              src={shopConfig.assets.logo}
              alt={shopConfig.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-white/20"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            <span className="text-2xl font-bold text-white tracking-tight">
              Connect
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white/95 mb-1 tracking-tight">
          Get in Touch
        </h3>
        <p className="text-sm text-white/70 mb-5">
          Reach us via WhatsApp or enquiry
        </p>

        <div className="space-y-3">
          {hasLinkedIn && (
            <motion.button
              onClick={() => {
                playClickSound()
                window.open(shopConfig.social!.linkedin!, '_blank', 'noopener,noreferrer')
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl h-12 px-6 font-semibold text-[15px] text-white flex items-center justify-center gap-2.5 transition-all duration-200"
              style={{
                background: '#0A66C2',
                boxShadow: '0 4px 14px rgba(10, 102, 194, 0.35)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Linkedin className="w-5 h-5 shrink-0" strokeWidth={2} />
              <span>LinkedIn</span>
            </motion.button>
          )}

          {hasWhatsApp && (
            <motion.button
              onClick={() => {
                playClickSound()
                const message = shopConfig.whatsapp?.defaultMessage || 'Hello Sir, I need consultation regarding tax services.'
                const link = getWhatsAppLink(whatsappPhone, message)
                window.open(link, '_blank', 'noopener,noreferrer')
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl h-12 px-6 font-semibold text-[15px] text-white flex items-center justify-center gap-2.5 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #20BA5A 100%)',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#fff" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>WhatsApp</span>
            </motion.button>
          )}

          {hasEmail && (
            <motion.a
              href={`mailto:${shopConfig.contact!.email!}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
              onClick={() => playClickSound()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl h-12 px-6 font-semibold text-[15px] text-white flex items-center justify-center gap-2.5 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Mail className="w-5 h-5 shrink-0" strokeWidth={2} />
              <span>Enquiry</span>
            </motion.a>
          )}
        </div>

        {/* Save contact + Share */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <motion.button
            onClick={handleSaveContact}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-11 rounded-2xl font-semibold text-[14px] text-slate-700 flex items-center justify-center gap-2 transition-all touch-manipulation relative overflow-hidden border-2 border-blue-500/70 bg-white/90"
            style={{
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-[shimmer_2s_infinite] pointer-events-none" />
            <Download className="w-4 h-4 relative z-10" style={{ color: '#5E351F' }} />
            <span className="relative z-10">Save</span>
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-11 rounded-2xl font-semibold text-[14px] text-white flex items-center justify-center gap-2 transition-all touch-manipulation relative overflow-hidden bg-[rgba(255,255,255,0.18)] border border-white/25"
            style={{
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              WebkitTapHighlightColor: 'transparent',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 3v12" />
              <path d="M7 8l5-5 5 5" />
              <path d="M5 21h14" />
            </svg>
            <span>Share Card</span>
          </motion.button>
        </div>
      </div>
    </motion.section>
  )
}
