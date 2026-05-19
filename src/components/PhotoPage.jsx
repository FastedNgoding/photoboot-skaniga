import { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, ArrowBigLeft, Check, LoaderLinesAlt, Star, Rocket, Cat, Bolt, Heart } from '@boxicons/react'

const THEME_ICONS = {
  astronaut: Rocket,
  hellokitty: Cat,
  lotso: Heart,
  starwars: Bolt,
}

function getThemeIcon(id) {
  return THEME_ICONS[id] || Star
}

function ThemeParticles({ template, active }) {
  const particles = template.particles || ['✨']
  if (!active) return null
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `sk-particle-float ${2 + Math.random() * 2}s ease-in-out ${Math.random()}s infinite`,
            fontSize: `${20 + Math.random() * 20}px`,
            opacity: 0.6 + Math.random() * 0.4,
          }}
        >
          {particles[i % particles.length]}
        </div>
      ))}
    </div>
  )
}

function PhotoStrip({ photos, template }) {
  const Icon = getThemeIcon(template.id)
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: template.stripBg,
        padding: '10px 10px 24px',
        width: 120,
        border: `2px solid ${template.border}`,
      }}
    >
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="mb-2 last:mb-0 rounded overflow-hidden relative"
          style={{
            width: 100,
            height: 75,
            background: photos[i] ? 'transparent' : 'rgba(255,255,255,0.1)',
            border: `1px solid ${template.border}44`,
          }}
        >
          {photos[i] ? (
            <img
              src={photos[i]}
              alt={`photo ${i + 1}`}
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div style={{ opacity: 0.3 }}>
                <Icon size="20" color={template.textColor} />
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="text-center mt-1">
        <span className="text-xs font-bold tracking-wider" style={{ color: template.textColor, fontFamily: template.font, fontSize: 8 }}>
          SKANIGA
        </span>
      </div>
    </div>
  )
}

