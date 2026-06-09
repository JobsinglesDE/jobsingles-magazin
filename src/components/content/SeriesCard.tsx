'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface SeriesCardProps {
  title: string;
  excerpt: string;
  href: string;
  image?: string;
  imageAlt?: string;
  seriesLabel?: string;
}

export function SeriesCard({ title, excerpt, href, image, imageAlt, seriesLabel }: SeriesCardProps) {
  return (
    <SpotlightCard>
      <Link href={href} className="block group">
        {image && (
          <div className="aspect-video overflow-hidden">
            <Image
              src={image}
              alt={imageAlt || title}
              width={800}
              height={450}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-5">
          {seriesLabel && (
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary-light mb-2 block">
              {seriesLabel}
            </span>
          )}
          <h3 className="font-bold text-lg text-foreground leading-tight mb-2 group-hover:text-brand-orange transition-colors">
            {title}
          </h3>
          <p className="text-sm text-foreground/60 line-clamp-2">{excerpt}</p>
        </div>
      </Link>
    </SpotlightCard>
  );
}
