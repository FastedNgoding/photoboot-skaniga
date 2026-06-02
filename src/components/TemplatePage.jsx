import { useState, useRef, useEffect, useCallback } from 'react'
import { TEMPLATES } from '../utils/templates'
import { Rocket, Star, Cat, Heart, Bear, Bolt, ArrowBigLeft, Check } from '@boxicons/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TemplatePage({ onSelect, onBack }) {
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  })
  const isDragging = useRef(false)
  const touchStart = useRef({ x: 0, y: 0, time: 0 })
  const swiped = useRef(false)

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { width, height } = dimensions
  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024

  let cardWidth = 250
  let gap;

  if (isMobile) {
    cardWidth = Math.min(180, width * 0.45)
    gap = 16
  } else if (isTablet) {
    cardWidth = Math.min(220, width * 0.28)
    gap = 20
  } else {
    cardWidth = Math.min(260, height * 0.38)
    gap = 24
  }

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(TEMPLATES.length - 1, prev + 1))
  }

  const handleSelect = useCallback((tmpl) => {
    setSelected(tmpl.id)
    setTimeout(() => onSelect(tmpl), 600)
  }, [onSelect])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selected !== null) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setActiveIndex((prev) => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setActiveIndex((prev) => Math.min(TEMPLATES.length - 1, prev + 1))
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const currentTmpl = TEMPLATES[activeIndex]
        if (currentTmpl) {
          handleSelect(currentTmpl)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, selected, handleSelect])

  const currentTemplate = TEMPLATES[activeIndex] || TEMPLATES[0]

  const isDark = ['astronaut', 'starwars', 'omnom', 'lotso', 'onepiece', 'dragonball'].includes(currentTemplate.id)
  
  const textColor = isDark ? '#F3F4F6' : '#2C3947'
  const subtitleColor = isDark ? '#9CA3AF' : '#5a6a7a'
  const btnBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
  const btnHoverBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
  const btnBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'

  const BACKGROUND_THEMES = {
    hellokitty: 'linear-gradient(135deg, #FFF0F3 0%, #FFE4E6 50%, #FFD1DC 100%)',
    sakura: 'linear-gradient(135deg, #FFF5F6 0%, #FCE4EC 50%, #F8BBD0 100%)',
    astronaut: 'linear-gradient(135deg, #040612 0%, #0b0f2a 50%, #03040a 100%)',
    starwars: 'linear-gradient(135deg, #010101 0%, #0a0910 50%, #010101 100%)',
    omnom: 'linear-gradient(135deg, #050010 0%, #0e001a 50%, #020006 100%)',
    lotso: 'linear-gradient(135deg, #2b0617 0%, #3d0b21 50%, #17020c 100%)',
    dragonball: 'linear-gradient(135deg, #361000 0%, #521800 50%, #1f0a00 100%)',
    onepiece: 'linear-gradient(135deg, #001624 0%, #00263d 50%, #000e17 100%)'
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
    },
    dragonball: {
      bg: 'linear-gradient(160deg, #bf360c 0%, #e65100 50%, #ff6f00 100%)',
      accent: '#ffcc02',
      Icon: Bolt,
      Deco: Star,
      slotBg: 'rgba(255,204,2,0.12)',
      slotBorder: '#ffa000',
      title: 'DRAGON BALL',
      subtitle: 'Power Up!',
      font: '"Bebas Neue", sans-serif'
    },
    onepiece: {
      bg: 'linear-gradient(160deg, #003c5f 0%, #01579b 50%, #0277bd 100%)',
      accent: '#e53935',
      Icon: Rocket,
      Deco: Star,
      slotBg: 'rgba(229,57,53,0.12)',
      slotBorder: '#e53935',
      title: 'ONE PIECE',
      subtitle: 'Set Sail!',
      font: '"Bebas Neue", sans-serif'
    },
    sakura: {
      bg: 'linear-gradient(160deg, #fce4ec 0%, #f8bbd0 50%, #f48fb1 100%)',
      accent: '#e91e63',
      Icon: Heart,
      Deco: Heart,
      slotBg: 'rgba(233,30,99,0.1)',
      slotBorder: '#e91e63',
      title: 'SAKURA',
      subtitle: 'Hanami',
      font: '"Playfair Display", serif'
    },
    omnom: {
      bg: 'linear-gradient(160deg, #0d0026 0%, #1a0033 50%, #2d004d 100%)',
      accent: '#00e676',
      Icon: Bolt,
      Deco: Star,
      slotBg: 'rgba(0,230,118,0.1)',
      slotBorder: '#00e676',
      title: 'OM NOM MOSTER',
      subtitle: 'Monster Green',
      font: '"Bebas Neue", sans-serif'
    }
  }

  const renderPreview = (tmpl) => {
    const p = THEME_PREVIEW[tmpl.id]
    const MainIcon = p.Icon
    
    const emoji1 = tmpl.decorations?.[0] || '✨'
    const emoji2 = tmpl.decorations?.[2] || '✨'

    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3 relative overflow-hidden select-none"
        style={{ background: p.bg }}>
        
        <div className="absolute top-2 left-2 text-sm select-none pointer-events-none animate-float opacity-80">
          {emoji1}
        </div>
        <div className="absolute bottom-12 right-2 text-sm select-none pointer-events-none animate-float opacity-80" style={{ animationDelay: '1s' }}>
          {emoji2}
        </div>

        <div className="absolute top-2 right-2" style={{ opacity: 0.6 }}>
          <MainIcon size="18" color={p.accent} />
        </div>
        
        {[0, 1, 2].map(i => (
          <div key={i} className="w-full rounded-lg relative overflow-hidden flex items-center justify-center"
            style={{ height: Math.floor(cardWidth * 0.32), background: p.slotBg, border: `1.5px solid ${p.slotBorder}` }}>
            
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 select-none">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
        ))}
        
        <div className="text-center mt-1 select-none">
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
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none">
      
      <motion.div
        className="fixed inset-0 -z-20 pointer-events-none"
        animate={{
          background: BACKGROUND_THEMES[currentTemplate.id] || 'linear-gradient(160deg, #E8EDF2 0%, #d0d8e2 100%)'
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 opacity-5 -z-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #2C3947 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full filter blur-[90px] md:blur-[130px] opacity-35"
          style={{ top: '15%', left: '15%' }}
          animate={{
            backgroundColor: currentTemplate.border,
          }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full filter blur-[90px] md:blur-[130px] opacity-30"
          style={{ bottom: '15%', right: '15%' }}
          animate={{
            backgroundColor: currentTemplate.accent || currentTemplate.border,
          }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        
        <div className="flex items-center justify-between px-10 md:px-16 lg:px-24 pt-8 pb-3 shrink-0">
          <motion.button 
            onClick={onBack}
            className="flex items-center justify-center gap-2 rounded-full !px-2 !py-1 !mt-2 !ml-2 transition-all hover:scale-105 active:scale-95 cursor-pointer font-bold text-sm backdrop-blur-md shadow-md"
            style={{ 
              background: btnBg, 
              color: textColor,
              border: `1px solid ${btnBorder}`
            }}
            whileHover={{ backgroundColor: btnHoverBg }}
          >
            <ArrowBigLeft size="20" />
            <span>Kembali</span>
          </motion.button>
          
          <div className="text-center py-2">
            <motion.span 
              className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase"
              animate={{ color: textColor }}
              transition={{ duration: 0.5 }}
            >
              PILIH FRAME
            </motion.span>
            <motion.div 
              className="h-[3px] w-12 mx-auto mt-1 rounded-full" 
              animate={{ background: currentTemplate.border }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="w-24" />
        </div>

        <div className="text-center pb-3 shrink-0 px-4">
          <motion.p 
            className="text-xs md:text-sm font-medium transition-colors"
            animate={{ color: subtitleColor }}
          >
            Setiap frame berisi <strong className="font-bold">3 foto</strong> yang akan digabung jadi satu strip
          </motion.p>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 md:px-12 pb-4 min-h-0 relative w-full overflow-hidden select-none">
          
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="absolute left-2 md:left-8 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
            style={{ 
              background: btnBg,
              border: `1px solid ${btnBorder}`,
              color: textColor,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <div className="w-full h-full relative flex items-center overflow-visible"
            style={{ perspective: '1200px' }}
          >
            <motion.div
              className="flex absolute"
              style={{
                gap: gap,
                transformStyle: 'preserve-3d',
                left: `calc(50% - ${cardWidth / 2}px)`,
              }}
              onTouchStart={(e) => {
                const touch = e.touches[0]
                touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() }
                swiped.current = false
                isDragging.current = false
              }}
              onTouchEnd={(e) => {
                if (swiped.current) return
                const touch = e.changedTouches[0]
                const dx = touch.clientX - touchStart.current.x
                const dy = touch.clientY - touchStart.current.y
                const dt = Date.now() - touchStart.current.time
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
                  isDragging.current = true
                  setTimeout(() => { isDragging.current = false }, 200)
                  if (dx < 0) {
                    setActiveIndex((prev) => Math.min(TEMPLATES.length - 1, prev + 1))
                  } else {
                    setActiveIndex((prev) => Math.max(0, prev - 1))
                  }
                  swiped.current = true
                }
              }}
              onTouchMove={(e) => {
                if (swiped.current) return
                const touch = e.touches[0]
                const dx = touch.clientX - touchStart.current.x
                const dy = touch.clientY - touchStart.current.y
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
                  isDragging.current = true
                  if (dx < 0) {
                    setActiveIndex((prev) => Math.min(TEMPLATES.length - 1, prev + 1))
                  } else {
                    setActiveIndex((prev) => Math.max(0, prev - 1))
                  }
                  swiped.current = true
                }
              }}
              onPointerDown={(e) => {
                if (e.pointerType === 'touch') return
                touchStart.current = { x: e.clientX, y: e.clientY, time: Date.now() }
                swiped.current = false
                isDragging.current = false
              }}
              onPointerUp={(e) => {
                if (e.pointerType === 'touch' || swiped.current) return
                const dx = e.clientX - touchStart.current.x
                if (Math.abs(dx) > 30) {
                  isDragging.current = true
                  setTimeout(() => { isDragging.current = false }, 200)
                  if (dx < 0) {
                    setActiveIndex((prev) => Math.min(TEMPLATES.length - 1, prev + 1))
                  } else {
                    setActiveIndex((prev) => Math.max(0, prev - 1))
                  }
                }
              }}
              animate={{
                x: -(activeIndex * (cardWidth + gap))
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
            >
              {TEMPLATES.map((tmpl, i) => {
                const offset = i - activeIndex
                const isActive = offset === 0
                const isHover = hovered === tmpl.id
                const isSelect = selected === tmpl.id
                
                return (
                  <motion.button
                    key={tmpl.id}
                    onClick={(e) => {
                      if (isDragging.current) {
                        e.preventDefault()
                        return
                      }
                      if (!isActive) {
                        setActiveIndex(i)
                      } else {
                        handleSelect(tmpl)
                      }
                    }}
                    onMouseEnter={() => setHovered(tmpl.id)}
                    onMouseLeave={() => setHovered(null)}
                    className="relative rounded-3xl overflow-hidden cursor-pointer shrink-0 outline-none border-none animate-shimmer-border"
                    style={{
                      width: cardWidth,
                      height: cardWidth * 1.5,
                      boxShadow: isActive
                        ? `0 25px 50px -12px ${tmpl.border}80, 0 0 0 4.5px ${tmpl.border}`
                        : '0 8px 32px rgba(0,0,0,0.06)',
                    }}
                    animate={{
                      scale: isActive ? (isHover ? 1.07 : 1.02) : 0.85,
                      opacity: isActive ? 1 : 0.45,
                      y: isActive ? -12 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                      mass: 0.8
                    }}
                  >
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                      {renderPreview(tmpl)}
                    </div>

                    {isSelect && (
                      <div className="absolute inset-0 flex items-center justify-center z-30"
                        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}>
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center animate-bounce-short"
                          style={{ background: tmpl.border }}>
                          <Check size="28" color="#ffffff" />
                        </div>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </motion.div>
          </div>

          <button
            onClick={handleNext}
            disabled={activeIndex === TEMPLATES.length - 1}
            className="absolute right-2 md:right-8 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
            style={{ 
              background: btnBg,
              border: `1px solid ${btnBorder}`,
              color: textColor,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

        </div>

        <div className="flex flex-col items-center justify-center shrink-0 pb-8 pt-2 z-10 w-full max-w-md select-none">
          
          <div className="h-16 flex items-center justify-center w-full mb-3 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTemplate.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <h2 
                  className="text-xl md:text-2xl font-black uppercase tracking-wider mb-0.5 flex items-center justify-center gap-2"
                  style={{ 
                    color: currentTemplate.accent || currentTemplate.border,
                    fontFamily: currentTemplate.font || 'Urbanist, sans-serif',
                    textShadow: isDark ? '0 2px 8px rgba(0,0,0,0.6)' : '0 1px 4px rgba(0,0,0,0.06)'
                  }}
                >
                  <span>{currentTemplate.name}</span>
                  <span className="text-sm md:text-xl">{currentTemplate.emoji}</span>
                </h2>
                <p 
                  className="text-xs italic font-semibold opacity-75"
                  style={{ color: subtitleColor }}
                >
                  "{currentTemplate.tagline}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-1 mb-4 justify-center items-center h-12">
            {TEMPLATES.map((tmpl, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveIndex(idx)}
                  className="cursor-pointer transition-all duration-300 border-none outline-none flex items-center justify-center w-5 h-5 bg-transparent"
                >
                  <div
                    style={{
                      width: isActive ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '9999px',
                      background: isActive ? currentTemplate.border : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </button>
              )
            })}
          </div>

          <motion.p 
            className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-center !mb-1"
            animate={{ color: subtitleColor }}
          >
            SWIPE ATAU TAP KEMBALI KARTU UNTUK MEMILIH
          </motion.p>
        </div>

      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-short {
          animation: bounce-short 1s ease-in-out infinite;
        }
      `}
      </style>
    </div>
  )
}