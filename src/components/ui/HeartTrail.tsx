'use client';

import { useEffect, useRef } from 'react';

export function HeartTrail() {
  const trail = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const hearts = trail.current;
    if (!hearts.length) return;

    // Each heart follows the previous with delay
    const positions = hearts.map(() => ({ x: 0, y: 0 }));
    let mouse = { x: 0, y: 0 };

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function animate() {
      // First heart follows mouse directly
      positions[0].x += (mouse.x - positions[0].x) * 0.3;
      positions[0].y += (mouse.y - positions[0].y) * 0.3;

      // Others follow the previous
      for (let i = 1; i < positions.length; i++) {
        positions[i].x += (positions[i - 1].x - positions[i].x) * 0.15;
        positions[i].y += (positions[i - 1].y - positions[i].y) * 0.15;
      }

      hearts.forEach((el, i) => {
        if (!el) return;
        el.style.left = `${positions[i].x}px`;
        el.style.top = `${positions[i].y}px`;
      });

      requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', onMove);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const sizes = [
    { size: '24px', opacity: 0.6 },
    { size: '18px', opacity: 0.4 },
    { size: '12px', opacity: 0.25 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {sizes.map((s, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trail.current[i] = el; }}
          className="absolute select-none"
          style={{
            transform: 'translate(-50%, -50%)',
            fontSize: s.size,
            opacity: s.opacity,
            color: '#ff3232',
            filter: `blur(${i * 0.3}px)`,
            transition: 'none',
          }}
        >
          ❤
        </div>
      ))}
    </div>
  );
}
