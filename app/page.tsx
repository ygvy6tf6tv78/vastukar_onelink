'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
// Shop-specific components
import Hero from './shops/dogra-associates/components/Hero'
import About from './shops/dogra-associates/components/About'
import MenuPreview from './shops/dogra-associates/components/MenuPreview'
import Services from './shops/dogra-associates/components/Services'
import ContactCard from './shops/dogra-associates/components/ContactCard'
import ClinicInfoSections from './shops/dogra-associates/components/ClinicInfoSections'
// Shop-specific components (Gallery and Reviews)
import Gallery from './shops/dogra-associates/components/Gallery'
import GoogleReviews from './shops/dogra-associates/components/GoogleReviews'
import UrgencyCTA from './shops/dogra-associates/components/UrgencyCTA'
// Shared components
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import LoadingScreen from './components/LoadingScreen'
import {
  consumeReturnSection,
  consumeSkipLoad,
  type HomeReturnSection,
} from './lib/homeNavigation'

export default function Home() {
  const [showLoading, setShowLoading] = useState(true)
  const [restoreSection, setRestoreSection] = useState<HomeReturnSection | null>(
    null
  )

  useEffect(() => {
    // Returning from an inner page (gallery / services / reviews):
    //   - if a section flag is set, remember it so we can scroll there
    //     once <main> is mounted.
    //   - if any "skip load" flag is set, mount immediately (no splash).
    if (typeof window === 'undefined') return

    const section = consumeReturnSection()
    const skipLoad = consumeSkipLoad() || section !== null

    if (section) setRestoreSection(section)

    if (skipLoad) {
      setShowLoading(false)
      // Section restore is handled in the next effect once <main> exists.
      // Avoid forcing top scroll here; it can feel like the OneLink jumps.
      return
    }

    // Show loading screen briefly to mask paint flash on cold loads.
    const timer = setTimeout(() => setShowLoading(false), 1600)
    const fallbackTimer = setTimeout(() => setShowLoading(false), 2500)
    return () => {
      clearTimeout(timer)
      clearTimeout(fallbackTimer)
    }
  }, [])

  // Once <main> is mounted, scroll to the requested section (if any).
  useEffect(() => {
    if (showLoading) return
    if (typeof window === 'undefined') return

    if (restoreSection) {
      // Wait for the next paint so the section's DOM is in place.
      const id = restoreSection
      const t = window.setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' })
        }
        setRestoreSection(null)
      }, 50)
      return () => window.clearTimeout(t)
    }

    // Strip stale hashes so we don't re-trigger jumps on refresh.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [showLoading, restoreSection])

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>
      {!showLoading && (
        <main 
          className="min-h-screen relative z-10 overflow-x-hidden pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
          style={{
            background: '#191A19',
          }}
        >
          <div className="relative z-10">
            <Hero />
            <About />
            <div
              className="lower-dark -mx-4 mt-0 px-4 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]"
              style={{
                background:
                  'linear-gradient(180deg, #191A19 0%, #151615 54%, #191A19 100%)',
              }}
            >
              <MenuPreview />
              <UrgencyCTA />
              <Services />
              <ClinicInfoSections />
              <GoogleReviews />
              <Gallery />
              <ContactCard />
              <div className="mt-8">
                <Footer />
              </div>
            </div>
          </div>
          <BackToTop />
        </main>
      )}
    </>
  )
}
