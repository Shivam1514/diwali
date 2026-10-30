import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ── Realistic Pyrotechnic Web Audio Synthesizer ── */
class RealisticSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.noiseBuffer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        const bufferSize = this.ctx.sampleRate * 2;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Auspicious Opening Conch (Shankh Naad)
  playShankh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.linearRampToValueAtTime(235, now + 0.7);
      osc.frequency.linearRampToValueAtTime(195, now + 2.6);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(430, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.75);
    } catch {
      // safely ignore
    }
  }

  // Realistic Rocket Launch Whoosh
  playLaunch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.noiseBuffer) return;
    try {
      const now = this.ctx.currentTime;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.linearRampToValueAtTime(1400, now + 0.75);
      filter.Q.setValueAtTime(3.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      src.start(now);
      src.stop(now + 0.85);
    } catch {
      // safely ignore
    }
  }

  // Deep Sub-Bass Pyrotechnic Explosion & Multi-grain Crackles
  playExplosion() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.noiseBuffer) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Visceral Sub-bass Boom (85Hz down to 25Hz)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(85, now);
      subOsc.frequency.exponentialRampToValueAtTime(26, now + 0.9);

      subGain.gain.setValueAtTime(0.55, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.0);

      // 2. Heavy Gunpowder Blast Body
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, now);
      filter.frequency.exponentialRampToValueAtTime(50, now + 1.3);
      filter.Q.setValueAtTime(2.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 1.4);

      // 3. Delayed Gunpowder Crackle Echoes
      setTimeout(() => {
        if (this.muted || !this.ctx) return;
        const crackleNow = this.ctx.currentTime;
        for (let i = 0; i < 6; i++) {
          const cDelay = i * 0.06 + Math.random() * 0.04;
          const cOsc = this.ctx.createOscillator();
          const cGain = this.ctx.createGain();
          cOsc.type = 'triangle';
          cOsc.frequency.setValueAtTime(750 + Math.random() * 800, crackleNow + cDelay);
          cGain.gain.setValueAtTime(0.08, crackleNow + cDelay);
          cGain.gain.exponentialRampToValueAtTime(0.001, crackleNow + cDelay + 0.05);
          cOsc.connect(cGain);
          cGain.connect(this.ctx.destination);
          cOsc.start(crackleNow + cDelay);
          cOsc.stop(crackleNow + cDelay + 0.06);
        }
      }, 220);
    } catch {
      // safely ignore
    }
  }
}

const sfxEngine = new RealisticSoundEngine();
sfxEngine.muted = true; // SFX turned off