export default function PhotoPage({ template, onComplete, onBack }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const mountedRef = useRef(false)
  const [photos, setPhotos] = useState([])
  const [countdown, setCountdown] = useState(null)
  const [showFlash, setShowFlash] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [phase, setPhase] = useState('setup')
  const [camError, setCamError] = useState(null)
  const [autoRunning, setAutoRunning] = useState(false)
  const photosRef = useRef([])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }
  }, [])

  const startCamera = useCallback(async (retryCount = 0) => {
    if (streamRef.current) return
    setCamError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream

      if (videoRef.current && mountedRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setPhase('ready')
      }
    } catch (e) {
      console.error('Camera error:', e)
      if (retryCount < 2) {
        setTimeout(() => startCamera(retryCount + 1), 500)
        return
      }
      setCamError('Kamera tidak bisa diakses. Pastikan izin kamera diberikan.')
      stopCamera()
    }
  }, [stopCamera])

  useEffect(() => {
    mountedRef.current = true
    const t = setTimeout(() => startCamera(), 800)
    return () => {
      mountedRef.current = false
      stopCamera()
      clearTimeout(t)
    }
  }, [startCamera, stopCamera])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.92)
  }, [])

  const doCountdownAndCapture = useCallback(async () => {
    for (let i = 3; i >= 1; i--) {
      setCountdown(i)
      await new Promise(r => setTimeout(r, 1000))
    }
    setCountdown(0)
    await new Promise(r => setTimeout(r, 200))

    const dataUrl = capturePhoto()
    setShowFlash(true)
    setShowParticles(true)
    setTimeout(() => setShowFlash(false), 500)
    setTimeout(() => setShowParticles(false), 2500)

    const newPhotos = [...photosRef.current, dataUrl]
    photosRef.current = newPhotos
    setPhotos([...newPhotos])
    setCountdown(null)

    await new Promise(r => setTimeout(r, 1200))
    return dataUrl
  }, [capturePhoto])

  const runAutoCapture = useCallback(async () => {
    if (autoRunning) return
    setAutoRunning(true)
    photosRef.current = []
    setPhotos([])

    await new Promise(r => setTimeout(r, 800))
    await doCountdownAndCapture()
    await doCountdownAndCapture()
    await doCountdownAndCapture()

    setAutoRunning(false)
    setPhase('done')
    setTimeout(() => onComplete(photosRef.current), 800)
  }, [autoRunning, doCountdownAndCapture, onComplete])

  useEffect(() => {
    if (phase === 'ready' && !autoRunning) {
      const t = setTimeout(() => runAutoCapture(), 1500)
      return () => clearTimeout(t)
    }
  }, [phase])

  const handleRetry = () => {
    stopCamera()
    setCamError(null)
    setPhase('setup')
    setTimeout(() => startCamera(), 500)
  }

  const MainIcon = getThemeIcon(template.id)

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: template.bg }}>
      <canvas ref={canvasRef} className="hidden" />

      {showFlash && (
        <div className="fixed inset-0 z-40 animate-flash" style={{ background: '#ffffff' }} />
      )}

      <ThemeParticles template={template} active={showParticles} />

      <div className="flex items-center justify-between px-8 pt-5 pb-2 relative z-10 shrink-0">
        <button
          onClick={onBack}
          disabled={autoRunning}
          className="flex items-center gap-2 rounded-xl px-4 py-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: 'rgba(0,0,0,0.2)', color: template.textColor }}
        >
          <ArrowBigLeft size="20" />
          <span className="font-medium text-sm">Kembali</span>
        </button>
        <div className="text-center">
          <br />
          <br />
          <span
            className="text-2xl font-bold tracking-[0.15em]"
            style={{ color: template.textColor, fontFamily: template.font }}
          >
            {template.name.toUpperCase()}
          </span>
          <div className="h-0.5 w-12 mx-auto mt-1 rounded-full" style={{ background: template.border }} />
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all duration-500"
              style={{
                background: photos[i] ? template.accent : 'rgba(255,255,255,0.25)',
                transform: photos[i] ? 'scale(1.3)' : 'scale(1)',
                boxShadow: photos[i] ? `0 0 10px ${template.accent}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-4 relative z-10 min-h-0">
        <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-5xl">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl flex-1"
            style={{ border: `3px solid ${template.border}`, aspectRatio: '4/3', maxWidth: 720 }}
          >
            {camError ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <Camera size="48" color={template.textColor} style={{ opacity: 0.5 }} />
                <p className="font-medium text-sm text-center px-4" style={{ color: template.textColor }}>{camError}</p>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-sm transition-all hover:scale-105 active:scale-95"
                  style={{ background: template.accent, color: '#fff' }}
                >
                  <LoaderLinesAlt size="16" />
                  Coba Lagi
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="sk-countdown-pop">
                  {countdown === 0 ? (
                    <Camera size="80" color={template.accent} />
                  ) : (
                    <span
                      className="font-bold"
                      style={{
                        fontSize: 140,
                        color: template.accent,
                        fontFamily: template.font,
                        textShadow: `0 0 60px ${template.accent}88`,
                      }}
                    >
                      {countdown}
                    </span>
                  )}
                </div>
              </div>
            )}

            {phase === 'done' && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                <div className="sk-done-pop text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: template.accent }}>
                    <Check size="40" color="#ffffff" />
                  </div>
                  <p className="text-xl font-bold" style={{ color: template.textColor }}>Selesai!</p>
                </div>
              </div>
            )}

            <div className="absolute top-4 left-4">
              <div
                className="rounded-xl px-4 py-1.5 text-xs font-bold flex items-center gap-2"
                style={{ background: 'rgba(0,0,0,0.5)', color: template.textColor, backdropFilter: 'blur(8px)' }}
              >
                <Camera size="14" />
                {photos.length}/3 foto
              </div>
            </div>

            {autoRunning && countdown === null && photos.length < 3 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-xl px-5 py-2 text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(0,0,0,0.6)', color: template.textColor }}>
                  <LoaderLinesAlt size="16" className="animate-spin" />
                  Foto berikutnya...
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-5 shrink-0">
            <PhotoStrip photos={photos} template={template} />
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <MainIcon size="20" color={template.textColor} />
                <p className="font-medium text-sm" style={{ color: template.textColor }}>
                  {autoRunning
                    ? countdown !== null
                      ? 'Berpose!'
                      : photos.length < 3 ? 'Siapkan pose...' : 'Selesai!'
                    : phase === 'done' ? 'Semua foto terambil!' : 'Mempersiapkan kamera...'}
                </p>
              </div>
              <p className="text-xs opacity-50" style={{ color: template.textColor }}>
                Auto capture setiap 3 detik
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center pb-4 shrink-0">
        <p className="text-xs opacity-40" style={{ color: template.textColor }}>
          SKANIGA PORTRAIT · Auto Mode
        </p>
      </div>

      <style>{`
        @keyframes sk-particle-float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-30px) rotate(10deg); opacity: 1; }
        }
        @keyframes sk-flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: sk-flash 0.5s ease-out forwards;
          pointer-events: none;
        }
        @keyframes sk-countdown-pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .sk-countdown-pop {
          animation: sk-countdown-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes sk-done-pop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .sk-done-pop {
          animation: sk-done-pop 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}