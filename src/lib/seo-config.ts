import seoSetup from '../../seo-setup.json';

export const siteConfig = seoSetup;

export function getArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedAt,
  authorName,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: string;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    image: image || seoSetup.defaultImage,
    datePublished: publishedAt,
    author: {
      '@type': 'Person',
      name: authorName || seoSetup.authors[0].name,
    },
    publisher: {
      '@type': 'Organization',
      name: seoSetup.organization.name,
      url: seoSetup.organization.url,
      logo: { '@type': 'ImageObject', url: seoSetup.organization.logo },
    },
  };
}

export function getFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
