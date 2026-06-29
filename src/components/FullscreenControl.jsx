import { useState, useEffect } from 'react'

export default function FullscreenControl() {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement)

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err))
    } else {
      document.exitFullscreen().catch(err => console.error(err))
    }
  }

  return (
    <div className="fixed !bottom-6 !right-6 z-50">
      <button
        onClick={toggleFullscreen}
        className="!w-12 !h-12 glass-dark rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform animate-pulse-glow"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? '📺' : '🖥️'}
      </button>
    </div>
  )
}
