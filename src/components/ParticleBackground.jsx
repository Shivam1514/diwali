import React, { useMemo } from 'react';

const STAR_COUNT = 80;
const PARTICLE_COUNT = 18;

const COLORS = [
  'rgba(255, 215, 0, 0.9)',
  'rgba(255, 140, 0, 0.85)',
  'rgba(255, 69, 0, 0.7)',
  'rgba(240, 98, 146, 0.8)',
  'rgba(212, 160, 23, 0.9)',
  'rgba(255, 255, 180, 0.8)',
];

function rand(a, b) { return a + Math.random() * (b - a); }

export default function ParticleBackground() {
  const stars = useMemo(() => Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    left: `${rand(0, 100)}%`,
    top: `${rand(0, 100)}%`,
    size: rand(1.5, 4),
    dur: `${rand(2, 5)}s`,
    delay: `-${rand(0, 5)}s`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  })), []);

  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: `${rand(0, 100)}%`,
    size: rand(4, 9),
    dur: `${rand(9, 18)}s`,
    delay: `-${rand(0, 15)}s`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  })), []);

  return (
    <div className="stars-layer" aria-hidden="true">
      {/* Stars */}
      {stars.map(s => (
        <div
          key={`s${s.id}`}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: `radial-gradient(circle, ${s.color} 0%, transparent 70%)`,
            '--dur': s.dur,
            '--delay': s.delay,
          }}
        />
      ))}

      {/* Rising particles */}
      {particles.map(p => (
        <div
          key={`p${p.id}`}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            '--dur': p.dur,
            '--delay': p.delay,
          }}
        />
      ))}

      {/* Ambient glow orbs */}
      <div style={{
        position: 'absolute', top: '8%', left: '4%',
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,0,0,0.11) 0%, transparent 70%)',
        animation: 'twinkle 7s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '12%', right: '8%',
        width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,160,23,0.09) 0%, transparent 70%)',
        animation: 'twinkle 9s ease-in-out infinite 4s',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '45%', left: '45%',
        transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(100,0,0,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
