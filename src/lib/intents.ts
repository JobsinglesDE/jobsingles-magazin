// src/lib/intents.ts
// Intent-Unterseiten pro Stadt (meinestadt-Modell, ~20 Intents).
// Jede Intent-Seite = eigene URL + Canonical + gefilterter Profil-Feed + Partner-Empfehlung.
//
// Historie: 2026-06-09 auf 3 Intents reduziert (markenfremde raus). 2026-06-12 mit Tommy
// auf das volle meinestadt-Modell erweitert — markenfremde Intents werden jetzt von
// PARTNER-Börsen bedient (Elflirt-Netzwerk von Christian Mogge + unsere Fachportale),
// damit jede Städteseite jeden Dating-Intent abfängt.
// Vault: JS-Network/Elflirt-Netzwerk/Elflirt-Netzwerk-Uebersicht.md
//
// placement 'tab'    = Tab-Leiste oben, Seite empfiehlt die Partner-Börse prominent.
// placement 'footer' = nur im Footer-Linkblock verlinkt, CTA = Registration der Empfehlung.
//
// Seiten bleiben global noindex (Demo-Phase). Index-Gate pro Stadt×Intent kommt mit dem
// ICONY-Feed (0 Profile auf Kreis-Ebene → noindex + raus aus Tabs/Sitemap).

import type { PartnerKey } from './partners';

export type IntentFAQ = { question: string; answer: string };

export type Intent = {
  slug: string;
  menuLabel: string; // Tab-/Footer-Beschriftung (wie meinestadt)
  placement: 'tab' | 'footer';
  /** Empfohlene Börse; jobsingles = eigener Feed ohne Partner-Karte */
  partner: PartnerKey;
  h1: (stadt: string) => string;
  seoTitle: (stadt: string) => string;
  intro: (stadt: string) => string;
  faq: (stadt: string) => IntentFAQ[];
  // Filter-Matrix für den (späteren) ICONY-Profil-Feed
  feed: { gender?: 'm' | 'f'; seeking?: 'm' | 'f'; minAge?: number; maxAge?: number; beruf?: string; tag?: string };
};

const kostenlosFaq = (stadt: string, was: string, boerse: string): IntentFAQ[] => [
  {
    question: `Wie finde ich ${was} in ${stadt}?`,
    answer: `Auf dieser Seite siehst du aktuelle Profile aus ${stadt} und Umgebung. Mit einem kostenlosen Profil bei ${boerse} kannst du direkt Kontakt aufnehmen — je vollständiger dein Profil, desto besser die Vorschläge aus deiner Region.`,
  },
  {
    question: 'Ist die Anmeldung kostenlos?',
    answer: `Ja. Die Registrierung bei ${boerse} ist kostenfrei, du kannst Profile aus ${stadt} ansehen und erste Kontakte knüpfen, bevor du dich für mehr entscheidest.`,
  },
  {
    question: `Warum ${boerse} für ${was} in ${stadt}?`,
    answer: `${boerse} ist auf genau diese Zielgruppe spezialisiert — statt im großen Teich zu fischen, triffst du Menschen, die dieselbe Lebensrealität haben. Die Profile kommen aus ${stadt}, dem Umland und ganz Deutschland.`,
  },
];

