import React, { useRef, useState, useEffect } from 'react';

/* ── 3D Interactive Tilt on Hover ─────────────── */
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 4}deg) scale3d(1.005, 1.005, 1.005)`;
    };
    const onLeave = () => {
      el.style.transform = 'rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);
}

/* ── Real Temple Bell Sound Engine ───────────── */
function playTempleBell() {
  try {
    const audio = new Audio('/temple_bell.wav');
    audio.volume = 0.9;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        playSynthesizedTempleBell();
      });
    }
  } catch {
    playSynthesizedTempleBell();
  }
}

function playSynthesizedTempleBell() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const f0 = 587.33; // D5 brass bell fundamental

    // Authentic brass temple bell partials with acoustic beating and long decay
    const partials = [
      { freq: f0 * 0.5, gain: 0.25, decay: 2.8 },    // Hum tone
      { freq: f0, gain: 0.45, decay: 2.5 },          // Fundamental
      { freq: f0 + 1.6, gain: 0.32, decay: 2.5 },    // Beating pair (iconic acoustic pulsation)
      { freq: f0 * 1.183, gain: 0.26, decay: 1.8 },  // Tierce (minor third)
      { freq: f0 * 1.506, gain: 0.22, decay: 1.5 },  // Quint (fifth)
      { freq: f0 * 2.0, gain: 0.18, decay: 1.2 },    // Nominal (octave)
      { freq: f0 * 2.514, gain: 0.12, decay: 0.8 },  // Decime
      { freq: f0 * 4.01, gain: 0.08, decay: 0.4 },   // Superoctave
      { freq: f0 * 5.42, gain: 0.06, decay: 0.25 },  // Metallic sheen
    ];

    partials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(gain, now + 0.003); // Instant sharp strike
      g.gain.exponentialRampToValueAtTime(0.00001, now + decay);

      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + decay + 0.05);
    });
  } catch {
    // Audio fallback
  }
}

/* ── Audio Chime Generator ───────────────────── */
function playFestiveChime(type = 'bell') {
  if (type === 'deep-bell') {
    playTempleBell();
    return;
  }
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.4);
    });
  } catch {
    // Audio fallback
  }
}

/* ── Celebration Sparkles Burst ──────────────── */
function triggerSparkles(x, y) {
  const count = 38;
  const colors = ['#FFD700', '#F5C842', '#FFA500', '#FDE68A', '#FFB703', '#FFFFFF', '#00F5D4'];
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (i / count) * 360 + (Math.random() * 20 - 10);
    const dist = 70 + Math.random() * 120;
    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * dist;
    const ty = Math.sin(rad) * dist;
    const size = 4 + Math.random() * 6;

    spark.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      box-shadow: 0 0 10px ${color};
      transition: transform 0.85s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.85s ease;
      transform: translate(0, 0) scale(1);
      opacity: 1;
    `;
    document.body.appendChild(spark);

    requestAnimationFrame(() => {
      spark.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      spark.style.opacity = '0';
    });

    setTimeout(() => spark.remove(), 900);
  }
}

