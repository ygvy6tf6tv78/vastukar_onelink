import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#F7FAFF' }}
    >
      <h1 className="text-6xl font-bold mb-2" style={{ color: '#0F2A44' }}>404</h1>
      <p className="text-lg mb-6 text-center" style={{ color: '#6B7A90' }}>
        This page could not be found.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-95"
        style={{ background: '#0F2A44', boxShadow: '0 8px 20px rgba(15,42,68,0.15)' }}
      >
        Back to Home
      </Link>
    </main>
  )
}
