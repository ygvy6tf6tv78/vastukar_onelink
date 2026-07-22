import clickSoundUrl from '../components/Click Button.mp3'

let clickAudio: HTMLAudioElement | null = null

export function playClickSound() {
  if (typeof window === 'undefined') return

  try {
    if (!clickAudio) {
      clickAudio = new Audio(clickSoundUrl)
      clickAudio.volume = 0.45
    }

    // Reset so consecutive taps still trigger the sound.
    clickAudio.currentTime = 0
    const p = clickAudio.play()
    if (p && typeof (p as Promise<void>).catch === 'function') {
      ;(p as Promise<void>).catch(() => {})
    }
  } catch {
    // Silently ignore sound failures.
  }
}

