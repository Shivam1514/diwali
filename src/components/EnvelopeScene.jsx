import React, { useRef, useState } from 'react';

const GARLAND = Array.from({ length: 13 }, (_, i) => i);

export default function EnvelopeScene({ onClick, isOpen }) {
  const [hovered, setHovered] = useState(false);
  const envRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = envRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 13}deg) rotateX(${-y * 10}deg) scale(1.04) translateY(-8px)`;
    el.style.filter = `
      drop-shadow(0 40px 80px rgba(212,160,23,0.5))
      drop-shadow(0 15px 40px rgba(0,0,0,0.85))
    `;
  };

  const handleMouseLeave = () => {
    const el = envRef.current;
    if (el) {
      el.style.transform = '';
      el.style.filter = '';
    }
    setHovered(false);
  };

  if (isOpen) return null;

  return (
    <div className="envelope-container">
      {/* Top diya row */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', pointerEvents: 'none' }}>
        {['🪔', '✨', '🪔', '✨', '🪔', '✨', '🪔'].map((e, i) => (
          <span
            key={i}
            style={{
              fontSize: i % 2 === 0 ? '1.55rem' : '0.9rem',
              display: 'inline-block',
              animation: `diyaGlow ${1.4 + i * 0.18}s ease-in-out infinite ${i * 0.28}s`,
            }}
          >{e}</span>
        ))}
      </div>

      <p className="envelope-hint">
        ✦ Tap the envelope to reveal your invitation ✦
      </p>

      <div className="envelope-wrapper">
        <div
          ref={envRef}
          className="envelope"
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="button"
          aria-label="Open Diwali Invitation Card"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onClick()}
          style={{
            transition: hovered ? 'filter 0.1s ease' : 'transform 0.6s ease, filter 0.4s ease',
          }}
        >
          {/* Garland */}
          <div className="env-garland">
            {GARLAND.map(i => (
              <div key={i} className="garland-dot" style={{ '--d': `${(i * 0.1).toFixed(1)}s` }} />
            ))}
          </div>

          {/* Body */}
          <div className="env-body" />
          <div className="env-border" />

          {/* Folds */}
          <div className="env-left-fold" />
          <div className="env-right-fold" />
          <div className="env-bottom-fold" />
          <div className="env-flap" />

          {/* Wax seal */}
          <div className="env-seal">
            <div className="seal-circle">🪔</div>
          </div>

          {/* Company text */}
          <div className="env-company-text">EzStays · Diwali 2026</div>

          {/* Decorative lotus corners on envelope */}
          {[
            { top: 9, left: 11 },
            { top: 9, right: 11 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', ...pos, fontSize: '1.3rem',
              opacity: 0.7, zIndex: 8, pointerEvents: 'none',
              filter: 'drop-shadow(0 0 6px rgba(255,100,100,0.6))',
            }}>🌸</div>
          ))}
        </div>
      </div>

      {/* Bottom deco row */}
      <div className="env-bottom-deco" style={{ display: 'flex', gap: '10px', pointerEvents: 'none' }}>
        {['🌺', '🪔', '🌸', '🪔', '🌺'].map((e, i) => (
          <span key={i} style={{
            fontSize: i % 2 === 0 ? '1.1rem' : '1.35rem',
            display: 'inline-block',
            animation: `twinkle ${2.2 + i * 0.28}s ease-in-out infinite ${i * 0.22}s`,
          }}>{e}</span>
        ))}
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '0.7rem',
        letterSpacing: '4px',
        color: 'rgba(212,160,23,0.38)',
        textTransform: 'uppercase',
        marginTop: '4px',
      }}>EzStays Corporate · Diwali 2026</div>
    </div>
  );
}
