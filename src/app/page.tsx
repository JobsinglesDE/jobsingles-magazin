import Link from 'next/link';
import { articleHref } from '@/lib/routes';
import Image from 'next/image';
import { reader } from '@/lib/keystatic';
import { ArticleCard } from '@/components/content/ArticleCard';
import { SuccessStory } from '@/components/content/SuccessStory';
import { PillarHero } from '@/components/content/PillarHero';
import { HeartButton } from '@/components/ui/HeartButton';
import { CarouselCards } from '@/components/ui/CarouselCards';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedStats } from '@/components/ui/AnimatedCounter';
import { MatchQuiz } from '@/components/ui/MatchQuiz';

export const metadata = {
  alternates: { canonical: '/' },
  title: { absolute: 'Jobsingles ❤️ — Dating der Berufe' },
  description: 'Partnersuche für Menschen mit fordernden Berufen. Guides für Dating trotz Schichtdienst, echte Erfolgsgeschichten und Tipps für deinen Arbeitsalltag.',
};

const rotations: Array<'left' | 'right' | 'slight'> = ['left', 'right', 'slight'];

export default async function HomePage() {
  const allArticles = await reader.collections.articles.all();
  const allStories = await reader.collections.stories.all();

  const byDateDesc = <T extends { entry: { publishedAt?: string | null } }>(a: T, b: T) =>
    (b.entry.publishedAt || '').localeCompare(a.entry.publishedAt || '');

  const articles = allArticles
    .filter((a) => a.entry.status === 'published' && a.entry.type !== 'story')
    .sort(byDateDesc);

  const stories = [...allStories].sort(byDateDesc);

  const carouselItems = articles.slice(0, 8).map((article) => ({
    title: article.entry.title,
    excerpt: article.entry.excerpt,
    href: `/${article.slug}`,
    image: article.entry.featuredImage || undefined,
    category: article.entry.category,
  }));

  return (
    <>
      <section className="relative overflow-hidden min-h-[420px] md:min-h-[560px]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-startseite.webp"
            alt="Jobsingles — Dating der Berufe"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 30%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 flex flex-col justify-end min-h-[420px] md:min-h-[560px] pb-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-2 drop-shadow-lg text-center">
            Job<span className="text-brand-orange">singles</span>
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow text-center">
            Das Dating-Magazin der Berufe
          </p>
        </div>
      </section>

      <ScrollReveal>
        <PillarHero
          as="h2"
          title="Jobsingles"
          texts={[
            "Echte Liebe trotz Beruf",
            "Schichtdienst trifft Herz",
            "Dating der Berufe",
            "Beruf trifft Beziehung",
            "Jemand, der deinen Alltag versteht",
            "Jobsingles",
          ]}
        />
      </ScrollReveal>

      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 pt-4 pb-12">
          <h2 className="text-3xl font-bold mb-6">Neueste Artikel</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article, i) => (
              <ArticleCard
                key={article.slug}
                title={article.entry.title}
                excerpt={article.entry.excerpt}
                href={articleHref(article)}
                image={article.entry.featuredImage || undefined}
                imageAlt={article.entry.featuredImageAlt || undefined}
                date={article.entry.publishedAt || undefined}
                priority={i === 0}
              />
            ))}
            {articles.length === 0 && (
              <p className="text-foreground/50 col-span-full text-center py-12">
                Noch keine Artikel. Erstelle welche unter{' '}
                <Link href="/keystatic" className="text-brand-orange underline">/keystatic</Link>
              </p>
            )}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="max-w-4xl mx-auto px-6 py-12">
          <AnimatedStats
            items={[
              { value: 25000, suffix: '+', label: 'Singles in fordernden Berufen' },
              { value: 5, suffix: '', label: 'Berufs-Netzwerke im Verbund' },
              { value: 6100, suffix: '+', label: 'aktive Mitglieder' },
            ]}
          />
        </section>
      </ScrollReveal>

      {stories.length > 0 && (
        <ScrollReveal>
          <section className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold mb-8">Erfolgsgeschichten</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {stories.slice(0, 3).map((story, i) => (
                <SuccessStory
                  key={story.slug}
                  title={story.entry.title}
                  couple={story.entry.couple}
                  location={story.entry.location}
                  excerpt={story.entry.excerpt}
                  href={`/erfolgsgeschichten/${story.slug}`}
                  image={story.entry.featuredImage || undefined}
                  imageAlt={story.entry.featuredImageAlt || undefined}
                  rotation={rotations[i % 3]}
                />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {carouselItems.length > 3 && (
        <ScrollReveal>
          <CarouselCards title="Mehr entdecken" items={carouselItems.slice(3)} />
        </ScrollReveal>
      )}

      <ScrollReveal>
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Finde deinen Match-Typ</h2>
          <p className="text-foreground/60 mb-8 text-center">3 Fragen — und du weißt, wer zu dir passt.</p>
          <MatchQuiz />
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="text-center py-12 px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Bereit für die Partnersuche?</h2>
          <p className="text-foreground/60 mb-8 max-w-lg mx-auto">
            Singles mit fordernden Berufen — sie verstehen deinen Alltag — warten auf dich.
          </p>
          <HeartButton href="https://jobsingles.de/?AID=JobsinglesMagazin">
            Jetzt kostenfrei mitmachen
          </HeartButton>
        </section>
      </ScrollReveal>
    </>
  );
}
