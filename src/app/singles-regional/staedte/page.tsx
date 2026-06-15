import Link from 'next/link';
import { reader } from '@/lib/keystatic';
import { PillarHero } from '@/components/content/PillarHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { HeartButton } from '@/components/ui/HeartButton';
import { AnimatedGradientBorder } from '@/components/ui/AnimatedGradientBorder';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, collectionPageJsonLd } from '@/components/seo/JsonLd';
import { BUNDESLAENDER, BUNDESLAND_SLUGS } from '@/lib/bundeslaender';

const PILLAR_URL = 'https://jobsingles.de/magazin/singles-regional/staedte';

export const metadata = {
  title: 'Singles Regional: Städte im Überblick',
  description: 'Singles und Partnersuche nach Stadt und Bundesland — finde Menschen aus deiner Region.',
  alternates: { canonical: PILLAR_URL },
  openGraph: {
    title: 'Singles Regional — Städte',
    description: 'Singles und Partnersuche nach Stadt und Bundesland.',
    url: PILLAR_URL,
    type: 'website',
    siteName: 'Jobsingles Magazin',
    locale: 'de-DE',
  },
};

const HERO_COLORS = [
  { r: 15, g: 139, b: 141 },
  { r: 47, g: 181, b: 184 },
  { r: 255, g: 122, b: 0 },
];

export default async function StaedtePillar() {
  const all = await reader.collections.staedte.all();
  const published = all.filter((a) => a.entry.status === 'published');

  function countByBL(slug: string) {
    return published.filter((a) => a.entry.bundesland === slug).length;
  }

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: 'Städte — Singles Regional',
          description: 'Singles und Partnersuche nach Stadt und Bundesland.',
          url: PILLAR_URL,
          items: BUNDESLAND_SLUGS.map((s) => ({
            name: BUNDESLAENDER[s].name,
            url: `${PILLAR_URL}/${s}`,
          })),
        })}
      />

      <PillarHero
        title="Singles Regional"
        texts={[
          'Singles in deiner Stadt',
          'Partnersuche nach Region',
          'Liebe vor der Haustür',
          'Singles Regional',
        ]}
        subtitle="Singles und Partnersuche nach Stadt und Bundesland — finde Menschen aus deiner Region."
        colors={HERO_COLORS}
      />

      <div className="max-w-6xl mx-auto px-6">
        <Breadcrumbs items={[
          { label: 'Singles Regional', href: '/singles-regional' },
          { label: 'Städte', href: '/singles-regional/staedte' },
        ]} />
      </div>

      <ScrollReveal>
        <section className="max-w-3xl mx-auto px-6 py-8">
          <AnimatedGradientBorder borderRadius={16} borderWidth={2}>
            <div className="bg-surface-dark rounded-xl p-6 text-white/90">
              <p className="text-base leading-relaxed">
                Waehle dein Bundesland und deine Stadt: hier findest du Singles und Partnersuche in deiner Region.
              </p>
            </div>
          </AnimatedGradientBorder>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="text-center py-6 px-6">
          <HeartButton href="https://jobsingles.de/?AID=JobsinglesMagazin">
            Jetzt kostenfrei mitmachen
          </HeartButton>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-brand-orange">
            Wähle dein Bundesland
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {BUNDESLAND_SLUGS.map((slug) => {
              const bl = BUNDESLAENDER[slug];
              const count = countByBL(slug);
              return (
                <Link
                  key={slug}
                  href={`/singles-regional/staedte/${slug}`}
                  className="group relative block p-5 rounded-xl bg-surface border border-foreground/10 hover:border-brand-orange/50 transition-colors"
                >
                  <div className="text-3xl mb-2">{bl.emoji}</div>
                  <div className="text-base font-bold text-foreground group-hover:text-brand-orange transition-colors leading-tight">
                    {bl.name}
                  </div>
                  <div className="text-xs text-foreground/50 mt-2">
                    {count > 0 ? `${count} Stadt${count > 1 ? 'ädte' : ''}` : 'In Vorbereitung'}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {published.length > 0 && (
        <ScrollReveal>
          <section className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-brand-orange">
              Direkt zur Stadt
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {published
                .slice()
                .sort((a, b) => (a.entry.stadt || '').localeCompare(b.entry.stadt || ''))
                .map((k) => (
                  <Link
                    key={k.slug}
                    href={`/singles-regional/staedte/${k.entry.bundesland}/${k.entry.stadt}`}
                    className="block px-4 py-3 rounded-lg bg-surface border border-foreground/10 hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-colors"
                  >
                    <div className="text-base font-bold text-foreground capitalize">
                      {(k.entry.stadt || '').replace(/-/g, ' ')}
                    </div>
                    <div className="text-xs text-foreground/50 mt-1">
                      {BUNDESLAENDER[k.entry.bundesland]?.name || k.entry.bundesland}
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <section className="text-center py-16 px-6">
          <h2 className="text-2xl font-bold mb-4">Lieber direkt zum Match?</h2>
          <p className="text-foreground/60 mb-8 max-w-lg mx-auto">
            Singles aus jedem Bundesland — auf Jobsingles.de.
          </p>
          <HeartButton href="https://jobsingles.de/?AID=JobsinglesMagazin">
            Jetzt kostenfrei mitmachen
          </HeartButton>
        </section>
      </ScrollReveal>
    </>
  );
}
