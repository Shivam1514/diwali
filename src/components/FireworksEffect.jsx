import React, { useMemo, useEffect, useRef } from 'react';

const COLORS = [
  '#FFD700', '#FF8C00', '#FF6347', '#FF1493',
  '#FF4500', '#FFA500', '#FFD700', '#FFEC8B',
  '#FF69B4', '#FFB347',
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function FireworksEffect() {
  const containerRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const LAUNCH_COUNT = 6;
    const SPARK_PER_LAUNCH = 22;

    for (let i = 0; i < LAUNCH_COUNT; i++) {
      setTimeout(() => {
        const cx = randomBetween(15, 85);
        const cy = randomBetween(10, 60);

        for (let j = 0; j < SPARK_PER_LAUNCH; j++) {
          const spark = document.createElement('div');
          const angle = (j / SPARK_PER_LAUNCH) * 360;
          const distance = randomBetween(60, 180);
          const rad = (angle * Math.PI) / 180;
          const tx = Math.cos(rad) * distance;
          const ty = Math.sin(rad) * distance;
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];
          const size = randomBetween(4, 9);
          const dur = randomBetween(0.8, 1.8);

          spark.style.cssText = `
            position: fixed;
            left: ${cx}vw;
            top: ${cy}vh;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: ${color};
            box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}80;
            pointer-events: none;
            z-index: 9999;
            animation: fireworkSpark ${dur}s ease-out forwards;
            --tx: ${tx}px;
            --ty: ${ty}px;
          `;
          container.appendChild(spark);
          sparksRef.current.push(spark);

          setTimeout(() => {
            if (container.contains(spark)) container.removeChild(spark);
          }, dur * 1000 + 200);
        }

        // Diya emoji sparkle
        const diyaEl = document.createElement('div');
        diyaEl.textContent = '🪔';
        diyaEl.style.cssText = `
          position: fixed;
          left: ${cx - 1}vw;
          top: ${cy - 2}vh;
          font-size: 2rem;
          pointer-events: none;
          z-index: 9999;
          animation: diyaPop 1.2s ease-out forwards;
        `;
        container.appendChild(diyaEl);
        setTimeout(() => {
          if (container.contains(diyaEl)) container.removeChild(diyaEl);
        }, 1400);

      }, i * 450);
    }

    return () => {
      sparksRef.current.forEach(s => {
        if (container.contains(s)) container.removeChild(s);
      });
      sparksRef.current = [];
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes fireworkSpark {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.1); opacity: 0; }
        }
        @keyframes diyaPop {
          0% { transform: scale(0) translateY(0); opacity: 1; }
          50% { transform: scale(1.5) translateY(-30px); opacity: 1; }
          100% { transform: scale(0.5) translateY(-60px); opacity: 0; }
        }
      `}</style>
      <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }} />
    </>
  );
}
