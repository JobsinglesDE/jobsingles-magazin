import Image from 'next/image';
import { ParticleText } from '@/components/ui/ParticleText';
import { SpotlightHero } from '@/components/ui/SpotlightHero';

interface PillarHeroProps {
  title: string;
  texts?: string[];
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  colors?: Array<{ r: number; g: number; b: number }>;
  /** Heading-Level für sr-only-Title. 'h1' wenn primärer Page-Hero (default),
   *  'h2' wenn die Page bereits ein anderes H1 hat (z.B. Homepage, Regional-Overview). */
  as?: 'h1' | 'h2';
}

export function PillarHero({ title, texts, subtitle, image, imageAlt, colors, as = 'h1' }: PillarHeroProps) {
  const HeadingTag = as;
  return (
    <SpotlightHero>
      <section className="relative overflow-hidden pt-1 pb-2 md:pt-2 md:pb-4">
        {/* Background */}
        <div className="absolute inset-0 particle-overlay opacity-50" />
        {image && (
          <Image
            src={image}
            alt={imageAlt || `${title} — Hintergrund-Hero`}
            width={1920}
            height={1080}
            priority
            className="absolute inset-0 w-full h-full object-cover opacity-15"
            sizes="100vw"
          />
        )}

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <HeadingTag className="sr-only">{title}</HeadingTag>
          <ParticleText text={title} texts={texts} colors={colors} className="w-full h-40 md:h-56 mb-0" />
          {subtitle && (
            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </section>
    </SpotlightHero>
  );
}
