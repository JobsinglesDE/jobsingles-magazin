// 3-USP-Block „Warum Jobsingles" — Marken-Inhalt (darf stadt-übergreifend gleich sein),
// ersetzt meinestadts Konkurrenz-Logo-Band. Wir bewerben keine fremden Singlebörsen.

const USPS = [
  {
    icon: '👩‍🚒',
    title: 'Dating der Berufe',
    text: 'Finde Menschen, die deinen Arbeitsalltag verstehen — vom Schichtdienst bis zum Wochenenddienst.',
  },
  {
    icon: '📍',
    title: 'Singles aus deiner Region',
    text: 'Echte Profile aus deiner Stadt und Umgebung — keine anonyme Masse, sondern Menschen aus der Nähe.',
  },
  {
    icon: '❤️',
    title: 'Kostenlos starten',
    text: 'Basis-Mitgliedschaft gratis. In zwei Minuten angemeldet und sofort losflirten.',
  },
];

export function WhyJobsingles({ stadtName }: { stadtName?: string }) {
  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4">
        Warum Jobsingles{stadtName ? ` in ${stadtName}` : ''}?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {USPS.map((u) => (
          <div key={u.title} className="rounded-2xl border border-foreground/10 bg-surface p-5">
            <div className="text-3xl mb-2" aria-hidden>{u.icon}</div>
            <div className="font-bold text-foreground mb-1">{u.title}</div>
            <p className="text-sm text-foreground/65 leading-relaxed">{u.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
