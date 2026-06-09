import Link from 'next/link';
import { HeartButton } from '@/components/ui/HeartButton';

type Specialization = 'kueche' | 'service' | 'bar' | 'hotel' | 'management' | string;

const PILLARS: Record<string, { heading: string; text: string; href: string; cta: string }> = {
  kueche: {
    heading: 'Partnersuche für Köche — der komplette Guide',
    text: 'Cluster-Artikel zu Schichtdienst, Sous Chef, Sommelier, Wirt und Hochzeit im Restaurant.',
    href: '/singles-partnersuche/koeche',
    cta: 'Zum Köche-Guide →',
  },
  service: {
    heading: 'Partnersuche Service & Hotelfach',
    text: 'Restaurantfachfrau, Hotelfachmann, Sommelier, Barkeeperin — alle Cluster im Überblick.',
    href: '/singles-partnersuche/service',
    cta: 'Zum Service-Guide →',
  },
  bar: {
    heading: 'Partnersuche Service & Hotelfach',
    text: 'Barkeeperin, Sommelier und Nacht-Service — Cluster für die Bar-Welt.',
    href: '/singles-partnersuche/service',
    cta: 'Zum Service-Guide →',
  },
  hotel: {
    heading: 'Partnersuche Service & Hotelfach',
    text: 'Hotelfachfrau, Hotelfachmann und Front-Office — Cluster für das Hotelfach.',
    href: '/singles-partnersuche/service',
    cta: 'Zum Service-Guide →',
  },
};

export function PillarBacklinkCard({ specialization }: { specialization?: Specialization }) {
  const key = specialization || 'kueche';
  const pillar = PILLARS[key] || PILLARS.kueche;
  return (
    <div className="not-prose my-12 rounded-2xl bg-surface border border-foreground/10 p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-bold mb-3">{pillar.heading}</h3>
      <p className="text-foreground/70 leading-relaxed mb-6">{pillar.text}</p>
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={pillar.href}
          className="inline-block px-5 py-2.5 rounded-lg bg-brand-orange text-white font-semibold hover:bg-brand-orange/90 transition"
        >
          {pillar.cta}
        </Link>
        <HeartButton href="https://jobsingles.de/?AID=JobsinglesMagazin">
          Jetzt mitmachen
        </HeartButton>
      </div>
    </div>
  );
}
