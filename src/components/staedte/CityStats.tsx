// Zensus-Datenblock pro Stadt — auf Stadt-Hauptseite UND Intent-Unterseiten.
// Einwohner = echt (Gemeinde, Zensus 2022); Ledige = Hochrechnung auf Basis Kreis-Quote;
// Ø Alter / Geschlecht = echt (Kreis-Ebene). Familienstand ist pro Gemeinde nicht verfügbar.

type CityFields = {
  einwohner?: string | null;
  ledigeAnzahl?: string | null;
  altersstruktur?: string | null;
  geschlechterquote?: string | null;
  stichtag?: string | null;
  kreis?: string | null;
};

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-5 text-center border ${
        accent
          ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20'
          : 'bg-surface border-foreground/10'
      }`}
    >
      <div className={`text-3xl sm:text-4xl font-extrabold leading-tight ${accent ? 'text-on-primary' : 'text-foreground'}`}>
        {value}
      </div>
      <div className={`mt-1 text-xs uppercase tracking-wide ${accent ? 'text-on-primary/80' : 'text-foreground/45'}`}>
        {label}
      </div>
    </div>
  );
}

export function CityStats({ name, e }: { name: string; e: CityFields }) {
  const has = e.einwohner || e.ledigeAnzahl || e.altersstruktur || e.geschlechterquote;
  if (!has) return null;
  return (
    <section className="my-12">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">Singles in {name}: Zahlen &amp; Fakten</h2>
      <p className="text-foreground/50 mb-6 text-sm">Amtliche Daten aus dem Zensus 2022 — für deine Region.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {e.ledigeAnzahl && <StatCard label={`Ledige in ${name}`} value={e.ledigeAnzahl} accent />}
        {e.einwohner && <StatCard label="Einwohner (Stadt)" value={e.einwohner} />}
        {e.altersstruktur && <StatCard label="Ø Alter (Landkreis)" value={e.altersstruktur} />}
        {e.geschlechterquote && <StatCard label="♂ / ♀ (Landkreis)" value={e.geschlechterquote} />}
      </div>
      <p className="mt-3 text-[11px] text-foreground/40">
        Quelle: {e.stichtag || 'Zensus 2022'}, Statistisches Bundesamt. Ledige = Hochrechnung auf Basis der Ledigen-Quote im {e.kreis || 'Landkreis'} (Familienstand ist amtlich nur bis Kreisebene verfügbar).
      </p>
    </section>
  );
}
