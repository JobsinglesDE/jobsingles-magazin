import Image from 'next/image';
import { getPartner, type PartnerKey } from '@/lib/partners';

/**
 * Empfehlungskarte auf Intent-Seiten: „Unsere Empfehlung für {Intent} in {Stadt}".
 * - Partner-Logo, sonst Platzhalter (Initialen + Markenfarbe), bis Grafiken vorliegen.
 * - rel: eigenes Netzwerk = follow, Chris (Drittanbieter/Affiliate) = sponsored nofollow.
 * - Bei externem Partner: jobsingles als dezenter Zweit-CTA darunter.
 */
export function PartnerRecommendation({
  partnerKey,
  stadtName,
  intentLabel,
}: {
  partnerKey: PartnerKey;
  stadtName: string;
  intentLabel: string;
}) {
  const partner = getPartner(partnerKey);
  if (partner.key === 'jobsingles') return null; // eigener Feed, Karte unnötig

  const rel = partner.owner === 'chris' ? 'sponsored nofollow noopener' : 'noopener';
  const initials = partner.name
    .replace(/\.de$/i, '')
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="my-8 rounded-2xl border border-foreground/10 bg-surface p-5 sm:p-6">
      <p className="text-[11px] uppercase tracking-widest font-bold text-foreground/40 mb-4">
        Unsere Empfehlung für {intentLabel} in {stadtName}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {partner.logoSrc ? (
          <Image
            src={partner.logoSrc}
            alt={`${partner.name} Logo`}
            width={240}
            height={96}
            className="h-14 w-auto max-w-[200px] object-contain self-start sm:self-center"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-xl grid place-items-center text-white text-xl font-extrabold flex-shrink-0"
            style={{ backgroundColor: partner.color }}
            aria-hidden
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">{partner.name}</p>
          <p className="text-sm text-foreground/70">{partner.claim}</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/60">
            <li className="flex items-center gap-1"><span className="text-primary font-bold">✓</span> Kostenlose Anmeldung</li>
            <li className="flex items-center gap-1"><span className="text-primary font-bold">✓</span> Geprüfte Profile</li>
            <li className="flex items-center gap-1"><span className="text-primary font-bold">✓</span> Mitglieder aus {stadtName} &amp; Umgebung</li>
          </ul>
        </div>
        <a
          href={partner.href}
          rel={rel}
          target="_blank"
          className="inline-block rounded-full bg-[#429A45] px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity whitespace-nowrap self-start sm:self-center shadow-sm"
        >
          Jetzt kostenlos anmelden
        </a>
      </div>
      <p className="mt-4 text-xs text-foreground/50">
        Lieber im Berufe-Netzwerk bleiben?{' '}
        <a
          href="https://jobsingles.de/registration/?AID=JobsinglesMagazin"
          rel="noopener"
          target="_blank"
          className="font-semibold text-primary hover:underline"
        >
          Kostenlos bei Jobsingles registrieren
        </a>
      </p>
    </section>
  );
}
