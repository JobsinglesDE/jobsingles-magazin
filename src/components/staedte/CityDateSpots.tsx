import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Intent } from '@/lib/intents';

/**
 * „Orte fürs erste Date in {Stadt}" — echte Bars/Cafés/Restaurants aus OpenStreetMap
 * (scripts/osm-spots-puller.mjs → src/data/spots/{stadt}.json). Unser Pendant zum
 * meinestadt-Branchenbuch-Block, aber Open Data (ODbL, Attribution unten).
 *
 * Uniqueness: Kategorien-Mix + Auswahl rotieren PRO INTENT (deterministischer Seed) —
 * jede Intent-Seite derselben Stadt zeigt andere Spots = andere Content-Bausteine,
 * genau wie meinestadt pro Intent-Seite andere Links einspielt.
 */

type Spot = {
  name: string;
  category: string;
  amenity: string;
  address: string;
  distanceKm: number;
};

// Intent-Slug → bevorzugte Kategorien (Reihenfolge = Priorität)
const INTENT_CATS: Record<string, string[]> = {
  seitensprung: ['bar', 'wine_bar', 'pub'],
  'freundschaft-plus': ['bar', 'pub', 'cafe'],
  'partnersuche-50-plus': ['cafe', 'restaurant', 'wine_bar'],
  'senioren-partnersuche': ['cafe', 'restaurant'],
  partnervermittlung: ['restaurant', 'wine_bar', 'cafe'],
  'landwirt-sucht-frau': ['biergarten', 'pub', 'restaurant'],
  'freunde-finden': ['cafe', 'ice_cream', 'biergarten'],
};
const DEFAULT_CATS = ['cafe', 'bar', 'restaurant', 'biergarten'];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

async function loadSpots(stadtSlug: string): Promise<Spot[]> {
  try {
    const raw = await readFile(join(process.cwd(), 'src', 'data', 'spots', `${stadtSlug}.json`), 'utf8');
    return (JSON.parse(raw).spots as Spot[]) ?? [];
  } catch {
    return []; // Stadt ohne Spots-Datei → Sektion wird nicht gerendert
  }
}

export async function CityDateSpots({
  stadtSlug,
  stadtName,
  intent,
}: {
  stadtSlug: string;
  stadtName: string;
  intent?: Intent;
}) {
  const all = await loadSpots(stadtSlug);
  if (all.length === 0) return null;

  const cats = (intent && INTENT_CATS[intent.slug]) || DEFAULT_CATS;
  const seed = hashStr(stadtSlug + (intent?.slug ?? 'main'));

  // Kategorie-priorisiert sortieren, dann seed-rotiert 4 auswählen
  const ranked = [...all].sort((a, b) => {
    const ra = cats.indexOf(a.amenity) === -1 ? 99 : cats.indexOf(a.amenity);
    const rb = cats.indexOf(b.amenity) === -1 ? 99 : cats.indexOf(b.amenity);
    return ra - rb || a.distanceKm - b.distanceKm;
  });
  const pool = ranked.slice(0, 8);
  const offset = pool.length > 0 ? seed % pool.length : 0;
  const spots = [...pool.slice(offset), ...pool.slice(0, offset)].slice(0, 3);

  const icon = (a: string) =>
    a === 'cafe' || a === 'ice_cream' ? '☕' : a === 'restaurant' ? '🍽️' : a === 'biergarten' ? '🍻' : '🍸';
  const mapsUrl = (s: Spot) =>
    `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${s.name} ${stadtName}`)}`;

  return (
    <section className="my-12">
      <p className="text-[11px] uppercase tracking-widest font-bold text-primary mb-1">Treffpunkte</p>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
        {spots.length} Date-Orte in {stadtName}
      </h2>
      <p className="text-foreground/60 mb-6 text-sm">
        Ausgewählte Treffpunkte für ein unkompliziertes erstes Date — kurz inspirieren lassen, Karte öffnen, los.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        {spots.map((s, i) => (
          <div
            key={`${s.name}-${i}`}
            className="group relative h-full flex flex-col rounded-2xl bg-surface border border-foreground/10 p-5 overflow-hidden transition-shadow hover:shadow-lg"
          >
            {/* große Nummer als Wasserzeichen */}
            <span className="pointer-events-none absolute -right-2 -top-3 text-7xl font-black text-secondary/10 leading-none select-none">
              {i + 1}
            </span>

            <div className="relative flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl grid place-items-center bg-secondary/15 text-2xl flex-shrink-0" aria-hidden>
                {icon(s.amenity)}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-block rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide px-2.5 py-1">
                  {s.category}
                </span>
                {s.distanceKm > 0 && (
                  <span className="inline-block rounded-full bg-foreground/5 text-foreground/55 text-[10px] font-semibold px-2.5 py-1">
                    {s.distanceKm} km vom Zentrum
                  </span>
                )}
              </div>
            </div>

            <p className="relative font-bold text-foreground text-lg leading-snug">{s.name}</p>
            {s.address && <p className="relative text-xs text-foreground/55 mt-0.5">{s.address}</p>}

            <a
              href={mapsUrl(s)}
              rel="nofollow noopener"
              target="_blank"
              className="relative mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
            >
              Auf Karte öffnen
              <span aria-hidden>→</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
