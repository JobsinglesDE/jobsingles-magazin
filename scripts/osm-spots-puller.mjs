#!/usr/bin/env node
/**
 * OSM-Spots-Puller — "Orte fürs erste Date" pro Stadt aus OpenStreetMap (Overpass).
 * Vorbild: meinestadt-Branchenbuch-Block (Bar/Restaurant + Adresse + km vom Zentrum).
 * Gratis, cachebar (SEO-safe, anders als Google Places). Skaliert auf alle Städte.
 *
 * Schreibt: src/data/spots/<stadt-slug>.json  (von CityDateSpots gelesen).
 *
 * Nutzung:
 *   node scripts/osm-spots-puller.mjs --stadt radolfzell-am-bodensee --name "Radolfzell am Bodensee"
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'src', 'data', 'spots');
const OVERPASS = 'https://overpass-api.de/api/interpreter';

// amenity → deutsches Label (Anzeige). Reihenfolge = Date-Tauglichkeit.
const CAT = {
  cafe: 'Café',
  bar: 'Bar',
  pub: 'Kneipe',
  restaurant: 'Restaurant',
  biergarten: 'Biergarten',
  ice_cream: 'Eiscafé',
  wine_bar: 'Weinbar',
};

function arg(flag, def = null) {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

function haversineKm(a, b) {
  const R = 6371, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

async function overpass(query) {
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Overpass liefert ohne UA 406
      'User-Agent': 'jobsingles-spots/1.0 (kontakt@jobsingles.de)',
    },
    body: 'data=' + encodeURIComponent(query),
  });
  if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
  return res.json();
}

async function pull(stadtSlug, name) {
  const amenities = Object.keys(CAT).join('|');
  const q = `[out:json][timeout:40];
area["name"="${name}"]["boundary"="administrative"]->.a;
node["place"~"^(city|town|village)$"]["name"="${name}"](area.a)->.c;
(node["amenity"~"^(${amenities})$"]["name"](area.a););
out body;
.c out center;`;
  const data = await overpass(q);
  const els = data.elements || [];

  // Zentrum: place-node, sonst Mittel aller Venues.
  const centerNode = els.find((e) => e.tags?.place);
  const venues = els.filter((e) => CAT[e.tags?.amenity] && e.tags?.name);
  const center = centerNode
    ? { lat: centerNode.lat, lon: centerNode.lon }
    : {
        lat: venues.reduce((s, e) => s + e.lat, 0) / (venues.length || 1),
        lon: venues.reduce((s, e) => s + e.lon, 0) / (venues.length || 1),
      };

  const spots = venues
    .map((e) => {
      const t = e.tags;
      const street = [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ');
      const plzort = [t['addr:postcode'], t['addr:city']].filter(Boolean).join(' ');
      return {
        name: t.name,
        category: CAT[t.amenity],
        amenity: t.amenity,
        address: [street, plzort].filter(Boolean).join(', '),
        hasAddress: Boolean(street),
        distanceKm: Math.round(haversineKm(center, { lat: e.lat, lon: e.lon }) * 100) / 100,
      };
    })
    // Mit Adresse zuerst, dann nächste am Zentrum
    .sort((a, b) => (b.hasAddress - a.hasAddress) || (a.distanceKm - b.distanceKm))
    .slice(0, 12);

  mkdirSync(OUT_DIR, { recursive: true });
  const out = join(OUT_DIR, `${stadtSlug}.json`);
  writeFileSync(out, JSON.stringify({ stadt: stadtSlug, name, source: 'OpenStreetMap', count: spots.length, spots }, null, 2));
  console.log(`✓ ${name}: ${spots.length} Spots → ${out}`);
  for (const s of spots.slice(0, 6)) console.log(`  • ${s.category} | ${s.name} | ${s.address || '(keine Adresse)'} | ${s.distanceKm} km`);
}

const stadt = arg('--stadt'), name = arg('--name');
if (!stadt || !name) { console.error('Nutzung: --stadt <slug> --name "<Stadtname>"'); process.exit(1); }
pull(stadt, name).catch((e) => { console.error('Fehler:', e.message); process.exit(1); });
