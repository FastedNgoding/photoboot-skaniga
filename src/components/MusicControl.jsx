import { useState } from 'react'

export default function MusicControl({ isPlaying, toggle, volume, setVolume, tracks }) {
  const [showVolume, setShowVolume] = useState(false)

  if (tracks.length === 0) return null

  return (
    <div className="fixed !bottom-6 !right-6 z-50 flex flex-col items-end !gap-2">
      {showVolume && (
        <div className="glass-dark rounded-2xl !p-3 flex flex-col items-center !gap-2 animate-slide-up">
          <span className="text-xs text-[var(--cream)] opacity-70 font-body">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="h-18 accent-[var(--gold)]"
            style={{ writingMode: 'horizontal-tb', direction: 'ltr', transform: 'rotate(-90deg)', width: '80px', cursor: 'pointer' }}
          />
        </div>
      )}
      <div className="flex !gap-2 items-center">
        <button
          onClick={() => setShowVolume(v => !v)}
          className="!w-10 !h-10 glass-dark rounded-full flex !items-center justify-center text-[var(--gold)] hover:scale-110 transition-transform"
        >
          🎚️
        </button>
        <button
          onClick={toggle}
          className="!w-12 !h-12 glass-dark rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform animate-pulse-glow"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>
    </div>
  )
}
