import { useEffect, useRef, useState } from 'react'

const musikFiles = import.meta.glob('../musik/*.{mp3,wav,ogg,aac,m4a,flac}', { eager: true, query: '?url', import: 'default' })

const trackList = Object.values(musikFiles)

export function useMusicPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const trackIndexRef = useRef(0)
  const tracks = trackList

  const initAudio = () => {
    if (audioRef.current) return
    if (tracks.length === 0) return

    const audio = new Audio(tracks[0])
    audio.volume = volume
    audio.addEventListener('ended', () => {
      if (tracks.length > 1) {
        trackIndexRef.current = (trackIndexRef.current + 1) % tracks.length
        audio.src = tracks[trackIndexRef.current]
        audio.load()
        audio.play().catch(() => {})
      } else {
        audio.currentTime = 0
        audio.play().catch(() => {})
      }
    })
    audioRef.current = audio
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const tryAutoPlay = () => {
    initAudio()
    if (!audioRef.current) return
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }

  const toggle = () => {
    initAudio()
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }

  return { isPlaying, toggle, volume, setVolume, tracks, tryAutoPlay }
}
