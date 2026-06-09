'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { withBasePath } from '@/lib/url';

interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
}

interface CircularTestimonialsProps {
  items: Testimonial[];
  interval?: number;
}

export function CircularTestimonials({ items, interval = 5000 }: CircularTestimonialsProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  if (items.length === 0) return null;

  return (
    <div className="relative max-w-2xl mx-auto text-center py-12">
      {/* Quote mark */}
      <div className="text-6xl text-brand-orange/20 font-serif leading-none mb-4">&ldquo;</div>

      <div className="min-h-[140px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed italic mb-6">
              {items[current].quote}
            </p>
            <div className="flex items-center justify-center gap-3">
              {items[current].avatar ? (
                <img width="600" height="400"
                  src={withBasePath(items[current].avatar)}
                  alt={items[current].name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-orange/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-brand-orange">
                    {items[current].name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">{items[current].name}</p>
                {items[current].role && (
                  <p className="text-xs text-foreground/40">{items[current].role}</p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-brand-orange w-6'
                  : 'bg-foreground/20 hover:bg-foreground/40'
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
