import React, { useRef, useState } from 'react';

export default function EnvelopeScene({ onClick, isOpen }) {
  const [hovered, setHovered] = useState(false);
  const envRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = envRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale(1.03) translateY(-6px)`;
    el.style.filter = `
      drop-shadow(0 35px 75px rgba(255, 200, 0, 0.35))
      drop-shadow(0 15px 40px rgba(0, 0, 0, 0.9))
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
      {/* Sleek Minimalist Gen-Z VIP Pill */}
      <div className="env-pill-badge">
        <span className="env-badge-dot" />
        <span>VIP PASS // DIWALI 2026</span>
        <span className="env-badge-spark">✨</span>
      </div>

      {/* Catchy Minimalist Cue */}
      <p className="envelope-hint">
        TAP TO REVEAL ✨
      </p>

      <div className="envelope-wrapper">
        <div
          ref={envRef}
          className="envelope royal-envelope"
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="button"
          aria-label="Open Diwali Invitation Pass"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onClick()}
          style={{
            transition: hovered ? 'filter 0.1s ease' : 'transform 0.6s ease, filter 0.4s ease',
          }}
        >
          {/* Subtle Royal Texture & Guilloche Lines */}
          <div className="env-body" />
          <div className="env-border" />
          <div className="env-corner-accent tl" />
          <div className="env-corner-accent tr" />
          <div className="env-corner-accent bl" />
          <div className="env-corner-accent br" />

          {/* Precision 3D Folds */}
          <div className="env-left-fold" />
          <div className="env-right-fold" />
          <div className="env-bottom-fold" />
          <div className="env-flap" />

          {/* Catchy Firecracker Wax Stamp */}
          <div className="env-seal">
            <div className="seal-circle firecracker-seal">
              <span className="seal-firecracker-icon" role="img" aria-label="Firecracker">🎆</span>
              <div className="seal-spark-ring" />
              <div className="seal-glint" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
