import Link from 'next/link';
import { notFound } from 'next/navigation';
import { reader } from '@/lib/keystatic';
import { ArticleCard } from '@/components/content/ArticleCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { HeartButton } from '@/components/ui/HeartButton';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, collectionPageJsonLd } from '@/components/seo/JsonLd';
import { BUNDESLAENDER, BUNDESLAND_SLUGS, bundeslandName, bundeslandEmoji } from '@/lib/bundeslaender';

export async function generateStaticParams() {
  return BUNDESLAND_SLUGS.map((bundesland) => ({ bundesland }));
}

export async function generateMetadata({ params }: { params: Promise<{ bundesland: string }> }) {
  const { bundesland } = await params;
  if (!BUNDESLAENDER[bundesland]) return {};
  const name = bundeslandName(bundesland);
  const url = `https://jobsingles.de/magazin/singles-regional/staedte/${bundesland}`;
  return {
    title: `Singles ${name} — Partnersuche nach Stadt`,
    description: `Singles und Partnersuche in ${name}: finde Menschen aus deiner Region.`,
    alternates: { canonical: url },
    openGraph: { url, type: 'website', siteName: 'Jobsingles Magazin', locale: 'de-DE' },
  };
}

export default async function StadtBundeslandPage({ params }: { params: Promise<{ bundesland: string }> }) {
  const { bundesland } = await params;
  if (!BUNDESLAENDER[bundesland]) notFound();

  const all = await reader.collections.staedte.all();
  const inBL = all.filter((a) => a.entry.status === 'published' && a.entry.bundesland === bundesland);

  const blName = bundeslandName(bundesland);
  const url = `https://jobsingles.de/magazin/singles-regional/staedte/${bundesland}`;

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: `Singles ${blName}`,
          description: `Singles und Partnersuche in ${blName}.`,
          url,
          items: inBL.map((a) => ({
            name: a.entry.title,
            url: `https://jobsingles.de/magazin/singles-regional/staedte/${bundesland}/${a.entry.stadt}`,
          })),
        })}
      />
      <section className="relative overflow-hidden min-h-[280px] md:min-h-[360px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-medical-teal/40 via-surface-dark to-background" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="text-7xl mb-4">{bundeslandEmoji(bundesland)}</div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            Singles <span className="text-brand-orange-text">{blName}</span>
          </h1>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto mt-4 leading-relaxed">
            Partnersuche in {blName} — Stadt für Stadt.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <Breadcrumbs items={[
          { label: 'Singles Regional', href: '/singles-regional' },
          { label: 'Städte', href: '/singles-regional/staedte' },
          { label: blName, href: `/singles-regional/staedte/${bundesland}` },
        ]} />
      </div>

      {inBL.length === 0 ? (
        <ScrollReveal>
          <section className="max-w-3xl mx-auto px-6 py-16 text-center">
            <p className="text-lg text-foreground/70 mb-6">
              Seiten für {blName} sind in Vorbereitung. Während wir die Recherche finalisieren —
              Jobsingles.de wartet nicht.
            </p>
            <HeartButton href="https://jobsingles.de/?AID=JobsinglesMagazin">
              Jetzt kostenfrei mitmachen
            </HeartButton>
          </section>
        </ScrollReveal>
      ) : (
        <ScrollReveal>
          <section className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold mb-8 pb-2 border-b-2 border-brand-orange">
              Städte in {blName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {inBL.map((a) => (
                <ArticleCard
                  key={a.slug}
                  title={a.entry.title}
                  excerpt={a.entry.intro}
                  href={`/singles-regional/staedte/${bundesland}/${a.entry.stadt}`}
                  category="Stadt"
                  date={a.entry.publishedAt || undefined}
                />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <Link
            href="/singles-regional/staedte"
            className="text-brand-orange-text hover:underline text-sm"
          >
            ← zurück zur Städte-Uebersicht
          </Link>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="text-center py-16 px-6">
          <h2 className="text-2xl font-bold mb-4">Direkt zu den Singles in {blName}?</h2>
          <p className="text-foreground/60 mb-8 max-w-lg mx-auto">
            Lokale Singles auf Jobsingles.de finden.
          </p>
          <HeartButton href="https://jobsingles.de/?AID=JobsinglesMagazin">
            Jetzt kostenfrei mitmachen
          </HeartButton>
        </section>
      </ScrollReveal>
    </>
  );
}
