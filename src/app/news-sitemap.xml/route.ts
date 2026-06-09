import { reader } from '@/lib/keystatic';
import { articleHref } from '@/lib/routes';

const BASE = 'https://jobsingles.de/magazin';

export async function GET() {
  const articles = await reader.collections.articles.all();

  // News-Sitemap: nur Artikel der letzten 2 Tage (Google-Anforderung)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  twoDaysAgo.setHours(0, 0, 0, 0);

  type NewsEntry = { url: string; title: string; date: string };
  const newsEntries: NewsEntry[] = [];

  for (const a of articles) {
    if (!a.entry.publishedAt) continue;
    const pubDate = new Date(a.entry.publishedAt);
    if (pubDate < twoDaysAgo) continue;

    newsEntries.push({
      url: `${BASE}${articleHref(a)}`,
      title: a.entry.title,
      date: pubDate.toISOString(),
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsEntries.map((e) => `  <url>
    <loc>${e.url}</loc>
    <news:news>
      <news:publication>
        <news:name>Jobsingles Magazin</news:name>
        <news:language>de</news:language>
      </news:publication>
      <news:publication_date>${e.date}</news:publication_date>
      <news:title>${escapeXml(e.title)}</news:title>
    </news:news>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
