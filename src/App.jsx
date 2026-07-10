import { useState, useEffect, useRef } from 'react'
import LandingPage from './components/LandingPage'
import TemplatePage from './components/TemplatePage'
import PhotoPage from './components/PhotoPage'
import FinalPage, { buildStrip } from './components/FinalPage'
import MusicControl from './components/MusicControl'
import FullscreenControl from './components/FullscreenControl'
import SettingsPage from './components/SettingsPage'
import LockScreen from './components/LockScreen'
import AlbumPage from './components/AlbumPage'
import { useMusicPlayer } from './hooks/useMusicPlayer'
import { uploadStripPaid, savePaidStripUrl, clearPaidSession, savePaidImgurId } from './utils/uploadService'

export default function App() {
  const [page, setPage] = useState('landing')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [chosenPhotos, setChosenPhotos] = useState([])
  const { isPlaying, toggle, volume, setVolume, tracks, tryAutoPlay } = useMusicPlayer()

  const [paidUploading, setPaidUploading] = useState(false)
  const [paidUploadCount, setPaidUploadCount] = useState(0)
  const expiredHandled = useRef(false)

  const [appConfig, setAppConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('skaniga-settings')
      const parsed = saved ? JSON.parse(saved) : {}
      return {
        mode: parsed.mode || 'bebas',
        pin: parsed.pin || '1234',
        duration: parsed.duration || 2,
        controlButtonMode: parsed.controlButtonMode || 'music',
        countdownDuration: parsed.countdownDuration || 3,
        watermarkText: parsed.watermarkText || 'SKANIGA PORTRAIT',
        freeUploadProvider: parsed.freeUploadProvider || 'imgbb',
        imgbbApiKey: parsed.imgbbApiKey || 'a49272e5e22c14d2e44681221e169088',
        imgurClientId: parsed.imgurClientId || '',
        cloudinaryCloudName: parsed.cloudinaryCloudName || 'xoawhvbs',
        cloudinaryUploadPreset: parsed.cloudinaryUploadPreset || 'photobooth_assets',
        theme: parsed.theme || 'light',
        paidUploadProvider: parsed.paidUploadProvider || 'imgur'
      }
    } catch {
      return {
        mode: 'bebas',
        pin: '1234',
        duration: 2,
        controlButtonMode: 'music',
        countdownDuration: 3,
        watermarkText: 'SKANIGA PORTRAIT',
        freeUploadProvider: 'imgbb',
        imgbbApiKey: 'a49272e5e22c14d2e44681221e169088',
        imgurClientId: '',
        cloudinaryCloudName: 'xoawhvbs',
        cloudinaryUploadPreset: 'photobooth_assets',
        theme: 'light',
        paidUploadProvider: 'imgur'
      }
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

  useEffect(() => {
    const handleInteraction = () => {
      if (!document.fullscreenElement && !window.skanigaExplicitExitFs) {
        document.documentElement.requestFullscreen()
          .then(() => {
            window.skanigaWasFullscreen = true
          })
          .catch(() => {})
      }
    }

    const handleFsChange = () => {
      if (document.fullscreenElement) {
        window.skanigaWasFullscreen = true
        window.skanigaExplicitExitFs = false
      } else {
        if (window.skanigaWasFullscreen) {
          window.skanigaExplicitExitFs = true
        }
      }
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('fullscreenchange', handleFsChange)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('fullscreenchange', handleFsChange)
    }
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

  if (currentPath === '/share') {
    const params = new URLSearchParams(window.location.search)
    const imagesStr = params.get('images') || ''
    const imageUrls = imagesStr ? imagesStr.split(',') : []

    return (
      <AlbumPage imageUrls={ imageUrls } />
    )
  }

  const handleStart = () => {
    if (appConfig.mode === 'berbayar') {
      const currentTime = Date.now()
      if (!sessionEnd || currentTime >= sessionEnd) {
        const newEnd = currentTime + appConfig.duration * 60 * 1000
        setSessionEnd(newEnd)
        localStorage.setItem('skaniga-session-end', newEnd.toString())
        clearPaidSession()
        setPaidUploadCount(0)
        expiredHandled.current = false
      }
    }
    if (appConfig.controlButtonMode === 'music') {
      tryAutoPlay()
    }
    setPage('photo')
  }

  const handlePhotosComplete = (photos) => {
    setChosenPhotos(photos)
    setPage('template')
  }

  const handleTemplateSelect = async (tmpl) => {
    setSelectedTemplate(tmpl)

    if (appConfig.mode === 'berbayar') {
      setPaidUploading(true)
      let stripB64 = null
      try {
        stripB64 = await buildStrip(chosenPhotos, tmpl, appConfig)
        const res = await uploadStripPaid(stripB64, appConfig)
        if (res.ok) {
          savePaidStripUrl(res.url)
          if (res.provider === 'imgur' && res.id) {
            savePaidImgurId(res.id)
          }
        } else {
          savePaidStripUrl(stripB64)
        }
      } catch (e) {
        console.error("Background upload error:", e)
        if (stripB64) {
          savePaidStripUrl(stripB64)
        }
      }
      setPaidUploading(false)
      setPaidUploadCount(prev => prev + 1)
      setChosenPhotos([])
      setSelectedTemplate(null)
      const isSessionOver = appConfig.mode === 'berbayar' && sessionEnd > 0 && Date.now() >= sessionEnd
      if (isSessionOver) {
        expiredHandled.current = true
        setPage('final')
      } else {
        setPage('photo')
      }
    } else {
      setPage('final')
    }
  }

  const handleRestart = () => {
    setCapturedPhotos([])
    setChosenPhotos([])
    setSelectedTemplate(null)
    setPaidUploadCount(0)
    expiredHandled.current = false
    clearPaidSession()
    setPage('landing')
  }

  const handleUnlock = () => {
    setSessionEnd(0)
    localStorage.setItem('skaniga-session-end', '0')
    clearPaidSession()
  }

  const isExpired = appConfig.mode === 'berbayar' && sessionEnd > 0 && now >= sessionEnd
  const showLockScreen = isExpired && page === 'landing'

  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (appConfig.mode === 'berbayar' && sessionEnd > 0 && now >= sessionEnd && !expiredHandled.current) {
      if (page === 'photo' || page === 'template') {
        expiredHandled.current = true
        setPage('final')
      }
    }
  }, [now, sessionEnd, appConfig.mode, page])

  return (
    <div className={`min-h-screen relative sk-theme-${appConfig.theme || 'light'}`} style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {showLockScreen ? (
        <LockScreen onUnlock={handleUnlock} pin={appConfig.pin} />
      ) : (
        <>
          {page === 'landing' && (
            <LandingPage onStart={handleStart} />
          )}

          {page === 'photo' && (
            <PhotoPage
              config={appConfig}
              onComplete={handlePhotosComplete}
              onBack={() => setPage('landing')}
            />
          )}

          {page === 'template' && chosenPhotos.length === 3 && (
            <TemplatePage
              config={appConfig}
              selectedPhotos={chosenPhotos}
              onSelect={handleTemplateSelect}
              onBack={() => setPage('photo')}
            />
          )}

          {page === 'final' && (
            <FinalPage
              config={appConfig}
              photos={chosenPhotos}
              template={selectedTemplate}
              onRestart={handleRestart}
              isExpired={isExpired}
            />
          )}

          {paidUploading && (
            <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center">
              <div className="bg-white/10 border border-white/20 rounded-3xl px-10 py-8 flex flex-col items-center gap-4 shadow-2xl">
                <div className="w-14 h-14 border-4 border-white/30 border-t-[#C2A56D] rounded-full animate-spin" />
                <p className="text-white font-bold text-lg tracking-wide">Menyimpan foto...</p>
                <p className="text-white/50 text-sm">Setelah selesai, kamu bisa ambil foto lagi</p>
              </div>
            </div>
          )}

          {appConfig.mode === 'berbayar' && page !== 'landing' && page !== 'final' && sessionEnd > 0 && now < sessionEnd && (
            <div className="absolute top-6 left-6 z-50 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/40 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="sk-font-display font-bold text-xl text-[#2C3947] tracking-widest">
                {formatTime(sessionEnd - now)}
              </span>
              {paidUploadCount > 0 && (
                <span className="text-xs bg-[#C2A56D] text-white font-bold px-2 py-0.5 rounded-full">
                  {paidUploadCount} foto
                </span>
              )}
            </div>
          )}

          {appConfig.mode === 'berbayar' && (
            <button
              onClick={() => window.location.href = '/settings'}
              className="fixed bottom-6 left-6 z-[99] w-10 h-10 rounded-full bg-black/5 hover:bg-black/20 border border-black/10 backdrop-blur-sm flex items-center justify-center text-black/30 hover:text-black/70 dark:text-white/20 dark:hover:text-white/70 dark:bg-white/5 dark:hover:bg-white/25 dark:border-white/10 transition-all cursor-pointer opacity-30 hover:opacity-100"
              title="Pengaturan"
            >
              ⚙️
            </button>
          )}

          {appConfig.controlButtonMode === 'fullscreen' ? (
            <FullscreenControl />
          ) : (
            <MusicControl
              isPlaying={isPlaying}
              toggle={toggle}
              volume={volume}
              setVolume={setVolume}
              tracks={tracks}
            />
          )}
        </>
      )}
    </div>
  )
}
