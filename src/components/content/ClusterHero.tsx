import Image from 'next/image';

interface ClusterHeroProps {
  title: string;
  excerpt?: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  date?: string;
}

export function ClusterHero({ title, excerpt, category, image, imageAlt, imageCredit, date }: ClusterHeroProps) {
  if (!image) {
    return (
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-6">
          {category && <span className="text-xs uppercase tracking-widest font-bold text-brand-orange">{category}</span>}
          {date && <span className="text-xs text-foreground/40">{date}</span>}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4 leading-tight">{title}</h1>
        {excerpt && <p className="text-lg text-foreground/60 max-w-2xl leading-relaxed">{excerpt}</p>}
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden min-h-[320px] md:min-h-[440px]">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt || title}
          width={1920}
          height={720}
          priority
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 20%' }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      </div>
      <div className="relative max-w-4xl mx-auto px-6 flex flex-col justify-end min-h-[320px] md:min-h-[440px] pb-6">
        <div className="flex items-center gap-3 mb-3">
          {category && <span className="text-xs uppercase tracking-widest font-bold text-brand-orange">{category}</span>}
          {date && <span className="text-xs text-white/50">{date}</span>}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3 leading-tight drop-shadow-lg">{title}</h1>
        {excerpt && <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed drop-shadow">{excerpt}</p>}
      </div>
      {imageCredit && (
        <div className="absolute bottom-1 right-2 text-[10px] text-white/80 drop-shadow-sm pointer-events-none">
          {imageCredit}
        </div>
      )}
    </section>
  );
}