/* ── Dynamic Hanging Lamp Component ─────────── */
function DynamicHangingLamp({ length = 55, delay = 0, swayDir = 'left', onLampClick }) {
  return (
    <div
      className={`dynamic-lamp sway-${swayDir}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onLampClick}
      title="Click to ring festive bell"
    >
      <div className="lamp-chain" style={{ height: `${length}px` }}>
        {Array.from({ length: Math.floor(length / 7) }).map((_, i) => (
          <span key={i} className="chain-link" />
        ))}
      </div>

      <div className="lamp-head">
        <div className="live-flame" style={{ animationDelay: `${(delay * 0.7).toFixed(2)}s` }}>
          <div className="flame-inner" />
          <div className="flame-glow" />
        </div>

        <svg className="lamp-bowl" viewBox="0 0 40 22" width="34" height="19">
          <defs>
            <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A7" />
              <stop offset="45%" stopColor="#D4A017" />
              <stop offset="100%" stopColor="#8A6000" />
            </linearGradient>
          </defs>
          <path
            d="M3 4 Q20 -1 37 4 L32 17 Q20 21 8 17 Z"
            fill="url(#brassGrad)"
            stroke="#FFE68A"
            strokeWidth="0.8"
          />
          <line x1="8" y1="8" x2="32" y2="8" stroke="#FFE68A" strokeWidth="0.7" strokeDasharray="1.5,1.5" />
          <line x1="11" y1="12" x2="29" y2="12" stroke="#FFE68A" strokeWidth="0.7" strokeDasharray="1.5,1.5" />
          <circle cx="20" cy="16" r="1.5" fill="#FFE68A" />
        </svg>
      </div>
    </div>
  );
}

/* ── Event Details ───────────────────────────── */
const DETAILS = [
  {
    icon: '📅',
    tag: 'DATE',
    title: 'Thursday, 5th Nov 2026',
    desc: 'Diwali Celebration Day',
  },
  {
    icon: '⏰',
    tag: 'TIMINGS',
    title: '10:30 AM Onwards',
    desc: 'Full Day Event',
  },
  {
    icon: '📍',
    tag: 'VENUE',
    title: 'EzStays Corporate Office',
    desc: 'Sector 18, Noida',
  },
  {
    icon: '👗',
    tag: 'DRESS CODE',
    title: 'Festive / Ethnic Chic',
    desc: 'Traditional Indian Attire',
  },
];

/* ── Gen-Z Minimalist Lineup Headings ─────────── */
const ITINERARY_HEADINGS = [
  { icon: '🪔', title: 'Puja & Aarti' },
  { icon: '🍽️', title: 'Royal Festive Lunch' },
  { icon: '🎯', title: 'Games & Team Shenanigans' },
  { icon: '✨', title: 'Mega Surprises' },
];

/* ── Bottom Live Diyas Array ─────────────────── */
const BOTTOM_DIYAS = Array.from({ length: 13 }, (_, i) => ({
  id: i,
  delay: (i * 0.14).toFixed(2),
}));

export default function InvitationCard({ onClose, onCelebrate }) {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  const [toast, setToast] = useState('');
  useTilt(cardRef);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleCelebrate = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    playFestiveChime('bell');
    triggerSparkles(cx, cy);
    showToast('🎆 Launching Grand Ramayana Drone & Fireworks Show! 🪔');
    if (onCelebrate) {
      setTimeout(() => onCelebrate(), 450);
    }
  };

  const handleDiyaClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top;
    playFestiveChime('bell');
    triggerSparkles(cx, cy);
  };

  const handleLampClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.bottom;
    playFestiveChime('deep-bell');
    triggerSparkles(cx, cy);
    showToast('🔔 Temple Bell Chime 🪔');
  };

  return (
    <div className="card-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      {/* Toast Notification */}
      {toast && <div className="toast-pill">{toast}</div>}

      {/* Close Button */}
      <button className="close-btn" onClick={onClose} aria-label="Close card">
        ✕
      </button>

      <div className="card-scene">
        <div className="invitation-card" ref={cardRef}>
          <div className="card-inner">

            {/* Deep Royal Midnight Blue & Gold Texture Backdrop */}
            <div className="card-theme-bg" />

            {/* ══════════ DYNAMIC UPPER DECORATION ══════════ */}
            <div className="upper-decoration-container">
              {/* Left Swaying Hanging Lamps */}
              <div className="hanging-group left-group">
                <DynamicHangingLamp length={54} delay={0} swayDir="left" onLampClick={handleLampClick} />
                <DynamicHangingLamp length={34} delay={0.6} swayDir="right" onLampClick={handleLampClick} />
                <DynamicHangingLamp length={46} delay={1.2} swayDir="left" onLampClick={handleLampClick} />
              </div>

              {/* Central Radiating Golden Mandala */}
              <div className="top-mandala-wrap">
                <svg className="top-mandala" viewBox="0 0 240 100">
                  <defs>
                    <linearGradient id="mandalaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFF2A7" />
                      <stop offset="50%" stopColor="#F5C842" />
                      <stop offset="100%" stopColor="#D4A017" />
                    </linearGradient>
                  </defs>
                  <path d="M20 0 A100 100 0 0 0 220 0" fill="none" stroke="url(#mandalaGrad)" strokeWidth="1.5" />
                  <path d="M38 0 A82 82 0 0 0 202 0" fill="none" stroke="url(#mandalaGrad)" strokeWidth="1" strokeDasharray="3,3" />
                  <path d="M55 0 A65 65 0 0 0 185 0" fill="none" stroke="url(#mandalaGrad)" strokeWidth="1.2" />
                  <path d="M72 0 A48 48 0 0 0 168 0" fill="none" stroke="url(#mandalaGrad)" strokeWidth="1" strokeDasharray="2,2" />
                  
                  {Array.from({ length: 13 }).map((_, idx) => {
                    const angle = (idx + 1) * (180 / 14);
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 120 - Math.cos(rad) * 55;
                    const y1 = Math.sin(rad) * 55;
                    const x2 = 120 - Math.cos(rad) * 85;
                    const y2 = Math.sin(rad) * 85;
                    return (
                      <g key={idx}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#mandalaGrad)" strokeWidth="0.9" />
                        <circle cx={x2} cy={y2} r="2" fill="#FFD700" />
                      </g>
                    );
                  })}
                  <circle cx="120" cy="0" r="24" fill="rgba(255,215,0,0.12)" stroke="url(#mandalaGrad)" strokeWidth="1.2" />
                </svg>
                <div className="mandala-ambient-glow" />
              </div>

              {/* Right Swaying Hanging Lamps */}
              <div className="hanging-group right-group">
                <DynamicHangingLamp length={46} delay={0.4} swayDir="right" onLampClick={handleLampClick} />
                <DynamicHangingLamp length={34} delay={0.9} swayDir="left" onLampClick={handleLampClick} />
                <DynamicHangingLamp length={54} delay={1.4} swayDir="right" onLampClick={handleLampClick} />
              </div>
            </div>

            {/* Draped Floral Toran / Golden Garland */}
            <div className="festive-toran-bar">
              <div className="toran-garland-svg-wrap">
                <svg viewBox="0 0 800 24" preserveAspectRatio="none" className="toran-svg">
                  <path
                    d="M0,4 Q100,20 200,4 Q300,20 400,4 Q500,20 600,4 Q700,20 800,4"
                    fill="none"
                    stroke="#F5C842"
                    strokeWidth="2"
                    strokeDasharray="4,3"
                  />
                  <path
                    d="M0,8 Q100,24 200,8 Q300,24 400,8 Q500,24 600,8 Q700,24 800,8"
                    fill="none"
                    stroke="#D4A017"
                    strokeWidth="1.2"
                  />
                  {[100, 200, 300, 400, 500, 600, 700].map((cx, i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cx % 200 === 0 ? 16 : 18} r="3.5" fill="#FFD700" />
                      <circle cx={cx} cy={cx % 200 === 0 ? 16 : 18} r="1.8" fill="#F59E0B" />
                      <circle cx={cx} cy={cx % 200 === 0 ? 21 : 23} r="1.5" fill="#FFE68A" />
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Ambient Lighting Layers */}
            <div className="card-glow-center" />
            <div className="card-frame" />

            {/* Corner Filigree Stars */}
            <span className="corner-ornament tl">✦</span>
            <span className="corner-ornament tr">✦</span>
            <span className="corner-ornament bl">✦</span>
            <span className="corner-ornament br">✦</span>

            {/* ══════════ MAIN CARD CONTENT ══════════ */}
            <div className="card-content">

              {/* Top Header Section: Gen-Z Official Invitation Pill & Title */}
              <div className="card-top-header">
                <div className="vip-pill-wrap">
                  <span className="vip-badge">
                    <span className="pulse-dot" />
                    OFFICIAL INVITATION
                  </span>
                </div>

                <div className="card-header">
                  <div className="shubh-glow">✦ DIWALI 2026 ✦</div>
                  <h1 className="hero-title">
                    DIWALI UTSAV <span className="gold-num">'26</span>
                  </h1>
                  <p className="hero-tagline">
                    A Celebration of Light, Togetherness &amp; Pure Festive Energy
                  </p>
                </div>
              </div>

              {/* Cordial Salutation */}
              <div className="invite-note">
                EzStays cordially invites you to join us in celebrating the festival of lights with the squad.
              </div>

              {/* 4-Item Event Coordinates Grid */}
              <div className="coords-grid">
                {DETAILS.map((d, i) => (
                  <div key={i} className="coord-chip">
                    <div className="coord-icon-box">{d.icon}</div>
                    <div className="coord-text">
                      <span className="coord-tag">{d.tag}</span>
                      <strong className="coord-title">{d.title}</strong>
                      <span className="coord-desc">{d.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gen-Z Minimalist Lineup Strip (1-2 lines, Main Headings Only) */}
              <div className="genz-itinerary-box">
                <div className="itinerary-header-mini">
                  <span className="itinerary-label">✨ SCHEDULE HIGHLIGHTS</span>
                </div>
                <div className="genz-itinerary-flow">
                  {ITINERARY_HEADINGS.map((item, i) => (
                    <React.Fragment key={i}>
                      <div className="itinerary-pill-item">
                        <span className="itinerary-pill-icon">{item.icon}</span>
                        <span className="itinerary-pill-text">{item.title}</span>
                      </div>
                      {i < ITINERARY_HEADINGS.length - 1 && (
                        <span className="itinerary-divider">✦</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Desktop Centered Celebrate Diwali Action */}
              <div className="card-actions-wrapper desktop-inline-actions">
                <div className="action-row single-action">
                  <button
                    className="action-btn spark-btn celebrate-spark-btn"
                    onClick={handleCelebrate}
                    title="Click here for a Grand Diwali Surprise!"
                  >
                    <span className="btn-sparkle">✨</span>
                    <div className="spark-btn-content">
                      <span className="spark-btn-main">Celebrate Diwali</span>
                      <span className="spark-btn-surprise">🎁 Click for Surprise! 🎆</span>
                    </div>
                    <span className="btn-sparkle">🪔</span>
                  </button>
                </div>
              </div>

              {/* Gen-Z Minimalist Footer */}
              <footer className="card-footer genz-footer">
                <p className="footer-genz-text">
                  <span className="footer-brand">EzStays</span> — Wishing you and your family a blessed, prosperous &amp; Happy Diwali! 🪔✨
                </p>
              </footer>

            </div>{/* /card-content */}

            {/* ══════════ MOBILE DOCKED ACTIONS ══════════ */}
            <div className="card-actions-wrapper mobile-docked-actions">
              <div className="action-row single-action">
                <button
                  className="action-btn spark-btn celebrate-spark-btn"
                  onClick={handleCelebrate}
                  title="Click here for a Grand Diwali Surprise!"
                >
                  <span className="btn-sparkle">✨</span>
                  <div className="spark-btn-content">
                    <span className="spark-btn-main">Celebrate Diwali</span>
                    <span className="spark-btn-surprise">🎁 Click for Surprise! 🎆</span>
                  </div>
                  <span className="btn-sparkle">🪔</span>
                </button>
              </div>
            </div>

            {/* ══════════ BOTTOM LIVE DIYAS ROW ══════════ */}
            <div className="bottom-diyas-banner">
              <div className="bottom-diyas-glow-bar" />
              <div className="diyas-track">
                {BOTTOM_DIYAS.map(({ id, delay }) => (
                  <div
                    key={id}
                    className="live-diya-unit"
                    onClick={handleDiyaClick}
                    title="Live Diya · Click to ignite sparkles"
                  >
                    <div className="diya-aura" style={{ animationDelay: `${delay}s` }} />
                    <div className="diya-wick-flame" style={{ animationDelay: `${delay}s` }}>
                      <div className="wick-flame-core" />
                      <div className="wick-flame-halo" />
                    </div>
                    <svg className="diya-earthen-cup" viewBox="0 0 32 16" width="28" height="14">
                      <defs>
                        <linearGradient id={`clayGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFE082" />
                          <stop offset="50%" stopColor="#D4A017" />
                          <stop offset="100%" stopColor="#8C6005" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M2 3 Q16 0 30 3 C28 11 22 15 16 15 C10 15 4 11 2 3 Z"
                        fill={`url(#clayGrad-${id})`}
                        stroke="#FFE082"
                        strokeWidth="0.8"
                      />
                      <ellipse cx="16" cy="3.5" rx="12" ry="2" fill="#FFE082" opacity="0.6" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* /card-inner */}
        </div>{/* /invitation-card */}
      </div>{/* /card-scene */}
    </div>
  );
}
