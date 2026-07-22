'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { siteConfig } from '../data/site'
import { shopConfig } from '../shops/dogra-associates/config'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between overflow-hidden py-8"
      style={{
        backgroundColor: '#000000',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        width: '100vw'
      }}
    >
      {/* OneLink watermark background (small logo) */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{
          opacity: 0.08,
          transform: 'translateY(-8%)',
          mixBlendMode: 'screen',
        }}
      >
        {/* Text-only fallback: avoids broken Next/Image if asset is missing. */}
        <div
          aria-hidden
          style={{
            width: 120,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8',
            fontWeight: 900,
            letterSpacing: '-0.3px',
          }}
          className="text-[28px]"
        >
          OneLink
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center" style={{ transform: 'translateY(-6%)' }}>
          {/* Square Frame with Logo – bigger so logo fits well (same style as Mango, black type) */}
          <div className="relative mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="w-44 h-44 sm:w-48 sm:h-48 bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border-2 border-slate-700 relative"
            >
              {/* Logo – larger area, object-contain so full logo fits */}
              <div className="w-[90%] h-[90%] rounded-xl flex items-center justify-center overflow-hidden bg-white relative">
                <Image
                  src={shopConfig.assets.logo}
                  alt={`${shopConfig.name} Logo`}
                  width={192}
                  height={192}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              {/* Scanning Line – blue accent for CA */}
              <motion.div
                className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#A66A3F] to-transparent pointer-events-none"
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatDelay: 0.3
                }}
                style={{
                  boxShadow: '0 0 20px rgba(58, 123, 213, 0.6), 0 0 40px rgba(58, 123, 213, 0.4)'
                }}
              />

              {/* Corner Indicators */}
              <motion.div
                className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-xl"
                style={{ borderColor: '#A66A3F' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
              <motion.div
                className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-xl"
                style={{ borderColor: '#A66A3F' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-xl"
                style={{ borderColor: '#A66A3F' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-xl"
                style={{ borderColor: '#A66A3F' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            </motion.div>
          </div>

          {/* Welcome to Company Name – white text on black like Mango */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <p className="text-sm text-slate-400 mb-1">
              Welcome to
            </p>
            <p className="text-base font-bold text-white">
              {siteConfig.name}
            </p>
          </motion.div>
        </div>
      </div>

      {/* OneLink logo at bottom – best position */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center justify-center gap-2 pb-6 safe-area-pb"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <span className="text-xs text-slate-500 font-medium">Powered by</span>
        <span
          aria-hidden
          className="inline-flex items-center justify-center font-extrabold"
          style={{
            width: 44,
            height: 22,
            opacity: 0.9,
            color: '#94a3b8',
            fontSize: 12,
            letterSpacing: '-0.2px',
          }}
        >
          OneLink
        </span>
      </motion.div>
    </motion.div>
  )
}
