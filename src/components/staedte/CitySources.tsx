// "Quellen & Datenstand" — Transparenz über Datenherkunft + Index-Methodik.
// Stärkt E-E-A-T (belegte Fakten) + AI-Citability (Primärquelle + Datum genannt).
// Externer Quell-Link = nofollow (GESETZ: extern immer nofollow).
import { computeSinglesIndex, INDEX_VERSION, type RawCityStats } from '@/lib/singles-index';

export function CitySources({
  e,
  kreis,
  stichtag,
}: {
  e: RawCityStats;
  kreis?: string | null;
  stichtag?: string | null;
}) {
  const idx = computeSinglesIndex(e);
  return (
    <section className="my-10 rounded-2xl border border-foreground/10 bg-surface/50 p-5 text-sm text-foreground/70">
      <h2 className="text-base font-bold text-foreground mb-2">Quellen &amp; Datenstand</h2>
      <ul className="space-y-1.5 leading-relaxed">
        <li>
          <strong className="text-foreground/80">Demografie:</strong> {stichtag || 'Zensus 2022'}, Statistisches Bundesamt
          (Destatis){kreis ? ` — Familienstand/Geschlecht auf Ebene ${kreis}, Einwohner auf Gemeinde-Ebene` : ''}. Die
          Singles-Zahl ist eine Hochrechnung auf Basis der Ledigen-Quote im {kreis || 'Landkreis'} (Familienstand amtlich nur
          bis Kreisebene).{' '}
          <a href="https://www.zensus2022.de/" rel="nofollow noopener" target="_blank" className="underline hover:text-primary">
            zensus2022.de
          </a>
        </li>
        {idx && (
          <li>
            <strong className="text-foreground/80">Jobsingles Singles-Index (v{INDEX_VERSION}):</strong> gewichteter Score aus
            Single-Dichte (Ledigen-/Haushaltsquote), Geschlechter-Balance und Altersstruktur — deterministisch aus den
            amtlichen Daten berechnet, keine Schätzung einzelner Profile.
          </li>
        )}
        <li>
          <strong className="text-foreground/80">Date-Orte:</strong> OpenStreetMap-Mitwirkende (ODbL).{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            rel="nofollow noopener"
            target="_blank"
            className="underline hover:text-primary"
          >
            openstreetmap.org/copyright
          </a>
        </li>
        <li className="text-foreground/50 text-xs">Angaben ohne Gewähr. Daten ändern sich; maßgeblich ist die jeweils amtliche Quelle.</li>
      </ul>
    </section>
  );
}
