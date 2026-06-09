import Link from 'next/link';
import { bundeslandName } from '@/lib/bundeslaender';

function kreisSlug(kreis: string): string {
  return kreis
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Geo-Wirbelsäule wie meinestadt: jede Stadt-/Intent-Seite verlinkt nach oben
 * → Deutschland-, Bundesland-, Kreis-Hub. Reiner hierarchischer Juice-Fluss
 * (keine direkten Nachbarstadt-Links — die laufen über den Kreis-Hub).
 */
export function CityGeoLinks({ bundesland, kreis }: { bundesland: string; kreis?: string }) {
  return (
    <nav aria-label="Regionen" className="mt-12 pt-6 border-t border-foreground/10">
      <p className="text-xs uppercase tracking-wide text-foreground/40 mb-2">Singles in der Region</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {kreis && (
          <li>
            <Link href={`/singles-regional/staedte/kreis/${kreisSlug(kreis)}`} className="text-primary hover:underline">
              Singles im {kreis}
            </Link>
          </li>
        )}
        <li>
          <Link href={`/singles-regional/staedte/${bundesland}`} className="text-primary hover:underline">
            Singles in {bundeslandName(bundesland)}
          </Link>
        </li>
        <li>
          <Link href="/singles-regional/staedte" className="text-primary hover:underline">
            Singles in Deutschland
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export { kreisSlug };
