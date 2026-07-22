/**
 * Navigation helpers for returning to the homepage from inner pages.
 *
 * Two return modes are supported, and they are mutually exclusive:
 *
 *   1. `prepareReturnToHeroCard()` — used when the user opened an inner
 *      page from the main hero card (e.g. ActionsRow → /services). On
 *      back, the homepage scrolls to the top and forces the hero card
 *      to its front face.
 *
 *   2. `setReturnSection('gallery' | 'services' | 'reviews')` — used when
 *      the user opened an inner page from a section's "View All" / "View
 *      Gallery" button. On back, the homepage scrolls to that section
 *      so the user lands exactly where they came from.
 *
 * The homepage (`app/page.tsx`) consumes these flags on mount.
 */

export type HomeReturnSection = 'gallery' | 'services' | 'reviews'

const RETURN_SECTION_KEY = 'homeReturnSection'
const FORCE_HERO_FRONT_KEY = 'forceHeroFront'
const SKIP_LOAD_KEY = 'homeBackSkipLoad'
const FROM_GALLERY_KEY = 'fromGallery' // legacy — kept clean

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

/** Hero-card return: top of page + force the front face on the 3D card. */
export function prepareReturnToHeroCard(): void {
  const ss = safeStorage()
  if (!ss) return
  try {
    ss.setItem(FORCE_HERO_FRONT_KEY, 'true')
    ss.setItem(SKIP_LOAD_KEY, 'true')
    ss.removeItem(RETURN_SECTION_KEY)
    ss.removeItem(FROM_GALLERY_KEY)
    ss.removeItem('openAppointment')
    ss.removeItem('openPayment')
    ss.removeItem('openFlip')
  } catch {
    /* ignore */
  }
}

/** Section return: skip loading screen and scroll to `#<section>`. */
export function setReturnSection(section: HomeReturnSection): void {
  const ss = safeStorage()
  if (!ss) return
  try {
    ss.setItem(RETURN_SECTION_KEY, section)
    ss.setItem(SKIP_LOAD_KEY, 'true')
    // Hero-card flag must lose, otherwise we'd jump to top instead.
    ss.removeItem(FORCE_HERO_FRONT_KEY)
  } catch {
    /* ignore */
  }
}

/** Read-and-clear the section flag. Returns null if none was set. */
export function consumeReturnSection(): HomeReturnSection | null {
  const ss = safeStorage()
  if (!ss) return null
  try {
    const v = ss.getItem(RETURN_SECTION_KEY)
    if (!v) return null
    ss.removeItem(RETURN_SECTION_KEY)
    if (v === 'gallery' || v === 'services' || v === 'reviews') return v
    return null
  } catch {
    return null
  }
}

/** Read-and-clear the "skip the loading screen" flag. */
export function consumeSkipLoad(): boolean {
  const ss = safeStorage()
  if (!ss) return false
  try {
    const v = ss.getItem(SKIP_LOAD_KEY) === 'true'
    if (v) ss.removeItem(SKIP_LOAD_KEY)
    return v
  } catch {
    return false
  }
}
