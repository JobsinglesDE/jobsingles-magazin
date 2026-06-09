/**
 * Kanonische Artikel-URL. Alle Artikel leben unter /singles-partnersuche/{slug}.
 */
export function getArticleUrl(
  slug: string,
  _category?: string,
  _opts?: { show?: string; position?: string },
): string {
  return `/singles-partnersuche/${slug}`;
}

/** Bequemer Helfer: URL aus einem Keystatic-Collection-Item ({slug, entry}). */
export function articleHref(item: {
  slug: string;
  entry: { category?: string };
}): string {
  return getArticleUrl(item.slug);
}
