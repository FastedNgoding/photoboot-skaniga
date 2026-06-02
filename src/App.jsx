import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import TemplatePage from './components/TemplatePage'
import PhotoPage from './components/PhotoPage'
import FinalPage from './components/FinalPage'
import MusicControl from './components/MusicControl'
import SettingsPage from './components/SettingsPage'
import LockScreen from './components/LockScreen'
import { useMusicPlayer } from './hooks/useMusicPlayer'

export default function App() {
  const [page, setPage] = useState('landing')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const { isPlaying, toggle, volume, setVolume, tracks, tryAutoPlay } = useMusicPlayer()

  const [appConfig, setAppConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('skaniga-settings')
      return saved ? JSON.parse(saved) : { mode: 'bebas', pin: '1234', duration: 2 }
    } catch {
      return { mode: 'bebas', pin: '1234', duration: 2 }
    }
  })

  const [sessionEnd, setSessionEnd] = useState(() => {
    return parseInt(localStorage.getItem('skaniga-session-end')) || 0
  })

  const [now, setNow] = useState(() => Date.now())
  const currentPath = window.location.pathname

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (currentPath === '/settings') {
    return (
      <SettingsPage
        config={appConfig}
        onSave={(newConfig) => {
          setAppConfig(newConfig)
          localStorage.setItem('skaniga-settings', JSON.stringify(newConfig))
          window.location.href = '/'
        }}
      />
    )
  }

  const handleStart = () => {
    if (appConfig.mode === 'berbayar') {
      const currentTime = Date.now()
      if (!sessionEnd || currentTime >= sessionEnd) {
        const newEnd = currentTime + appConfig.duration * 60 * 1000
        setSessionEnd(newEnd)
        localStorage.setItem('skaniga-session-end', newEnd.toString())
      }
    }
    tryAutoPlay()
    setPage('template')
  }

  const handleTemplateSelect = (tmpl) => {
    setSelectedTemplate(tmpl)
    setPage('photo')
  }

  const handlePhotosComplete = (photos) => {
    setCapturedPhotos(photos)
    setPage('final')
  }

  const handleRestart = () => {
    setCapturedPhotos([])
    setSelectedTemplate(null)
    setPage('landing')
  }

  const handleUnlock = () => {
    setSessionEnd(0)
    localStorage.setItem('skaniga-session-end', '0')
  }

  const isExpired = appConfig.mode === 'berbayar' && sessionEnd > 0 && now >= sessionEnd
  const showLockScreen = isExpired && page === 'landing'

  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen relative" style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {showLockScreen ? (
        <LockScreen onUnlock={handleUnlock} pin={appConfig.pin} />
      ) : (
        <>
          {page === 'landing' && (
            <LandingPage onStart={handleStart} />
          )}
          {page === 'template' && (
            <TemplatePage
              onSelect={handleTemplateSelect}
              onBack={() => setPage('landing')}
            />
          )}
          {page === 'photo' && selectedTemplate && (
            <PhotoPage
              template={selectedTemplate}
              onComplete={handlePhotosComplete}
              onBack={() => setPage('template')}
            />
          )}
          {page === 'final' && selectedTemplate && capturedPhotos.length > 0 && (
            <FinalPage
              photos={capturedPhotos}
              template={selectedTemplate}
              onRestart={handleRestart}
            />
          )}

          {appConfig.mode === 'berbayar' && page === 'landing' && sessionEnd > 0 && now < sessionEnd && (
            <div className="absolute top-6 left-6 z-50 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/40 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-display font-bold text-xl text-[#2C3947] tracking-widest">
                {formatTime(sessionEnd - now)}
              </span>
            </div>
          )}

          <MusicControl
            isPlaying={isPlaying}
            toggle={toggle}
            volume={volume}
            setVolume={setVolume}
            tracks={tracks}
          />
        </>
      )}
    </div>
  )
}
