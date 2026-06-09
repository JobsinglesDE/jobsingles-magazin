// Zensus-Datenblock pro Stadt. Einwohner = echt (Gemeinde, Zensus 2022);
// Ledige = Hochrechnung auf Basis Kreis-Quote; Geschlecht = echt (Kreis).
// Durchschnittsalter bewusst NICHT angezeigt (schreckt jüngere Zielgruppe ab).
import { AnimatedGradientBorder } from '@/components/ui/AnimatedGradientBorder';

type CityFields = {
  einwohner?: string | null;
  ledigeAnzahl?: string | null;
  geschlechterquote?: string | null;
  stichtag?: string | null;
  kreis?: string | null;
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="h-full rounded-2xl p-5 text-center bg-surface border border-foreground/10">
      <div className="text-3xl sm:text-4xl font-extrabold leading-tight text-foreground">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-foreground/45">{label}</div>
    </div>
  );
}

export function CityStats({ name, e }: { name: string; e: CityFields }) {
  if (!e.einwohner && !e.ledigeAnzahl && !e.geschlechterquote) return null;
  return (
    <section className="my-12">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">{name} in Zahlen</h2>
      <p className="text-foreground/50 mb-6 text-sm">Amtliche Daten aus dem Zensus 2022 — für deine Region.</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Ledige — Hero-Karte mit Animated Border */}
        {e.ledigeAnzahl && (
          <AnimatedGradientBorder borderRadius={18} borderWidth={2} className="col-span-2 lg:col-span-1">
            <div className="h-full rounded-2xl p-5 text-center bg-primary text-on-primary">
              <div className="text-4xl sm:text-5xl font-extrabold leading-tight">{e.ledigeAnzahl}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-on-primary/80">Ledige in {name}</div>
            </div>
          </AnimatedGradientBorder>
        )}
        {e.einwohner && <StatCard label="Einwohner (Stadt)" value={e.einwohner} />}
        {e.geschlechterquote && <StatCard label="♂ / ♀ (Landkreis)" value={e.geschlechterquote} />}
      </div>
      <p className="mt-3 text-[11px] text-foreground/40">
        Quelle: {e.stichtag || 'Zensus 2022'}, Statistisches Bundesamt. Ledige = Hochrechnung auf Basis der Ledigen-Quote im {e.kreis || 'Landkreis'} (Familienstand ist amtlich nur bis Kreisebene verfügbar).
      </p>
    </section>
  );
}