export default function RamayanaDroneShow({ onClose }) {
  const [videoMode, setVideoMode] = useState('local'); // 'local' or 'youtube'
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isSfxMuted, setIsSfxMuted] = useState(true); // SFX turned off by default
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef(null);
  const ambientVideoRef = useRef(null);
  const fireworksCanvasRef = useRef(null);

  const fireworksRef = useRef([]);
  const animFrameRef = useRef(null);

  // Initialize videos & start playback
  useEffect(() => {
    // Start ambient background strictly muted
    if (ambientVideoRef.current) {
      ambientVideoRef.current.muted = true;
      ambientVideoRef.current.defaultMuted = true;
      ambientVideoRef.current.playsInline = true;
      ambientVideoRef.current.play().catch(() => {});
    }

    // Start main video with sound
    if (videoRef.current) {
      videoRef.current.playsInline = true;
      videoRef.current.volume = 1.0;
      videoRef.current.muted = isVideoMuted;
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.catch(() => {
          // If browser policy blocks unmuted autoplay, mute initially to allow playback
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsVideoMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [videoMode]);

  // Toggle Video Source (Local MP4 vs YouTube Embed)
  const toggleVideoMode = () => {
    setVideoMode((prev) => (prev === 'local' ? 'youtube' : 'local'));
  };

  // Toggle Video Sound
  const toggleVideoSound = () => {
    if (!videoRef.current) return;
    if (videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsVideoMuted(false);
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.muted = true;
      setIsVideoMuted(true);
    }
  };

  // Toggle Fireworks SFX
  const toggleSfx = () => {
    setIsSfxMuted((prev) => {
      sfxEngine.muted = !prev;
      return !prev;
    });
  };

  // Toggle Play / Pause Video
  const togglePlayPause = () => {
    if (videoMode === 'local' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (ambientVideoRef.current) ambientVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        if (ambientVideoRef.current) ambientVideoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying((p) => !p);
    }
  };

  // Launch Realistic Firework
  const spawnFirework = useCallback((w, h, originX, originY) => {
    const fwColors = ['#FFD700', '#FF8800', '#FF3366', '#00F5D4', '#FFF3C4', '#F72585', '#70E000'];
    const startX = originX !== undefined ? originX : (0.08 + Math.random() * 0.84) * w;
    const targetY = originY !== undefined ? originY : (0.06 + Math.random() * 0.42) * h;
    const color = fwColors[Math.floor(Math.random() * fwColors.length)];

    sfxEngine.playLaunch();

    fireworksRef.current.push({
      x: startX,
      y: h - 30,
      targetY,
      color,
      vx: (Math.random() - 0.5) * 2.2,
      vy: -(11.5 + Math.random() * 3.8),
      exploded: false,
      particles: [],
    });
  }, []);

  // Main Fireworks Physics & Animation Loop
  // CRITICAL: We clear with clearRect so NO BLACK OVERLAY EVER OBSCORES THE VIDEO!
  useEffect(() => {
    const fCanvas = fireworksCanvasRef.current;
    if (!fCanvas) return;
    const fCtx = fCanvas.getContext('2d');

    const resize = () => {
      fCanvas.width = window.innerWidth;
      fCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let fwTimer = 0;

    const loop = () => {
      const w = fCanvas.width;
      const h = fCanvas.height;

      fwTimer++;
      if (fwTimer % 95 === 0) {
        spawnFirework(w, h);
      }

      // Completely clear canvas every frame to ensure 100% crystal-clear transparency over video!
      fCtx.clearRect(0, 0, w, h);

      fCtx.save();
      fCtx.globalCompositeOperation = 'lighter';

      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];

        if (!fw.exploded) {
          fw.x += fw.vx;
          fw.y += fw.vy;
          fw.vy += 0.16; // Gravity

          // Glowing rocket comet trail & spark head
          fCtx.strokeStyle = 'rgba(255, 224, 130, 0.85)';
          fCtx.lineWidth = 2.5;
          fCtx.beginPath();
          fCtx.moveTo(fw.x, fw.y);
          fCtx.lineTo(fw.x - fw.vx * 3.2, fw.y - fw.vy * 3.2);
          fCtx.stroke();

          fCtx.fillStyle = '#FFFFFF';
          fCtx.beginPath();
          fCtx.arc(fw.x, fw.y, 3.2, 0, Math.PI * 2);
          fCtx.fill();

          if (fw.vy >= 0 || fw.y <= fw.targetY) {
            fw.exploded = true;
            sfxEngine.playExplosion();

            const pCount = 75 + Math.floor(Math.random() * 35);
            for (let j = 0; j < pCount; j++) {
              const angle = (j / pCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
              const speed = 2.8 + Math.random() * 7.2;
              fw.particles.push({
                x: fw.x,
                y: fw.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                decay: 0.013 + Math.random() * 0.014,
                color: fw.color,
                size: 2.4 + Math.random() * 2.6,
              });
            }
          }
        } else {
          let allDead = true;
          fw.particles.forEach((p) => {
            if (p.alpha > 0) {
              allDead = false;
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.082; // Gravity
              p.vx *= 0.96;  // Air Drag
              p.vy *= 0.96;
              p.alpha -= p.decay;

              // Glowing spark streak
              fCtx.strokeStyle = p.color;
              fCtx.lineWidth = p.size * 0.9;
              fCtx.globalAlpha = Math.max(0, p.alpha);
              fCtx.beginPath();
              fCtx.moveTo(p.x, p.y);
              fCtx.lineTo(p.x - p.vx * 1.8, p.y - p.vy * 1.8);
              fCtx.stroke();

              // White core
              fCtx.fillStyle = '#FFFFFF';
              fCtx.beginPath();
              fCtx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
              fCtx.fill();
            }
          });

          if (allDead) {
            fireworksRef.current.splice(i, 1);
          }
        }
      }
      fCtx.restore();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [spawnFirework]);

  // Click on screen to trigger interactive fireworks
  const handleSkyClick = (e) => {
    // Resume video if paused
    if (videoMode === 'local' && videoRef.current && videoRef.current.paused && isPlaying) {
      videoRef.current.play().catch(() => {});
      if (ambientVideoRef.current) ambientVideoRef.current.play().catch(() => {});
    }

    const rect = fireworksCanvasRef.current ? fireworksCanvasRef.current.getBoundingClientRect() : null;
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top : e.clientY;
    spawnFirework(window.innerWidth, window.innerHeight, x, y);
  };

  return (
    <div className="drone-show-overlay" onClick={handleSkyClick}>
      {/* ── Ambient Blurred Backdrop (Strictly Muted) ── */}
      <div className="ambient-video-wrapper">
        {videoMode === 'local' ? (
          <video
            ref={ambientVideoRef}
            src="/video_20261030_160945.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="ambient-backdrop-video"
          />
        ) : (
          <div className="ambient-backdrop-gradient" />
        )}
        <div className="ambient-dark-scrim" />
      </div>

      {/* ── Fullscreen Interactive Fireworks Canvas Layer (Behind Theater Card) ── */}
      <canvas
        ref={fireworksCanvasRef}
        className="fireworks-canvas"
        style={{ cursor: 'crosshair' }}
      />

      {/* ── Central Cinematic Theater Video Frame (With Integrated Audio) ── */}
      <div className="drone-theater-stage">
        <div className="theater-video-card" onClick={(e) => e.stopPropagation()}>
          {videoMode === 'local' ? (
            <video
              ref={videoRef}
              src="/video_20261030_160945.mp4"
              autoPlay
              loop
              playsInline
              preload="auto"
              onError={() => {
                console.warn('Local clip playback error, switching to YouTube stream...');
                setVideoMode('youtube');
              }}
              className="drone-featured-video"
            />
          ) : (
            <iframe
              src="https://www.youtube-nocookie.com/embed/8s2jLZcizpk?autoplay=1&mute=1&loop=1&playlist=8s2jLZcizpk&controls=0&modestbranding=1&rel=0&playsinline=1"
              title="Ayodhya Ramayana Drone Show"
              className="drone-featured-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none', width: '100%', height: '100%' }}
            />
          )}

          {/* Golden Frame Overlay */}
          <div className="theater-gold-frame" />
        </div>
      </div>

      {/* ── Ayodhya Saryu Ghats Horizon Silhouette ── */}
      <div className="ayodhya-skyline-horizon">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="ayodhya-ghats-svg">
          <path
            d="M0,120 L0,95 L40,95 L60,60 L70,40 L75,25 L80,40 L90,60 L110,95 L200,95 L220,70 L235,45 L240,30 L245,45 L260,70 L280,95 L450,95 L480,55 L500,20 L510,5 L520,20 L540,55 L570,95 L720,95 L740,65 L755,38 L760,22 L765,38 L780,65 L800,95 L950,95 L975,50 L990,25 L995,12 L1000,25 L1015,50 L1040,95 L1200,95 L1200,120 Z"
            fill="#060103"
          />
          <rect x="0" y="95" width="1200" height="25" fill="#040002" />
        </svg>

        {/* Shimmering Floating Saryu River Diyas */}
        <div className="ghat-diya-spark" style={{ left: '8%' }}></div>
        <div className="ghat-diya-spark" style={{ left: '24%', animationDelay: '0.4s' }}></div>
        <div className="ghat-diya-spark" style={{ left: '42%', animationDelay: '0.8s' }}></div>
        <div className="ghat-diya-spark" style={{ left: '58%', animationDelay: '0.2s' }}></div>
        <div className="ghat-diya-spark" style={{ left: '76%', animationDelay: '0.6s' }}></div>
        <div className="ghat-diya-spark" style={{ left: '92%', animationDelay: '1.0s' }}></div>
      </div>

      {/* ── Top Header Controls Bar ── */}
      <header className="drone-top-bar" onClick={(e) => e.stopPropagation()}>
        <div className="drone-title-block">
          <div className="drone-show-badge">
            <span className="badge-dot"></span>
            <span>BOTLAB DYNAMICS · RAMAYANA DRONE SPECTACLE</span>
          </div>
          <h1 className="drone-main-heading">अयोध्या दीपोत्सव · RAMAYANA LIGHT SHOW</h1>
        </div>

        <div className="drone-controls-group">
          {/* Stream Switcher */}
          <button
            className="ctrl-btn source-switch-btn"
            onClick={toggleVideoMode}
            title={videoMode === 'local' ? 'Switch to YouTube Stream' : 'Switch to Local HD'}
          >
            <span className="btn-full-text">{videoMode === 'local' ? '⚡ Local HD' : '📺 YouTube'}</span>
            <span className="btn-mobile-icon">{videoMode === 'local' ? '⚡' : '📺'}</span>
          </button>

          {/* Video Soundtrack Audio Toggle */}
          <button
            className={`ctrl-btn bhajan-btn ${!isVideoMuted ? 'active-audio' : ''}`}
            onClick={toggleVideoSound}
            title={isVideoMuted ? 'Unmute Video Audio' : 'Mute Video Audio'}
          >
            <span className="btn-full-text">{isVideoMuted ? '🔇 Audio Off' : '🔊 Video Audio'}</span>
            <span className="btn-mobile-icon">{isVideoMuted ? '🔇' : '🔊'}</span>
          </button>

          {/* Fireworks Sound Toggle */}
          <button
            className="ctrl-btn mute-btn"
            onClick={toggleSfx}
            title={isSfxMuted ? 'Unmute Fireworks Sound' : 'Mute Fireworks Sound'}
          >
            <span className="btn-full-text">{isSfxMuted ? '💥 SFX Off' : '💥 SFX On'}</span>
            <span className="btn-mobile-icon">{isSfxMuted ? '🔇' : '💥'}</span>
          </button>

          {/* Play/Pause Video */}
          <button
            className="ctrl-btn play-btn"
            onClick={togglePlayPause}
            title={isPlaying ? 'Pause' : 'Resume'}
          >
            <span>{isPlaying ? '⏸' : '▶'}</span>
          </button>

          {/* Exit Show */}
          <button
            className="ctrl-btn close-drone-btn"
            onClick={onClose}
            title="Return to Invitation Card"
          >
            <span className="btn-full-text">✕ Exit</span>
            <span className="btn-mobile-icon">✕</span>
          </button>
        </div>
      </header>

      {/* ── Unobtrusive Bottom Devotional HUD Strip ── */}
      <div className="drone-bottom-hud" onClick={(e) => e.stopPropagation()}>
        <div className="hud-steps">
          <span className="hud-pill active">
            {videoMode === 'local' ? 'HD VIDEO CLIP' : 'YOUTUBE STREAM'}
          </span>
          <span className="hud-pill">BOTLAB 500 DRONES</span>
        </div>

        <div className="hud-caption">
          <span className="hud-sanskrit">॥ मंगल भवन अमंगल हारी · राम सिया राम सिया राम जय जय राम ॥</span>
        </div>

        <div className="hud-nav">
          <button className="hud-nav-btn" onClick={() => spawnFirework(window.innerWidth, window.innerHeight)}>
            ✨ Spark Firework
          </button>
        </div>
      </div>
    </div>
  );
}
