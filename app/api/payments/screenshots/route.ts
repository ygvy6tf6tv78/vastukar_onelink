/**
 * POST /api/payments/screenshots
 *
 * Receives a multipart/form-data upload with field `file` and `sessionId`.
 *
 * Default impl: writes to `public/uploads/payments/<sessionId>-<timestamp>.<ext>`
 * — perfect for local dev / a single Node server. For Vercel/AWS Lambda
 * (read-only filesystem), swap the `persist()` function with an S3 / R2
 * presigned upload — the request/response shape stays the same.
 *
 * Response: { ok: true, url: "/uploads/payments/<file>" }
 *
 * Security:
 *  - Whitelisted MIME types (image/jpeg, image/png, image/webp).
 *  - Max 5 MB.
 *  - Filename is server-generated; user input is never written verbatim.
 */

import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED = new Map<string, string>([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

async function persist(buffer: Buffer, sessionId: string, ext: string): Promise<string> {
  const dir = path.join(process.cwd(), 'public', 'uploads', 'payments')
  await fs.mkdir(dir, { recursive: true })
  const safeId = sessionId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'session'
  const filename = `${safeId}-${Date.now()}.${ext}`
  await fs.writeFile(path.join(dir, filename), buffer)
  return `/uploads/payments/${filename}`
}

export async function POST(req: Request) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'Expected multipart/form-data' }, { status: 400 })
  }

  const file = formData.get('file')
  const sessionId = String(formData.get('sessionId') ?? '')

  if (!(file instanceof Blob)) {
    return NextResponse.json({ ok: false, error: 'Missing `file`' }, { status: 400 })
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: `Unsupported file type. Allowed: ${Array.from(ALLOWED.keys()).join(', ')}` },
      { status: 400 },
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: 'File exceeds 5 MB limit' }, { status: 400 })
  }

  try {
    const arrayBuf = await file.arrayBuffer()
    const url = await persist(Buffer.from(arrayBuf), sessionId, ALLOWED.get(file.type)!)
    return NextResponse.json({ ok: true, url })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 },
    )
  }
}
