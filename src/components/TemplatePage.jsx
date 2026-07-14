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

// Returns CSS clip-path or border-radius for frame shapes
function getFrameStyle(shape, pw, ph) {
  switch (shape) {
    case 'heart':
      return {
        clipPath: `path('M ${pw/2} ${ph*0.85} C ${pw*0.1} ${ph*0.55}, -${pw*0.08} ${ph*0.1}, ${pw/2} ${ph*0.25} C ${pw*1.08} ${ph*0.1}, ${pw*1.08} ${ph*0.55}, ${pw/2} ${ph*0.85} Z')`,
        borderRadius: undefined,
        overflow: 'hidden',
      }
    case 'circle':
      return { borderRadius: '50%', overflow: 'hidden' }
    case 'oval':
      return { borderRadius: '50% / 35%', overflow: 'hidden' }
    case 'diamond':
      return { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', overflow: 'hidden' }
    case 'hexagon':
      return { clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', overflow: 'hidden' }
    case 'star':
      return { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', overflow: 'hidden' }
    case 'cloud':
      return { borderRadius: '40% 40% 30% 30% / 35% 35% 25% 25%', overflow: 'hidden' }
    case 'arch':
      return { borderRadius: '50% 50% 5% 5% / 30% 30% 5% 5%', overflow: 'hidden' }
    case 'wave':
      return { borderRadius: '15% 15% 40% 40% / 10% 10% 25% 25%', overflow: 'hidden' }
    case 'polaroid':
      return { borderRadius: '4px', overflow: 'hidden' }
    default:
      return { borderRadius: '0px', overflow: 'hidden' }
  }
}

// Decorative emojis/shapes scattered on the strip background per template
function TemplateDecoLayer({ templateId, border }) {
  const configs = {
    lovepink: {
      items: ['💗','💕','💝','💖','🌹','✨','💫','🎀','💗','💕'],
      positions: [
        {top:20,left:15,size:28},{top:50,left:540,size:22},{top:200,left:10,size:20},
        {top:250,left:550,size:26},{top:420,left:8,size:24},{top:450,left:548,size:18},
        {top:650,left:20,size:22},{top:680,left:535,size:28},{top:870,left:5,size:20},{top:900,left:552,size:16},
      ]
    },
    bubblegum: {
      items: ['🍬','🍭','🫧','⭐','🌈','✨','🍡','🎠','🍬','🫧'],
      positions: [
        {top:15,left:10,size:26},{top:45,left:545,size:20},{top:200,left:5,size:22},
        {top:240,left:552,size:24},{top:430,left:12,size:20},{top:460,left:544,size:26},
        {top:650,left:8,size:24},{top:690,left:540,size:20},{top:880,left:10,size:22},{top:910,left:550,size:18},
      ]
    },
    vintagefilm: {
      items: ['📸','🎞️','⌛','🗝️','📺','🎬','📷','🌿','📸','🎞️'],
      positions: [
        {top:18,left:12,size:24},{top:48,left:545,size:20},{top:195,left:8,size:22},
        {top:238,left:548,size:20},{top:425,left:10,size:22},{top:458,left:542,size:24},
        {top:648,left:12,size:20},{top:685,left:542,size:22},{top:882,left:8,size:24},{top:905,left:548,size:20},
      ]
    },
    neonnight: {
      items: ['⚡','🌃','💎','🔮','✨','🌙','⭐','🎆','⚡','💎'],
      positions: [
        {top:12,left:8,size:26},{top:42,left:544,size:22},{top:198,left:6,size:24},
        {top:235,left:550,size:20},{top:422,left:8,size:22},{top:455,left:546,size:26},
        {top:646,left:10,size:20},{top:682,left:544,size:24},{top:878,left:6,size:22},{top:908,left:548,size:18},
      ]
    },
    y2k: {
      items: ['💿','🦋','⭐','🌀','📱','💾','🎵','✨','💿','🦋'],
      positions: [
        {top:16,left:14,size:24},{top:46,left:543,size:20},{top:196,left:10,size:22},
        {top:234,left:547,size:24},{top:424,left:12,size:20},{top:456,left:544,size:22},
        {top:644,left:14,size:24},{top:684,left:542,size:20},{top:876,left:10,size:22},{top:906,left:546,size:18},
      ]
    },
    cottagecore: {
      items: ['🌼','🍄','🌿','🦋','🌾','🌻','🍃','🌸','🌼','🌿'],
      positions: [
        {top:14,left:16,size:26},{top:44,left:544,size:22},{top:194,left:12,size:20},
        {top:232,left:548,size:24},{top:422,left:14,size:22},{top:454,left:542,size:20},
        {top:642,left:16,size:24},{top:682,left:540,size:22},{top:874,left:12,size:20},{top:904,left:544,size:18},
      ]
    },
    kiddie: {
      items: ['🎈','🎉','🎊','⭐','🦄','🌈','🎀','🍭','🎈','🎉'],
      positions: [
        {top:10,left:10,size:28},{top:40,left:545,size:24},{top:192,left:6,size:22},
        {top:230,left:549,size:26},{top:420,left:8,size:24},{top:452,left:543,size:28},
        {top:640,left:12,size:22},{top:680,left:541,size:26},{top:872,left:8,size:24},{top:902,left:547,size:20},
      ]
    },
    galaxygirl: {
      items: ['🌌','⭐','💜','🌟','🔮','✨','🌙','💫','🌌','⭐'],
      positions: [
        {top:14,left:8,size:26},{top:44,left:546,size:22},{top:196,left:6,size:24},
        {top:234,left:550,size:20},{top:424,left:8,size:22},{top:456,left:544,size:26},
        {top:644,left:10,size:20},{top:684,left:542,size:24},{top:876,left:6,size:22},{top:906,left:548,size:18},
      ]
    },
    summer: {
      items: ['☀️','🌊','🏄','🌺','🍹','🌴','🐚','🦀','☀️','🌊'],
      positions: [
        {top:16,left:12,size:26},{top:46,left:545,size:22},{top:197,left:8,size:24},
        {top:235,left:549,size:20},{top:425,left:10,size:22},{top:457,left:543,size:26},
        {top:645,left:12,size:20},{top:685,left:541,size:24},{top:877,left:8,size:22},{top:907,left:547,size:18},
      ]
    },
    aesthetic: {
      items: ['🤍','🪷','🌿','☁️','✨','🕊️','🌙','⭐','🤍','🪷'],
      positions: [
        {top:18,left:14,size:24},{top:48,left:544,size:20},{top:198,left:10,size:22},
        {top:236,left:548,size:24},{top:426,left:12,size:20},{top:458,left:542,size:22},
        {top:646,left:14,size:24},{top:686,left:540,size:20},{top:878,left:10,size:22},{top:908,left:546,size:18},
      ]
    },
    matcha: {
      items: ['🍵','🌿','🍃','🎋','🌾','✨','🪴','🌸','🍵','🌿'],
      positions: [
        {top:16,left:12,size:24},{top:46,left:545,size:20},{top:196,left:8,size:22},
        {top:234,left:549,size:24},{top:424,left:10,size:20},{top:456,left:543,size:22},
        {top:644,left:12,size:24},{top:684,left:541,size:20},{top:876,left:8,size:22},{top:906,left:547,size:18},
      ]
    },
  }
  const conf = configs[templateId]
  if (!conf) return null
  return (
    <>
      {conf.items.map((em, i) => {
        const pos = conf.positions[i] || { top: 0, left: 0, size: 20 }
        return (
          <div key={i} className="absolute pointer-events-none select-none"
            style={{ top: pos.top, left: pos.left, fontSize: pos.size, zIndex: 5, opacity: 0.7, lineHeight: 1 }}>
            {em}
          </div>
        )
      })}
    </>
  )
}

// Frame shape overlay / clip for photo slots (CSS-based preview)
function PhotoSlotPreview({ photo, shape, border, index }) {
  const pw = 528
  const ph = 320

  // For heart shape we use SVG clip-path
  if (shape === 'heart') {
    const id = `heart-clip-${index}`
    return (
      <div className="absolute" style={{ width: pw, height: ph, overflow: 'visible' }}>
        <svg width={pw} height={ph} style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <clipPath id={id}>
              <path d={`M ${pw/2} ${ph*0.85} C ${pw*0.12} ${ph*0.55}, -${pw*0.05} ${ph*0.1}, ${pw/2} ${ph*0.27} C ${pw*1.05} ${ph*0.1}, ${pw*1.12} ${ph*0.55}, ${pw/2} ${ph*0.85} Z`} />
            </clipPath>
          </defs>
          {photo ? (
            <image href={photo} x="0" y="0" width={pw} height={ph} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id})`} style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }} />
          ) : (
            <rect x="0" y="0" width={pw} height={ph} fill={border + '22'} clipPath={`url(#${id})`} />
          )}
          <path
            d={`M ${pw/2} ${ph*0.85} C ${pw*0.12} ${ph*0.55}, -${pw*0.05} ${ph*0.1}, ${pw/2} ${ph*0.27} C ${pw*1.05} ${ph*0.1}, ${pw*1.12} ${ph*0.55}, ${pw/2} ${ph*0.85} Z`}
            fill="none" stroke={border + '99'} strokeWidth="4"
          />
        </svg>
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
          {index + 1}/3
        </div>
      </div>
    )
  }

  if (shape === 'circle') {
    return (
      <div className="absolute overflow-hidden" style={{ width: ph, height: ph, left: (pw - ph) / 2, borderRadius: '50%', background: border + '22' }}>
        {photo && <img src={photo} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
        <div className="absolute" style={{ inset: 0, borderRadius: '50%', border: `4px solid ${border}77` }} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
          {index + 1}/3
        </div>
      </div>
    )
  }

  if (shape === 'oval') {
    return (
      <div className="absolute overflow-hidden" style={{ width: pw, height: ph, borderRadius: '50% / 35%', background: border + '22' }}>
        {photo && <img src={photo} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
        <div className="absolute" style={{ inset: 0, borderRadius: '50% / 35%', border: `4px solid ${border}77` }} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
          {index + 1}/3
        </div>
      </div>
    )
  }

  if (shape === 'diamond') {
    return (
      <div className="absolute" style={{ width: pw, height: ph, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', background: border + '22', overflow: 'hidden' }}>
        {photo && <img src={photo} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
          {index + 1}/3
        </div>
      </div>
    )
  }

  if (shape === 'hexagon') {
    return (
      <div className="absolute" style={{ width: pw, height: ph, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', background: border + '22', overflow: 'hidden' }}>
        {photo && <img src={photo} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
          {index + 1}/3
        </div>
      </div>
    )
  }

  if (shape === 'star') {
    return (
      <div className="absolute" style={{ width: pw, height: ph, clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', background: border + '22', overflow: 'hidden' }}>
        {photo && <img src={photo} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
          {index + 1}/3
        </div>
      </div>
    )
  }

  if (shape === 'cloud') {
    return (
      <div className="absolute overflow-hidden" style={{ width: pw, height: ph, borderRadius: '40% 40% 30% 30% / 35% 35% 25% 25%', background: border + '22' }}>
        {photo && <img src={photo} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
        <div className="absolute" style={{ inset: 0, borderRadius: '40% 40% 30% 30% / 35% 35% 25% 25%', border: `4px solid ${border}77` }} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
          {index + 1}/3
        </div>
      </div>
    )
  }

  if (shape === 'arch') {
    return (
      <div className="absolute overflow-hidden" style={{ width: pw, height: ph, borderRadius: '50% 50% 5% 5% / 30% 30% 5% 5%', background: border + '22' }}>
        {photo && <img src={photo} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
        <div className="absolute" style={{ inset: 0, borderRadius: '50% 50% 5% 5% / 30% 30% 5% 5%', border: `4px solid ${border}77` }} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
          {index + 1}/3
        </div>
      </div>
    )
  }

  if (shape === 'wave') {
    return (
      <div className="absolute overflow-hidden" style={{ width: pw, height: ph, borderRadius: '15% 15% 40% 40% / 10% 10% 25% 25%', background: border + '22' }}>
        {photo && <img src={photo} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
        <div className="absolute" style={{ inset: 0, borderRadius: '15% 15% 40% 40% / 10% 10% 25% 25%', border: `4px solid ${border}77` }} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
          {index + 1}/3
        </div>
      </div>
    )
  }

  if (shape === 'polaroid') {
    // Polaroid: photo with white border bottom + tick mark
    return (
      <div className="absolute" style={{ width: pw, height: ph + 30, background: '#fff', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
        <div className="overflow-hidden" style={{ width: pw, height: ph, background: border + '22', borderRadius: '4px 4px 0 0' }}>
          {photo && <img src={photo} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
        </div>
        <div style={{ textAlign: 'center', paddingTop: 6, fontSize: 11, fontFamily: '"Urbanist", sans-serif', color: '#888', letterSpacing: 1 }}>
          {index + 1} / 3
        </div>
      </div>
    )
  }

  // Default rect
  return (
    <div className="absolute overflow-hidden" style={{ width: pw, height: ph, background: border + '11', borderRadius: '4px' }}>
      {photo && <img src={photo} alt="" className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />}
      <div className="absolute border" style={{ inset: 0, borderWidth: 4, borderColor: border + '77' }} />
      <div className="absolute" style={{ bottom: 12, right: 12, width: 42, height: 24, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: '"Urbanist", sans-serif' }}>{index + 1}/3</span>
      </div>
    </div>
  )
}

// Background pattern per template
function BgPattern({ templateId, border }) {
  const patterns = {
    lovepink: { type: 'hearts', color: border },
    bubblegum: { type: 'circles', color: border },
    vintagefilm: { type: 'film', color: border },
    neonnight: { type: 'grid', color: border },
    y2k: { type: 'dots', color: border },
    cottagecore: { type: 'leaf', color: border },
    kiddie: { type: 'zigzag', color: border },
    galaxygirl: { type: 'stars', color: border },
    summer: { type: 'waves', color: border },
    aesthetic: { type: 'minimal', color: border },
    matcha: { type: 'bamboo', color: border },
  }
  const p = patterns[templateId]
  if (!p) return null

  // Render pattern using SVG background patterns
  const svgPatterns = {
    hearts: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><text x='8' y='30' font-size='20' opacity='0.15'>❤</text></svg>`,
    circles: `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><circle cx='15' cy='15' r='8' fill='none' stroke='${border}' stroke-width='1.5' opacity='0.12'/></svg>`,
    film: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='60'><rect x='0' y='0' width='40' height='60' fill='none' stroke='${border}' stroke-width='0.5' opacity='0.1'/><rect x='4' y='4' width='10' height='8' fill='${border}' opacity='0.1'/><rect x='4' y='24' width='10' height='8' fill='${border}' opacity='0.1'/><rect x='4' y='44' width='10' height='8' fill='${border}' opacity='0.1'/><rect x='26' y='4' width='10' height='8' fill='${border}' opacity='0.1'/><rect x='26' y='24' width='10' height='8' fill='${border}' opacity='0.1'/><rect x='26' y='44' width='10' height='8' fill='${border}' opacity='0.1'/></svg>`,
    grid: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><line x1='0' y1='0' x2='0' y2='40' stroke='${border}' stroke-width='0.5' opacity='0.15'/><line x1='0' y1='0' x2='40' y2='0' stroke='${border}' stroke-width='0.5' opacity='0.15'/></svg>`,
    dots: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='10' cy='10' r='2' fill='${border}' opacity='0.2'/></svg>`,
    stars: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><polygon points='20,4 24,14 35,14 26,21 29,32 20,26 11,32 14,21 5,14 16,14' fill='${border}' opacity='0.1'/></svg>`,
    waves: `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='20'><path d='M0,10 Q15,0 30,10 Q45,20 60,10' stroke='${border}' stroke-width='1.5' fill='none' opacity='0.15'/></svg>`,
    minimal: `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><circle cx='30' cy='30' r='25' fill='none' stroke='${border}' stroke-width='0.5' opacity='0.08'/></svg>`,
    leaf: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><ellipse cx='20' cy='20' rx='8' ry='15' fill='${border}' opacity='0.1' transform='rotate(30 20 20)'/></svg>`,
    zigzag: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='20'><polyline points='0,10 10,0 20,10 30,0 40,10' stroke='${border}' stroke-width='1.5' fill='none' opacity='0.15'/></svg>`,
    bamboo: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='40'><rect x='8' y='0' width='4' height='38' fill='${border}' opacity='0.1'/><line x1='8' y1='10' x2='12' y2='10' stroke='${border}' stroke-width='1' opacity='0.2'/><line x1='8' y1='25' x2='12' y2='25' stroke='${border}' stroke-width='1' opacity='0.2'/></svg>`,
  }

  const svg = svgPatterns[p.type]
  if (!svg) return null
  const encoded = `data:image/svg+xml,${encodeURIComponent(svg)}`

  return (
    <div className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: `url("${encoded}")`, backgroundRepeat: 'repeat', zIndex: 1 }} />
  )
}

function StripPreview({ template, photos, height, config }) {
  const [c1, c2] = extractColors(template.stripBg)
  const stickers = STICKERS[template.id] || []
  const dt = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  const bf = template.font?.includes('Bebas') ? '"Bebas Neue", sans-serif' : '"Playfair Display", serif'
  const shape = template.frameShape || 'rect'

  const ORIG_W = 600;
  const ORIG_H = 1198;
  const scale = height / ORIG_H;
  const renderW = ORIG_W * scale;

  // Photo slot layout depending on shape
  const slots = [0, 1, 2].map(i => {
    const x = 36;
    const baseY = 36 + i * (320 + 18);
    const pw = 528;
    const ph = 320;
    return { x, y: baseY, pw, ph }
  })

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
        className="absolute top-0 left-0"
        style={{
          width: ORIG_W,
          height: ORIG_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          background: `linear-gradient(180deg, ${c1} 0%, ${c2} 50%, ${c1} 100%)`,
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <BgPattern templateId={template.id} border={template.border} />

        {/* Border frames */}
        <div className="absolute border" style={{ top: 0, left: 0, width: 600, height: 1198, borderWidth: 8, borderColor: template.border, zIndex: 20 }} />
        <div className="absolute border" style={{ top: 12, left: 12, width: 576, height: 1174, borderWidth: 2, borderColor: template.border + '33', zIndex: 20 }} />

        {/* Photo slots with shape */}
        {slots.map((slot, i) => (
          <div key={i} className="absolute" style={{ top: slot.y, left: slot.x, width: slot.pw, height: slot.ph, zIndex: 10 }}>
            <PhotoSlotPreview
              photo={photos[i]}
              shape={shape}
              border={template.border}
              index={i}
            />
          </div>
        ))}

        {/* Floating deco emojis for new templates */}
        <TemplateDecoLayer templateId={template.id} border={template.border} />

        {/* Footer watermark */}
        <div className="absolute w-full text-center" style={{ top: 1068, zIndex: 15 }}>
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

        {/* Classic stickers for original templates */}
        {stickers.map((s, i) => (
          <img key={i} src={s.src} alt="" className="absolute pointer-events-none select-none"
            style={{ top: s.style.top, left: s.style.left, width: s.style.width, height: s.style.height, objectFit: 'contain', zIndex: 18 }} />
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
  const isDark = ['astronaut', 'starwars', 'omnom', 'lotso', 'onepiece', 'dragonball', 'neonnight', 'galaxygirl', 'matcha'].includes(currentTemplate.id)
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
    lovepink: 'linear-gradient(135deg, #ff758c 0%, #ff4d6d 50%, #ff2052 100%)',
    bubblegum: 'linear-gradient(135deg, #f5d0fe 0%, #e879f9 50%, #d946ef 100%)',
    vintagefilm: 'linear-gradient(135deg, #5c3d28 0%, #a0714f 50%, #5c3d28 100%)',
    neonnight: 'linear-gradient(135deg, #020024 0%, #050550 50%, #020024 100%)',
    y2k: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #eff6ff 100%)',
    cottagecore: 'linear-gradient(135deg, #f5ebe0 0%, #edcfab 50%, #f5ebe0 100%)',
    kiddie: 'linear-gradient(135deg, #fef08a 0%, #fde047 50%, #fef9c3 100%)',
    galaxygirl: 'linear-gradient(135deg, #1a0540 0%, #2e1065 50%, #1a0540 100%)',
    summer: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fdba74 100%)',
    aesthetic: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #e5e7eb 100%)',
    matcha: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)',
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
      {/* Animated background */}
      <motion.div
        className="fixed inset-0 -z-20 pointer-events-none"
        animate={{ background: BACKGROUND_THEMES[currentTemplate.id] || 'linear-gradient(160deg, #E8EDF2 0%, #d0d8e2 100%)' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-5 -z-15 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #2C3947 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Glow orbs */}
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

      {/* Save overlay */}
      <AnimatePresence>
        {saving && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ backdropFilter: 'blur(0px)', background: 'rgba(0,0,0,0)' }}
              animate={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.5)' }}
              transition={{ duration: 0.5 }}
            />

            <motion.div
              className="relative z-10 flex flex-col items-center gap-4"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.15 }}
            >
              <StripPreview template={TEMPLATES[activeIndex]} photos={selectedPhotos || []} height={Math.min(stripH * 1.1, height * 0.9)} config={config} />

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

      {/* Main content */}
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
          Geser untuk melihat · Klik langsung pada frame untuk memilih
        </motion.p>

        {/* Template carousel */}
        <div className="flex-1 flex items-center justify-center px-2 md:px-8 pb-2 min-h-0 relative w-full overflow-hidden">

          {/* Left arrow */}
          <button onClick={() => !saving && setActiveIndex(p => Math.max(0, p - 1))}
            disabled={activeIndex === 0 || saving}
            className="absolute left-1 md:left-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
            style={{ background: btnBg, border: `1px solid ${btnBorder}`, color: textColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          {/* Scrollable strip row */}
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
                    {/* Template label badge */}
                    {isActive && (
                      <motion.div
                        className="mt-2 text-center"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <span style={{
                          background: tmpl.border,
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 'bold',
                          letterSpacing: 1,
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontFamily: '"Urbanist", sans-serif',
                          textTransform: 'uppercase',
                          boxShadow: `0 4px 12px ${tmpl.border}66`
                        }}>
                          {tmpl.emoji} {tmpl.name}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Right arrow */}
          <button onClick={() => !saving && setActiveIndex(p => Math.min(TEMPLATES.length - 1, p + 1))}
            disabled={activeIndex === TEMPLATES.length - 1 || saving}
            className="absolute right-1 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed"
            style={{ background: btnBg, border: `1px solid ${btnBorder}`, color: textColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* Dots pagination */}
        <div className="flex flex-col items-center shrink-0 pb-6 pt-1 z-10 w-full px-4">
          <div className="flex gap-1 mb-3 justify-center items-center flex-wrap max-w-xs">
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
          <motion.p className="text-xs opacity-60"
            animate={{ color: subtitleColor }}
            style={{ fontFamily: '"Urbanist", sans-serif' }}>
            {activeIndex + 1} / {TEMPLATES.length} — {currentTemplate.tagline}
          </motion.p>
        </div>
      </div>
    </div>
  )
}