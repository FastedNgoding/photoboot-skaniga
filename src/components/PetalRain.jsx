import { useMemo } from 'react'

const PETAL_SHAPES = [
  { emoji: '🌸', size: 24 },
  { emoji: '🌺', size: 20 },
  { emoji: '✨', size: 16 },
  { emoji: '⭐', size: 18 },
  { emoji: '🌙', size: 20 },
  { emoji: '💫', size: 22 },
  { emoji: '🦋', size: 26 },
  { emoji: '🌼', size: 22 },
]

export default function PetalRain({ count = 20 }) {
  const pseudoRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const shape = PETAL_SHAPES[i % PETAL_SHAPES.length]
      return {
        id: i,
        ...shape,
        left: `${pseudoRandom(i * 12.34 + 1.23) * 100}%`,
        duration: `${4 + pseudoRandom(i * 23.45 + 2.34) * 6}s`,
        delay: `${pseudoRandom(i * 34.56 + 3.45) * 8}s`,
        drift: `${(pseudoRandom(i * 45.67 + 4.56) - 0.5) * 200}px`,
        opacity: 0.4 + pseudoRandom(i * 56.78 + 5.67) * 0.6,
      }
    })
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map(p => (
        <div
          key={p.id}
          className="petal absolute"
          style={{
            left: p.left,
            top: '-50px',
            fontSize: p.size,
            '--duration': p.duration,
            '--delay': p.delay,
            '--drift': p.drift,
            opacity: p.opacity,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
