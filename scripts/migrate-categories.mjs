// scripts/migrate-categories.mjs
// Migriert Artikel-Frontmatter auf das 3-Sektionen-Modell:
//   category → {tv-koch-shows | berufsbilder | partnersuche}
//   show     ← aus bestehendem series-Feld (nur bei tv-koch-shows)
//   person   ← Vorname-Nachname aus Slug (nur bei tv-koch-shows)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'content/articles';

const CAT = {
  'gossip-promikoeche': 'tv-koch-shows',
  'karriere': 'berufsbilder',
  'partnersuche': 'partnersuche',
  'kennenlernen': 'partnersuche',
  'date-ideen': 'partnersuche',
  'beziehung': 'partnersuche',
  'hochzeit': 'partnersuche',
  'ue50': 'partnersuche',
  'news': 'partnersuche', // keine eigene News-Sektion (DFS: 90/mo) — News leben in tv-koch-shows
};

// series-Wert → show-Wert
const SERIES_TO_SHOW = {
  'grill-den-henssler': 'grill-den-henssler',
  'kitchen-impossible': 'kitchen-impossible',
  'rosins-restaurants': 'rosins-restaurants',
  'promikoche': 'promi-koeche',
};

function personFromSlug(slug) {
  // erste zwei Tokens = Vorname-Nachname (Heuristik für Köche-Porträts)
  const parts = slug.split('-');
  return parts.slice(0, 2).join('-');
}

function getField(s, key) {
  const m = s.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

function setOrInsertField(s, key, value, afterKey) {
  if (new RegExp(`^${key}:`, 'm').test(s)) {
    return s.replace(new RegExp(`^${key}:.*$`, 'm'), `${key}: ${value}`);
  }
  // nach afterKey einfügen
  return s.replace(new RegExp(`^(${afterKey}:.*)$`, 'm'), `$1\n${key}: ${value}`);
}

let changed = 0;
const noShow = [];
for (const f of readdirSync(DIR).filter((x) => x.endsWith('.mdoc'))) {
  const p = join(DIR, f);
  let s = readFileSync(p, 'utf8');
  const slug = f.replace(/\.mdoc$/, '');

  const oldCat = getField(s, 'category');
  if (!oldCat) continue;
  const newCat = CAT[oldCat] ?? oldCat;
  s = s.replace(/^category:.*$/m, `category: ${newCat}`);

  if (newCat === 'tv-koch-shows') {
    const series = getField(s, 'series') ?? '';
    const show = SERIES_TO_SHOW[series] ?? 'promi-koeche'; // Default-Bucket
    s = setOrInsertField(s, 'show', show, 'category');
    s = setOrInsertField(s, 'person', personFromSlug(slug), 'show');
    if (!SERIES_TO_SHOW[series]) noShow.push(`${slug} (series=${series || 'leer'} → promi-koeche)`);
  }

  writeFileSync(p, s);
  changed++;
}

console.log(`migriert: ${changed} Dateien`);
if (noShow.length) {
  console.log(`\nDefault-Bucket promi-koeche (manuell prüfen, ${noShow.length}):`);
  noShow.forEach((x) => console.log('  ' + x));
}
