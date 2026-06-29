import { useState, useRef, useEffect, useCallback } from 'react'
import { TEMPLATES } from '../utils/templates'
import { ArrowBigLeft, Check } from '@boxicons/react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Sticker assets ───────────────────────────────────────────────────────────
import astronotImg1 from '../assets/astronot1.png'
import astronotImg2 from '../assets/astronot2.png'
import planetImg from '../assets/planet.png'
import hkImg1 from '../assets/hk1.png'
import hkImg2 from '../assets/hk2.png'
import hkImg3 from '../assets/hk3.png'
import swImg1 from '../assets/sw1.png'
import swImg2 from '../assets/sw2.png'
import swImg3 from '../assets/sw3.png'
import lImg1 from '../assets/l1.png'
import lImg2 from '../assets/l2.png'
import lImg3 from '../assets/l3.png'
import dbImg1 from '../assets/db1.png'
import dbImg2 from '../assets/db2.png'
import dbImg3 from '../assets/db3.png'
import opImg1 from '../assets/op1.png'
import opImg2 from '../assets/op2.png'
import opImg3 from '../assets/op3.png'
import saImg1 from '../assets/sa1.png'
import saImg2 from '../assets/sa2.png'
import saImg3 from '../assets/sa3.png'
import omImg1 from '../assets/om1.png'
import omImg2 from '../assets/om2.png'
import omImg3 from '../assets/om3.png'

const STICKERS = {
  astronaut: [
    { src: astronotImg1, style: { top: 0, left: -8, width: 80, height: 80 } },
    { src: astronotImg2, style: { top: '45%', right: -12, width: 75, height: 75 } },
    { src: planetImg, style: { bottom: '12%', left: -5, width: 70, height: 45 } },
  ],
  hellokitty: [
    { src: hkImg1, style: { top: 0, left: -5, width: 75, height: 75 } },
    { src: hkImg2, style: { top: '45%', right: -10, width: 75, height: 75 } },
    { src: hkImg3, style: { bottom: '12%', left: 0, width: 65, height: 55 } },
  ],
  starwars: [
    { src: swImg1, style: { top: 5, left: 0, width: 85, height: 45 } },
    { src: swImg2, style: { top: '45%', right: -10, width: 70, height: 70 } },
    { src: swImg3, style: { bottom: '10%', left: -2, width: 65, height: 72 } },
  ],
  lotso: [
    { src: lImg1, style: { top: -5, left: -5, width: 70, height: 70 } },
    { src: lImg2, style: { top: '50%', right: -5, width: 55, height: 55 } },
    { src: lImg3, style: { bottom: '10%', left: -5, width: 65, height: 72 } },
  ],
  dragonball: [
    { src: dbImg1, style: { top: 0, left: -5, width: 75, height: 75 } },
    { src: dbImg2, style: { top: '45%', right: -10, width: 70, height: 70 } },
    { src: dbImg3, style: { bottom: '10%', left: -3, width: 70, height: 70 } },
  ],
  onepiece: [
    { src: opImg1, style: { top: 0, left: -5, width: 75, height: 75 } },
    { src: opImg2, style: { top: '45%', right: -10, width: 75, height: 75 } },
    { src: opImg3, style: { bottom: '10%', left: -3, width: 55, height: 70 } },
  ],
  sakura: [
    { src: saImg1, style: { top: 2, left: 0, width: 55, height: 75 } },
    { src: saImg2, style: { top: '45%', right: -8, width: 65, height: 75 } },
    { src: saImg3, style: { bottom: '10%', left: -5, width: 70, height: 70 } },
  ],
  omnom: [
    { src: omImg1, style: { top: 2, left: 0, width: 70, height: 75 } },
    { src: omImg2, style: { top: '45%', right: -8, width: 65, height: 65 } },
    { src: omImg3, style: { bottom: '10%', left: -5, width: 70, height: 70 } },
  ],
}

