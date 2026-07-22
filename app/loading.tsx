export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: '#F7FAFF' }}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="w-10 h-10 rounded-full border-4 border-[#E5ECF6] border-t-[#A66A3F] animate-spin"
        aria-hidden
      />
      <p className="mt-4 text-sm font-medium" style={{ color: '#6B7A90' }}>
        Loading...
      </p>
    </div>
  )
}
