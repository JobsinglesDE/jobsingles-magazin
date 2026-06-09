// Zensus-Datenblock pro Stadt. Einwohner = echt (Gemeinde, Zensus 2022);
// Singles-Zahl = Hochrechnung auf Basis Kreis-Ledigen-Quote; Geschlecht = echt (Kreis).
// Durchschnittsalter bewusst NICHT angezeigt (schreckt jüngere Zielgruppe ab).
import type { ReactNode } from 'react';
import { AnimatedGradientBorder } from '@/components/ui/AnimatedGradientBorder';

type CityFields = {
  einwohner?: string | null;
  ledigeAnzahl?: string | null;
  geschlechterquote?: string | null; // Format "MM,M / FF,F %" (Männer / Frauen)
  stichtag?: string | null;
  kreis?: string | null;
};

// "48,5 / 51,5 %" → { maenner: "48,5 %", frauen: "51,5 %" }
function parseGeschlecht(v?: string | null): { maenner: string; frauen: string } | null {
  if (!v) return null;
  const nums = v.replace(/%/g, '').split('/').map((s) => s.trim()).filter(Boolean);
  if (nums.length < 2) return null;
  return { maenner: `${nums[0]} %`, frauen: `${nums[1]} %` };
}

function Card({ children }: { children: ReactNode }) {
  return (
    <AnimatedGradientBorder borderRadius={18} borderWidth={2} className="h-full">
      <div className="h-full rounded-2xl bg-surface p-5 text-center flex flex-col justify-center">{children}</div>
    </AnimatedGradientBorder>
  );
}

export function CityStats({ name, e }: { name: string; e: CityFields }) {
  const g = parseGeschlecht(e.geschlechterquote);
  if (!e.einwohner && !e.ledigeAnzahl && !g) return null;
  return (
    <section className="my-12">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">{name} in Zahlen</h2>
      <p className="text-foreground/60 mb-6 text-sm">Amtliche Daten aus dem Zensus 2022 — für deine Region.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        {/* Singles — Hero-Karte */}
        {e.ledigeAnzahl && (
          <AnimatedGradientBorder borderRadius={18} borderWidth={2} className="h-full">
            <div className="h-full rounded-2xl bg-primary text-on-primary p-5 text-center flex flex-col justify-center">
              <div className="text-4xl sm:text-5xl font-extrabold leading-tight">{e.ledigeAnzahl}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-on-primary/85">Singles in {name}</div>
            </div>
          </AnimatedGradientBorder>
        )}

        {/* Einwohner */}
        {e.einwohner && (
          <Card>
            <div className="text-4xl sm:text-5xl font-extrabold leading-tight text-foreground">{e.einwohner}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-foreground/50">Einwohner (Stadt)</div>
          </Card>
        )}

        {/* Geschlechterverhältnis mit klaren Labels */}
        {g && (
          <Card>
            <div className="grid grid-cols-2 divide-x divide-foreground/10">
              <div className="px-2">
                <div className="text-xs uppercase tracking-wide text-foreground/50 mb-0.5">♀ Frauen</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{g.frauen}</div>
              </div>
              <div className="px-2">
                <div className="text-xs uppercase tracking-wide text-foreground/50 mb-0.5">♂ Männer</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{g.maenner}</div>
              </div>
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-wide text-foreground/40">im Landkreis</div>
          </Card>
        )}
      </div>

      <p className="mt-3 text-xs text-foreground/60 leading-relaxed">
        Quelle: {e.stichtag || 'Zensus 2022'}, Statistisches Bundesamt. Die Singles-Zahl ist eine Hochrechnung auf Basis der Ledigen-Quote im {e.kreis || 'Landkreis'} (Familienstand ist amtlich nur bis Kreisebene verfügbar).
      </p>
    </section>
  );
}