function extractColors(gradStr) {
  const m = gradStr.match(/#[a-fA-F0-9]{6}/g) || ['#333333', '#666666']
  return [m[0], m[m.length - 1]]
}

// ─── StripPreview component ─────────────────────────────────────────────────
// Renders a mini version of the actual photo strip with real photos + stickers
function StripPreview({ template, photos, height }) {
  const [c1, c2] = extractColors(template.stripBg)
  const stickers = STICKERS[template.id] || []
  const dt = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  const bf = template.font?.includes('Bebas') ? '"Bebas Neue", sans-serif' : '"Playfair Display", serif'

  return (
    <div
      className="relative overflow-hidden rounded-2xl select-none"
      style={{
        height,
        width: height * 0.52, // aspect ratio ~600:1150
        background: `linear-gradient(180deg, ${c1} 0%, ${c2} 50%, ${c1} 100%)`,
        boxShadow: `0 0 0 3px ${template.border}, 0 20px 60px ${template.border}44`,
      }}
    >
      {/* Inner border */}
      <div className="absolute inset-[6px] border rounded-xl pointer-events-none" style={{ borderColor: template.border + '33', borderWidth: 1 }} />

      {/* 3 photo slots */}
      <div className="flex flex-col gap-[3%] p-[6%] pb-0" style={{ height: '78%' }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 rounded-md overflow-hidden relative"
            style={{ border: `2px solid ${template.border}77` }}>
            {photos[i] ? (
              <img src={photos[i]} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
            ) : (
              <div className="w-full h-full" style={{ background: template.border + '11' }} />
            )}
            {/* Numbering badge */}
            <div className="absolute bottom-0 right-0 px-1.5 py-0.5 text-white font-bold"
              style={{ fontSize: 7, background: 'rgba(0,0,0,0.5)' }}>
              {i + 1}/3
            </div>
          </div>
        ))}
      </div>

      {/* Footer text */}
      <div className="text-center px-2" style={{ height: '22%', paddingTop: '3%' }}>
        <p className="font-bold tracking-wider leading-tight"
          style={{ color: template.textColor, fontFamily: bf, fontSize: Math.max(height * 0.032, 9), textShadow: `0 1px 6px ${template.border}66` }}>
          SKANIGA PORTRAIT
        </p>
        <div className="mx-auto rounded-full my-0.5" style={{ width: '35%', height: 1, background: template.border + '55' }} />
        <p style={{ color: template.textColor + 'bb', fontSize: Math.max(height * 0.02, 7), fontFamily: '"Urbanist", sans-serif' }}>
          {template.overlayText}
        </p>
        <p style={{ color: template.textColor + '99', fontSize: Math.max(height * 0.017, 6), fontFamily: '"Urbanist", sans-serif', marginTop: 2 }}>
          {dt}
        </p>
        <p className="font-bold uppercase tracking-widest"
          style={{ color: template.border + 'cc', fontSize: Math.max(height * 0.016, 6), marginTop: 1 }}>
          {template.name}
        </p>
      </div>

      {/* Stickers */}
      {stickers.map((s, i) => (
        <img key={i} src={s.src} alt="" className="absolute pointer-events-none select-none"
          style={{ ...s.style, objectFit: 'contain', zIndex: 5 }} />
      ))}

      {/* Decorative particles */}
      {(template.decorations || []).slice(0, 4).map((deco, i) => (
        <div key={`d${i}`} className="absolute pointer-events-none select-none opacity-25"
          style={{
            fontSize: Math.max(height * 0.03, 10),
            left: i % 2 === 0 ? `${10 + i * 8}%` : undefined,
            right: i % 2 !== 0 ? `${8 + i * 6}%` : undefined,
            top: `${15 + i * 22}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
          }}>
          {deco}
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function TemplatePage({ onSelect, onBack, selectedPhotos }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState(null)
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  })
  const isDragging = useRef(false)
  const touchStart = useRef({ x: 0, y: 0, time: 0 })
  const swiped = useRef(false)

  useEffect(() => {
    const onResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const { width, height } = dimensions
  const isMobile = width < 640

  // Strip dimensions based on screen
  const stripH = isMobile ? Math.min(height * 0.55, 420) : Math.min(height * 0.68, 560)
  const stripW = stripH * 0.52
  const gap = isMobile ? 20 : 32

  const currentTemplate = TEMPLATES[activeIndex] || TEMPLATES[0]
  const isDark = ['astronaut', 'starwars', 'omnom', 'lotso', 'onepiece', 'dragonball'].includes(currentTemplate.id)
  const textColor = isDark ? '#F3F4F6' : '#2C3947'
  const subtitleColor = isDark ? '#9CA3AF' : '#5a6a7a'
  const btnBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
  const btnBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'

  const BACKGROUND_THEMES = {
    hellokitty: 'linear-gradient(135deg, #FFF0F3 0%, #FFE4E6 50%, #FFD1DC 100%)',
    sakura: 'linear-gradient(135deg, #FFF5F6 0%, #FCE4EC 50%, #F8BBD0 100%)',
    astronaut: 'linear-gradient(135deg, #040612 0%, #0b0f2a 50%, #03040a 100%)',
    starwars: 'linear-gradient(135deg, #010101 0%, #0a0910 50%, #010101 100%)',
    omnom: 'linear-gradient(135deg, #050010 0%, #0e001a 50%, #020006 100%)',
    lotso: 'linear-gradient(135deg, #2b0617 0%, #3d0b21 50%, #17020c 100%)',
    dragonball: 'linear-gradient(135deg, #361000 0%, #521800 50%, #1f0a00 100%)',
    onepiece: 'linear-gradient(135deg, #001624 0%, #00263d 50%, #000e17 100%)',
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (saving) return
      if (e.key === 'ArrowLeft') { e.preventDefault(); setActiveIndex((p) => Math.max(0, p - 1)) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); setActiveIndex((p) => Math.min(TEMPLATES.length - 1, p + 1)) }
      else if (e.key === 'Enter') { e.preventDefault(); handleSave() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, saving])

  const handleSave = useCallback(() => {
    if (saving) return
    const tmpl = TEMPLATES[activeIndex]
    setSaving(true)
    setSavedId(tmpl.id)
    // Smooth save: scale up → checkmark → fade out
    setTimeout(() => onSelect(tmpl), 1200)
  }, [activeIndex, saving, onSelect])

  // Swipe logic
  const onSwipe = (dx) => {
    if (saving) return
    if (dx < 0) setActiveIndex((p) => Math.min(TEMPLATES.length - 1, p + 1))
    else setActiveIndex((p) => Math.max(0, p - 1))
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none">
      {/* Animated background */}
      <motion.div
        className="fixed inset-0 -z-20 pointer-events-none"
        animate={{ background: BACKGROUND_THEMES[currentTemplate.id] || 'linear-gradient(160deg, #E8EDF2 0%, #d0d8e2 100%)' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-5 -z-15 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #2C3947 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full filter blur-[90px] md:blur-[130px] opacity-35"
          style={{ top: '15%', left: '15%' }}
          animate={{ backgroundColor: currentTemplate.border }}
          transition={{ duration: 1.0 }}
        />
        <motion.div className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full filter blur-[90px] md:blur-[130px] opacity-30"
          style={{ bottom: '15%', right: '15%' }}
          animate={{ backgroundColor: currentTemplate.accent || currentTemplate.border }}
          transition={{ duration: 1.0 }}
        />
      </div>

      {/* Save overlay animation */}
      <AnimatePresence>
        {saving && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop blur */}
            <motion.div
              className="absolute inset-0"
              initial={{ backdropFilter: 'blur(0px)', background: 'rgba(0,0,0,0)' }}
              animate={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.5)' }}
              transition={{ duration: 0.5 }}
            />

            {/* The strip scales up + checkmark */}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-4"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.15 }}
            >
              <StripPreview template={TEMPLATES[activeIndex]} photos={selectedPhotos || []} height={Math.min(stripH * 1.1, 500)} />

              {/* Check badge */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.45 }}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
                  style={{ background: currentTemplate.border, boxShadow: `0 0 40px ${currentTemplate.border}88` }}>
                  <Check size="40" color="#ffffff" />
                </div>
              </motion.div>

              <motion.p
                className="text-lg font-black tracking-widest uppercase"
                style={{ color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Tersimpan! ✨
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Content layout ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-12 lg:px-20 pt-6 pb-2 shrink-0">
          <motion.button
            onClick={onBack}
            disabled={saving}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 font-bold text-sm backdrop-blur-md shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-30"
            style={{ background: btnBg, color: textColor, border: `1px solid ${btnBorder}` }}
          >
            <ArrowBigLeft size="20" />
            <span>Kembali</span>
          </motion.button>

          <div className="text-center">
            <motion.span className="text-lg md:text-2xl font-black tracking-[0.2em] uppercase"
              animate={{ color: textColor }} transition={{ duration: 0.5 }}>
              PILIH FRAME
            </motion.span>
            <motion.div className="h-[3px] w-12 mx-auto mt-1 rounded-full"
              animate={{ background: currentTemplate.border }} transition={{ duration: 0.5 }} />
          </div>

          <div className="w-24" />
        </div>

        <motion.p className="text-center text-xs md:text-sm font-medium pb-2 px-4 shrink-0"
          animate={{ color: subtitleColor }}>
          Geser untuk memilih frame · Klik <strong>Simpan</strong> jika sudah cocok
        </motion.p>

        {/* ─── Strip Carousel ────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-2 md:px-8 pb-2 min-h-0 relative w-full overflow-hidden">

          {/* Prev button */}
          <button onClick={() => !saving && setActiveIndex(p => Math.max(0, p - 1))}
            disabled={activeIndex === 0 || saving}
            className="absolute left-1 md:left-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
            style={{ background: btnBg, border: `1px solid ${btnBorder}`, color: textColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          {/* Strips container */}
          <div className="w-full h-full relative flex items-center overflow-visible"
            style={{ perspective: '1200px' }}
          >
            <motion.div
              className="flex absolute items-center"
              style={{ gap, left: `calc(50% - ${stripW / 2}px)` }}

              onTouchStart={(e) => {
                const t = e.touches[0]
                touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() }
                swiped.current = false; isDragging.current = false
              }}
              onTouchEnd={(e) => {
                if (swiped.current) return
                const t = e.changedTouches[0]
                const dx = t.clientX - touchStart.current.x
                const dy = t.clientY - touchStart.current.y
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
                  isDragging.current = true
                  setTimeout(() => { isDragging.current = false }, 200)
                  onSwipe(dx)
                  swiped.current = true
                }
              }}
              onTouchMove={(e) => {
                if (swiped.current) return
                const t = e.touches[0]
                const dx = t.clientX - touchStart.current.x
                const dy = t.clientY - touchStart.current.y
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
                  onSwipe(dx)
                  swiped.current = true
                }
              }}
              onPointerDown={(e) => {
                if (e.pointerType === 'touch') return
                touchStart.current = { x: e.clientX, y: e.clientY, time: Date.now() }
                swiped.current = false; isDragging.current = false
              }}
              onPointerUp={(e) => {
                if (e.pointerType === 'touch' || swiped.current) return
                const dx = e.clientX - touchStart.current.x
                if (Math.abs(dx) > 30) {
                  isDragging.current = true
                  setTimeout(() => { isDragging.current = false }, 200)
                  onSwipe(dx)
                }
              }}

              animate={{ x: -(activeIndex * (stripW + gap)) }}
              transition={{ type: 'spring', stiffness: 250, damping: 28, mass: 0.9 }}
            >
              {TEMPLATES.map((tmpl, i) => {
                const isActive = i === activeIndex
                return (
                  <motion.div
                    key={tmpl.id}
                    className="shrink-0 cursor-pointer"
                    onClick={() => { if (!isDragging.current && !saving) setActiveIndex(i) }}
                    animate={{
                      scale: isActive ? 1 : 0.78,
                      opacity: isActive ? 1 : 0.35,
                      y: isActive ? -8 : 0,
                      rotateY: isActive ? 0 : (i < activeIndex ? 15 : -15),
                    }}
                    transition={{ type: 'spring', stiffness: 250, damping: 28, mass: 0.9 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <StripPreview template={tmpl} photos={selectedPhotos || []} height={stripH} />
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Next button */}
          <button onClick={() => !saving && setActiveIndex(p => Math.min(TEMPLATES.length - 1, p + 1))}
            disabled={activeIndex === TEMPLATES.length - 1 || saving}
            className="absolute right-1 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
            style={{ background: btnBg, border: `1px solid ${btnBorder}`, color: textColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* ─── Bottom: Info + Save Button ────────────────────────────────── */}
        <div className="flex flex-col items-center shrink-0 pb-6 pt-1 z-10 w-full px-4">

          {/* Template name/tagline */}
          <div className="h-12 flex items-center justify-center w-full max-w-md mb-2 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={currentTemplate.id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }} className="text-center">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2"
                  style={{ color: currentTemplate.accent || currentTemplate.border, fontFamily: currentTemplate.font || 'Urbanist, sans-serif' }}>
                  <span>{currentTemplate.name}</span>
                  <span className="text-base md:text-xl">{currentTemplate.emoji}</span>
                </h2>
                <p className="text-xs italic font-semibold opacity-75" style={{ color: subtitleColor }}>
                  "{currentTemplate.tagline}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex gap-1 mb-3 justify-center items-center">
            {TEMPLATES.map((tmpl, idx) => (
              <button key={tmpl.id} onClick={() => !saving && setActiveIndex(idx)}
                className="cursor-pointer transition-all duration-300 border-none outline-none w-5 h-5 flex items-center justify-center bg-transparent">
                <div style={{
                  width: idx === activeIndex ? '22px' : '7px',
                  height: '7px',
                  borderRadius: '9999px',
                  background: idx === activeIndex ? currentTemplate.border : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
                  transition: 'all 0.3s ease',
                }} />
              </button>
            ))}
          </div>

          {/* SIMPAN button */}
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 rounded-2xl px-10 py-3.5 font-extrabold text-base uppercase tracking-widest transition-all cursor-pointer disabled:cursor-not-allowed shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${currentTemplate.border}, ${currentTemplate.accent || currentTemplate.border})`,
              color: '#fff',
              boxShadow: `0 8px 30px ${currentTemplate.border}55`,
              border: '1px solid rgba(255,255,255,0.2)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Check size="20" />
            <span>Simpan</span>
          </motion.button>

          <motion.p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2"
            animate={{ color: subtitleColor }}>
            {activeIndex + 1} / {TEMPLATES.length} · GESER UNTUK PILIH
          </motion.p>
        </div>
      </div>
    </div>
  )
}