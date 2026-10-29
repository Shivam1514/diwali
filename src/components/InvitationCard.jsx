import React, { useState, useEffect, useRef } from 'react';

/* ── Live Countdown Hook ─────────────────────── */
function useCountdown(target) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(target) - new Date();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

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

/* ── Audio Chime Generator ───────────────────── */
function playFestiveChime(type = 'bell') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'deep-bell') {
      // Deep temple bell resonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 1.8);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.9);
      return;
    }

    // Melodious festive bell chord (C5, E5, G5, B5, C6)
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
  const colors = ['#FFD700', '#F5C842', '#FFA500', '#FDE68A', '#FFB703', '#FFFFFF', '#FF4D6D'];
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
      {/* Hanging Chain */}
      <div className="lamp-chain" style={{ height: `${length}px` }}>
        {Array.from({ length: Math.floor(length / 7) }).map((_, i) => (
          <span key={i} className="chain-link" />
        ))}
      </div>

      {/* Lamp Vessel & Live Flame */}
      <div className="lamp-head">
        <div className="live-flame" style={{ animationDelay: `${(delay * 0.7).toFixed(2)}s` }}>
          <div className="flame-inner" />
          <div className="flame-glow" />
        </div>

        {/* Brass Diya Vessel */}
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
    title: 'Traditional / Ethnic',
    desc: 'Festive Indian Attire',
  },
];

/* ── Program Itinerary (Timings Removed & Surprise Maintained) ── */
const ITINERARY = [
  {
    icon: '🪔',
    title: 'Diwali Puja & Aarti',
    desc: 'Auspicious prayers invoking divine blessings of Maa Lakshmi for prosperity, health & success',
  },
  {
    icon: '🍽️',
    title: 'Grand Festive Lunch',
    desc: 'Curated royal buffet spread featuring traditional festive delicacies and sweet treats',
  },
  {
    icon: '🎯',
    title: 'Team Activities & Games',
    desc: 'Engaging festive games, friendly competitions, tambola, and joyous team celebrations',
  },
  {
    icon: '✨',
    title: 'Grand Finale & Surprises',
    desc: 'Exciting undisclosed surprises, celebratory music, team memories & evening festivities',
  },
];

/* ── Bottom Live Diyas Array ─────────────────── */
const BOTTOM_DIYAS = Array.from({ length: 13 }, (_, i) => ({
  id: i,
  delay: (i * 0.14).toFixed(2),
}));

