'use client'

/**
 * Lightweight client-side device detection.
 *
 * Why not server-side: UPI deep links must launch from the user's actual
 * browser, so we always need to confirm device type client-side. We avoid
 * heavyweight UA parsers — pointer:coarse + UA hint is reliable enough.
 *
 * Returns a stable object after the first paint to avoid hydration mismatch.
 */

import { useEffect, useState } from 'react'

export type DeviceKind = 'mobile' | 'desktop'

export interface DeviceInfo {
  kind: DeviceKind
  isAndroid: boolean
  isIOS: boolean
  /** True after the hook has actually inspected the navigator — avoid hydration flicker */
  ready: boolean
}

const initial: DeviceInfo = { kind: 'desktop', isAndroid: false, isIOS: false, ready: false }

export function useDevice(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>(initial)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ua = navigator.userAgent || ''
    const isAndroid = /Android/i.test(ua)
    const isIOS = /iPhone|iPad|iPod/i.test(ua)

    // Combine UA + pointer media query — handles iPad-as-desktop cases.
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const narrow = window.matchMedia('(max-width: 768px)').matches
    const looksMobile = isAndroid || isIOS || (coarsePointer && narrow)

    setInfo({
      kind: looksMobile ? 'mobile' : 'desktop',
      isAndroid,
      isIOS,
      ready: true,
    })
  }, [])

  return info
}
