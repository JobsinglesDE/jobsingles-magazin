'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  href: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  date?: string;
  priority?: boolean;
}

export function ArticleCard({ title, excerpt, href, image, imageAlt, category, date, priority }: ArticleCardProps) {
  return (
    <SpotlightCard className="hover-lift">
      <Link href={href} className="block group">
        {image && (
          <div className="aspect-[16/10] overflow-hidden">
            <Image
              src={image}
              alt={imageAlt || title}
              width={800}
              height={500}
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ objectPosition: '50% 20%' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            {category && (
              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-orange-text">
                {category}
              </span>
            )}
            {date && (
              <span className="text-[10px] text-foreground/70">{date}</span>
            )}
          </div>
          <h3 className="font-bold text-lg text-foreground leading-tight mb-2 group-hover:text-brand-orange transition-colors">
            {title}
          </h3>
          <p className="text-sm text-foreground/60 line-clamp-2">{excerpt}</p>
        </div>
      </Link>
    </SpotlightCard>
  );
}
