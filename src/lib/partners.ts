// src/lib/partners.ts
// Börsen-Registry für die Intent-Städteseiten: unsere Fachportale (owner 'js')
// + Christian Mogges Elflirt-Netzwerk (owner 'chris', beide ICONY).
//
// Link-Regeln:
// - Unsere Domains: https://{domain}/?AID=JS — AID=JS ist PLATZHALTER, bis Tommy
//   die Partner-IDs in ICONY angelegt hat (Stand 2026-06-12).
// - Chris-Domains: https://www.{domain}/registration/?AID=th — Deep-Link direkt
//   auf die Registration (Pattern live verifiziert 2026-06-12); AID final bestätigen.
// - rel: eigenes Netzwerk = follow erlaubt; Chris = Drittanbieter → sponsored nofollow (GESETZ).

export type PartnerKey =
  | 'jobsingles'
  | 'medicsingles'
  | 'farmersingles'
  | 'gastrosingles'
  | 'polizeisingles'
  | 'handwerksingles'
  | 'elflirt'
  | 'ersuchtihn'
  | 'siesuchtsie'
  | 'ab50'
  | 'schwerverliebt'
  | 'tierischverliebt';

export type Partner = {
  key: PartnerKey;
  name: string;
  domain: string;
  href: string;
  /** null = Platzhalter-Karte (Initialen + Markenfarbe) bis Grafik vorliegt */
  logoSrc: string | null;
  claim: string;
  owner: 'js' | 'chris';
  /** Markenfarbe für Platzhalter-Karten */
  color: string;
};

const js = (domain: string) => `https://${domain}/?AID=JS`;
const chris = (domain: string) => `https://www.${domain}/registration/?AID=th`;

export const PARTNERS: Record<PartnerKey, Partner> = {
  jobsingles: {
    key: 'jobsingles',
    name: 'Jobsingles',
    domain: 'jobsingles.de',
    href: 'https://jobsingles.de/registration/?AID=JobsinglesMagazin',
    logoSrc: '/logos/jobsingles-logo.png',
    claim: 'Das Dating-Netzwerk der Berufe — Singles, die deinen Alltag verstehen.',
    owner: 'js',
    color: '#E52312',
  },
  medicsingles: {
    key: 'medicsingles',
    name: 'MedicSingles',
    domain: 'medicsingles.de',
    href: js('medicsingles.de'),
    logoSrc: null,
    claim: 'Die Singlebörse für Ärztinnen, Ärzte und Menschen im Gesundheitswesen.',
    owner: 'js',
    color: '#0B7285',
  },
  farmersingles: {
    key: 'farmersingles',
    name: 'FarmerSingles',
    domain: 'farmersingles.de',
    href: js('farmersingles.de'),
    logoSrc: null,
    claim: 'Landwirte und Landliebhaber finden hier ihr Gegenstück.',
    owner: 'js',
    color: '#2B8A3E',
  },
  gastrosingles: {
    key: 'gastrosingles',
    name: 'GastroSingles',
    domain: 'gastrosingles.de',
    href: js('gastrosingles.de'),
    logoSrc: null,
    claim: 'Köche, Wirte und Gastronomen — Singles, die wissen, was Feierabend um 23 Uhr heißt.',
    owner: 'js',
    color: '#A61E4D',
  },
  polizeisingles: {
    key: 'polizeisingles',
    name: 'PolizeiSingles',
    domain: 'polizeisingles.de',
    href: js('polizeisingles.de'),
    logoSrc: null,
    claim: 'Die Singlebörse für Polizistinnen, Polizisten und Blaulicht-Fans.',
    owner: 'js',
    color: '#1864AB',
  },
  handwerksingles: {
    key: 'handwerksingles',
    name: 'Handwerksingles',
    domain: 'handwerksingles.de',
    href: js('handwerksingles.de'),
    logoSrc: null,
    claim: 'Singles aus dem Handwerk — ehrliche Arbeit, ehrliches Kennenlernen.',
    owner: 'js',
    color: '#52230f',
  },
  elflirt: {
    key: 'elflirt',
    name: 'Elflirt',
    domain: 'elflirt.de',
    href: chris('elflirt.de'),
    logoSrc: '/images/partner/elflirt.png',
    claim: 'Unkompliziertes Casual Dating — flirten ohne Verpflichtungen.',
    owner: 'chris',
    color: '#C2255C',
  },
  ersuchtihn: {
    key: 'ersuchtihn',
    name: 'Er-sucht-Ihn.de',
    domain: 'er-sucht-ihn.de',
    href: chris('er-sucht-ihn.de'),
    logoSrc: '/images/partner/er-sucht-ihn.png',
    claim: 'Gay-Dating mit echten Profilen aus deiner Region.',
    owner: 'chris',
    color: '#5F3DC4',
  },
  siesuchtsie: {
    key: 'siesuchtsie',
    name: 'Sie-sucht-Sie.de',
    domain: 'sie-sucht-sie.de',
    href: chris('sie-sucht-sie.de'),
    logoSrc: '/images/partner/sie-sucht-sie.png',
    claim: 'Lesbisches Dating — Frauen, die Frauen suchen.',
    owner: 'chris',
    color: '#D6336C',
  },
  ab50: {
    key: 'ab50',
    name: 'ab50.de',
    domain: 'ab50.de',
    href: chris('ab50.de'),
    logoSrc: '/images/partner/ab50.jpg',
    claim: 'Partnersuche und Bekanntschaften für die zweite Lebenshälfte.',
    owner: 'chris',
    color: '#E8590C',
  },
  schwerverliebt: {
    key: 'schwerverliebt',
    name: 'Schwer-verliebt.de',
    domain: 'schwer-verliebt.de',
    href: chris('schwer-verliebt.de'),
    logoSrc: null,
    claim: 'Die Singlebörse für mollige Singles und ihre Bewunderer.',
    owner: 'chris',
    color: '#862E9C',
  },
  tierischverliebt: {
    key: 'tierischverliebt',
    name: 'Tierisch-verliebt.de',
    domain: 'tierisch-verliebt.de',
    href: chris('tierisch-verliebt.de'),
    logoSrc: '/images/partner/tierisch-verliebt.png',
    claim: 'Dating für Tierfreunde — wer Hund, Katze oder Pferd liebt, ist hier richtig.',
    owner: 'chris',
    color: '#74B816',
  },
};

export function getPartner(key: PartnerKey): Partner {
  return PARTNERS[key];
}