export const INTENTS: Intent[] = [
  // ───────────────────────── Tabs: eigene Feeds (jobsingles) ─────────────────────────
  {
    slug: 'single-frauen',
    menuLabel: 'Er sucht Sie',
    placement: 'tab',
    partner: 'jobsingles',
    h1: (s) => `Single-Frauen in ${s}`,
    seoTitle: (s) => `Single-Frauen in ${s} kennenlernen`,
    intro: (s) => `Single-Frauen aus ${s} und Umgebung, die einen Partner suchen — lerne sie kostenlos kennen.`,
    faq: (s) => kostenlosFaq(s, 'Single-Frauen', 'Jobsingles'),
    feed: { gender: 'f', seeking: 'm' },
  },
  {
    slug: 'single-maenner',
    menuLabel: 'Sie sucht Ihn',
    placement: 'tab',
    partner: 'jobsingles',
    h1: (s) => `Single-Männer in ${s}`,
    seoTitle: (s) => `Single-Männer in ${s} kennenlernen`,
    intro: (s) => `Single-Männer aus ${s} und Umgebung, die eine Partnerin suchen — lerne sie kostenlos kennen.`,
    faq: (s) => kostenlosFaq(s, 'Single-Männer', 'Jobsingles'),
    feed: { gender: 'm', seeking: 'f' },
  },

  // ───────────────────────── Tabs: Berufs-Intents (unsere Fachportale) ─────────────────────────
  {
    slug: 'arzt-sucht-frau',
    menuLabel: 'Arzt sucht Frau',
    placement: 'tab',
    partner: 'medicsingles',
    h1: (s) => `Arzt sucht Frau in ${s}`,
    seoTitle: (s) => `Arzt sucht Frau in ${s} | Single-Ärzte kennenlernen`,
    intro: (s) =>
      `Single-Ärzte aus ${s} und Umgebung suchen eine Partnerin, die mit Schichtdienst und Verantwortung umgehen kann. Auf MedicSingles treffen sich Medizinerinnen, Mediziner und alle, die das Gesundheitswesen kennen.`,
    faq: (s) => kostenlosFaq(s, 'einen Single-Arzt', 'MedicSingles'),
    feed: { gender: 'm', seeking: 'f', beruf: 'arzt' },
  },
  {
    slug: 'aerztin-sucht-mann',
    menuLabel: 'Ärztin sucht Mann',
    placement: 'tab',
    partner: 'medicsingles',
    h1: (s) => `Ärztin sucht Mann in ${s}`,
    seoTitle: (s) => `Ärztin sucht Mann in ${s} | Single-Ärztinnen treffen`,
    intro: (s) =>
      `Single-Ärztinnen aus ${s} und Umgebung suchen einen Partner auf Augenhöhe — einen, der Nachtdienste versteht statt sie zu zählen. MedicSingles ist die Singlebörse fürs Gesundheitswesen.`,
    faq: (s) => kostenlosFaq(s, 'eine Single-Ärztin', 'MedicSingles'),
    feed: { gender: 'f', seeking: 'm', beruf: 'arzt' },
  },
  {
    slug: 'landwirt-sucht-frau',
    menuLabel: 'Landwirt sucht Frau',
    placement: 'tab',
    partner: 'farmersingles',
    h1: (s) => `Landwirt sucht Frau in ${s}`,
    seoTitle: (s) => `Landwirt sucht Frau in ${s} | Single-Landwirte treffen`,
    intro: (s) =>
      `Single-Landwirte aus der Region ${s} suchen eine Frau, die das Landleben nicht nur romantisch findet, sondern leben will. FarmerSingles bringt Landwirte und Landliebhaber zusammen — ohne Kamerateam, anders als im Fernsehen.`,
    faq: (s) => kostenlosFaq(s, 'einen Single-Landwirt', 'FarmerSingles'),
    feed: { gender: 'm', seeking: 'f', beruf: 'landwirt' },
  },
  {
    slug: 'koch-sucht-frau',
    menuLabel: 'Koch sucht Frau',
    placement: 'tab',
    partner: 'gastrosingles',
    h1: (s) => `Koch sucht Frau in ${s}`,
    seoTitle: (s) => `Koch sucht Frau in ${s} | Singles aus der Gastronomie`,
    intro: (s) =>
      `Köche, Wirte und Gastronomen aus ${s} und Umgebung suchen eine Partnerin, die versteht, dass Feierabend selten vor 23 Uhr ist. GastroSingles ist die Singlebörse für alle, die in Küche, Service und Gastgewerbe zuhause sind.`,
    faq: (s) => kostenlosFaq(s, 'einen Single-Koch oder Wirt', 'GastroSingles'),
    feed: { gender: 'm', seeking: 'f', beruf: 'koch' },
  },
  {
    slug: 'polizist-sucht-frau',
    menuLabel: 'Polizist sucht Frau',
    placement: 'tab',
    partner: 'polizeisingles',
    h1: (s) => `Polizist sucht Frau in ${s}`,
    seoTitle: (s) => `Polizist sucht Frau in ${s} | Singles in Uniform`,
    intro: (s) =>
      `Single-Polizisten aus ${s} und Umgebung suchen eine Partnerin, die mit Wechselschicht und Bereitschaft leben kann. PolizeiSingles ist die Singlebörse für Polizei und Blaulicht-Berufe.`,
    faq: (s) => kostenlosFaq(s, 'einen Single-Polizisten', 'PolizeiSingles'),
    feed: { gender: 'm', seeking: 'f', beruf: 'polizist' },
  },
  {
    slug: 'handwerker-sucht-frau',
    menuLabel: 'Handwerker sucht Frau',
    placement: 'tab',
    partner: 'handwerksingles',
    h1: (s) => `Handwerker sucht Frau in ${s}`,
    seoTitle: (s) => `Handwerker sucht Frau in ${s} | Singles aus dem Handwerk`,
    intro: (s) =>
      `Single-Handwerker aus ${s} und Umgebung — vom Elektriker bis zum Zimmermann — suchen eine Partnerin, die ehrliche Arbeit zu schätzen weiß. Handwerksingles ist die Börse fürs Handwerk.`,
    faq: (s) => kostenlosFaq(s, 'einen Single-Handwerker', 'Handwerksingles'),
    feed: { gender: 'm', seeking: 'f', beruf: 'handwerker' },
  },

  // ───────────────────────── Tabs: Elflirt-Netzwerk (Chris) ─────────────────────────
  {
    slug: 'er-sucht-ihn',
    menuLabel: 'Er sucht Ihn',
    placement: 'tab',
    partner: 'ersuchtihn',
    h1: (s) => `Er sucht Ihn in ${s}`,
    seoTitle: (s) => `Er sucht Ihn ${s} | Gay-Dating & Kontaktanzeigen`,
    intro: (s) =>
      `Männer aus ${s} und Umgebung, die Männer suchen — von der ernsthaften Beziehung bis zum Date. Er-sucht-Ihn.de ist die spezialisierte Gay-Dating-Plattform mit Profilen aus deiner Region.`,
    faq: (s) => kostenlosFaq(s, 'Männer, die Männer suchen', 'Er-sucht-Ihn.de'),
    feed: { gender: 'm', seeking: 'm' },
  },
  {
    slug: 'sie-sucht-sie',
    menuLabel: 'Sie sucht Sie',
    placement: 'tab',
    partner: 'siesuchtsie',
    h1: (s) => `Sie sucht Sie in ${s}`,
    seoTitle: (s) => `Sie sucht Sie ${s} | Lesbisches Dating & Kontaktanzeigen`,
    intro: (s) =>
      `Frauen aus ${s} und Umgebung, die Frauen suchen — ehrlich, regional und ohne Versteckspiel. Sie-sucht-Sie.de ist die Plattform für lesbisches Dating mit echten Profilen.`,
    faq: (s) => kostenlosFaq(s, 'Frauen, die Frauen suchen', 'Sie-sucht-Sie.de'),
    feed: { gender: 'f', seeking: 'f' },
  },
  {
    slug: 'seitensprung',
    menuLabel: 'Seitensprung',
    placement: 'tab',
    partner: 'elflirt',
    h1: (s) => `Seitensprung in ${s}`,
    seoTitle: (s) => `Seitensprung ${s} | Diskrete Kontakte & Abenteuer`,
    intro: (s) =>
      `Diskrete Kontakte und unverbindliche Abenteuer in ${s} und Umgebung — ohne Namen, ohne Verpflichtungen, mit klaren Regeln. Elflirt ist die Plattform für prickelnde Affären mit Diskretion.`,
    faq: (s) => kostenlosFaq(s, 'diskrete Kontakte', 'Elflirt'),
    feed: { tag: 'casual' },
  },
  {
    slug: 'partnersuche-50-plus',
    menuLabel: 'Partnersuche 50+',
    placement: 'tab',
    partner: 'ab50',
    h1: (s) => `Partnersuche 50 plus in ${s}`,
    seoTitle: (s) => `Partnersuche ab 50 ${s} | Kostenlose Bekanntschaften`,
    intro: (s) =>
      `Singles ab 50 aus ${s} und Umgebung — Partnersuche und Bekanntschaften für die zweite Lebenshälfte. ab50.de ist die Singlebörse, bei der niemand der Jüngste sein muss.`,
    faq: (s) => kostenlosFaq(s, 'Singles ab 50', 'ab50.de'),
    feed: { minAge: 50 },
  },

  // ───────────────────────── Footer-Intents ─────────────────────────
  {
    slug: 'partnersuche-30-plus',
    menuLabel: 'Partnersuche 30 plus',
    placement: 'footer',
    partner: 'jobsingles',
    h1: (s) => `Partnersuche 30 plus in ${s}`,
    seoTitle: (s) => `Partnersuche ab 30 ${s} | Singles 30+ kennenlernen`,
    intro: (s) =>
      `Singles ab 30 aus ${s} und Umgebung: mitten im Berufsleben, klare Vorstellungen, keine Lust auf Spielchen. Bei Jobsingles triffst du Menschen, die wissen, was sie wollen.`,
    faq: (s) => kostenlosFaq(s, 'Singles ab 30', 'Jobsingles'),
    feed: { minAge: 30, maxAge: 45 },
  },
  {
    slug: 'partnersuche-40-plus',
    menuLabel: 'Partnersuche 40 plus',
    placement: 'footer',
    partner: 'jobsingles',
    h1: (s) => `Partnersuche 40 plus in ${s}`,
    seoTitle: (s) => `Partnersuche ab 40 ${s} | Singles 40+ kennenlernen`,
    intro: (s) =>
      `Singles ab 40 aus ${s} und Umgebung — Lebenserfahrung trifft Neuanfang. Bei Jobsingles findest du Menschen aus deiner Region, die es ernst meinen.`,
    faq: (s) => kostenlosFaq(s, 'Singles ab 40', 'Jobsingles'),
    feed: { minAge: 40, maxAge: 55 },
  },
  {
    slug: 'senioren-partnersuche',
    menuLabel: 'Senioren Partnersuche',
    placement: 'footer',
    partner: 'ab50',
    h1: (s) => `Senioren-Partnersuche in ${s}`,
    seoTitle: (s) => `Senioren Partnersuche ${s} | Bekanntschaften 60+`,
    intro: (s) =>
      `Gemeinsam statt einsam: Seniorinnen und Senioren aus ${s} und Umgebung suchen Bekanntschaften, Reisepartner und neue Liebe. ab50.de ist auf die Generation 50/60+ spezialisiert.`,
    faq: (s) => kostenlosFaq(s, 'Senioren-Bekanntschaften', 'ab50.de'),
    feed: { minAge: 60 },
  },
  {
    slug: 'freunde-finden',
    menuLabel: 'Freunde finden',
    placement: 'footer',
    partner: 'jobsingles',
    h1: (s) => `Freunde finden in ${s}`,
    seoTitle: (s) => `Freunde finden in ${s} | Neue Leute kennenlernen`,
    intro: (s) =>
      `Neu in ${s} oder einfach Lust auf neue Gesichter? Hier findest du Menschen aus deiner Umgebung für Freizeit, Sport und gemeinsame Unternehmungen — Freundschaft zuerst, alles Weitere offen.`,
    faq: (s) => kostenlosFaq(s, 'neue Freunde', 'Jobsingles'),
    feed: { tag: 'freundschaft' },
  },
  {
    slug: 'schlanke-frauen',
    menuLabel: 'Schlanke Frauen',
    placement: 'footer',
    partner: 'jobsingles',
    h1: (s) => `Schlanke Frauen in ${s} kennenlernen`,
    seoTitle: (s) => `Schlanke Frauen in ${s} | Single-Frauen treffen`,
    intro: (s) =>
      `Sportlich, schlank und Single: Frauen aus ${s} und Umgebung, die einen aktiven Lebensstil teilen wollen. Lerne sie kostenlos bei Jobsingles kennen.`,
    faq: (s) => kostenlosFaq(s, 'schlanke Single-Frauen', 'Jobsingles'),
    feed: { gender: 'f', seeking: 'm', tag: 'schlank' },
  },
  {
    slug: 'mollige-frauen',
    menuLabel: 'Mollige Frauen',
    placement: 'footer',
    partner: 'schwerverliebt',
    h1: (s) => `Mollige Frauen in ${s} kennenlernen`,
    seoTitle: (s) => `Mollige Frauen in ${s} | Kurvige Singles treffen`,
    intro: (s) =>
      `Kurvige Single-Frauen aus ${s} und Umgebung suchen Männer, die Frauen mit Rundungen zu schätzen wissen. Schwer-verliebt.de ist die Singlebörse für mollige Singles und ihre Bewunderer.`,
    faq: (s) => kostenlosFaq(s, 'mollige Single-Frauen', 'Schwer-verliebt.de'),
    feed: { gender: 'f', seeking: 'm', tag: 'mollig' },
  },
  {
    slug: 'tierliebe-singles',
    menuLabel: 'Tierliebe Singles',
    placement: 'footer',
    partner: 'tierischverliebt',
    h1: (s) => `Tierliebe Singles in ${s}`,
    seoTitle: (s) => `Tierliebe Singles in ${s} | Dating für Tierfreunde`,
    intro: (s) =>
      `Hund, Katze oder Pferd gehören für dich zur Familie? Tierliebe Singles aus ${s} und Umgebung suchen Menschen, bei denen das Tier nicht verhandelbar ist. Tierisch-verliebt.de bringt Tierfreunde zusammen.`,
    faq: (s) => kostenlosFaq(s, 'tierliebe Singles', 'Tierisch-verliebt.de'),
    feed: { tag: 'tierliebe' },
  },
  {
    slug: 'partnervermittlung',
    menuLabel: 'Partnervermittlung',
    placement: 'footer',
    partner: 'jobsingles',
    h1: (s) => `Partnervermittlung in ${s}`,
    seoTitle: (s) => `Partnervermittlung ${s} | Seriöse Partnersuche`,
    intro: (s) =>
      `Seriöse Partnersuche in ${s} — ob ab 40, ab 50 oder ab 60: Hier zählt die ernsthafte Beziehung, nicht der schnelle Flirt. Jobsingles vermittelt Menschen, die zueinander passen — über Beruf und Lebensstil.`,
    faq: (s) => kostenlosFaq(s, 'seriöse Partnervermittlung', 'Jobsingles'),
    feed: { minAge: 35 },
  },
  {
    slug: 'freundschaft-plus',
    menuLabel: 'Freundschaft plus',
    placement: 'footer',
    partner: 'elflirt',
    h1: (s) => `Freundschaft plus in ${s}`,
    seoTitle: (s) => `Freundschaft plus ${s} | F+ Kontakte finden`,
    intro: (s) =>
      `Freundschaft plus in ${s}: die Vertrautheit einer Freundschaft, das gewisse Extra — ohne Beziehungsetikett. Auf Elflirt findest du Menschen aus deiner Region, die dasselbe Arrangement suchen.`,
    faq: (s) => kostenlosFaq(s, 'Freundschaft-plus-Kontakte', 'Elflirt'),
    feed: { tag: 'casual' },
  },
];

export const TAB_INTENTS = INTENTS.filter((i) => i.placement === 'tab');
export const FOOTER_INTENTS = INTENTS.filter((i) => i.placement === 'footer');
export const INTENT_SLUGS = INTENTS.map((i) => i.slug);

export function getIntent(slug: string): Intent | undefined {
  return INTENTS.find((i) => i.slug === slug);
}
