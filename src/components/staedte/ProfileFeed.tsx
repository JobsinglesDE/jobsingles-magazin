import type { Intent } from '@/lib/intents';

const REGISTER_URL = 'https://jobsingles.de/registration/?AID=JobsinglesMagazin';

// Deterministische Mock-Profile (kein Math.random — stabil pro Stadt/Intent).
const FEMALE = ['Sandra', 'Nicole', 'Petra', 'Andrea', 'Claudia', 'Melanie', 'Bianca', 'Sabine', 'Jana', 'Tanja', 'Kerstin', 'Anja'];
const MALE = ['Markus', 'Stefan', 'Andreas', 'Thomas', 'Michael', 'Daniel', 'Frank', 'Jochen', 'Sven', 'Tobias', 'Dirk', 'Kai'];
const HUES = [4, 200, 28, 280, 150, 330, 50, 190];

function pick<T>(arr: T[], seed: number, i: number): T {
  return arr[(seed + i * 7) % arr.length];
}
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Profil-Ausspielung pro Stadt/Intent. AKTUELL: Platzhalter (Mock) im meinestadt-Layout.
 * SPÄTER: dieselbe Komponente, Datenquelle = ICONY-Schnittstelle (server-side, crawlbar).
 * Conversion: Klick auf Profil → Registrieren (rel=nofollow, wie meinestadt).
 */
export function ProfileFeed({
  stadtName,
  intent,
  gender,
  heading,
  count = 12,
}: {
  stadtName: string;
  intent?: Intent;
  gender?: 'm' | 'f';
  heading?: string;
  count?: number;
}) {
  const seed = hashStr(stadtName + (gender ?? intent?.slug ?? 'main'));
  // Geschlecht: expliziter gender-Prop > Intent-Filter > gemischt
  const showGender = gender ?? intent?.feed.gender; // 'm' | 'f' | undefined
  const minAge = intent?.feed.minAge ?? 23;

  const profiles = Array.from({ length: count }).map((_, i) => {
    const female = showGender ? showGender === 'f' : (seed + i) % 2 === 0;
    const name = pick(female ? FEMALE : MALE, seed, i);
    const age = minAge + ((seed + i * 13) % 22);
    const dist = 1 + ((seed + i * 5) % 28);
    const hue = HUES[(seed + i) % HUES.length];
    return { name, age, dist, hue, female };
  });

  return (
    <section aria-label={`Singles aus ${stadtName}`} className="my-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {heading ?? (intent ? intent.h1(stadtName) : `Singles aus ${stadtName}`)}
        </h2>
        <span className="text-[11px] uppercase tracking-wide text-foreground/40 border border-foreground/15 rounded px-2 py-0.5">
          Vorschau
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {profiles.map((p, i) => (
          <a
            key={i}
            href={REGISTER_URL}
            rel="nofollow noopener"
            target="_blank"
            className="group block rounded-xl overflow-hidden bg-surface border border-foreground/10 hover:border-primary/50 transition-colors"
          >
            <div
              className="relative aspect-[3/4] flex items-end"
              style={{
                background: `linear-gradient(140deg, hsl(${p.hue} 55% 62%), hsl(${(p.hue + 40) % 360} 55% 48%))`,
              }}
            >
              {/* geblurrtes Profilbild-Platzhalter */}
              <div className="absolute inset-0 backdrop-blur-md bg-black/5" aria-hidden />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/85 text-3xl font-bold drop-shadow blur-[1px]">
                  {p.name[0]}
                </span>
              </div>
              <div className="relative w-full p-2 bg-gradient-to-t from-black/55 to-transparent text-white">
                <div className="text-sm font-semibold leading-tight">
                  {p.name}, {p.age}
                </div>
                <div className="text-[11px] text-white/80">{p.dist} km entfernt</div>
              </div>
            </div>
            <div className="p-2 text-center">
              <span className="inline-block text-xs font-semibold text-primary group-hover:underline">
                Kennenlernen →
              </span>
            </div>
          </a>
        ))}
      </div>

    </section>
  );
}
