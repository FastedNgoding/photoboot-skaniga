import { useState, useRef, useEffect, useCallback } from 'react'
import { TEMPLATES } from '../utils/templates'
import { ArrowBigLeft, Check } from '@boxicons/react'
import { motion, AnimatePresence } from 'framer-motion'

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
    { src: astronotImg1, style: { top: 5, left: -20, width: 140, height: 140 } },
    { src: astronotImg2, style: { top: 330, left: 468, width: 140, height: 140 } },
    { src: planetImg, style: { top: 700, left: 8, width: 130, height: 80 } },
  ],
  hellokitty: [
    { src: hkImg1, style: { top: 8, left: 13, width: 140, height: 140 } },
    { src: hkImg2, style: { top: 330, left: 468, width: 140, height: 140 } },
    { src: hkImg3, style: { top: 700, left: 15, width: 120, height: 100 } },
  ],
  starwars: [
    { src: swImg1, style: { top: 25, left: 17, width: 160, height: 80 } },
    { src: swImg2, style: { top: 330, left: 468, width: 140, height: 140 } },
    { src: swImg3, style: { top: 670, left: 15, width: 120, height: 135 } },
  ],
  lotso: [
    { src: lImg1, style: { top: -5, left: 5, width: 130, height: 130 } },
    { src: lImg2, style: { top: 378, left: 468, width: 100, height: 100 } },
    { src: lImg3, style: { top: 680, left: 5, width: 120, height: 135 } },
  ],
  dragonball: [
    { src: dbImg1, style: { top: 5, left: -10, width: 140, height: 140 } },
    { src: dbImg2, style: { top: 330, left: 468, width: 130, height: 130 } },
    { src: dbImg3, style: { top: 690, left: 5, width: 130, height: 130 } },
  ],
  onepiece: [
    { src: opImg1, style: { top: 5, left: -10, width: 140, height: 140 } },
    { src: opImg2, style: { top: 330, left: 468, width: 140, height: 140 } },
    { src: opImg3, style: { top: 690, left: 5, width: 100, height: 130 } },
  ],
  sakura: [
    { src: saImg1, style: { top: 12, left: 10, width: 100, height: 140 } },
    { src: saImg2, style: { top: 330, left: 468, width: 120, height: 140 } },
    { src: saImg3, style: { top: 690, left: 0, width: 130, height: 130 } },
  ],
  omnom: [
    { src: omImg1, style: { top: 12, left: 10, width: 130, height: 140 } },
    { src: omImg2, style: { top: 330, left: 468, width: 120, height: 120 } },
    { src: omImg3, style: { top: 690, left: 0, width: 130, height: 130 } },
  ],
}

