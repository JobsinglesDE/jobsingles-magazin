import { notFound } from 'next/navigation';
import { reader } from '@/lib/keystatic';
import { HeartButton } from '@/components/ui/HeartButton';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, webPageJsonLd, faqJsonLd } from '@/components/seo/JsonLd';
import { BUNDESLAENDER, bundeslandName } from '@/lib/bundeslaender';
import { CityIntentNav } from '@/components/staedte/CityIntentNav';
import { ProfileFeed } from '@/components/staedte/ProfileFeed';
import { ProfileFeedLazy } from '@/components/staedte/ProfileFeedLazy';
import { getPartner } from '@/lib/partners';
import { CityGeoLinks } from '@/components/staedte/CityGeoLinks';
import { CityStats } from '@/components/staedte/CityStats';
import { CityFooterLinks } from '@/components/staedte/CityFooterLinks';
import { PartnerRecommendation } from '@/components/staedte/PartnerRecommendation';
import { CityBadgeHero } from '@/components/staedte/CityBadgeHero';
import { CityDateSpots } from '@/components/staedte/CityDateSpots';
import { PartnerCTA } from '@/components/staedte/PartnerCTA';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { CityDatingInsight } from '@/components/staedte/CityDatingInsight';
import { CitySources } from '@/components/staedte/CitySources';
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
      <JsonLd data={webPageJsonLd({
        name: intentDef.h1(name),
        description: intentDef.intro(name),
        url,
        datePublished: e.publishedAt || undefined,
        dateModified: e.publishedAt || undefined,
        about: { name, region: blName },
      })} />
      <JsonLd data={faqJsonLd(faqItems)} />
      {/* BreadcrumbList wird allein von der <Breadcrumbs>-Komponente emittiert (kein Duplikat) */}

      <CityIntentNav cityBase={cityBase} stadtName={name} activeSlug={intent} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Singles Regional', href: '/singles-regional' },
          { label: 'Deutschland', href: '/singles-regional/staedte' },
          { label: blName, href: `/singles-regional/staedte/${bundesland}` },
          { label: name, href: cityBase },
          { label: intentDef.menuLabel, href: `${cityBase}/${intent}` },
        ]} />

        <CityBadgeHero
          name={name}
          kicker={`${intentDef.menuLabel} · ${blName}`}
          h1={intentDef.h1(name)}
          intro={intentDef.intro(name)}
          ledige={e.ledigeAnzahl || undefined}
        />

        <PartnerRecommendation partnerKey={intentDef.partner} stadtName={name} intentLabel={intentDef.menuLabel} />

        <CityStats name={name} e={e} />

        {/* Was bedeutet das fürs Dating — generierter Unique-Text aus den Zahlen */}
        <CityDatingInsight name={name} kreis={e.kreis || undefined} e={e} />

        {intentDef.feed.beruf ? (
          /* Beruf-Filter = disjunktes Profilset → serverseitig (SEO-Asset) */
          <ProfileFeed stadtName={name} kreis={e.kreis || undefined} bundesland={bundesland} intent={intentDef} />
        ) : (
          /* Geteilter ICONY-Pool (auch bei meinestadt) → client-only, kein Profil-Content im HTML */
          (() => {
            const p = getPartner(intentDef.partner);
            return (
              <ProfileFeedLazy
                stadtName={name}
                intentSlug={intentDef.slug}
                heading={intentDef.h1(name)}
                gender={intentDef.feed.gender}
                seeking={intentDef.feed.seeking}
                minAge={intentDef.feed.minAge}
                maxAge={intentDef.feed.maxAge}
                registerUrl={p.href}
                rel={p.owner === 'chris' ? 'sponsored nofollow noopener' : 'nofollow noopener'}
              />
            );
          })()
        )}

        <CityDateSpots stadtSlug={stadt} stadtName={name} intent={intentDef} />

        {/* Conversion-CTA vor den FAQs (Tommy 2026-06-12) */}
        <PartnerCTA partnerKey={intentDef.partner} stadtName={name} intentLabel={intentDef.menuLabel} />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-6">Häufige Fragen: {intentDef.menuLabel} in {name}</h2>
          <FAQAccordion items={faqItems} />
        </section>

        {/* Anmelde-CTA direkt nach der FAQ — der Conversion-Moment */}
        <section className="mt-10 mb-4 rounded-2xl bg-primary px-6 py-8 text-center text-on-primary">
          <p className="text-lg sm:text-xl font-bold mb-1">{intentDef.h1(name)}</p>
          <p className="text-on-primary/80 text-sm mb-4">Kostenlos anmelden und Singles aus deiner Region entdecken.</p>
          <HeartButton href="https://jobsingles.de/?AID=JobsinglesMagazin">Jetzt kostenfrei mitmachen</HeartButton>
        </section>

        {/* Footer-Bereich: Navigation + alle Quellen gesammelt, nofollow */}
        <CityGeoLinks bundesland={bundesland} kreis={e.kreis || undefined} />

        <CityFooterLinks name={name} kreis={e.kreis || undefined} currentStadt={stadt} cityBase={cityBase} />

        <CitySources e={e} kreis={e.kreis || undefined} stichtag={e.stichtag || undefined} />
      </div>
    </>
  );
}
