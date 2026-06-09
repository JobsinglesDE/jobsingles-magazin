import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/kontakt' },
  title: 'Kontakt',
  description:
    'Kontakt zum Jobsingles Magazin: Redaktion, Hinweise zu Artikeln, Pressekontakt, Werbung. Wir antworten innerhalb von 48 Stunden.',
  openGraph: {
    title: 'Kontakt — Jobsingles Magazin',
    description: 'Kontakt zum Jobsingles Magazin: Redaktion, Hinweise zu Artikeln, Pressekontakt und Werbung.',
    url: 'https://jobsingles.de/magazin/kontakt',
    type: 'website',
    siteName: 'Jobsingles Magazin',
    locale: 'de_DE',
  },
};

export default function KontaktPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
        Kontakt zum Jobsingles Magazin
      </h1>
      <p className="text-lg text-foreground/70 mb-12 leading-relaxed">
        Redaktionelle Anfragen, Themen-Vorschläge, Korrekturen oder Pressekontakt — schreib uns. Wir antworten innerhalb
        von 48 Stunden, oft schneller.
      </p>

      <section className="space-y-8">
        <div className="rounded-2xl border border-foreground/10 p-6 bg-foreground/5">
          <h2 className="text-xl font-bold mb-2">Redaktion</h2>
          <p className="text-foreground/70 mb-3">
            Verantwortlich für Inhalt und Recherche: <strong>Tommy Honold</strong>
          </p>
          <p className="text-foreground/70">
            E-Mail:{' '}
            <a
              href="mailto:redaktion@jobsingles.de"
              className="text-brand-orange hover:underline"
            >
              redaktion@jobsingles.de
            </a>
          </p>
          <p className="text-sm text-foreground/55 mt-2">
            Mehr über den Autor:{' '}
            <Link href="/autor/tommy-honold" className="hover:text-brand-orange transition-colors">
              Profil &amp; Veröffentlichungen
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-foreground/10 p-6 bg-foreground/5">
          <h2 className="text-xl font-bold mb-2">Korrekturen &amp; Hinweise</h2>
          <p className="text-foreground/70">
            Fehler entdeckt? Falsche Zahlen, veraltete Quellen, Tippfehler — schick uns einen kurzen Hinweis mit der URL
            des Artikels. Wir prüfen und korrigieren transparent.
          </p>
        </div>

        <div className="rounded-2xl border border-foreground/10 p-6 bg-foreground/5">
          <h2 className="text-xl font-bold mb-2">Plattform Jobsingles.de</h2>
          <p className="text-foreground/70 mb-2">
            Fragen zu Mitgliedschaft, Profil, Premium oder Datenschutz auf der Dating-Plattform:
          </p>
          <ul className="text-foreground/70 space-y-1">
            <li>
              →{' '}
              <a href="https://jobsingles.de/hilfe/" className="text-brand-orange hover:underline">
                Hilfe &amp; Support
              </a>
            </li>
            <li>
              →{' '}
              <a href="https://jobsingles.de/datenschutz.html" className="text-brand-orange hover:underline">
                Datenschutz / Cookies
              </a>
            </li>
            <li>
              →{' '}
              <a href="https://jobsingles.de/impressum.html" className="text-brand-orange hover:underline">
                Impressum &amp; AGB
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-foreground/10 p-6 bg-foreground/5">
          <h2 className="text-xl font-bold mb-2">Presse &amp; Kooperationen</h2>
          <p className="text-foreground/70">
            Pressekontakt, Gastbeiträge, Werbe-Anfragen, Kooperationen mit Verbänden oder Behörden — gleicher Mail-Kanal:{' '}
            <a href="mailto:redaktion@jobsingles.de" className="text-brand-orange hover:underline">
              redaktion@jobsingles.de
            </a>
          </p>
        </div>
      </section>

      <h2 className="text-2xl font-bold mt-12 mb-3">Wer steckt hinter dem Magazin?</h2>
      <p className="text-foreground/70">
        Das Jobsingles Magazin gehört zum Jobsingles-Netzwerk und wird redaktionell von Tommy Honold geführt. Schwerpunkt:
        Partnersuche für Köche, Sommeliers, Wirte und Servicekräfte in der DACH-Region. Die Themen reichen von
        Dating-Tipps im Schichtdienst über psychologische Aspekte der Partnersuche bis zu Erfolgsgeschichten echter Paare,
        die sich über die Plattform gefunden haben.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">Themenvorschläge willkommen</h2>
      <p className="text-foreground/70">
        Wir nehmen Themen-Vorschläge gerne entgegen — vor allem wenn sie aus erster Hand kommen: aus dem Küchen-Alltag,
        aus dem Service nach Mitternacht, aus dem Beziehungsalltag mit Schichtdienst. Anonymität ist möglich, alle Geschichten werden
        nur mit ausdrücklicher Freigabe veröffentlicht.
      </p>

      <p className="text-sm text-foreground/45 mt-12">
        Antwortzeit: typischerweise 24–48 Stunden, in Ausnahmefällen länger.
      </p>
    </section>
  );
}
