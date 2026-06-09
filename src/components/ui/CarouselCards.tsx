'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CarouselCard {
  title: string;
  excerpt: string;
  href: string;
  image?: string;
  category?: string;
}

interface CarouselCardsProps {
  title?: string;
  items: CarouselCard[];
}

export function CarouselCards({ title, items }: CarouselCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 'left' | 'right') {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  }

  if (items.length === 0) return null;

  return (
    <section className="my-16">
      {title && (
        <div className="flex items-center justify-between mb-6 px-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/40 hover:text-brand-orange hover:border-brand-orange transition-colors"
              aria-label="Zurück"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/40 hover:text-brand-orange hover:border-brand-orange transition-colors"
              aria-label="Weiter"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-hide mx-auto max-w-6xl px-6"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex gap-5 mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="flex-none w-72 md:w-80 snap-start"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={item.href} className="group block">
              <div className="rounded-2xl overflow-hidden bg-surface ambient-shadow h-full">
                {item.image && (
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <Image
              width={1600}
              height={900}
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="320px"
                    />
                  </div>
                )}
                <div className="p-5">
                  {item.category && (
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-orange-text mb-2 block">
                      {item.category}
                    </span>
                  )}
                  <h3 className="font-bold text-foreground leading-tight mb-2 group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground/60 line-clamp-2">{item.excerpt}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        </div>
      </div>
    </section>
  );
}
