import type { Intent } from '@/lib/intents';
import { getProfiles } from '@/lib/feed';
import { getPartner } from '@/lib/partners';
import { ProfileCards } from '@/components/staedte/ProfileCards';

/**
 * Server-gerenderte Profil-Ausspielung — für die Stadt-Hauptseite und Intents mit
 * BERUF-Filter (disjunkte Profilsets, die meinestadt nicht hat; Beruf-Chip auf der
 * Karte ist Teil der Uniqueness). Intents mit geteiltem Pool nutzen ProfileFeedLazy
 * (client-only, kein Profil-Content im ausgelieferten HTML).
 * Datenquelle = Feed-Adapter (src/lib/feed.ts): aktuell Mock, später ICONY.
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
  const rel = partner.owner === 'chris' ? 'sponsored nofollow noopener' : 'nofollow noopener';
  const baseHeading = heading ?? (intent ? intent.h1(stadtName) : `Singles aus ${stadtName}`);

  return (
    <ProfileCards
      profiles={profiles}
      heading={radiusLevel !== 'stadt' ? `${baseHeading} und Umgebung` : baseHeading}
      registerUrl={partner.href}
      rel={rel}
      stadtName={stadtName}
    />
  );
}
