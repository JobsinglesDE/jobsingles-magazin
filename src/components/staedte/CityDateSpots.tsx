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
  const spots = [...pool.slice(offset), ...pool.slice(0, offset)].slice(0, 4);

  return (
    <section className="my-12">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground">
          Orte fürs erste Date in {stadtName}
        </h2>
        <span className="text-[11px] text-foreground/40">Quelle: OpenStreetMap</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {spots.map((s, i) => (
          <div
            key={`${s.name}-${i}`}
            className="flex items-center gap-4 rounded-2xl bg-surface border border-foreground/10 p-4 relative overflow-hidden"
          >
            {/* Kategorie-Marke: goldener Eckakzent */}
            <div
              className="absolute -left-6 -top-6 w-12 h-12 rotate-45 bg-secondary/25"
              aria-hidden
            />
            <div className="w-11 h-11 rounded-full grid place-items-center bg-secondary/15 text-lg flex-shrink-0" aria-hidden>
              {s.amenity === 'cafe' || s.amenity === 'ice_cream' ? '☕' : s.amenity === 'restaurant' ? '🍽️' : s.amenity === 'biergarten' ? '🍻' : '🍸'}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                {s.category}
                {s.distanceKm > 0 && <span className="ml-2 normal-case tracking-normal font-semibold text-foreground/50">{s.distanceKm} km vom Zentrum</span>}
              </p>
              <p className="font-bold text-foreground truncate">{s.name}</p>
              {s.address && <p className="text-xs text-foreground/55 truncate">{s.address}</p>}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-foreground/40">
        Daten:{' '}
        <a href="https://www.openstreetmap.org/copyright" rel="nofollow noopener" target="_blank" className="underline hover:text-primary">
          © OpenStreetMap contributors
        </a>{' '}
        (ODbL) — Angaben ohne Gewähr.
      </p>
    </section>
  );
}
