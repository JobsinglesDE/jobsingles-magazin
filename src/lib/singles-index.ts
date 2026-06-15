// Singles-Index + Dating-Interpretation — deterministisch aus amtlichen Demografie-Daten.
// Quellen-agnostisch: liest rohe Zahlen (Regionalstatistik / Zensus 2022 / city-direct),
// egal woher der Puller sie füllt. KEINE erfundenen Werte — fehlt eine Komponente,
// wird sie aus der Gewichtung herausgerechnet (Konfidenz sinkt), statt geraten.
//
// FORMEL v1.0 (gelockt — bei Änderung INDEX_VERSION hochziehen, sonst driftet die zitierte Zahl):
//   Single-Dichte 45 %  — Einpersonenhaushalte-Quote, Fallback Ledigen-Quote (Kreis)
//                         Band: 30 % → 40 Pkt, 50 % → 100 Pkt (linear, geklemmt 0..100)
//   Geschlechter-Balance 30 % — 100 − |50 − Männer%| · 8 (50/50 = Optimum), geklemmt 0..100
//   Alters-Eignung 25 % — Peak bei 40 J.: 100 − |Alter − 40| · 4, geklemmt 40..100
//   Score = round(Σ gewicht·subscore), fehlende Komponente → Restgewichte renormalisiert.

export const INDEX_VERSION = '1.0';

export type RawCityStats = {
  ledigeQuote?: string | number | null; // Ledigen-Anteil % (Kreis), z.B. "43,3"
  singlehaushalteQuote?: string | number | null; // Einpersonenhaushalte-Anteil % (Gemeinde)
  maennerQuote?: string | number | null; // Männer-Anteil %, z.B. "48,5"
  durchschnittsalter?: string | number | null; // Ø-Alter Jahre, z.B. "43,6"
};

export type IndexComponent = { key: string; label: string; score: number; weight: number };
export type SinglesIndexResult = {
  score: number; // 0..100
  band: 'sehr-gut' | 'gut' | 'solide' | 'ruhig';
  label: string;
  components: IndexComponent[];
  confidence: 'voll' | 'teilweise';
  version: string;
};

// "43,3" | "48,5 %" | "Ø 43,6 J." | 43.3 → 43.3 ; ungültig → null
export function parseDeNum(v?: string | number | null): number | null {
  if (v == null) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const m = v.replace(',', '.').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function bandFor(score: number): { band: SinglesIndexResult['band']; label: string } {
  if (score >= 75) return { band: 'sehr-gut', label: 'sehr gute Single-Lage' };
  if (score >= 60) return { band: 'gut', label: 'gute Single-Lage' };
  if (score >= 45) return { band: 'solide', label: 'solide Single-Lage' };
  return { band: 'ruhig', label: 'ruhigerer Single-Markt' };
}

export function computeSinglesIndex(raw: RawCityStats): SinglesIndexResult | null {
  const dichteQuote = parseDeNum(raw.singlehaushalteQuote) ?? parseDeNum(raw.ledigeQuote);
  const maenner = parseDeNum(raw.maennerQuote);
  const alter = parseDeNum(raw.durchschnittsalter);

  const parts: IndexComponent[] = [];
  if (dichteQuote != null) {
    const sub = clamp(40 + ((dichteQuote - 30) / 20) * 60, 0, 100);
    parts.push({ key: 'dichte', label: 'Single-Dichte', score: Math.round(sub), weight: 0.45 });
  }
  if (maenner != null) {
    const sub = clamp(100 - Math.abs(50 - maenner) * 8, 0, 100);
    parts.push({ key: 'balance', label: 'Geschlechter-Balance', score: Math.round(sub), weight: 0.3 });
  }
  if (alter != null) {
    const sub = clamp(100 - Math.abs(alter - 40) * 4, 40, 100);
    parts.push({ key: 'alter', label: 'Alters-Eignung', score: Math.round(sub), weight: 0.25 });
  }
  if (parts.length === 0) return null;

  const totalW = parts.reduce((s, p) => s + p.weight, 0);
  const score = Math.round(parts.reduce((s, p) => s + p.score * (p.weight / totalW), 0));
  const { band, label } = bandFor(score);
  return {
    score,
    band,
    label,
    components: parts,
    confidence: parts.length >= 3 ? 'voll' : 'teilweise',
    version: INDEX_VERSION,
  };
}

const fmt = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 1 }).replace('.', ',');

// 2–4 unique Sätze pro Stadt aus den Zahlen (Schwellwert-Regeln). Citation-Stil für AI-Citability.
// Erster Satz = "Kurz gesagt"-Lead. KEINE Behauptung ohne zugrundeliegende Zahl.
export function interpretDating(
  raw: RawCityStats,
  idx: SinglesIndexResult | null,
  name: string,
  kreis?: string | null
): { lead: string; points: string[] } {
  const ledige = parseDeNum(raw.ledigeQuote);
  const haushalte = parseDeNum(raw.singlehaushalteQuote);
  const maenner = parseDeNum(raw.maennerQuote);
  const alter = parseDeNum(raw.durchschnittsalter);
  const region = kreis || 'der Region';
  const points: string[] = [];

  if (haushalte != null) {
    points.push(
      `Mit rund ${fmt(haushalte)} % Einpersonenhaushalten zählt ${name} zu den single-reicheren Orten — ein starkes Signal fürs Kennenlernen.`
    );
  } else if (ledige != null) {
    points.push(
      `Laut amtlicher Statistik liegt der Ledigen-Anteil in ${region} bei rund ${fmt(ledige)} % — eine solide Basis an Singles vor Ort und im Umland.`
    );
  }

  if (maenner != null) {
    const frauen = 100 - maenner;
    if (Math.abs(50 - maenner) <= 1.5) {
      points.push(`Die Geschlechterverteilung ist mit ${fmt(maenner)} % Männern zu ${fmt(frauen)} % Frauen nahezu ausgeglichen — faire Ausgangslage für alle.`);
    } else if (maenner < 50) {
      points.push(`Mit ${fmt(frauen)} % Frauen zu ${fmt(maenner)} % Männern ist die Ausgangslage für Männer auf Partnersuche vergleichsweise günstig.`);
    } else {
      points.push(`Mit ${fmt(maenner)} % Männern zu ${fmt(frauen)} % Frauen haben Frauen auf Partnersuche hier rechnerisch die etwas bessere Auswahl.`);
    }
  }

  if (alter != null) {
    if (alter <= 42) points.push(`Das Durchschnittsalter von ${fmt(alter)} Jahren spricht für eine lebendige Alters­mischung mit vielen Singles in der klassischen Dating-Phase.`);
    else if (alter <= 47) points.push(`Mit einem Durchschnittsalter von ${fmt(alter)} Jahren trifft man hier vor allem Singles mitten im Leben — ideal für ernsthafte Partnersuche.`);
    else points.push(`Das Durchschnittsalter liegt bei ${fmt(alter)} Jahren — eine reifere Zielgruppe, gut für Bekanntschaften ab der Lebensmitte.`);
  }

  const lead = idx
    ? `Kurz gesagt: ${name} erreicht im Jobsingles Singles-Index ${idx.score} von 100 Punkten — eine ${idx.label}.`
    : `Kurz gesagt: ${name} bietet eine solide Ausgangslage für die Partnersuche in der Region.`;

  return { lead, points };
}
