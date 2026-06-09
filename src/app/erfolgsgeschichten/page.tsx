import { reader } from '@/lib/keystatic';
import { SuccessStory } from '@/components/content/SuccessStory';

export const metadata = {
  alternates: { canonical: '/erfolgsgeschichten' },
  title: 'Erfolgsgeschichten aus der Gastronomie',
  description: 'Echte Liebesgeschichten von Jobsingles.de: Köche, Sommeliers und Servicekräfte, die ihre Partner in der Gastronomie gefunden haben.',
  openGraph: {
    title: 'Erfolgsgeschichten — Liebespaare aus der Gastronomie',
    description: 'Echte Liebesgeschichten von Jobsingles.de: Köche, Sommeliers und Servicekräfte, die ihre Partner in der Gastronomie gefunden haben.',
    url: 'https://jobsingles.de/magazin/erfolgsgeschichten',
    type: 'website' as const,
    siteName: 'Jobsingles Magazin',
    locale: 'de_DE',
  },
};

const rotations: Array<'left' | 'right' | 'slight'> = ['left', 'right', 'slight'];

export default async function Erfolgsgeschichten() {
  const allStories = await reader.collections.stories.all();
  const stories = [...allStories].sort((a, b) =>
    String(b.entry.publishedAt ?? '').localeCompare(String(a.entry.publishedAt ?? ''))
  );

  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 particle-overlay opacity-50" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 particle-text">Erfolgsgeschichten</h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Echte Paare. Echte Geschichten. So findet die Gastronomie die Liebe.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-4">
        <div className="space-y-4 text-foreground/75 leading-relaxed">
          <p>
            Echte Paare, die sich über Jobsingles.de gefunden haben. Keine Werbesprüche, keine inszenierten Models —
            sondern Menschen, die im Berufsalltag mit Schichtdienst, Spätservice und 60-Stunden-Wochen leben. Ihre Geschichten
            zeigen, dass Partnersuche in der Gastronomie funktioniert, auch wenn die Rahmenbedingungen unvorhersehbar sind.
          </p>
          <p>
            Jede Erfolgsgeschichte stammt aus einem persönlichen Gespräch mit dem Paar — freigegeben für die Veröffentlichung.
            Die Namen sind echt (oder mit Einverständnis leicht verändert), die Beschreibungen stammen aus den Paaren selbst.
            Was sie eint: beide Seiten verstehen, was der andere beruflich durchmacht, und beide haben bewusst eine Plattform
            gewählt, die darauf zugeschnitten ist.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="sr-only">Erfolgsgeschichten unserer Mitglieder</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {stories.map((story, i) => (
            <SuccessStory
              key={story.slug}
              title={story.entry.title}
              couple={story.entry.couple}
              location={story.entry.location}
              excerpt={story.entry.excerpt}
              href={`/erfolgsgeschichten/${story.slug}`}
              image={story.entry.featuredImage || undefined}
              imageAlt={story.entry.featuredImageAlt || undefined}
              rotation={rotations[i % 3]}
            />
          ))}
        </div>
        {stories.length === 0 && (
          <p className="text-foreground/50 text-center py-12">Erfolgsgeschichten folgen in Kürze.</p>
        )}
      </section>
    </>
  );
}
