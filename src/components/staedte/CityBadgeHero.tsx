import { AnimatedGradientBorder } from '@/components/ui/AnimatedGradientBorder';

/**
 * Kompakter Stadt-Kopf mit „Stadt-Plakette" — UNSER visueller Fingerabdruck statt
 * meinestadt-Listen-Look oder generischem Header-Bild (Tommy 2026-06-12: Bild klein,
 * nicht als Header). Leicht gedrehte Wappen-Karte mit Stadt-Monogramm, Herz-Marke
 * und Ledigen-Zahl; Hintergrund mit dezentem Gold-Schimmer + Herz-Wasserzeichen.
 */
export function CityBadgeHero({
  name,
  kicker,
  h1,
  intro,
  ledige,
}: {
  name: string;
  kicker: string;
  h1: string;
  intro: string;
  /** z. B. "Rund 13.300" — wird auf der Plakette gezeigt */
  ledige?: string | null;
}) {
  const monogram = name
    .split(/[\s-]+/)
    .filter((w) => w[0] === w[0]?.toUpperCase())
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <header className="relative mt-6 mb-8 overflow-hidden rounded-3xl border border-foreground/10 bg-surface">
      {/* Atmosphäre: Gold-Schimmer + Herz-Wasserzeichen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(420px 200px at 88% 18%, color-mix(in srgb, var(--secondary) 16%, transparent), transparent 70%)',
        }}
        aria-hidden
      />
      <svg
        className="absolute -right-7 -bottom-9 w-44 h-44 text-primary/[0.06] pointer-events-none"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 p-6 sm:p-8">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-primary mb-2">{kicker}</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight">{h1}</h1>
          <p className="mt-3 text-foreground/70 max-w-2xl">{intro}</p>
        </div>

        {/* Stadt-Plakette: klein, gedreht, mit Monogramm + Ledigen-Zahl */}
        <div className="flex-shrink-0 self-start sm:self-center rotate-[-4deg]">
          <AnimatedGradientBorder borderRadius={20} borderWidth={2}>
            <div className="rounded-[18px] bg-surface px-5 py-4 text-center min-w-[120px]">
              <div className="mx-auto w-12 h-12 rounded-full grid place-items-center bg-primary text-on-primary text-xl font-extrabold shadow-sm">
                {monogram}
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-widest font-bold text-foreground/45">{name}</p>
              {ledige && (
                <p className="mt-1 text-sm font-extrabold text-primary leading-tight">
                  {ledige}
                  <span className="block text-[10px] font-semibold text-foreground/50 normal-case tracking-normal">Singles vor Ort ❤</span>
                </p>
              )}
            </div>
          </AnimatedGradientBorder>
        </div>
      </div>
    </header>
  );
}
