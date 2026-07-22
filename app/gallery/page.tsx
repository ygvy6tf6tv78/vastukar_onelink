'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ChevronLeft, ChevronRight, X, Image as ImageIcon, Video } from 'lucide-react'
import { prepareReturnToHeroCard } from '../lib/homeNavigation'

// Gallery images from public/gallery folder
const galleryImages = [
  '/vastukar/kargil-bhawan.jpg',
  '/vastukar/yoga-hall.jpg',
  '/vastukar/school-building.jpg',
  '/vastukar/chib-gate.jpg',
  '/vastukar/jkssb.jpg',
  '/vastukar/katra-police.jpg',
]

// No videos – show empty state when on Videos tab
const galleryVideos: { src: string; thumbnail: string; title: string }[] = []

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      galleryImages.slice(0, 6).forEach((src) => {
        const img = document.createElement('img')
        img.src = src
        img.loading = 'eager'
      })
    }
  }, [])

  useEffect(() => {
    if (lightboxOpen && typeof window !== 'undefined') {
      setImageLoading(true)
      const preloadIndexes = [
        photoIndex === 0 ? galleryImages.length - 1 : photoIndex - 1,
        photoIndex,
        photoIndex === galleryImages.length - 1 ? 0 : photoIndex + 1,
      ]
      preloadIndexes.forEach((idx) => {
        const img = document.createElement('img')
        img.src = galleryImages[idx]
        img.onload = () => {
          if (idx === photoIndex) {
            setImageLoading(false)
          }
        }
      })
    }
  }, [lightboxOpen, photoIndex])

  const openLightbox = (index: number) => {
    setPhotoIndex(index)
    setLightboxOpen(true)
    setImageLoading(true)
  }

  const goPrev = () => {
    setImageLoading(true)
    setPhotoIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const goNext = () => {
    setImageLoading(true)
    setPhotoIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <main
        className="min-h-screen"
        style={{
          background:
            'radial-gradient(circle at 50% -8%, rgba(166, 106, 63, 0.16), transparent 22rem), linear-gradient(180deg, #F7FBFF 0%, #FFFFFF 46%, #EFF7FF 100%)',
        }}
      >
        <div
          className="border-b border-blue-100 sticky top-0 z-20 bg-white/90 backdrop-blur-md"
        >
          <div className="max-w-md mx-auto px-2 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="p-2.5 sm:p-3 rounded-xl transition-colors"
              style={{ color: '#0F172A' }}
              onClick={() => prepareReturnToHeroCard()}
            >
              <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#0EA5B7' }} />
            </Link>
            <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#0F172A' }}>Gallery</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-3 py-4 sm:py-6">
          <div className="flex gap-3 mb-4 sm:mb-6 px-2">
            <motion.button
              onClick={() => setActiveTab('photos')}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-5 py-3.5 rounded-2xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center"
              style={
                activeTab === 'photos'
                  ? {
                      background: '#A66A3F',
                      color: '#FFFFFF',
                      boxShadow: '0 8px 20px rgba(15,42,68,0.15)',
                      border: '1px solid rgba(166, 106, 63,0.35)',
                    }
                  : {
                    background: '#FFFFFF',
                    color: '#5E351F',
                    border: '1px solid #E5D1B8',
                    boxShadow: '0 8px 20px rgba(94, 53, 31,0.08)',
                    }
              }
            >
              <span className="flex items-center justify-center gap-2.5">
                <ImageIcon
                  className="w-5 h-5"
                  style={{ color: activeTab === 'photos' ? '#FFFFFF' : '#5E351F' }}
                  strokeWidth={2.5}
                />
                Photos
              </span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('videos')}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-5 py-3.5 rounded-2xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center"
              style={
                activeTab === 'videos'
                  ? {
                      background: '#A66A3F',
                      color: '#FFFFFF',
                      boxShadow: '0 8px 20px rgba(15,42,68,0.15)',
                      border: '1px solid rgba(166, 106, 63,0.35)',
                    }
                  : {
                    background: '#FFFFFF',
                    color: '#5E351F',
                    border: '1px solid #E5D1B8',
                    boxShadow: '0 8px 20px rgba(94, 53, 31,0.08)',
                    }
              }
            >
              <span className="flex items-center justify-center gap-2.5">
                <Video
                  className="w-5 h-5"
                  style={{ color: activeTab === 'videos' ? '#FFFFFF' : '#5E351F' }}
                  strokeWidth={2.5}
                />
                Videos
              </span>
            </motion.button>
          </div>

          {activeTab === 'photos' && galleryImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
              {galleryImages.map((imageSrc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="rounded-[22px] shadow-[0_12px_28px_rgba(94, 53, 31,0.12)] aspect-square overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all relative border border-white"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={imageSrc}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    priority={index < 4}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    quality={85}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* No videos – empty state */}
          {activeTab === 'videos' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-600/50 p-8 sm:p-10 text-center bg-slate-800/60"
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(71,85,105,0.65)' }}
              >
                <Video className="w-8 h-8" style={{ color: '#93C5FD' }} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>No video uploaded</h3>
              <p className="text-sm max-w-xs mx-auto" style={{ color: '#94A3B8' }}>
                Videos will show here once uploaded. Check back later.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="absolute top-6 right-6 z-50 p-2.5 rounded-full transition-all touch-manipulation backdrop-blur-md"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow:
                  '0 8px 22px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              }}
            >
              <X className="w-5 h-5" strokeWidth={2.6} style={{ color: '#5E351F' }} />
            </button>
            <motion.div
              key={photoIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <Image
                src={galleryImages[photoIndex]}
                alt={`Gallery image ${photoIndex + 1}`}
                width={1600}
                height={1600}
                className={`w-full h-auto max-h-[90vh] object-contain rounded-xl transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                priority
                quality={90}
                unoptimized
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="text-white text-sm font-medium">
                  {photoIndex + 1} / {galleryImages.length}
                </span>
              </div>
            </motion.div>
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goPrev()
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all touch-manipulation backdrop-blur-md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    boxShadow:
                      '0 8px 22px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <ChevronLeft className="w-6 h-6" strokeWidth={2.6} style={{ color: '#5E351F' }} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goNext()
                  }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all touch-manipulation backdrop-blur-md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    boxShadow:
                      '0 8px 22px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <ChevronRight className="w-6 h-6" strokeWidth={2.6} style={{ color: '#5E351F' }} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
