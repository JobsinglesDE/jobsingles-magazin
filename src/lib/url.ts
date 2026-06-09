const BASE_PATH = '/magazin';

/**
 * Prefix root-relative paths with Next.js basePath.
 * Used for <img src> in rendered markup — Next.js <Image> and <Link> prefix
 * automatically, but raw <img>, <a href> outside Link, and custom handlers do not.
 */
export function withBasePath(src: string | undefined | null): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('//') || /^[a-z]+:/i.test(src) || src.startsWith('#')) return src;
  if (src.startsWith(`${BASE_PATH}/`) || src === BASE_PATH) return src;
  if (src.startsWith('/')) return `${BASE_PATH}${src}`;
  return src;
}
