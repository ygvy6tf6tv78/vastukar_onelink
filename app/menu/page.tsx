'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MenuPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/services')
  }, [router])

  return (
    <main
      className="min-h-screen pb-24 flex items-center justify-center"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <p className="text-white/70 text-sm">Redirecting to services…</p>
    </main>
  )
}
