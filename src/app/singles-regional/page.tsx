import { reader } from '@/lib/keystatic';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, collectionPageJsonLd, breadcrumbJsonLd } from '@/components/seo/JsonLd';
import { BUNDESLAENDER } from '@/lib/bundeslaender';

const BASE_URL = 'https://jobsingles.de/magazin';

export const metadata = {
  title: 'Singles Regional: Partnersuche nach Stadt & Bundesland',
  description: 'Singles und Partnersuche in deiner Region — sortiert nach Stadt und Bundesland.',
  alternates: { canonical: `${BASE_URL}/singles-regional` },
  openGraph: {
    title: 'Singles Regional — Partnersuche nach Region',
    description: 'Singles und Partnersuche nach Stadt und Bundesland.',
    url: `${BASE_URL}/singles-regional`,
    type: 'website',
    siteName: 'Jobsingles Magazin',
    locale: 'de-DE',
  },
};

export default async function SinglesRegionalHub() {
  const staedte = await reader.collections.staedte.all();
  const published = staedte.filter((k) => k.entry.status === 'published');
  const byBundesland = published.reduce<Record<string, number>>((acc, k) => {
    const bl = k.entry.bundesland;
    acc[bl] = (acc[bl] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: 'Singles Regional — Partnersuche nach Region',
          description: 'Singles und Partnersuche nach Stadt und Bundesland.',
          url: `${BASE_URL}/singles-regional`,
          items: [{ name: 'Städte', url: `${BASE_URL}/singles-regional/staedte` }],
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Magazin', url: BASE_URL },
          { name: 'Singles Regional', url: `${BASE_URL}/singles-regional` },
        ])}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumbs items={[{ label: 'Singles Regional', href: '/singles-regional' }]} />

        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">Singles Regional</h1>
        <p className="text-lg text-foreground/75 leading-relaxed max-w-3xl mb-12">
          Partnersuche in deiner Nähe. Finde Singles aus deiner Stadt und deinem Bundesland —
          Menschen, die deinen Alltag und deine Region kennen.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-brand-orange">Städte</h2>
          <p className="text-foreground/70 mb-8 leading-relaxed max-w-3xl">
            Singles und Partnersuche, sortiert nach Stadt und Bundesland.
          </p>
          <Link
            href="/singles-regional/staedte"
            className="inline-block px-6 py-3 rounded-lg bg-brand-orange text-white font-semibold hover:bg-brand-orange/90 transition"
          >
            Zu den Städten
          </Link>
        </section>

        {Object.keys(byBundesland).length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-brand-orange">Direkt zum Bundesland</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(byBundesland)
                .sort((a, b) => b[1] - a[1])
                .map(([bl, count]) => (
                  <Link
                    key={bl}
                    href={`/singles-regional/staedte/${bl}`}
                    className="block px-4 py-3 rounded-lg bg-surface border border-foreground/10 hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-colors"
                  >
                    <div className="text-base font-bold capitalize">{BUNDESLAENDER[bl]?.name || bl.replace(/-/g, ' ')}</div>
                    <div className="text-xs text-foreground/50 mt-1">{count} Stadt{count > 1 ? 'ädte' : ''}</div>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
