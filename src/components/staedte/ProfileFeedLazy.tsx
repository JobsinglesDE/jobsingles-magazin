'use client';

import { useEffect, useState } from 'react';
import { getProfiles, type FeedProfile } from '@/lib/feed';
import { ProfileCards } from '@/components/staedte/ProfileCards';

/**
 * Client-only Profil-Modul für Intents mit GETEILTEM Profil-Pool (kein Beruf-Filter:
 * Er sucht Ihn, Sie sucht Sie, Casual, 50+ …). Rendert erst NACH dem Mount —
 * im server-gerenderten/indexierten HTML steht damit NULL Profil-Content.
 * Das ist die technische Antwort auf die Duplicate-Frage (meinestadt bezieht denselben
 * ICONY-Stream): unser Ranking hängt am unique Text, die Profile sind reine
 * Conversion-Fläche. Siehe Vault Staedteseiten/Uwe-Briefing-2026-06-15.md.
 *
 * Später (ICONY): statt Mock ein fetch auf eine interne API-Route — Verhalten identisch.
 */
export function ProfileFeedLazy({
  stadtName,
  intentSlug,
  heading,
  gender,
  seeking,
  minAge,
  maxAge,
  registerUrl,
  rel,
  count = 12,
}: {
  stadtName: string;
  intentSlug: string;
  heading: string;
  gender?: 'm' | 'f';
  seeking?: 'm' | 'f';
  minAge?: number;
  maxAge?: number;
  registerUrl: string;
  rel: string;
  count?: number;
}) {
  const [profiles, setProfiles] = useState<FeedProfile[] | null>(null);

  useEffect(() => {
    let alive = true;
    getProfiles({
      stadtName,
      intent: {
        slug: intentSlug,
        feed: { gender, seeking, minAge, maxAge },
        // nur feed/slug werden vom Adapter gelesen — Rest-Felder hier irrelevant
      } as never,
      count,
    }).then((r) => {
      if (alive) setProfiles(r.profiles);
    });
    return () => {
      alive = false;
    };
  }, [stadtName, intentSlug, gender, seeking, minAge, maxAge, count]);

  if (!profiles) {
    // Skeleton — bewusst ohne Profil-Daten (nichts Indexierbares)
    return (
      <section aria-hidden className="my-10">
        <div className="h-6 w-64 rounded bg-foreground/10 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-foreground/5 border border-foreground/10" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <ProfileCards
      profiles={profiles}
      heading={heading}
      registerUrl={registerUrl}
      rel={rel}
      stadtName={stadtName}
    />
  );
}
