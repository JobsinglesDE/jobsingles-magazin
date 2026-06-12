import { notFound } from 'next/navigation';
import { reader } from '@/lib/keystatic';
import { HeartButton } from '@/components/ui/HeartButton';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/components/seo/JsonLd';
import { BUNDESLAENDER, bundeslandName } from '@/lib/bundeslaender';
import { CityIntentNav } from '@/components/staedte/CityIntentNav';
import { ProfileFeed } from '@/components/staedte/ProfileFeed';
import { CityGeoLinks } from '@/components/staedte/CityGeoLinks';
import { CityStats } from '@/components/staedte/CityStats';
import { CityFooterLinks } from '@/components/staedte/CityFooterLinks';
import { PartnerRecommendation } from '@/components/staedte/PartnerRecommendation';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { INTENT_SLUGS, getIntent } from '@/lib/intents';

const BASE_URL = 'https://jobsingles.de/magazin';
type Params = Promise<{ bundesland: string; stadt: string; intent: string }>;

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const all = await reader.collections.staedte.all();
  const cities = all.filter((a) => a.entry.status === 'published');
  // jede Stadt × Intents (aktuell 3)
  return cities.flatMap((a) =>
    INTENT_SLUGS.map((intent) => ({ bundesland: a.entry.bundesland, stadt: a.entry.stadt, intent }))
  );
}

async function findCity(bundesland: string, stadt: string) {
  const all = await reader.collections.staedte.all();
  const found = all.find(
    (a) => a.entry.status === 'published' && a.entry.bundesland === bundesland && a.entry.stadt === stadt
  );
  if (!found) return null;
  const full = await reader.collections.staedte.read(found.slug, { resolveLinkedFiles: true });
  return full ? { slug: found.slug, entry: full } : null;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { bundesland, stadt, intent } = await params;
  const intentDef = getIntent(intent);
  const city = await findCity(bundesland, stadt);
  if (!intentDef || !city) return {};
  const name = city.entry.title;
  const url = `${BASE_URL}/singles-regional/staedte/${bundesland}/${stadt}/${intent}`;
  const title = intentDef.seoTitle(name);
  const description = intentDef.intro(name);
  const image = `${BASE_URL}/logos/jobsingles-logo.png`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', images: [{ url: image, width: 1200, height: 630, alt: title }], siteName: 'Jobsingles Magazin', locale: 'de_DE' },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function IntentPage({ params }: { params: Params }) {
  const { bundesland, stadt, intent } = await params;
  if (!BUNDESLAENDER[bundesland]) notFound();
  const intentDef = getIntent(intent);
  if (!intentDef) notFound();
  const city = await findCity(bundesland, stadt);
  if (!city) notFound();

  const e = city.entry;
  const name = e.title;
  const blName = bundeslandName(bundesland);
  const cityBase = `/singles-regional/staedte/${bundesland}/${stadt}`;
  const url = `${BASE_URL}${cityBase}/${intent}`;

  const faqItems = intentDef.faq(name);

  return (
    <>
      <JsonLd data={articleJsonLd({ title: intentDef.h1(name), description: intentDef.intro(name), url })} />
      <JsonLd data={faqJsonLd(faqItems)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Magazin', url: BASE_URL },
        { name: 'Singles Regional', url: `${BASE_URL}/singles-regional` },
        { name: 'Deutschland', url: `${BASE_URL}/singles-regional/staedte` },
        { name: blName, url: `${BASE_URL}/singles-regional/staedte/${bundesland}` },
        { name, url: `${BASE_URL}${cityBase}` },
        { name: intentDef.menuLabel, url },
      ])} />

      <CityIntentNav cityBase={cityBase} stadtName={name} activeSlug={intent} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Singles Regional', href: '/singles-regional' },
          { label: 'Deutschland', href: '/singles-regional/staedte' },
          { label: blName, href: `/singles-regional/staedte/${bundesland}` },
          { label: name, href: cityBase },
          { label: intentDef.menuLabel, href: `${cityBase}/${intent}` },
        ]} />

        <header className="mt-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">{intentDef.h1(name)}</h1>
          <p className="mt-3 text-foreground/70 max-w-2xl">{intentDef.intro(name)}</p>
        </header>

        <PartnerRecommendation partnerKey={intentDef.partner} stadtName={name} intentLabel={intentDef.menuLabel} />

        <CityStats name={name} e={e} />

        <ProfileFeed stadtName={name} kreis={e.kreis || undefined} bundesland={bundesland} intent={intentDef} />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-6">Häufige Fragen: {intentDef.menuLabel} in {name}</h2>
          <FAQAccordion items={faqItems} />
        </section>

        <CityGeoLinks bundesland={bundesland} kreis={e.kreis || undefined} />

        <CityFooterLinks name={name} kreis={e.kreis || undefined} currentStadt={stadt} cityBase={cityBase} />
      </div>

      <section className="text-center py-14 px-6">
        <p className="text-lg font-bold mb-2">{intentDef.h1(name)}</p>
        <HeartButton href="https://jobsingles.de/?AID=JobsinglesMagazin">Jetzt kostenfrei mitmachen</HeartButton>
      </section>
    </>
  );
}
