'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

function Counter({ value, suffix = '', duration = 2000 }: Omit<AnimatedCounterProps, 'label'>) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let rafId: number;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };
    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  // Callback ref — fires once when the DOM node mounts, avoids stale-ref issues
  const callbackRef = useCallback(
    (node: HTMLSpanElement | null) => {
      // Clean up previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            startAnimation();
            observer.disconnect();
          }
        },
        { threshold: 0, rootMargin: '0px 0px -10% 0px' },
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [startAnimation],
  );

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Format Swiss-style with apostrophe
  const formatted = count.toLocaleString('de-CH');

  return (
    <span ref={callbackRef} className="inline-block">
      {formatted}{suffix}
    </span>
  );
}

interface StatsItem {
  value: number;
  suffix?: string;
  label: string;
}

export function AnimatedStats({ items }: { items: StatsItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-6 md:gap-12 text-center">
      {items.map((item) => (
        <div key={item.label}>
          <div className="text-3xl md:text-5xl font-bold text-brand-orange mb-2">
            <Counter value={item.value} suffix={item.suffix} />
          </div>
          <div className="text-sm md:text-base text-foreground/60">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
