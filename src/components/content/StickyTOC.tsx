'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  label: string;
  id: string;
}

interface Props {
  items: TocItem[];
  showFaq?: boolean;
}

export function StickyTOC({ items, showFaq = true }: Props) {
  const allItems = showFaq
    ? [...items, { label: 'Häufige Fragen', id: 'haeufige-fragen' }]
    : items;
  const [activeId, setActiveId] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (allItems.length === 0) return;

    function checkVisibility() {
      const firstH2 = document.getElementById(allItems[0]?.id);
      if (!firstH2) return;
      const rect = firstH2.getBoundingClientRect();
      // Show only when first H2 has scrolled past the top third of the viewport
      setVisible(rect.top < window.innerHeight * 0.6);
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    checkVisibility();

    // Track active heading
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    allItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [allItems]);

  if (allItems.length === 0 || !visible) return null;

  return (
    <nav className={`hidden xl:block fixed left-[max(1rem,calc((100vw-48rem)/2-14rem))] top-28 w-48 text-xs transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <p className="font-semibold text-foreground/40 uppercase tracking-widest mb-3">Inhalt</p>
      <ol className="space-y-2 border-l border-foreground/10">
        {allItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block pl-3 -ml-px transition-colors duration-200 ${
                activeId === item.id
                  ? 'border-l-2 border-brand-orange text-brand-orange font-semibold'
                  : 'text-foreground/50 hover:text-foreground/80'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
