'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#F7FAFF' }}
    >
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#0F2A44' }}>
        Something went wrong
      </h1>
      <p className="text-center mb-6 max-w-sm" style={{ color: '#6B7A90' }}>
        We couldn’t load this page. Please try again.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#0F2A44' }}
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl font-semibold text-center transition-opacity hover:opacity-90 border"
          style={{ color: '#0F2A44', borderColor: '#E5ECF6' }}
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
