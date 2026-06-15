// "Was bedeutet das fürs Dating in {Stadt}?" — generiert 2–4 unique Sätze pro Stadt
// aus den amtlichen Zahlen (lib/singles-index.ts). Der Haupt-Unique-Text-Generator:
// gegen Thin-Content, für AI-Citability (Zahlen + Quelle + Datum sind hoch-extrahierbar).
import { computeSinglesIndex, interpretDating, type RawCityStats } from '@/lib/singles-index';

export function CityDatingInsight({
  name,
  kreis,
  e,
}: {
  name: string;
  kreis?: string | null;
  e: RawCityStats;
}) {
  const idx = computeSinglesIndex(e);
  const { lead, points } = interpretDating(e, idx, name, kreis);
  if (points.length === 0) return null;

  return (
    <section className="my-12 rounded-2xl bg-surface border border-foreground/10 p-6 sm:p-7">
      <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-3">
        Was bedeutet das fürs Dating in {name}?
      </h2>
      <p className="text-foreground font-semibold mb-4">{lead}</p>
      <ul className="space-y-2.5">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-foreground/80 leading-relaxed">
            <span className="text-primary flex-shrink-0" aria-hidden>❤</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
