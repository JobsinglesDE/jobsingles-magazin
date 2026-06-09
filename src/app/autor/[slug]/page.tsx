import Link from 'next/link';
import { reader } from '@/lib/keystatic';
import { notFound } from 'next/navigation';
import { getArticleUrl } from '@/lib/routes';
import { JsonLd } from '@/components/seo/JsonLd';
import { withBasePath } from '@/lib/url';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await reader.collections.authors.read(slug);
  if (!author) return {};
  return {
    title: `${author.name} — Autor | Jobsingles Magazin`,
    description: author.bio || `Artikel von ${author.name} auf dem Jobsingles Magazin.`,
    alternates: { canonical: `/autor/${slug}` },
    openGraph: {
      title: `${author.name} — Autor | Jobsingles Magazin`,
      description: author.bio || undefined,
      images: author.avatar ? [author.avatar] : [],
    },
  };
}

export async function generateStaticParams() {
  const authors = await reader.collections.authors.all();
  return authors.map((a) => ({ slug: a.slug }));
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await reader.collections.authors.read(slug);
  if (!author) notFound();

  const allArticles = await reader.collections.articles.all();
  const authorArticles = allArticles
    .filter((a) => a.entry.author === slug)
    .sort((a, b) => {
      const da = a.entry.publishedAt || '';
      const db = b.entry.publishedAt || '';
      return db.localeCompare(da);
    });
  const totalArticles = authorArticles.length;
  const visibleArticles = authorArticles.slice(0, 30);

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `https://jobsingles.de/magazin/autor/${slug}`,
    image: author.avatar
      ? `https://jobsingles.de/magazin${author.avatar}`
      : undefined,
    jobTitle: author.role || undefined,
    description: author.bio || undefined,
    sameAs: author.socialLinks
      ?.filter((l) => l.url)
      .map((l) => l.url as string),
  };

  return (
    <>
      <JsonLd data={personJsonLd} />

      {/* Hero */}
      <section className="bg-surface border-b border-border/40 py-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          {author.avatar ? (
            <img width="600" height="400"
              src={withBasePath(author.avatar)}
              alt={author.name}
              className="w-28 h-28 rounded-full object-cover shrink-0 ring-4 ring-primary/20"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/20 flex items-center justify-center shrink-0">
              <span className="text-4xl font-bold text-primary">{author.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">
              {author.role || 'Autor'}
            </p>
            <h1 className="text-3xl font-bold text-foreground mb-4">{author.name}</h1>
            {author.longBio ? (
              <div className="text-foreground/70 leading-relaxed whitespace-pre-line text-sm">
                {author.longBio}
              </div>
            ) : author.bio ? (
              <p className="text-foreground/70 leading-relaxed text-sm">{author.bio}</p>
            ) : null}
            {author.socialLinks && author.socialLinks.length > 0 && (
              <div className="flex gap-4 mt-5">
                {author.socialLinks.filter((l) => l.url).map((l) => (
                  <a
                    key={l.url}
                    href={l.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {l.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-xl font-bold text-foreground mb-8">
          Artikel von {author.name} ({totalArticles})
        </h2>
        {totalArticles === 0 ? (
          <p className="text-foreground/50 text-sm">Noch keine Artikel vorhanden.</p>
        ) : (
          <ul className="divide-y divide-border/40">
            {visibleArticles.map((a) => (
              <li key={a.slug} className="py-5">
                <Link
                  href={getArticleUrl(a.slug, a.entry.category, { show: a.entry.show, position: a.entry.position })}
                  className="group flex gap-4 items-start"
                >
                  {a.entry.featuredImage && (
                    <img width="600" height="400"
                      src={withBasePath(a.entry.featuredImage)}
                      alt={a.entry.featuredImageAlt || a.entry.title}
                      className="w-20 h-14 object-cover rounded-lg shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">
                      {a.entry.category}
                    </p>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {a.entry.title}
                    </p>
                    {a.entry.publishedAt && (
                      <p className="text-xs text-foreground/40 mt-1">
                        {new Date(a.entry.publishedAt).toLocaleDateString('de-CH', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {totalArticles > 30 && (
          <p className="text-xs text-foreground/50 mt-6 text-center">
            Zeigt 30 der {totalArticles} Artikel — die neusten zuerst.
          </p>
        )}
      </section>
    </>
  );
}
