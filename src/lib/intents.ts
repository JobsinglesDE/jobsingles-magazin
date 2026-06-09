// src/lib/intents.ts
// Die 7 Intent-Unterseiten pro Stadt — Menü-Label → Slug an meinestadt.de verifiziert.
// Jede Intent-Seite = eigene URL + eigenes Canonical + eigener (gefilterter) Profil-Feed.

export type Intent = {
  slug: string;
  menuLabel: string; // Top-Menü-Beschriftung (wie meinestadt)
  h1: (stadt: string) => string;
  seoTitle: (stadt: string) => string;
  intro: (stadt: string) => string;
  // Filter-Hinweis für den (späteren) ICONY-Profil-Feed
  feed: { gender?: 'm' | 'f'; seeking?: 'm' | 'f'; minAge?: number; tag?: string };
};

export const INTENTS: Intent[] = [
  {
    slug: 'single-maenner',
    menuLabel: 'Sie sucht Ihn',
    h1: (s) => `Single-Männer in ${s}`,
    seoTitle: (s) => `Single-Männer in ${s} kennenlernen`,
    intro: (s) => `Single-Männer aus ${s} und Umgebung, die eine Partnerin suchen — lerne sie kostenlos kennen.`,
    feed: { gender: 'm', seeking: 'f' },
  },
  {
    slug: 'single-frauen',
    menuLabel: 'Er sucht Sie',
    h1: (s) => `Single-Frauen in ${s}`,
    seoTitle: (s) => `Single-Frauen in ${s} kennenlernen`,
    intro: (s) => `Single-Frauen aus ${s} und Umgebung, die einen Partner suchen — lerne sie kostenlos kennen.`,
    feed: { gender: 'f', seeking: 'm' },
  },
  {
    slug: 'frau-sucht-frau',
    menuLabel: 'Sie sucht Sie',
    h1: (s) => `Frau sucht Frau in ${s}`,
    seoTitle: (s) => `Frau sucht Frau in ${s} | Lesbische Singles`,
    intro: (s) => `Lesbische Singles und Frauen, die Frauen suchen, aus ${s} und Umgebung.`,
    feed: { gender: 'f', seeking: 'f' },
  },
  {
    slug: 'mann-sucht-mann',
    menuLabel: 'Er sucht Ihn',
    h1: (s) => `Mann sucht Mann in ${s}`,
    seoTitle: (s) => `Mann sucht Mann in ${s} | Schwule Singles`,
    intro: (s) => `Schwule Singles und Männer, die Männer suchen, aus ${s} und Umgebung.`,
    feed: { gender: 'm', seeking: 'm' },
  },
  {
    slug: 'partnervermittlung',
    menuLabel: 'Partnervermittlung',
    h1: (s) => `Partnervermittlung in ${s}`,
    seoTitle: (s) => `Partnervermittlung ${s} | Kostenlose Bekanntschaften`,
    intro: (s) => `Seriöse Partnersuche in ${s}: Menschen aus deiner Region, die eine feste Beziehung suchen.`,
    feed: {},
  },
  {
    slug: 'casual-dating',
    menuLabel: 'Casual Dating',
    h1: (s) => `Casual Dating in ${s}`,
    seoTitle: (s) => `Casual Dating ${s} | Lockere Bekanntschaften`,
    intro: (s) => `Lockere Bekanntschaften und unkomplizierte Dates in ${s} und Umgebung.`,
    feed: { tag: 'casual' },
  },
  {
    slug: 'partnersuche-50-plus',
    menuLabel: 'Partnersuche 50+',
    h1: (s) => `Partnersuche 50 plus in ${s}`,
    seoTitle: (s) => `Partnersuche ab 50 ${s} | Kostenlose Bekanntschaften`,
    intro: (s) => `Singles ab 50 aus ${s} und Umgebung — Partnersuche und Bekanntschaften für die zweite Lebenshälfte.`,
    feed: { minAge: 50 },
  },
];

export const INTENT_SLUGS = INTENTS.map((i) => i.slug);

export function getIntent(slug: string): Intent | undefined {
  return INTENTS.find((i) => i.slug === slug);
}
