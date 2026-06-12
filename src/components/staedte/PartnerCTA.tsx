import { getPartner, type PartnerKey } from '@/lib/partners';

/**
 * Conversion-Band vor den FAQs (Tommy 2026-06-12): pro Intent-Seite nochmal ein
 * klarer CTA zur empfohlenen Börse — wie meinestadt vor dem Footer zur Registration
 * schiebt. Roter Marken-Streifen mit Herz; rel sponsored bei Chris-Domains.
 */
export function PartnerCTA({
  partnerKey,
  stadtName,
  intentLabel,
}: {
  partnerKey: PartnerKey;
  stadtName: string;
  intentLabel: string;
}) {
  const partner = getPartner(partnerKey);
  const rel = partner.owner === 'chris' ? 'sponsored nofollow noopener' : 'noopener';

  return (
    <div className="my-10 rounded-2xl bg-primary px-6 py-6 text-center text-on-primary relative overflow-hidden">
      <svg
        className="absolute -left-4 -bottom-6 w-28 h-28 text-on-primary/10 pointer-events-none"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <p className="font-bold text-lg relative">
        {intentLabel} in {stadtName}? Bei {partner.name} wirst du fündig.
      </p>
      <p className="text-on-primary/80 text-sm mt-1 mb-4 relative">
        Kostenlos anmelden, Profile aus {stadtName} und Umgebung ansehen, losflirten.
      </p>
      <a
        href={partner.href}
        rel={rel}
        target="_blank"
        className="relative inline-block rounded-full bg-surface px-7 py-3 text-sm font-bold text-primary hover:opacity-90 transition-opacity"
      >
        Jetzt kostenlos bei {partner.name} anmelden ❤
      </a>
    </div>
  );
}
