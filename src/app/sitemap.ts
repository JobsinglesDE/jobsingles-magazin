import type { MetadataRoute } from 'next';
import { reader } from '@/lib/keystatic';
import { getArticleUrl } from '@/lib/routes';
import { ALL_HUBS } from '@/lib/hubs';

const BASE = 'https://jobsingles.de/magazin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, stories, staedte] = await Promise.all([
    reader.collections.articles.all(),
    reader.collections.stories.all(),
    reader.collections.staedte.all(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE}/singles-partnersuche`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/singles-regional`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/singles-regional/staedte`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/erfolgsgeschichten`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/ueber-uns`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/kontakt`, priority: 0.5, changeFrequency: 'monthly' },
    // Hubs (zentral aus hubs.ts, je mit ❤️-Meta)
    ...ALL_HUBS.map((h) => ({
      url: `${BASE}/${h.slug}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    })),
  ];

  const articlePages: MetadataRoute.Sitemap = articles
    .filter((a) => a.entry.status === 'published')
    .map((a) => ({
      url: `${BASE}${getArticleUrl(a.slug)}`,
      priority: a.entry.isFeatured ? 0.9 : 0.7,
      changeFrequency: 'monthly' as const,
    }));

  const storyPages: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${BASE}/erfolgsgeschichten/${s.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  // Städte
  const staedteBundeslaender = [...new Set(staedte.map((a) => a.entry.bundesland))];
  const staedteBundeslandPages: MetadataRoute.Sitemap = staedteBundeslaender.map((b) => ({
    url: `${BASE}/singles-regional/staedte/${b}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));
  const staedtePages: MetadataRoute.Sitemap = staedte
    .filter((a) => a.entry.status === 'published')
    .map((a) => ({
      url: `${BASE}/singles-regional/staedte/${a.entry.bundesland}/${a.entry.stadt}`,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    }));

  const all = [...staticPages, ...articlePages, ...storyPages, ...staedteBundeslandPages, ...staedtePages];
  // Dedupe nach URL
  const seen = new Set<string>();
  return all.filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
}
