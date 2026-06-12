// src/lib/feed.ts
// Feed-Adapter für die Profil-Ausspielung auf Stadt-/Intent-Seiten.
//
// Die MATRIX (Stadt × Intent × Beruf/Gender/Alter-Filter) ist hier fixiert —
// die Datenquelle ist austauschbar:
//   Implementierung 1 (aktiv): deterministischer Mock (kein Math.random, Build-stabil).
//   Implementierung 2 (nach Uwe-Termin 2026-06-15): ICONY-Feed (API oder RSS — egal,
//   dieser Adapter kapselt das; Seiten/Komponenten bleiben unverändert).
//
// Radius-Fallback: liefert die Stadt zu wenige Profile, wird auf Kreis → Bundesland
// aufgeweitet. radiusLevel steuert die „und Umgebung"-Copy und später das Index-Gate
// (0 Profile auf Kreis-Ebene → Seite noindex + raus aus Tabs/Sitemap).

import type { Intent } from './intents';

export type FeedProfile = {
  name: string;
  age: number;
  /** Entfernung in km (Mock); ICONY liefert später Ort/PLZ */
  dist: number;
  /** Anzeige-Berufslabel, wenn der Intent berufsgefiltert ist */
  beruf?: string;
  /** Platzhalter-Avatar-Farbton bis echte Profilbilder kommen */
  hue: number;
  female: boolean;
};

export type FeedResult = {
  profiles: FeedProfile[];
  /** 'stadt' | 'kreis' | 'bundesland' — wie weit aufgeweitet wurde */
  radiusLevel: 'stadt' | 'kreis' | 'bundesland';
};

const FEMALE = ['Sandra', 'Nicole', 'Petra', 'Andrea', 'Claudia', 'Melanie', 'Bianca', 'Sabine', 'Jana', 'Tanja', 'Kerstin', 'Anja'];
const MALE = ['Markus', 'Stefan', 'Andreas', 'Thomas', 'Michael', 'Daniel', 'Frank', 'Jochen', 'Sven', 'Tobias', 'Dirk', 'Kai'];
const HUES = [4, 200, 28, 280, 150, 330, 50, 190];

const BERUF_LABELS: Record<string, string[]> = {
  arzt: ['Assistenzarzt', 'Fachärztin', 'Oberarzt', 'Allgemeinmedizinerin', 'Chirurg', 'Internistin'],
  landwirt: ['Landwirt', 'Milchviehhalter', 'Agrartechniker', 'Hofnachfolger', 'Winzer', 'Landwirtin'],
  koch: ['Koch', 'Köchin', 'Sous-Chef', 'Restaurantfachfrau', 'Gastronom', 'Küchenmeister'],
  polizist: ['Polizist', 'Polizistin', 'Kommissar', 'Streifenpolizist', 'Kriminalbeamtin', 'Polizeimeister'],
  handwerker: ['Elektriker', 'Zimmermann', 'Tischlerin', 'KFZ-Mechatroniker', 'Dachdecker', 'Malermeisterin'],
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function pick<T>(arr: T[], seed: number, i: number): T {
  return arr[(seed + i * 7) % arr.length];
}

/**
 * Profile für Stadt × Intent. Mock-Implementierung — Signatur ist die spätere
 * ICONY-Schnittstelle (stadt/kreis/bundesland für Radius, intent.feed als Filter).
 */
export async function getProfiles({
  stadtName,
  intent,
  gender,
  count = 12,
}: {
  stadtName: string;
  kreis?: string | null;
  bundesland?: string;
  intent?: Intent;
  gender?: 'm' | 'f';
  count?: number;
}): Promise<FeedResult> {
  const seed = hashStr(stadtName + (gender ?? intent?.slug ?? 'main'));
  const showGender = gender ?? intent?.feed.gender;
  const minAge = intent?.feed.minAge ?? 23;
  const maxAge = intent?.feed.maxAge ?? minAge + 21;
  const span = Math.max(1, maxAge - minAge);
  const berufKey = intent?.feed.beruf;

  const profiles: FeedProfile[] = Array.from({ length: count }).map((_, i) => {
    const female = showGender ? showGender === 'f' : (seed + i) % 2 === 0;
    return {
      name: pick(female ? FEMALE : MALE, seed, i),
      age: minAge + ((seed + i * 13) % span),
      dist: 1 + ((seed + i * 5) % 28),
      beruf: berufKey ? pick(BERUF_LABELS[berufKey] ?? [], seed, i) : undefined,
      hue: HUES[(seed + i) % HUES.length],
      female,
    };
  });

  // Mock liefert immer Stadt-Level; die ICONY-Implementierung weitet bei
  // zu wenigen Treffern auf kreis/bundesland auf und meldet das hier zurück.
  return { profiles, radiusLevel: 'stadt' };
}
