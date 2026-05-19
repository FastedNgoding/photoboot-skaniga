import { useState } from 'react'
import { TEMPLATES } from '../utils/templates'
import { Rocket, Star, Cat, Heart, Bear, Bolt, ArrowBigLeft, Check } from '@boxicons/react'

export default function TemplatePage({ onSelect, onBack }) {
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)

  const handleSelect = (tmpl) => {
    setSelected(tmpl.id)
    setTimeout(() => onSelect(tmpl), 600)
  }

  const THEME_PREVIEW = {
    hellokitty: {
      bg: 'linear-gradient(160deg, #ffe4ec 0%, #ffcce0 50%, #ffb7d5 100%)',
      accent: '#ff6b9d',
      Icon: Cat,
      Deco: Heart,
      slotBg: 'rgba(255,255,255,0.6)',
      slotBorder: '#ff8fab',
      title: 'HELLO KITTY',
      subtitle: 'Sweet & Cute',
      font: '"Playfair Display", serif'
    },
    astronaut: {
      bg: 'linear-gradient(160deg, #0a0e27 0%, #1a1f4e 50%, #0f1538 100%)',
      accent: '#4488ff',
      Icon: Rocket,
      Deco: Star,
      slotBg: 'rgba(68,136,255,0.15)',
      slotBorder: '#4488ff',
      title: 'SPACE EXPLORER',
      subtitle: 'To Infinity',
      font: '"Bebas Neue", sans-serif'
    },
    lotso: {
      bg: 'linear-gradient(160deg, #5c1a3d 0%, #7b2349 50%, #3d0f2a 100%)',
      accent: '#e74c3c',
      Icon: Bear,
      Deco: Heart,
      slotBg: 'rgba(255,255,255,0.1)',
      slotBorder: '#e74c3c',
      title: 'LOTSO WORLD',
      subtitle: 'Berry Sweet',
      font: '"Playfair Display", serif'
    },
    starwars: {
      bg: 'linear-gradient(160deg, #0a0a0a 0%, #1a1a2e 50%, #111111 100%)',
      accent: '#FFD700',
      Icon: Bolt,
      Deco: Star,
      slotBg: 'rgba(255,215,0,0.08)',
      slotBorder: '#FFD700',
      title: 'STAR WARS',
      subtitle: 'May the Force',
      font: '"Bebas Neue", sans-serif'
    }
  }

  const renderPreview = (tmpl) => {
    const p = THEME_PREVIEW[tmpl.id]
    const DecoIcon = p.Deco
    const MainIcon = p.Icon
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3 relative overflow-hidden"
        style={{ background: p.bg }}>
        <div className="absolute top-2 right-2" style={{ opacity: 0.6 }}>
          <MainIcon size="20" color={p.accent} />
        </div>
        {/* <div className="flex gap-1.5 mb-1">
          {[0,1,2,3,4].map(i => (
            <DecoIcon key={i} size="14" color={p.accent} style={{ opacity: 0.7 }} />
          ))}
        </div> */}
        {[0,1,2].map(i => (
          <div key={i} className="w-full rounded-lg relative overflow-hidden"
            style={{ height: 72, background: p.slotBg, border: `1.5px solid ${p.slotBorder}` }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full" style={{ background: p.accent, opacity: 0.3 }} />
            </div>
          </div>
        ))}
        <div className="text-center mt-1">
          <div className="text-xs font-bold tracking-wider" style={{ color: p.accent, fontFamily: p.font }}>
            {p.title}
          </div>
          <div className="text-[10px] opacity-60" style={{ color: p.accent }}>
            {p.subtitle}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #E8EDF2 0%, #d0d8e2 100%)' }}>
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #2C3947 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between px-8 pt-5 pb-3 shrink-0">
          <button onClick={onBack}
            className="flex w-25 justify-center items-center gap-2 rounded-xl px-4 py-2 transition-all hover:scale-105 active:scale-95"
            style={{ background: 'rgba(0,0,0,0.08)', color: '#2C3947' }}>
            <ArrowBigLeft size="20" />
            <span className="font-medium text-sm">Kembali</span>
          </button>
          <div className="text-center">
            <br />
            <br />
            <span className="text-2xl font-bold tracking-[0.15em]" style={{ color: '#2C3947' }}>
              PILIH FRAME
            </span>
            <div className="h-0.5 w-16 mx-auto mt-1 rounded-full" style={{ background: '#2C3947' }} />
          </div>
          <div className="w-24" />
        </div>

        <div className="text-center pb-3 shrink-0">
          <p className="text-sm" style={{ color: '#5a6a7a' }}>
            Setiap frame berisi <strong>3 foto</strong> yang akan digabung jadi satu strip
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-4 min-h-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-5xl">
            {TEMPLATES.map((tmpl, i) => {
              const isHover = hovered === tmpl.id
              const isSelect = selected === tmpl.id
              const p = THEME_PREVIEW[tmpl.id]
              const MainIcon = p.Icon
              return (
                <button key={tmpl.id} onClick={() => handleSelect(tmpl)}
                  onMouseEnter={() => setHovered(tmpl.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative rounded-3xl overflow-hidden cursor-pointer group"
                  style={{
                    animation: `sk-slide-up 0.5s ease-out ${i * 0.1}s both`,
                    border: isHover || isSelect ? `3px solid ${tmpl.border}` : '3px solid transparent',
                    transform: isHover ? 'scale(1.05) translateY(-4px)' : isSelect ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isHover
                      ? `0 25px 60px ${tmpl.border}55, 0 0 0 1px ${tmpl.border}33`
                      : '0 8px 30px rgba(0,0,0,0.1)',
                    aspectRatio: '2/3',
                  }}>
                  <div className="absolute inset-0">
                    {renderPreview(tmpl)}
                  </div>

                  {isSelect && (
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}>
                      <div className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: tmpl.border }}>
                        <Check size="32" color="#ffffff" />
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="text-center pb-4 shrink-0">
          <p className="text-xs opacity-50" style={{ color: '#5a6a7a' }}>
            Tap template untuk mulai foto
          </p>
        </div>
      </div>

      <style>{`
        @keyframes sk-slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}