function extractColors(gradStr) {
  const m = gradStr.match(/#[a-fA-F0-9]{6}/g) || ['#333333', '#666666']
  return [m[0], m[m.length - 1]]
}

function StripPreview({ template, photos, height, config }) {
  const [c1, c2] = extractColors(template.stripBg)
  const stickers = STICKERS[template.id] || []
  const dt = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  const bf = template.font?.includes('Bebas') ? '"Bebas Neue", sans-serif' : '"Playfair Display", serif'

  const ORIG_W = 600;
  const ORIG_H = 1198;
  const scale = height / ORIG_H;
  const renderW = ORIG_W * scale;
  
  return (
    <div
      className="relative select-none rounded-[16px] overflow-hidden"
      style={{
        width: renderW,
        height: height,
        boxShadow: `0 0 0 2px ${template.border}, 0 20px 60px ${template.border}44`,
        background: template.border 
      }}
    >
      <div 
        className="absolute top-0 left-0 bg-white"
        style={{
          width: ORIG_W,
          height: ORIG_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          background: `linear-gradient(180deg, ${c1} 0%, ${c2} 50%, ${c1} 100%)`,
        }}
      >
        {}
        <div className="absolute border" style={{ top: 0, left: 0, width: 600, height: 1198, borderWidth: 8, borderColor: template.border }} />
        <div className="absolute border" style={{ top: 12, left: 12, width: 576, height: 1174, borderWidth: 2, borderColor: template.border + '33' }} />
        
        {}
        {[0, 1, 2].map(i => {
          const x = 36;
          const y = 36 + i * (320 + 18);
          const pw = 528;
          const ph = 320;
          return (
            <div key={i} className="absolute overflow-hidden" style={{ top: y, left: x, width: pw, height: ph, background: template.border + '11' }}>
              {photos[i] && <img src={photos[i]} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
              <div className="absolute border" style={{ inset: 0, borderWidth: 4, borderColor: template.border + '77' }} />
              
              {}
              <div className="absolute" style={{ bottom: 12, right: 12, width: 42, height: 24, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: '"Urbanist", sans-serif' }}>{i + 1}/3</span>
              </div>
            </div>
          )
        })}

        {}
        <div className="absolute w-full text-center" style={{ top: 1068 }}>
          <p style={{ color: template.textColor, fontFamily: bf, fontSize: 44, fontWeight: 'bold', textShadow: `0 0 10px ${template.border}66` }}>
            {config?.watermarkText || 'SKANIGA PORTRAIT'}
          </p>
          <div style={{ position: 'absolute', top: 52, left: 220, width: 160, height: 1.5, background: template.border + '55' }} />
          <p style={{ position: 'absolute', top: 74, width: '100%', color: template.textColor + 'bb', fontSize: 16, fontFamily: '"Urbanist", sans-serif' }}>
            {template.overlayText}
          </p>
          <p style={{ position: 'absolute', top: 96, width: '100%', color: template.textColor + '99', fontSize: 13, fontFamily: '"Urbanist", sans-serif' }}>
            {dt}
          </p>
          <p style={{ position: 'absolute', top: 116, width: '100%', color: template.border + 'cc', fontSize: 12, fontWeight: 'bold', fontFamily: '"Urbanist", sans-serif', textTransform: 'uppercase', letterSpacing: 1 }}>
            {template.name}
          </p>
        </div>

        {}
        {stickers.map((s, i) => (
          <img key={i} src={s.src} alt="" className="absolute pointer-events-none select-none"
            style={{ top: s.style.top, left: s.style.left, width: s.style.width, height: s.style.height, objectFit: 'contain', zIndex: 10 }} />
        ))}
      </div>
    </div>
  )
}

export default function TemplatePage({ onSelect, onBack, selectedPhotos, config }) {
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

  const stripH = isMobile ? Math.min(height * 0.65, 480) : Math.min(height * 0.72, 650)
  const stripW = stripH * (600 / 1198)
  const gap = isMobile ? 24 : 40

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

  useEffect(() => {
    const handler = (e) => {
      if (saving) return
      if (e.key === 'ArrowLeft') { e.preventDefault(); setActiveIndex((p) => Math.max(0, p - 1)) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); setActiveIndex((p) => Math.min(TEMPLATES.length - 1, p + 1)) }
      else if (e.key === 'Enter') { e.preventDefault(); handleTemplateClick(activeIndex) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, saving])

  const handleTemplateClick = useCallback((index) => {
    if (saving || isDragging.current) return
    setActiveIndex(index)
    const tmpl = TEMPLATES[index]
    setSaving(true)
    setSavedId(tmpl.id)
    setTimeout(() => onSelect(tmpl), 1200)
  }, [saving, onSelect])

  const onSwipe = (dx) => {
    if (saving) return
    if (dx < 0) setActiveIndex((p) => Math.min(TEMPLATES.length - 1, p + 1))
    else setActiveIndex((p) => Math.max(0, p - 1))
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none">
      {}
      <motion.div
        className="fixed inset-0 -z-20 pointer-events-none"
        animate={{ background: BACKGROUND_THEMES[currentTemplate.id] || 'linear-gradient(160deg, #E8EDF2 0%, #d0d8e2 100%)' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {}
      <div className="absolute inset-0 opacity-5 -z-15 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #2C3947 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {}
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

      {}
      <AnimatePresence>
        {saving && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {}
            <motion.div
              className="absolute inset-0"
              initial={{ backdropFilter: 'blur(0px)', background: 'rgba(0,0,0,0)' }}
              animate={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.5)' }}
              transition={{ duration: 0.5 }}
            />

            {}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-4"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.15 }}
            >
              <StripPreview template={TEMPLATES[activeIndex]} photos={selectedPhotos || []} height={Math.min(stripH * 1.1, height * 0.9)} config={config} />

              {}
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

      {}
      <div className="relative z-10 flex flex-col h-full">

        {}
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
          Geser untuk melihat · Klik langsung pada frame untuk memilih
        </motion.p>

        {}
        <div className="flex-1 flex items-center justify-center px-2 md:px-8 pb-2 min-h-0 relative w-full overflow-hidden">

          {}
          <button onClick={() => !saving && setActiveIndex(p => Math.max(0, p - 1))}
            disabled={activeIndex === 0 || saving}
            className="absolute left-1 md:left-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
            style={{ background: btnBg, border: `1px solid ${btnBorder}`, color: textColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          {}
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
                    onClick={() => { if (!isDragging.current && !saving) handleTemplateClick(i) }}
                    animate={{
                      scale: isActive ? 1 : 0.78,
                      opacity: isActive ? 1 : 0.35,
                      y: isActive ? -8 : 0,
                      rotateY: isActive ? 0 : (i < activeIndex ? 15 : -15),
                    }}
                    transition={{ type: 'spring', stiffness: 250, damping: 28, mass: 0.9 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <StripPreview template={tmpl} photos={selectedPhotos || []} height={stripH} config={config} />
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {}
          <button onClick={() => !saving && setActiveIndex(p => Math.min(TEMPLATES.length - 1, p + 1))}
            disabled={activeIndex === TEMPLATES.length - 1 || saving}
            className="absolute right-1 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
            style={{ background: btnBg, border: `1px solid ${btnBorder}`, color: textColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {}
        <div className="flex flex-col items-center shrink-0 pb-6 pt-1 z-10 w-full px-4">

          {}
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
        </div>
      </div>
    </div>
  )
}