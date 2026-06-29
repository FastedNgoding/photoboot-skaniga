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
  // Alur baru: landing → photo → template → final
  const [page, setPage] = useState('landing')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [capturedPhotos, setCapturedPhotos] = useState([]) // all photos (5)
  const [chosenPhotos, setChosenPhotos] = useState([])     // 3 picked by user
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
    setPage('photo') // Langsung ke foto dulu
  }

  // PhotoPage selesai: user sudah pilih 3 foto terbaik → ke template
  const handlePhotosComplete = (photos) => {
    setChosenPhotos(photos)
    setPage('template')
  }

  // TemplatePage: user pilih template dan klik Simpan → ke final
  const handleTemplateSelect = (tmpl) => {
    setSelectedTemplate(tmpl)
    setPage('final')
  }

  const handleRestart = () => {
    setCapturedPhotos([])
    setChosenPhotos([])
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

          {/* Foto dulu — tanpa template */}
          {page === 'photo' && (
            <PhotoPage
              onComplete={handlePhotosComplete}
              onBack={() => setPage('landing')}
            />
          )}

          {/* Setelah pilih 3 foto → pilih template, dengan preview foto */}
          {page === 'template' && chosenPhotos.length === 3 && (
            <TemplatePage
              selectedPhotos={chosenPhotos}
              onSelect={handleTemplateSelect}
              onBack={() => setPage('photo')}
            />
          )}

          {/* Final: QR + download */}
          {page === 'final' && selectedTemplate && chosenPhotos.length > 0 && (
            <FinalPage
              photos={chosenPhotos}
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
