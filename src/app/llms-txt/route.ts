import { reader } from '@/lib/keystatic';
import { getArticleUrl } from '@/lib/routes';

const BASE = 'https://jobsingles.de/magazin';

export async function GET() {
  const [articles, staedte, stories] = await Promise.all([
    reader.collections.articles.all(),
    reader.collections.staedte.all(),
    reader.collections.stories.all(),
  ]);

  const published = {
    articles: articles.filter((a) => a.entry.status !== 'draft'),
    staedte: staedte.filter((s) => s.entry.status !== 'draft'),
    stories,
  };

  const lines: string[] = [];

  lines.push('# Jobsingles Magazin — jobsingles.de');
  lines.push('');
  lines.push('Dating-Magazin der Berufe: Partnersuche für Menschen mit fordernden Berufen.');
  lines.push('Partnersuche-Guides nach Beruf, Singles regional nach Stadt und Erfolgsgeschichten.');
  lines.push('');
  lines.push('## Sitemaps');
  lines.push('');
  lines.push(`- [XML Sitemap](${BASE}/sitemap.xml): Alle öffentlichen URLs`);
  lines.push(`- [News Sitemap](${BASE}/news-sitemap.xml): Aktuelle Artikel (letzte 48h)`);
  lines.push('');

  lines.push('## Partnersuche & Dating');
  lines.push('');
  for (const a of published.articles) {
    const url = `${BASE}${getArticleUrl(a.slug)}`;
    const desc = a.entry.excerpt || a.entry.seoDescription || '';
    lines.push(`- [${a.entry.title}](${url})${desc ? ` - ${desc}` : ''}`);
  }
  lines.push('');

  lines.push('## Singles Regional');
  lines.push('');
  for (const s of published.staedte) {
    const url = `${BASE}/singles-regional/staedte/${s.entry.bundesland}/${s.entry.stadt}`;
    const desc = s.entry.intro || s.entry.seoDescription || '';
    lines.push(`- [${s.entry.title}](${url})${desc ? ` - ${desc}` : ''}`);
  }
  lines.push('');

  lines.push('## Erfolgsgeschichten');
  lines.push('');
  for (const s of published.stories) {
    const url = `${BASE}/erfolgsgeschichten/${s.slug}`;
    const desc = s.entry.excerpt || s.entry.seoDescription || '';
    lines.push(`- [${s.entry.title}](${url})${desc ? ` - ${desc}` : ''}`);
  }
  lines.push('');

  lines.push('## Kontakt');
  lines.push('');
  lines.push('- Website: https://jobsingles.de');
  lines.push('- Magazin: https://jobsingles.de/magazin');
  lines.push('- Netzwerk: JobSingles.de — Dating für Berufe');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
