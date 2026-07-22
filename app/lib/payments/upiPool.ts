/**
 * UPI ID pool + rotation strategy.
 *
 * Why rotate:
 * - Distributes load across personal VPAs (banks throttle high-volume VPAs).
 * - Avoids "always paying ABC" pattern in user history.
 *
 * Strategies:
 * - "random"      — uniformly random per session (default; good for low volume).
 * - "round-robin" — process-local counter; resets on cold start (serverless).
 * - "weighted"    — pick using `weight` if you want to bias toward one account.
 *
 * Add accounts in `shopConfig.payment` and they will surface here automatically.
 * For per-shop overrides, expose a `paymentPool` array on the shop config.
 */

import { shopConfig } from '../../shops/dogra-associates/config'
import type { UpiAccount } from './types'

export interface PoolEntry extends UpiAccount {
  /** Higher weight => more likely to be chosen with "weighted" strategy */
  weight?: number
  /** Set false to temporarily disable an account without deleting */
  enabled?: boolean
}

export type RotationStrategy = 'random' | 'round-robin' | 'weighted'

/**
 * Build the pool from shop config. Filters out empty/duplicate VPAs.
 *
 * For multi-tenant setups, replace this with a function that takes the shop
 * id and returns its pool from a config map.
 */
function buildPool(): PoolEntry[] {
  const raw: Array<PoolEntry | undefined> = [
    shopConfig.payment.upiId
      ? { id: shopConfig.payment.upiId, name: shopConfig.payment.upiName, label: 'primary', weight: 2 }
      : undefined,
    shopConfig.payment.upiId2
      ? { id: shopConfig.payment.upiId2, name: shopConfig.payment.upiName, label: 'secondary', weight: 1 }
      : undefined,
  ]
  const seen = new Set<string>()
  return raw
    .filter((x): x is PoolEntry => Boolean(x?.id))
    .filter((x) => x.enabled !== false)
    .filter((x) => {
      const k = x.id.toLowerCase()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
}

export const upiPool: PoolEntry[] = buildPool()

let rrCounter = 0

/**
 * Pick a UPI account using the requested strategy.
 * Always returns at least one account (throws if the pool is empty).
 */
export function pickUpiAccount(strategy: RotationStrategy = 'random'): UpiAccount {
  if (upiPool.length === 0) {
    throw new Error('upiPool is empty — configure shopConfig.payment.upiId at minimum')
  }
  if (upiPool.length === 1) return upiPool[0]

  if (strategy === 'round-robin') {
    const choice = upiPool[rrCounter % upiPool.length]
    rrCounter++
    return choice
  }

  if (strategy === 'weighted') {
    const total = upiPool.reduce((s, e) => s + (e.weight ?? 1), 0)
    let r = Math.random() * total
    for (const entry of upiPool) {
      r -= entry.weight ?? 1
      if (r <= 0) return entry
    }
    return upiPool[upiPool.length - 1]
  }

  return upiPool[Math.floor(Math.random() * upiPool.length)]
}
