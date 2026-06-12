import type { Intent } from '@/lib/intents';
import { getProfiles } from '@/lib/feed';
import { getPartner } from '@/lib/partners';

/**
 * Profil-Ausspielung pro Stadt/Intent. Datenquelle = Feed-Adapter (src/lib/feed.ts):
 * aktuell Mock, nach dem ICONY-Termin echte Profile — Komponente bleibt gleich.
 * Conversion: Klick auf Profil → Registrierung der für den Intent empfohlenen Börse
 * (rel=nofollow, wie meinestadt). Berufs-Intents zeigen das Berufslabel auf der Karte —
 * Teil der Uniqueness-Strategie (Profilset + sichtbares Attribut unterscheiden sich pro Intent).
 */
export async function ProfileFeed({
  stadtName,
  kreis,
  bundesland,
  intent,
  gender,
  heading,
  count = 12,
}: {
  stadtName: string;
  kreis?: string | null;
  bundesland?: string;
  intent?: Intent;
  gender?: 'm' | 'f';
  heading?: string;
  count?: number;
}) {
  const { profiles, radiusLevel } = await getProfiles({ stadtName, kreis, bundesland, intent, gender, count });
  const partner = getPartner(intent?.partner ?? 'jobsingles');
  const registerUrl = partner.href;
  const rel = partner.owner === 'chris' ? 'sponsored nofollow noopener' : 'nofollow noopener';

  return (
    <section aria-label={`Singles aus ${stadtName}`} className="my-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {heading ?? (intent ? intent.h1(stadtName) : `Singles aus ${stadtName}`)}
          {radiusLevel !== 'stadt' && ' und Umgebung'}
        </h2>
        <span className="text-[11px] uppercase tracking-wide text-foreground/40 border border-foreground/15 rounded px-2 py-0.5">
          Vorschau
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {profiles.map((p, i) => (
          <a
            key={i}
            href={registerUrl}
            rel={rel}
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
                <div className="text-[11px] text-white/80">
                  {p.beruf ? `${p.beruf} · ` : ''}
                  {p.dist} km entfernt
                </div>
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
