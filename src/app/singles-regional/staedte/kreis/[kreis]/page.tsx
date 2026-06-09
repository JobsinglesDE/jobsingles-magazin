import Link from 'next/link';
import { notFound } from 'next/navigation';
import { reader } from '@/lib/keystatic';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, breadcrumbJsonLd } from '@/components/seo/JsonLd';
import { bundeslandName } from '@/lib/bundeslaender';
import { kreisSlug } from '@/components/staedte/CityGeoLinks';

const BASE_URL = 'https://jobsingles.de/magazin';
type Params = Promise<{ kreis: string }>;

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const all = await reader.collections.staedte.all();
  const kreise = new Set(
    all.filter((a) => a.entry.status === 'published' && a.entry.kreis).map((a) => kreisSlug(a.entry.kreis!))
  );
  return [...kreise].map((kreis) => ({ kreis }));
}

async function citiesInKreis(slug: string) {
  const all = await reader.collections.staedte.all();
  return all.filter(
    (a) => a.entry.status === 'published' && a.entry.kreis && kreisSlug(a.entry.kreis) === slug
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const { kreis } = await params;
  const cities = await citiesInKreis(kreis);
  if (cities.length === 0) return {};
  const kreisName = cities[0].entry.kreis || kreis;
  const url = `${BASE_URL}/singles-regional/staedte/kreis/${kreis}`;
  const title = `Singles im ${kreisName} – Partnersuche & Bekanntschaften`;
  const description = `Singles, Dating und Bekanntschaften im ${kreisName}: alle Städte und Gemeinden auf einen Blick.`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: 'Jobsingles Magazin', locale: 'de_DE' } };
}

export default async function KreisPage({ params }: { params: Params }) {
  const { kreis } = await params;
  const cities = await citiesInKreis(kreis);
  if (cities.length === 0) notFound();
  const kreisName = cities[0].entry.kreis || kreis;
  const bundesland = cities[0].entry.bundesland;
  const url = `${BASE_URL}/singles-regional/staedte/kreis/${kreis}`;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Magazin', url: BASE_URL },
        { name: 'Singles Regional', url: `${BASE_URL}/singles-regional` },
        { name: 'Deutschland', url: `${BASE_URL}/singles-regional/staedte` },
        { name: bundeslandName(bundesland), url: `${BASE_URL}/singles-regional/staedte/${bundesland}` },
        { name: kreisName, url },
      ])} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Breadcrumbs items={[
          { label: 'Singles Regional', href: '/singles-regional' },
          { label: 'Deutschland', href: '/singles-regional/staedte' },
          { label: bundeslandName(bundesland), href: `/singles-regional/staedte/${bundesland}` },
          { label: kreisName, href: `/singles-regional/staedte/kreis/${kreis}` },
        ]} />

        <h1 className="mt-6 text-3xl font-extrabold text-foreground">Singles im {kreisName}</h1>
        <p className="mt-3 text-foreground/70">
          Partnersuche und Bekanntschaften im {kreisName}. Wähle deine Stadt:
        </p>

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cities
            .sort((a, b) => (a.entry.title || '').localeCompare(b.entry.title || ''))
            .map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/singles-regional/staedte/${c.entry.bundesland}/${c.entry.stadt}`}
                  className="block p-4 rounded-lg bg-surface border border-foreground/10 hover:border-primary/50 hover:bg-primary/5 transition-colors font-semibold text-foreground"
                >
                  Singles in {c.entry.title}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
