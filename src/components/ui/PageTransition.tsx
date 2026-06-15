import { ReactNode } from 'react';

/**
 * Sanfter Seiten-Einblend-Effekt — rein CSS (kein framer-motion, kein 'use client').
 * Wichtig fürs SEO/LCP: Content wird NICHT per JS sichtbar gemacht (kein style="opacity:0"
 * im SSR-HTML, das LCP bis zur Hydration blockiert). Die CSS-Animation läuft beim ersten
 * Paint, auch ohne JS, und respektiert prefers-reduced-motion (siehe globals.css).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-fade-in">{children}</div>;
}
