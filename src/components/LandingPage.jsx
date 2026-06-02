import { useState, useEffect } from 'react'
import PetalRain from './PetalRain'
import { Camera } from '@boxicons/react'

const TITLE_CHARS = 'SKANIGA'.split('')
const SUBTITLE_CHARS = 'POTRAIT'.split('')

export default function LandingPage({ onStart }) {
  const [phase, setPhase] = useState('intro')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('title'), 500)
    const t2 = setTimeout(() => setPhase('subtitle'), 1200)
    const t3 = setTimeout(() => setPhase('content'), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E8EDF2 0%, #d4dce6 50%, #E8EDF2 100%)',
      }}
    >
      <PetalRain count={25} />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #2C3947 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="absolute top-10 right-10 w-48 h-48 rounded-full opacity-20 animate-spin-slow"
        style={{ background: 'conic-gradient(from 0deg, #C2A56D, #547A95, #2C3947, #C2A56D)' }}
      />
      <div className="absolute bottom-16 left-10 w-32 h-32 rounded-full opacity-15 animate-float"
        style={{ background: 'radial-gradient(circle, #C2A56D, transparent)' }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-2 overflow-hidden font-[Quicksand]">
          {phase !== 'intro' && (
            <div className="flex justify-center gap-1 flex-wrap">
              {TITLE_CHARS.map((c, i) => (
                <span
                  key={i}
                  className="font-display text-7xl md:text-9xl shimmer-text inline-block"
                  style={{
                    animation: `slideInDown 0.5s ease-out ${i * 0.07}s both`,
                    fontSize: 'clamp(3rem, 10vw, 7rem)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden mb-8">
          {(phase === 'subtitle' || phase === 'content') && (
            <div className="flex justify-center gap-2 flex-wrap">
              {SUBTITLE_CHARS.map((c, i) => (
                <span
                  key={i}
                  className="font-display inline-block"
                  style={{
                    animation: `slideInUp 0.5s ease-out ${i * 0.08}s both`,
                    fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                    color: 'var(--blue)',
                    letterSpacing: '0.2em',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {phase === 'content' && (
          <div className="space-y-8" style={{ animation: 'slideInUp 0.8s ease-out 0.3s both' }}>
            <div className="glass rounded-3xl px-8 py-6 inline-block">
              <p className="font-body text-lg md:text-xl text-[var(--dark)] font-light leading-relaxed">
                Abadikan momenmu dalam frame yang
                <span className="text-[var(--gold)] font-semibold"> ikonik ✨</span>
              </p>
            </div>

            <br />
            <br />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={onStart}
                className="btn-primary rounded-full px-10 py-5 text-xl font-body font-bold animate-pulse-glow group relative flex w-44 sm:w-50 h-12 sm:h-13 gap-x-2 justify-center items-center"
              >
                <span className="mr-2"><Camera /></span>
                Foto Sekarang
              </button>
            </div>

            <br />
            <br />
            <br />

            <div className="flex gap-8 justify-center pt-4">
              {['🎀', '🚀', '🧸', '⚔️'].map((emoji, i) => (
                <span
                  key={i}
                  className="text-3xl cursor-default"
                  style={{ animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
        {phase === 'content' && (
          <p className="font-body text-xs text-[var(--blue)] opacity-60 tracking-widest uppercase"
            style={{ animation: 'slideInUp 0.5s ease-out 1s both' }}>
            Studio Foto Digital · Gen-Z Edition · PPLG-Product
          </p>
        )}
      </div>
    </div>
  )
}
