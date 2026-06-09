import Link from 'next/link';

interface ArticleBylineProps {
  authorName?: string;
  authorSlug?: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return d;
  }
}

export function ArticleByline({
  authorName = 'Tommy Honold',
  authorSlug = 'tommy-honold',
  publishedAt,
  updatedAt,
}: ArticleBylineProps) {
  return (
    <address className="not-italic flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/60 mb-6 pb-4 border-b border-foreground/10">
      <span>
        Von{' '}
        <Link
          rel="author"
          href={`/autor/${authorSlug}`}
          className="text-foreground/85 font-medium hover:text-brand-orange transition-colors"
          itemProp="author"
        >
          {authorName}
        </Link>
      </span>
      {publishedAt && (
        <>
          <span className="text-foreground/50">·</span>
          <time dateTime={publishedAt} itemProp="datePublished">Veröffentlicht {formatDate(publishedAt)}</time>
        </>
      )}
      {updatedAt && updatedAt !== publishedAt && (
        <>
          <span className="text-foreground/50">·</span>
          <time dateTime={updatedAt}>Aktualisiert {formatDate(updatedAt)}</time>
        </>
      )}
    </address>
  );
}
