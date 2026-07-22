'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, ArrowLeft, Check, Shield, Lock, Download, Share2, QrCode, Landmark } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '../../../contexts/LanguageContext'
import { shopConfig } from '../config'

interface PaymentFaceProps {
  upiId: string
  upiId2?: string
  upiName: string
  amountINR?: number
  upiQrImageUrl?: string
  scannerImage?: string
  bank?: {
    bankName: string
    accountNumberMasked: string
    ifsc: string
    accountHolder: string
    branchName?: string
  }
  onBack: () => void
}

// Build UPI deep link - Secure and properly encoded
function buildUpiLink(upiId: string, upiName: string, amount?: number): string {
  // URLSearchParams automatically encodes special characters like @
  const params = new URLSearchParams({
    pa: upiId, // Payee Address (UPI ID) - @ symbol will be encoded as %40
    pn: upiName, // Payee Name
    cu: 'INR', // Currency
  })
  if (amount && amount > 0) {
    params.set('am', amount.toString())
  }
  return `upi://pay?${params.toString()}`
}

// Copy to clipboard with toast
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
    }
  }

  return { copy, copied }
}

export default function PaymentFace({
  upiId,
  upiId2,
  upiName,
  amountINR,
  upiQrImageUrl,
  scannerImage,
  bank,
  onBack,
}: PaymentFaceProps) {
  const { t } = useLanguage()
  const { copy: copyUpi, copied: upiCopied } = useCopyToClipboard()
  const { copy: copyBank, copied: bankCopied } = useCopyToClipboard()
  const [lastCopiedUpiId, setLastCopiedUpiId] = useState<string | null>(null)
  const [lastCopiedBankField, setLastCopiedBankField] = useState<string | null>(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [scannerModalOpen, setScannerModalOpen] = useState(false)
  const [bankModalOpen, setBankModalOpen] = useState(false)
  const [canShare, setCanShare] = useState(false)

  const upiLink = buildUpiLink(upiId, upiName, amountINR)

  // Generate QR code URL from UPI ID if not provided
  const getQRCodeUrl = () => {
    if (upiQrImageUrl) return upiQrImageUrl
    // Generate QR code using UPI link
    const encodedUpiLink = encodeURIComponent(upiLink)
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUpiLink}&bgcolor=ffffff&color=000000&margin=1`
  }

  const qrCodeUrl = getQRCodeUrl()

  // Check if Web Share API is available
  useEffect(() => {
    setCanShare(!!navigator.share && !!navigator.canShare)
  }, [])

  // Download QR Code
  const handleDownloadQR = async () => {
    try {
      // Fetch QR code image and download
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `upi-qr-${upiId.replace('@', '-')}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      // Fallback: create img element to convert to canvas
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `upi-qr-${upiId.replace('@', '-')}.png`
              document.body.appendChild(a)
              a.click()
              window.URL.revokeObjectURL(url)
              document.body.removeChild(a)
            }
          }, 'image/png')
        }
      }
      img.src = qrCodeUrl
    }
  }

  // Share QR Code: native share (with image) when supported, else open WhatsApp share with text
  const handleShareQR = async () => {
    const shareText = `Scan to pay ${upiName}\nUPI: ${upiId}`

    try {
      if (canShare && navigator.share) {
        const response = await fetch(qrCodeUrl)
        const blob = await response.blob()
        const file = new File([blob], `upi-qr-${upiId.replace('@', '-')}.png`, { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'UPI Payment QR Code',
            text: shareText,
            files: [file],
          })
          return
        }
      }
      // Fallback: open WhatsApp share with pre-filled text (no image)
      const encoded = encodeURIComponent(shareText)
      window.open(`https://wa.me/?text=${encoded}`, '_blank')
    } catch (error) {
      const encoded = encodeURIComponent(shareText)
      window.open(`https://wa.me/?text=${encoded}`, '_blank')
    }
  }

  // Build Paytm app deep link with UPI ID - Secure and optimized
  const buildPaytmLink = () => {
    // URLSearchParams automatically encodes @ symbol as %40
    const params = new URLSearchParams({
      pa: upiId, // Payee Address (UPI ID) - Same account for all apps
      pn: upiName, // Payee Name
      cu: 'INR', // Currency
    })
    if (amountINR && amountINR > 0) {
      params.set('am', amountINR.toString()) // Amount
    }
    // Paytm deep link - opens Paytm app directly with pre-filled UPI ID
    return `paytmmp://pay?${params.toString()}`
  }

  // Build Google Pay deep link - Secure and optimized
  const buildGooglePayLink = () => {
    // URLSearchParams automatically encodes @ symbol as %40
    const params = new URLSearchParams({
      pa: upiId, // Payee Address (UPI ID) - Same account for all apps
      pn: upiName, // Payee Name
      cu: 'INR', // Currency
    })
    if (amountINR && amountINR > 0) {
      params.set('am', amountINR.toString()) // Amount
    }
    // Google Pay deep link - opens Google Pay app directly with pre-filled UPI ID
    return `tez://upi/pay?${params.toString()}`
  }

  // Build PhonePe UPI link - Secure and optimized
  const buildPhonePeLink = () => {
    // URLSearchParams automatically encodes @ symbol as %40
    const params = new URLSearchParams({
      pa: upiId, // Payee Address (UPI ID) - Same account for all apps
      pn: upiName, // Payee Name
      cu: 'INR', // Currency
    })
    if (amountINR && amountINR > 0) {
      params.set('am', amountINR.toString()) // Amount
    }
    // PhonePe deep link - opens PhonePe app directly with pre-filled UPI ID
    return `phonepe://pay?${params.toString()}`
  }

  const handlePayWithPaytm = () => {
    try {
      const paytmLink = buildPaytmLink()
      setPaymentModalOpen(false)
      
      // Open Paytm app with UPI ID pre-filled
      window.location.href = paytmLink
      
      // Smart fallback: if Paytm app doesn't open, use standard UPI link
      setTimeout(() => {
        if (document.hasFocus()) {
          // App didn't open, fallback to standard UPI
          window.open(upiLink, '_blank')
        }
      }, 1500)
    } catch (error) {
      // Fallback to standard UPI link on error
      window.open(upiLink, '_blank')
      setPaymentModalOpen(false)
    }
  }

  const handlePayWithGooglePay = () => {
    try {
      const googlePayLink = buildGooglePayLink()
      setPaymentModalOpen(false)
      
      // Open Google Pay app with UPI ID pre-filled
      window.location.href = googlePayLink
      
      // Smart fallback: if Google Pay app doesn't open, use standard UPI link
      setTimeout(() => {
        if (document.hasFocus()) {
          // App didn't open, fallback to standard UPI
          window.open(upiLink, '_blank')
        }
      }, 1500)
    } catch (error) {
      // Fallback to standard UPI link on error
      window.open(upiLink, '_blank')
      setPaymentModalOpen(false)
    }
  }

  const handlePayWithPhonePe = () => {
    try {
      const phonePeLink = buildPhonePeLink()
      setPaymentModalOpen(false)
      
      // Open PhonePe app with UPI ID pre-filled
      window.location.href = phonePeLink
      
      // Smart fallback: if PhonePe app doesn't open, use standard UPI link
      setTimeout(() => {
        if (document.hasFocus()) {
          // App didn't open, fallback to standard UPI
          window.open(upiLink, '_blank')
        }
      }, 1500)
    } catch (error) {
      // Fallback to standard UPI link on error
      window.open(upiLink, '_blank')
      setPaymentModalOpen(false)
    }
  }

  const handleCopyUpi = (id: string) => {
    setLastCopiedUpiId(id)
    copyUpi(id)
  }

  const handleCopyBankField = (fieldLabel: string, value: string) => {
    setLastCopiedBankField(fieldLabel)
    copyBank(value)
  }

  // Handle Escape key to go back
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onBack])

  if (!upiId) {
    const message = encodeURIComponent('Hello Vastukar Architects, please share the payment details for my project.')
    return (
      <div
        className="rounded-[28px] shadow-2xl overflow-hidden border border-slate-800 relative w-full"
        style={{ background: 'radial-gradient(circle at 50% 35%, #199097 0%, #0F766E 52%, rgb(17, 19, 21) 100%)', minHeight: '580px' }}
      >
        <div className="relative z-10 flex min-h-[580px] flex-col items-center justify-center px-7 py-8 text-center">
          <Lock className="mb-4 h-11 w-11 text-white" />
          <h2 className="text-2xl font-black tracking-tight text-white">Secure Payment</h2>
          <p className="mt-3 max-w-xs text-sm font-medium leading-6 text-white/75">
            Payment details are shared against your approved quotation or project invoice.
          </p>
          <a
            href={`https://wa.me/${shopConfig.contact.clientPhoneE164}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex h-12 w-full items-center justify-center rounded-2xl bg-white text-sm font-black text-[#0F766E] shadow-xl"
          >
            Request Payment Details
          </a>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Details
          </button>
          <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-white/65">
            <Shield className="h-4 w-4" /> OneLink secure payment flow
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-[28px] shadow-2xl overflow-y-auto border border-slate-800 relative w-full"
      style={{
        background:
          'radial-gradient(circle at 50% 35%, #199097 0%, #0F766E 52%, #111315 100%)',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        minHeight: 'auto',
      }}
    >
      {/* Grain overlay – same as reference */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-6 text-center" style={{ minHeight: '580px', paddingBottom: '2rem', pointerEvents: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Title: Secure Payment + 100% Secure & Encrypted */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
              Secure Payment
            </h2>
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <Lock className="w-4 h-4" />
              <span>100% Secure &amp; Encrypted</span>
            </div>
          </motion.div>

          {/* 1. Pay via Scanner – white, border */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mb-3"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setScannerModalOpen(true)
              }}
              className="w-full bg-white hover:bg-gray-50 font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer relative z-20 touch-manipulation border-[1.5px]"
              style={{
                WebkitTapHighlightColor: 'transparent',
                borderColor: 'rgba(15, 118, 110, 0.38)',
                color: '#0F766E',
                boxShadow: '0 2px 8px rgba(15, 118, 110, 0.12)',
              }}
              aria-label="Pay via Scanner"
            >
              <QrCode className="w-5 h-5" style={{ color: '#0F766E' }} />
              <span>Pay via Scanner</span>
            </motion.button>
          </motion.div>

          {/* 2. Pay via UPI – teal, app logos */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mb-3 relative z-20"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setPaymentModalOpen(true)
              }}
              className="w-full text-white font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer relative z-30 touch-manipulation"
              style={{
                WebkitTapHighlightColor: 'transparent',
                background:
                  'linear-gradient(135deg, #157C82 0%, #0F766E 58%, #111315 100%)',
                boxShadow:
                  '0 8px 20px rgba(15,118,110,0.30), 0 2px 8px rgba(17,19,21,0.24)',
              }}
              aria-label="Pay via UPI"
            >
              <div className="flex items-center gap-1.5">
                <Image src="/logos/icons8-paytm-48.png" alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain" unoptimized />
                <Image src="/logos/icons8-google-pay-48.png" alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain" unoptimized />
                <Image src="/logos/icons8-phone-pe-48.png" alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain" unoptimized />
              </div>
              <span>{t('payViaUPI')}</span>
            </motion.button>
          </motion.div>

          {/* 3. Transfer via Bank */}
          {bank && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="mb-3"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setBankModalOpen(true)
                }}
                className="w-full text-white font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer relative z-20 touch-manipulation"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  background: 'linear-gradient(135deg, #115E59 0%, #0F766E 100%)',
                  boxShadow: '0 4px 14px rgba(15, 118, 110, 0.32)',
                }}
                aria-label="Transfer via Bank"
              >
                <Landmark className="w-5 h-5" />
                <span>Transfer via Bank</span>
              </motion.button>
            </motion.div>
          )}

          {/* 4. Back to Details – grey, border */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="mb-4 relative z-20"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onBack()
              }}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-4 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-30 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-label={t('backToDetails')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToDetails')}</span>
            </motion.button>
          </motion.div>

          {/* Helper text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="mt-3"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-4 h-4" style={{ color: '#5EEAD4' }} />
              <p className="text-white/80 text-xs font-medium">{t('securePaymentGateway')}</p>
            </div>
            <p className="text-white/60 text-xs">{t('worksWith')}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* OneLink Branding - Bottom Edge (match reference: light pill) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 pb-3 pt-2 px-4"
      >
        <div className="flex items-center justify-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              background: 'rgba(0,0,0,0.55)',
              borderColor: 'rgba(94,234,212,0.55)',
            }}
          >
            <Shield className="w-3.5 h-3.5" style={{ color: '#5EEAD4' }} />
            <span
              className="text-xs font-semibold flex items-center gap-1.5"
              style={{
                color: '#E6FFFB',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Secure payment gateway
              <span style={{ color: 'rgba(230,255,251,0.9)' }}>•</span>
              <Image
                src="/gallery/onelinklogo.png"
                alt="OneLink Logo"
                width={32}
                height={11}
                className="opacity-95 object-contain"
                priority
              />
            </span>
          </div>
        </div>
      </motion.div>

      {/* Payment Options Modal - Same Card */}
      <AnimatePresence>
        {paymentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 rounded-[28px] flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 50% 45%, rgba(25, 144, 151, 0.97) 0%, rgba(15, 118, 110, 0.98) 52%, rgba(17, 19, 21, 0.99) 100%)',
              backdropFilter: 'blur(10px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPaymentModalOpen(false)
              }
            }}
          >
            {/* Grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none rounded-[28px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-50 w-full max-w-md px-6"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight drop-shadow-lg text-center">
                Pay via UPI ID
              </h3>
              
              <div className="mb-4 relative z-30 space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <p className="text-white/70 text-xs mb-3 text-center tracking-wide uppercase font-medium">UPI IDs</p>
                  
                  {/* UPI ID(s) Display */}
                  <div className="bg-white/5 rounded-xl p-4 mb-3 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p
                        className="text-white font-bold text-base break-all select-all"
                        style={{ wordBreak: 'break-all', lineHeight: '1.35' }}
                      >
                        {upiId}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCopyUpi(upiId)
                        }}
                        className="shrink-0 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-3 rounded-xl border border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                        aria-label="Copy UPI ID 1"
                      >
                        {upiCopied && lastCopiedUpiId === upiId ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-xs font-bold">Copy</span>
                          </>
                        )}
                      </motion.button>
                    </div>

                    {upiId2 && (
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className="text-white font-bold text-base break-all select-all"
                          style={{ wordBreak: 'break-all', lineHeight: '1.35' }}
                        >
                          {upiId2}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleCopyUpi(upiId2)
                          }}
                          className="shrink-0 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-3 rounded-xl border border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                          aria-label="Copy UPI ID 2"
                        >
                          {upiCopied && lastCopiedUpiId === upiId2 ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span className="text-xs font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span className="text-xs font-bold">Copy</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </div>
                  
                  {/* Instructions */}
                  <div className="grid grid-cols-1 gap-2.5 text-white/80 text-xs pt-2 border-t border-white/10">
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1.5 flex-shrink-0" />
                      <span>Open any UPI app (GPay, PhonePe, Paytm, BHIM).</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1.5 flex-shrink-0" />
                      <span>Choose &quot;Pay to UPI ID&quot; and paste the ID.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1.5 flex-shrink-0" />
                      <span>Enter amount and complete the payment.</span>
                    </div>
                  </div>

                  <p className="text-white/90 text-sm text-center font-medium mt-3">
                    After payment, please share screenshot on WhatsApp.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setPaymentModalOpen(false)
                }}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-4 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-30 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span>{t('close')}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank Transfer Modal */}
      <AnimatePresence>
        {bankModalOpen && bank && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 rounded-[28px] flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 50% 45%, rgba(25, 144, 151, 0.97) 0%, rgba(15, 118, 110, 0.98) 52%, rgba(17, 19, 21, 0.99) 100%)',
              backdropFilter: 'blur(10px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setBankModalOpen(false)
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none rounded-[28px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-50 w-full max-w-md px-6"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight drop-shadow-lg text-center">
                Transfer via Bank
              </h3>

              <div className="space-y-3 mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl">
                  <p className="text-white/70 text-xs mb-3 text-center tracking-wide uppercase font-medium">
                    Bank Details
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white/70 text-xs">Bank Name</p>
                        <p className="text-white font-bold text-sm break-all select-all">{bank.bankName}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCopyBankField('Bank Name', bank.bankName)
                        }}
                        className="shrink-0 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-3 rounded-xl border border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                        aria-label="Copy Bank Name"
                      >
                        {bankCopied && lastCopiedBankField === 'Bank Name' ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-xs font-bold">Copy</span>
                          </>
                        )}
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white/70 text-xs">Account Holder</p>
                        <p className="text-white font-bold text-sm break-all select-all">{bank.accountHolder}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCopyBankField('Account Holder', bank.accountHolder)
                        }}
                        className="shrink-0 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-3 rounded-xl border border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                        aria-label="Copy Account Holder"
                      >
                        {bankCopied && lastCopiedBankField === 'Account Holder' ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-xs font-bold">Copy</span>
                          </>
                        )}
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white/70 text-xs">A/C No</p>
                        <p className="text-white font-bold text-sm break-all select-all">{bank.accountNumberMasked}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCopyBankField('A/C No', bank.accountNumberMasked)
                        }}
                        className="shrink-0 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-3 rounded-xl border border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                        aria-label="Copy A/C No"
                      >
                        {bankCopied && lastCopiedBankField === 'A/C No' ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-xs font-bold">Copy</span>
                          </>
                        )}
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white/70 text-xs">IFSC</p>
                        <p className="text-white font-bold text-sm break-all select-all">{bank.ifsc}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCopyBankField('IFSC', bank.ifsc)
                        }}
                        className="shrink-0 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-3 rounded-xl border border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                        aria-label="Copy IFSC"
                      >
                        {bankCopied && lastCopiedBankField === 'IFSC' ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-xs font-bold">Copy</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-white/90 text-sm text-center font-medium mb-4">
                After payment, please share screenshot on WhatsApp.
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setBankModalOpen(false)
                }}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-4 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-30 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span>{t('close')}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanner Modal Overlay - Same Card */}
      <AnimatePresence>
        {scannerModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 rounded-[28px] flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 50% 45%, rgba(25, 144, 151, 0.97) 0%, rgba(15, 118, 110, 0.98) 52%, rgba(17, 19, 21, 0.99) 100%)',
              backdropFilter: 'blur(10px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setScannerModalOpen(false)
              }
            }}
          >
            {/* Grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none rounded-[28px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-50 w-full max-w-sm px-4 py-3 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <h3 className="text-xl font-black text-white mb-2 tracking-tight drop-shadow-lg text-center">
                Scan to Pay
              </h3>
              <p className="text-white/80 text-xs text-center mb-3">
                (GPay, PhonePe, Paytm, BHIM)
              </p>
              
              {/* Scanner / QR Image */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-3">
                <div className="flex justify-center mb-2">
                  <Image
                    src={scannerImage || shopConfig.payment.scannerImage}
                    alt="Scan to pay – UPI QR"
                    width={280}
                    height={280}
                    className="w-full max-w-[280px] h-auto object-contain rounded-2xl"
                    priority
                    unoptimized
                  />
                </div>
                <p className="text-white/80 text-xs text-center">
                  Open your payment app and scan this code to make a payment
                </p>
              </div>

              {/* Share QR – primary action */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleShareQR()
                }}
                className="w-full bg-white hover:bg-gray-50 font-bold py-2.5 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer relative z-30 touch-manipulation border-[1.5px] mb-2"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  borderColor: 'rgba(15, 118, 110, 0.38)',
                  color: '#0F766E',
                  boxShadow: '0 2px 8px rgba(15, 118, 110, 0.12)'
                }}
                aria-label="Share QR Code"
              >
                <Share2 className="w-4 h-4" style={{ color: '#0F766E' }} />
                <span className="text-sm">Share QR</span>
              </motion.button>

              {/* Close Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setScannerModalOpen(false)
                }}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-4 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-30 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                aria-label="Close Scanner"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Close</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
