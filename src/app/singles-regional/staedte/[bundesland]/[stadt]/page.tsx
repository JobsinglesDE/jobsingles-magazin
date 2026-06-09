import { notFound } from 'next/navigation';
import { reader } from '@/lib/keystatic';
import { ArticleBody } from '@/components/content/ArticleBody';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { HeartButton } from '@/components/ui/HeartButton';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, articleJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/components/seo/JsonLd';
import { BUNDESLAENDER, bundeslandName } from '@/lib/bundeslaender';
import { CityIntentNav } from '@/components/staedte/CityIntentNav';
import { ProfileFeed } from '@/components/staedte/ProfileFeed';
import { CityGeoLinks } from '@/components/staedte/CityGeoLinks';
import { CityStats } from '@/components/staedte/CityStats';
import { CitySearchBox } from '@/components/staedte/CitySearchBox';
import { CityFooterLinks } from '@/components/staedte/CityFooterLinks';

const BASE_URL = 'https://jobsingles.de/magazin';
type Params = Promise<{ bundesland: string; stadt: string }>;

export const revalidate = 86400; // ISR — Skalierung auf viele Städte
export const dynamicParams = true;

export async function generateStaticParams() {
  const all = await reader.collections.staedte.all();
  return all
    .filter((a) => a.entry.status === 'published')
    .map((a) => ({ bundesland: a.entry.bundesland, stadt: a.entry.stadt }));
}

async function findEntry(bundesland: string, stadt: string) {
  const all = await reader.collections.staedte.all();
  const found = all.find(
    (a) => a.entry.status === 'published' && a.entry.bundesland === bundesland && a.entry.stadt === stadt
  );
  if (!found) return null;
  const full = await reader.collections.staedte.read(found.slug, { resolveLinkedFiles: true });
  return full ? { slug: found.slug, entry: full } : null;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { bundesland, stadt } = await params;
  const entry = await findEntry(bundesland, stadt);
  if (!entry) return {};
  const e = entry.entry;
  const name = e.title;
  const url = `${BASE_URL}/singles-regional/staedte/${bundesland}/${stadt}`;
  const title = e.seoTitle || `Singles in ${name} – Dating & Bekanntschaften`;
  const description = e.seoDescription || e.intro || `Singles, Dating und Bekanntschaften in ${name} und Umgebung.`;
  const image = `${BASE_URL}/logos/jobsingles-logo.png`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', images: [{ url: image, width: 1200, height: 630, alt: title }], siteName: 'Jobsingles Magazin', locale: 'de_DE' },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function StadtPage({ params }: { params: Params }) {
  const { bundesland, stadt } = await params;
  if (!BUNDESLAENDER[bundesland]) notFound();
  const entry = await findEntry(bundesland, stadt);
  if (!entry) notFound();

  const e = entry.entry;
  const name = e.title;
  const blName = bundeslandName(bundesland);
  const cityBase = `/singles-regional/staedte/${bundesland}/${stadt}`;
  const url = `${BASE_URL}${cityBase}`;

  return (
    <>
      <JsonLd data={articleJsonLd({ title: `Singles in ${name}`, description: e.intro || '', url, datePublished: e.publishedAt || undefined })} />
      {e.faqItems && e.faqItems.length > 0 && <JsonLd data={faqJsonLd(e.faqItems)} />}
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Magazin', url: BASE_URL },
        { name: 'Singles Regional', url: `${BASE_URL}/singles-regional` },
        { name: 'Deutschland', url: `${BASE_URL}/singles-regional/staedte` },
        { name: blName, url: `${BASE_URL}/singles-regional/staedte/${bundesland}` },
        { name, url },
      ])} />

      <CityIntentNav cityBase={cityBase} stadtName={name} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Singles Regional', href: '/singles-regional' },
          { label: 'Deutschland', href: '/singles-regional/staedte' },
          { label: blName, href: `/singles-regional/staedte/${bundesland}` },
          { label: name, href: cityBase },
        ]} />

        {/* Hero */}
        <header className="mt-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Singles in {name} und Umgebung
          </h1>
          <p className="mt-3 text-foreground/70 max-w-2xl">
            {e.intro || `Lerne Singles aus ${name} kennen — Partnersuche, Dating und Bekanntschaften in deiner Region.`}
          </p>
        </header>

        {/* Starte direkt mit deiner Suche */}
        <CitySearchBox stadtName={name} cityBase={cityBase} />

        {/* Profil-Ausspielung gesplittet (Platzhalter → später ICONY-Feed) */}
        <ProfileFeed stadtName={name} gender="f" heading={`Zum Verlieben: Single-Frauen aus ${name}`} count={8} />

        {/* Element dazwischen — Register-CTA-Strip */}
        <div className="my-6 rounded-2xl bg-primary px-6 py-5 text-center text-on-primary">
          <p className="font-bold text-lg">Wen möchtest du in {name} kennenlernen?</p>
          <p className="text-on-primary/80 text-sm mt-1 mb-3">Kostenlos anmelden und sofort losflirten.</p>
          <HeartButton href="https://jobsingles.de/registration/?AID=JobsinglesMagazin">Jetzt kostenlos registrieren</HeartButton>
        </div>

        <ProfileFeed stadtName={name} gender="m" heading={`Zum Verlieben: Single-Männer aus ${name}`} count={8} />

        {/* Zensus-Datenblock — unser Vorsprung vs. meinestadt */}
        <CityStats name={name} e={e} />

        {e.content && (
          <div className="prose-jobsingles my-8">
            <ArticleBody content={e.content} />
          </div>
        )}

        {e.faqItems && e.faqItems.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-3">Häufige Fragen</h2>
            <FAQAccordion items={e.faqItems} />
          </section>
        )}

        <CityGeoLinks bundesland={bundesland} kreis={e.kreis || undefined} />

        <CityFooterLinks name={name} kreis={e.kreis || undefined} currentStadt={stadt} cityBase={cityBase} />
      </div>

      <section className="text-center py-14 px-6">
        <p className="text-lg font-bold mb-2">Lerne Singles in {name} kennen</p>
        <HeartButton href="https://jobsingles.de/?AID=JobsinglesMagazin">Jetzt kostenfrei mitmachen</HeartButton>
      </section>
    </>
  );
}
