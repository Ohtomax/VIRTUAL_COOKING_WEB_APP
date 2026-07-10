import { useEffect, useRef } from 'react'
import type { AudioSettings } from '../types'

export function useAudio(settings: AudioSettings): void {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!settings.musicEnabled) {
      audioRef.current?.pause()
      return
    }

    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/audio/background-music.mp3')
      audioRef.current.loop = true
    }

    audioRef.current.volume = (settings.masterVolume / 100) * 0.3

    const play = () => {
      audioRef.current?.play().catch(() => {
        // Browsers may block autoplay — ignore silently
      })
    }

    play()

    // Try again on first user interaction
    const handler = () => {
      play()
      document.removeEventListener('click', handler)
    }
    document.addEventListener('click', handler)

    return () => {
      document.removeEventListener('click', handler)
    }
  }, [settings.musicEnabled, settings.masterVolume])
}
