import { articleHref } from '@/lib/routes';
import { reader } from '@/lib/keystatic';
import { PillarHero } from '@/components/content/PillarHero';
import { ArticleCard } from '@/components/content/ArticleCard';
import { HeartButton } from '@/components/ui/HeartButton';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, collectionPageJsonLd, breadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SINGLE_HUB } from '@/lib/hubs';

const HUB_URL = 'https://jobsingles.de/magazin/singles-partnersuche';

export const metadata = {
  title: SINGLE_HUB.seoTitle,
  description: SINGLE_HUB.seoDescription,
  alternates: { canonical: HUB_URL },
  openGraph: {
    title: SINGLE_HUB.seoTitle,
    description: SINGLE_HUB.seoDescription,
    url: HUB_URL,
    type: 'website',
    siteName: 'Jobsingles Magazin',
    locale: 'de-DE',
  },
};

const HUB_COLORS = [
  { r: 220, g: 60, b: 50 },
  { r: 255, g: 145, b: 60 },
  { r: 255, g: 200, b: 70 },
];

export default async function SinglesPartnersuche() {
  const all = await reader.collections.articles.all();
  const articles = all
    .filter((a) => a.entry.status === 'published')
    .sort((a, b) => (b.entry.publishedAt || '').localeCompare(a.entry.publishedAt || ''));

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: 'Partnersuche der Berufe — Hub',
          description: SINGLE_HUB.seoDescription,
          url: HUB_URL,
          items: articles.slice(0, 12).map((a) => ({
            name: a.entry.title,
            url: `https://jobsingles.de/magazin${articleHref(a)}`,
          })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Magazin', url: 'https://jobsingles.de/magazin' },
          { name: 'Partnersuche', url: HUB_URL },
        ])}
      />

      <PillarHero
        title="Partnersuche"
        texts={[
          'Liebe trotz Beruf',
          'Schichtdienst trifft Beziehung',
          'Dating der Berufe',
          'Jemand, der deinen Alltag versteht',
          'Jobsingles',
        ]}
        subtitle="Partnersuche für Menschen mit fordernden Berufen. Beruf-Verständnis ohne Erklärung."
        colors={HUB_COLORS}
      />

      <div className="max-w-6xl mx-auto px-6">
        <Breadcrumbs items={[{ label: 'Partnersuche', href: '/singles-partnersuche' }]} />
      </div>

      {articles.length > 0 && (
        <ScrollReveal>
          <section className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold mb-8 pb-2 border-b-2 border-brand-orange">Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {articles.map((a) => (
                <ArticleCard
                  key={a.slug}
                  title={a.entry.title}
                  excerpt={a.entry.excerpt}
                  href={articleHref(a)}
                  image={a.entry.featuredImage || undefined}
                  imageAlt={a.entry.featuredImageAlt || undefined}
                  category={a.entry.category}
                  date={a.entry.publishedAt || undefined}
                />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <section className="text-center py-12 px-6">
          <h2 className="text-2xl font-bold mb-4">Bereit für die Partnersuche?</h2>
          <p className="text-foreground/60 mb-8 max-w-lg mx-auto">
            Singles mit fordernden Berufen warten auf dich — Menschen, die deinen Alltag verstehen.
          </p>
          <HeartButton href="https://jobsingles.de/?AID=JobsinglesMagazin">
            Jetzt kostenfrei mitmachen
          </HeartButton>
        </section>
      </ScrollReveal>
    </>
  );
}
