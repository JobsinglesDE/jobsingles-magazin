import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-orange text-white/95 relative overflow-visible">
      {/* Animated gradient accent line */}
      <div className="animated-gradient-line h-[3px]" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        {/* Inner content area — slightly lighter surface */}
        <div className="relative rounded-2xl p-8 md:p-10" style={{ background: '#D86600' }}>
          {/* Tape left — fast senkrecht, zerrissene Ränder, dunkelgrau */}
          <div
            className="absolute -top-10 left-24 w-9 h-20 hidden md:block z-10"
            style={{
              background: 'rgba(255,255,255,0.38)',
              transform: 'rotate(-5deg)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              clipPath: 'polygon(4% 0%, 98% 2%, 100% 18%, 96% 35%, 100% 52%, 97% 70%, 100% 88%, 95% 100%, 3% 98%, 0% 82%, 3% 65%, 0% 48%, 4% 30%, 0% 14%)',
            }}
          />
          {/* Tape right — horizontal schräg, zerrissene Ränder */}
          <div
            className="absolute -top-3 right-14 w-24 h-8 hidden md:block z-10"
            style={{
              background: 'rgba(255,255,255,0.35)',
              transform: 'rotate(6deg)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
              clipPath: 'polygon(0% 3%, 15% 0%, 35% 4%, 52% 0%, 70% 3%, 88% 0%, 100% 4%, 98% 97%, 85% 100%, 65% 96%, 48% 100%, 30% 97%, 12% 100%, 2% 96%)',
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logos/jobsingles-logo.png"
                  alt="Jobsingles Magazin"
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
                <h3 className="font-bold text-lg text-white tracking-tight">
                  <span>Jobsingles</span><span className="text-white/80"> Magazin</span>
                </h3>
              </div>
              <p className="text-sm text-white/75 leading-relaxed">
                Das Magazin für Köche, Sommeliers, Wirte und Servicekräfte.
                Partnersuche, Tipps für den Schichtdienst und echte Erfolgsgeschichten aus der Gastronomie.
              </p>
            </div>

            {/* Magazin */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-white/70 mb-4">
                Magazin
              </h4>
              <nav className="flex flex-col gap-2">
                <Link href="/singles-partnersuche" className="text-sm text-white/75 hover:text-white transition-colors">
                  Partnersuche-Hub
                </Link>
                <Link href="/singles-regional" className="text-sm text-white/75 hover:text-white transition-colors">
                  Singles Regional
                </Link>
                <Link href="/erfolgsgeschichten" className="text-sm text-white/75 hover:text-white transition-colors">
                  Erfolgsgeschichten
                </Link>
              </nav>
            </div>

            {/* Netzwerk */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-white/70 mb-4">
                Netzwerk
              </h4>
              <nav className="flex flex-col gap-2">
                <a href="https://jobsingles.de" className="text-sm text-white/75 hover:text-white transition-colors">
                  Jobsingles.de — Das Netzwerk
                </a>
                <a href="https://www.youtube.com/@Jobsingles" target="_blank" rel="me noopener" className="text-sm text-white/75 hover:text-white transition-colors flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
                  YouTube-Kanal
                </a>
              </nav>
              <p className="text-[10px] text-white/80 mt-3">
                Teil des Jobsingles-Netzwerks mit 15+ Berufs-Dating-Portalen
              </p>
            </div>

            {/* Service */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-white/70 mb-4">
                Service
              </h4>
              <nav className="flex flex-col gap-2">
                <a href="https://jobsingles.de/hilfe/" className="text-sm text-white/75 hover:text-white transition-colors">
                  Hilfe & Support
                </a>
                <a href="https://jobsingles.de/kontakt/k%C3%BCndigen/" rel="nofollow" className="text-sm text-white/75 hover:text-white transition-colors">
                  Premium-Mitgliedschaft kündigen
                </a>
                <a href="https://jobsingles.de/datenschutz.html" className="text-sm text-white/75 hover:text-white transition-colors">
                  Datenschutz
                </a>
                <a href="https://jobsingles.de/impressum.html" className="text-sm text-white/75 hover:text-white transition-colors">
                  Impressum / AGB
                </a>
                <Link href="/ueber-uns" className="text-sm text-white/75 hover:text-white transition-colors">
                  Über uns
                </Link>
                <Link href="/kontakt" className="text-sm text-white/75 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/70">
            © {currentYear} Jobsingles.de — Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-white/70">
            Made with <span className="text-white">❤</span> by{' '}
            <a
              href="https://seeside.ai"
              target="_blank"
              rel="noopener"
              className="text-white/60 underline hover:text-white transition-colors"
            >
              seeside.ai
            </a>
          </p>
        </div>
      </div>

    </footer>
  );
}