export default function InvitationCard({ onClose, onCelebrate }) {
  const countdown = useCountdown('2026-11-05T10:30:00+05:30');
  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  const [toast, setToast] = useState('');
  useTilt(cardRef);

  const pad = (n) => String(n).padStart(2, '0');

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

  const handleAddToCalendar = () => {
    playFestiveChime('bell');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      'EzStays Diwali Party 2026'
    )}&dates=20261105T050000Z/20261105T133000Z&details=${encodeURIComponent(
      'EzStays Annual Diwali Celebration: Diwali Puja, Office Lunch, Team Activities, and Special Surprises.\nVenue: EzStays Corporate Office, Sector 18, Noida.\nDress Code: Traditional / Ethnic Attire.'
    )}&location=${encodeURIComponent('EzStays Corporate Office, Sector 18, Noida')}`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
    showToast('📅 Added to Calendar!');
  };

  const handleShare = () => {
    playFestiveChime('bell');
    const text = "🪔 You are cordially invited to the EzStays Diwali Celebration 2026! Join us on Thursday, 5th November 2026, 10:30 AM onwards at EzStays Corporate Office, Sector 18, Noida.";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('📋 Invitation copied to clipboard!');
    } else {
      showToast('🪔 EzStays Diwali Celebration 2026');
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

            {/* Deep Velvet Maroon Texture Backdrop */}
            <div className="card-maroon-bg" />

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

            {/* Draped Floral Toran / Marigold Garland */}
            <div className="festive-toran-bar">
              <div className="toran-garland-svg-wrap">
                <svg viewBox="0 0 800 24" preserveAspectRatio="none" className="toran-svg">
                  <path
                    d="M0,4 Q100,20 200,4 Q300,20 400,4 Q500,20 600,4 Q700,20 800,4"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeDasharray="4,3"
                  />
                  <path
                    d="M0,8 Q100,24 200,8 Q300,24 400,8 Q500,24 600,8 Q700,24 800,8"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="1.5"
                  />
                  {/* Marigold Floral Drops */}
                  {[100, 200, 300, 400, 500, 600, 700].map((cx, i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cx % 200 === 0 ? 16 : 18} r="4" fill="#FBBF24" />
                      <circle cx={cx} cy={cx % 200 === 0 ? 16 : 18} r="2" fill="#D97706" />
                      <circle cx={cx} cy={cx % 200 === 0 ? 21 : 23} r="1.5" fill="#FFD700" />
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

              {/* Top Header Section (Maa Lakshmi Flanked by Shubh-Labh) */}
              <div className="card-top-header">
                <div className="vip-pill-wrap">
                  <span className="vip-badge">
                    <span className="pulse-dot" />
                    EZSTAYS ANNUAL CELEBRATION
                  </span>
                  <span className="vip-subtag">OFFICIAL INVITATION</span>
                </div>

                {/* Shubh - Lakshmi - Labh Trio Row */}
                <div className="auspicious-trio-row">
                  {/* Left Auspicious Medallion: Shubh */}
                  <div className="shubh-labh-emblem left-emblem">
                    <div className="emblem-petal-ring" />
                    <span className="emblem-text">शुभ</span>
                    <span className="emblem-sublabel">Auspicious</span>
                  </div>

                  {/* Central Maa Lakshmi Crest */}
                  <div className="emblem-crest">
                    <div className="crest-ring" />
                    <div className="crest-halo" />
                    <img
                      src="/lakshmi_graphic.png"
                      alt="Maa Lakshmi"
                      className="crest-img"
                    />
                  </div>

                  {/* Right Auspicious Medallion: Labh */}
                  <div className="shubh-labh-emblem right-emblem">
                    <div className="emblem-petal-ring" />
                    <span className="emblem-text">लाभ</span>
                    <span className="emblem-sublabel">Prosperity</span>
                  </div>
                </div>

                <div className="sanskrit-chant">
                  ॥ ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः ॥
                </div>

                <div className="card-header">
                  <div className="shubh-glow">✦ शुभ दीपावली ✦</div>
                  <h1 className="hero-title">
                    DIWALI UTSAV <span className="gold-num">2026</span>
                  </h1>
                  <p className="hero-tagline">
                    A Celebration of Light, Prosperity &amp; Togetherness
                  </p>
                </div>
              </div>

              {/* ══════════ TWO-COLUMN RESPONSIVE BODY GRID ══════════ */}
              <div className="card-body-grid">
                
                {/* Left Column: Cordial Salutation, Countdown & Event Coordinates */}
                <div className="body-col-left">
                  <div className="invite-note">
                    EzStays cordially invites you to join us in celebrating the auspicious festival of lights with your colleagues.
                  </div>

                  <div className="countdown-section">
                    <div className="countdown-title">CELEBRATION COMMENCES IN</div>
                    <div className="countdown-pods">
                      {[
                        { val: countdown.d, label: 'DAYS' },
                        { val: countdown.h, label: 'HOURS' },
                        { val: countdown.m, label: 'MINS' },
                        { val: countdown.s, label: 'SECS' },
                      ].map(({ val, label }) => (
                        <div key={label} className="time-pod">
                          <span className="time-val">{pad(val)}</span>
                          <span className="time-lbl">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2x2 Event Coordinates */}
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
                </div>

                {/* Right Column: Program Itinerary & Interactive Actions */}
                <div className="body-col-right">
                  <div className="lineup-container">
                    <div className="lineup-header">
                      <div className="lineup-title-wrap">
                        <span className="lineup-icon">🪔</span>
                        <span className="lineup-title">PROGRAM ITINERARY</span>
                      </div>
                      <span className="lineup-badge">SCHEDULE</span>
                    </div>

                    <div className="lineup-grid">
                      {ITINERARY.map((item, i) => (
                        <div key={i} className="lineup-tile">
                          <div className="lineup-top">
                            <span className="lineup-tile-icon">{item.icon}</span>
                            <h4 className="lineup-tile-title">{item.title}</h4>
                          </div>
                          <p className="lineup-tile-desc">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="action-row">
                    <button
                      className="action-btn spark-btn"
                      onClick={handleCelebrate}
                      title="Celebrate with Sparkles"
                    >
                      <span className="btn-sparkle">✨</span>
                      <span>Celebrate Diwali</span>
                      <span className="btn-sparkle">🪔</span>
                    </button>

                    <button
                      className="action-btn cal-btn"
                      onClick={handleAddToCalendar}
                      title="Add to Google Calendar"
                    >
                      <span>📅 Calendar</span>
                    </button>

                    <button
                      className="action-btn share-btn"
                      onClick={handleShare}
                      title="Copy Invitation Details"
                    >
                      <span>🔗 Share</span>
                    </button>
                  </div>
                </div>

              </div>{/* /card-body-grid */}

              {/* Minimalist Footer */}
              <footer className="card-footer">
                <div className="footer-company">EZSTAYS CORPORATE OFFICE</div>
                <div className="footer-motto">
                  Sector 18, Noida · Wishing you and your family a blessed, prosperous &amp; happy Diwali! 🪔
                </div>
              </footer>

            </div>{/* /card-content */}

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
                          <stop offset="0%" stopColor="#FFD54F" />
                          <stop offset="40%" stopColor="#C87028" />
                          <stop offset="100%" stopColor="#5D1B00" />
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
