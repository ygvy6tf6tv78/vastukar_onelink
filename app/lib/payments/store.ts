/**
 * Pluggable PaymentStore.
 *
 * Default: in-memory Map (works out of the box, perfect for dev / single-process).
 * Production: set `MONGODB_URI` and uncomment the Mongo adapter at the bottom.
 *
 * The interface is deliberately minimal so swapping in Postgres, Redis,
 * DynamoDB, or a merchant gateway is a 1-file change.
 *
 * MongoDB schema (target):
 *
 *   collection: payments
 *   {
 *     _id: ObjectId,
 *     id: string (unique),
 *     amount: number?,
 *     note: string?,
 *     assignedUpi: { id, name, label? },
 *     upiLink: string,
 *     status: 'pending' | 'submitted' | 'verified' | 'failed' | 'expired',
 *     createdAt: Date,
 *     updatedAt: Date,
 *     expiresAt: Date,
 *     attempts: [{
 *       id, at, txId?, screenshotUrl?, outcome, note?
 *     }],
 *     metadata: object
 *   }
 *
 *   indexes:
 *     - { id: 1 } unique
 *     - { status: 1, createdAt: -1 }
 *     - { expiresAt: 1 } TTL (auto-delete expired sessions)
 */

import type {
  ConfirmAttemptInput,
  CreateSessionInput,
  PaymentAttempt,
  PaymentSession,
  UpiAccount,
} from './types'
import { buildUpiLink } from './upi'
import { pickUpiAccount } from './upiPool'

const SESSION_TTL_MS = 30 * 60 * 1000 // 30 minutes

export interface PaymentStore {
  create(input: CreateSessionInput): Promise<PaymentSession>
  get(id: string): Promise<PaymentSession | null>
  recordAttempt(id: string, attempt: ConfirmAttemptInput): Promise<PaymentSession | null>
  /** Optional admin: list recent sessions (in-memory only — DB impls may paginate) */
  list?(limit?: number): Promise<PaymentSession[]>
}

// ---------- shared helpers ----------

/** URL-safe random id without bringing in `nanoid`. */
function randomId(prefix = 'pay_'): string {
  const bytes = new Uint8Array(12)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  const b64 = Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return prefix + b64
}

function buildSession(input: CreateSessionInput, upi: UpiAccount): PaymentSession {
  const id = randomId('pay_')
  const now = new Date()
  const upiLink = buildUpiLink({
    upi,
    amount: input.amount,
    note: input.note,
    ref: id,
  })
  return {
    id,
    amount: input.amount,
    note: input.note,
    assignedUpi: upi,
    upiLink,
    status: 'pending',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
    metadata: input.metadata,
  }
}

function applyAttempt(session: PaymentSession, attempt: ConfirmAttemptInput): PaymentSession {
  const finalised: PaymentAttempt = {
    id: randomId('att_'),
    at: new Date().toISOString(),
    txId: attempt.txId?.trim() || undefined,
    screenshotUrl: attempt.screenshotUrl,
    outcome: attempt.outcome === 'failed' ? 'failed' : 'paid',
    note: attempt.note?.trim() || undefined,
  }
  return {
    ...session,
    status: finalised.outcome === 'failed' ? 'failed' : 'submitted',
    updatedAt: new Date().toISOString(),
    lastAttempt: finalised,
  }
}

// ---------- in-memory adapter (default) ----------

class MemoryStore implements PaymentStore {
  private sessions = new Map<string, PaymentSession>()
  private attempts = new Map<string, PaymentAttempt[]>()

  async create(input: CreateSessionInput): Promise<PaymentSession> {
    const upi = pickUpiAccount('random')
    const session = buildSession(input, upi)
    this.sessions.set(session.id, session)
    this.attempts.set(session.id, [])
    return session
  }

  async get(id: string): Promise<PaymentSession | null> {
    const s = this.sessions.get(id)
    if (!s) return null
    if (new Date(s.expiresAt).getTime() < Date.now() && s.status === 'pending') {
      const expired = { ...s, status: 'expired' as const, updatedAt: new Date().toISOString() }
      this.sessions.set(id, expired)
      return expired
    }
    return s
  }

  async recordAttempt(id: string, attempt: ConfirmAttemptInput): Promise<PaymentSession | null> {
    const existing = this.sessions.get(id)
    if (!existing) return null
    const updated = applyAttempt(existing, attempt)
    this.sessions.set(id, updated)
    if (updated.lastAttempt) {
      const list = this.attempts.get(id) ?? []
      list.push(updated.lastAttempt)
      this.attempts.set(id, list)
    }
    return updated
  }

  async list(limit = 25): Promise<PaymentSession[]> {
    return Array.from(this.sessions.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
  }
}

// ---------- MongoDB adapter (opt-in) ----------
// To enable in production:
//   1. `pnpm add mongodb`
//   2. Set MONGODB_URI in your .env (e.g. MONGODB_URI="mongodb+srv://...")
//   3. Uncomment the implementation below.
//
// The dynamic import keeps `mongodb` from being required at build time
// for the default in-memory mode.
//
// class MongoStore implements PaymentStore {
//   private collectionPromise: Promise<any>
//   constructor(uri: string) {
//     this.collectionPromise = (async () => {
//       const { MongoClient } = await import('mongodb')
//       const client = new MongoClient(uri)
//       await client.connect()
//       const col = client.db().collection('payments')
//       await col.createIndex({ id: 1 }, { unique: true })
//       await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
//       return col
//     })()
//   }
//   async create(input: CreateSessionInput) {
//     const upi = pickUpiAccount('random')
//     const session = buildSession(input, upi)
//     const col = await this.collectionPromise
//     await col.insertOne({ ...session, attempts: [] })
//     return session
//   }
//   async get(id: string) {
//     const col = await this.collectionPromise
//     return (await col.findOne({ id })) as PaymentSession | null
//   }
//   async recordAttempt(id: string, attempt: ConfirmAttemptInput) {
//     const col = await this.collectionPromise
//     const existing = (await col.findOne({ id })) as PaymentSession | null
//     if (!existing) return null
//     const updated = applyAttempt(existing, attempt)
//     await col.updateOne(
//       { id },
//       { $set: updated, $push: updated.lastAttempt ? { attempts: updated.lastAttempt } : {} },
//     )
//     return updated
//   }
// }

// ---------- singleton selector ----------

/**
 * Stash the singleton on `globalThis` so it survives:
 *  - Next.js dev HMR (each route bundle shares this global, not each module copy)
 *  - Multiple route files importing the store
 *
 * This is the same pattern used by Prisma's recommended Next.js setup.
 */
const GLOBAL_KEY = '__dogra_payment_store__'
type GlobalWithStore = typeof globalThis & { [GLOBAL_KEY]?: PaymentStore }

export function getPaymentStore(): PaymentStore {
  const g = globalThis as GlobalWithStore
  if (g[GLOBAL_KEY]) return g[GLOBAL_KEY]!
  // const uri = process.env.MONGODB_URI
  // if (uri) {
  //   g[GLOBAL_KEY] = new MongoStore(uri)
  //   return g[GLOBAL_KEY]!
  // }
  g[GLOBAL_KEY] = new MemoryStore()
  return g[GLOBAL_KEY]!
}
