// src/lib/hubs.ts
// Single Source of Truth für alle Hub-/Kategorie-Metadaten.
// REGEL (Tommy): title (H1) enthaelt Herz; seoTitle OHNE Herz (Template haengt an).

export type Hub = {
  slug: string; // Pfad-Segment relativ zu basePath, ohne führenden Slash
  title: string; // H1 / Anzeigename, MUSS ❤️ enthalten
  description: string; // Intro-Absatz auf der Hub-Seite
  seoTitle: string; // <title>-Basis OHNE Herz: layout.tsx template "%s ❤️" ergaenzt es. Final inkl. Herz <=60.
  seoDescription: string; // meta description, ≤160 Zeichen
};

// Einziger Hub: Partnersuche der Berufe.
export const SINGLE_HUB: Hub = {
  slug: 'singles-partnersuche',
  title: 'Jobsingles ❤️ — Partnersuche der Berufe',
  description:
    'Partnersuche und Dating für Menschen mit fordernden Berufen — finde jemanden, der deinen Arbeitsalltag versteht.',
  seoTitle: 'Jobsingles: Partnersuche nach Beruf',
  seoDescription:
    'Jobsingles — das Dating-Netzwerk der Berufe. Partnersuche für Schichtdienstler, Landwirte, Mediziner, Handwerker und mehr.',
};

// Leere Maps für Importeure, die noch SHOW_HUBS/BERUF_HUBS/SECTION_HUBS referenzieren.
export const SHOW_HUBS: Record<string, Hub> = {};
export const BERUF_HUBS: Record<string, Hub> = {};
export const SECTION_HUBS: Record<string, Hub> = {};

// Alle Hubs flach (für Sitemap + QC)
export const ALL_HUBS: Hub[] = [SINGLE_HUB];
