'use client'

import { motion } from 'framer-motion'
import { shopConfig } from '../config'

export default function About() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto py-4"
    >
      <div
        className="relative overflow-hidden rounded-[30px]"
        style={{
          background: '#A66A3F',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 18px 42px rgba(94, 53, 31, 0.20)',
        }}
      >
        <div className="section-shell-inner p-6 sm:p-7">
          <div className="relative">
            <div className="section-title-accent mb-4">
              <h2 className="text-[1.85rem] font-black leading-tight tracking-tight text-white sm:text-[2.1rem]">
                {shopConfig.about.title}
              </h2>
            </div>
            <p className="text-[17px] font-medium leading-[1.75] text-white/95 sm:text-[18px]">
              {shopConfig.about.shortDescription}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
