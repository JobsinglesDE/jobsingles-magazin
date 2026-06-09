import Link from 'next/link';
import { reader } from '@/lib/keystatic';
import { INTENTS } from '@/lib/intents';
import { kreisSlug } from '@/components/staedte/CityGeoLinks';

/**
 * Großer SEO-Link-Block am Seitenende (wie meinestadt): Umgebung (Nachbarstädte),
 * Dating-Kategorien (unsere Intents) und Magazin-Ratgeber. NUR echte, existierende
 * Seiten (kein 404-Doorway). Async Server-Component.
 */
export async function CityFooterLinks({
  name,
  kreis,
  currentStadt,
  cityBase,
}: {
  name: string;
  kreis?: string | null;
  currentStadt: string;
  cityBase: string;
}) {
  const [staedte, articles] = await Promise.all([
    reader.collections.staedte.all(),
    reader.collections.articles.all().catch(() => []),
  ]);

  const kSlug = kreis ? kreisSlug(kreis) : '';
  const siblings = kreis
    ? staedte
        .filter(
          (a) =>
            a.entry.status === 'published' &&
            a.entry.kreis &&
            kreisSlug(a.entry.kreis) === kSlug &&
            a.entry.stadt !== currentStadt
        )
        .sort((a, b) => (a.entry.title || '').localeCompare(b.entry.title || ''))
    : [];

  const guides = articles
    .filter((a) => a.entry.status === 'published')
    .slice(0, 8);

  return (
    <section className="mt-16 border-t border-foreground/10 pt-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        {/* Umgebung */}
        {siblings.length > 0 && (
          <div>
            <h3 className="font-bold text-foreground mb-3">Singles in der Umgebung</h3>
            <ul className="space-y-2">
              {siblings.map((c) => (
                <li key={c.slug}>
                  <Link href={`/singles-regional/staedte/${c.entry.bundesland}/${c.entry.stadt}`} className="text-foreground/70 hover:text-primary">
                    Singles in {c.entry.title}
                  </Link>
                </li>
              ))}
              {kSlug && (
                <li>
                  <Link href={`/singles-regional/staedte/kreis/${kSlug}`} className="font-semibold text-primary hover:underline">
                    Alle Städte im {kreis} →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Dating-Kategorien (Intents) */}
        <div>
          <h3 className="font-bold text-foreground mb-3">Dating in {name}</h3>
          <ul className="space-y-2">
            {INTENTS.map((i) => (
              <li key={i.slug}>
                <Link href={`${cityBase}/${i.slug}`} className="text-foreground/70 hover:text-primary">
                  {i.menuLabel} in {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Magazin / Ratgeber */}
        {guides.length > 0 && (
          <div>
            <h3 className="font-bold text-foreground mb-3">Ratgeber & Magazin</h3>
            <ul className="space-y-2">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link href={`/singles-partnersuche/${g.slug}`} className="text-foreground/70 hover:text-primary">
                    {g.entry.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/singles-partnersuche" className="font-semibold text-primary hover:underline">
                  Zum Dating-Magazin →
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
