import { NextResponse } from 'next/server';
import { reader } from '@/lib/keystatic';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allArticles = await reader.collections.articles.all();

  const featuredArticles = allArticles
    .filter((a) => a.entry.isFeatured && a.entry.status === 'published')
    .map((a) => ({
      title: a.entry.title,
      excerpt: a.entry.excerpt || '',
      url: `https://jobsingles.de/magazin/${a.slug}/`,
      image: a.entry.featuredImage
        ? `https://jobsingles.de/magazin${a.entry.featuredImage}`
        : '',
      category: a.entry.category,
    }));

  return NextResponse.json({ articles: featuredArticles, stories: [] });
}
