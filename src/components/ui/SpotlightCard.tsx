'use client';

import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 122, 0, 0.15)',
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function handleEnter() {
    setOpacity(1);
  }

  function handleLeave() {
    setOpacity(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative rounded-2xl bg-surface overflow-hidden ambient-shadow transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      <div
        className="pointer-events-none absolute transition-opacity duration-300 text-[80px] leading-none select-none"
        style={{
          opacity,
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          color: 'rgba(255, 50, 50, 0.10)',
          textShadow: '0 0 60px rgba(255, 50, 50, 0.15)',
        }}
      >
        ❤
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
