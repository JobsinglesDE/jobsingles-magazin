interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function articleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  isNews,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  isNews?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': isNews ? 'NewsArticle' : 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description,
    url,
    ...(image && {
      image: image.startsWith('http') ? [image] : [`https://jobsingles.de${image.startsWith('/') ? '' : '/'}${image}`],
    }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: authorName || 'Tommy Honold',
      url: authorUrl || 'https://jobsingles.de/magazin/autor/tommy-honold',
      sameAs: [
        'https://www.facebook.com/thomashonold1/',
        'https://jobsingles.de/magazin/autor/tommy-honold',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jobsingles Magazin',
      url: 'https://jobsingles.de/magazin',
      logo: {
        '@type': 'ImageObject',
        url: 'https://jobsingles.de/magazin/logos/jobsingles-logo.png',
        width: 200,
        height: 200,
      },
    },
    inLanguage: 'de-DE',
  };
}

export function personJsonLd({
  name,
  role,
  image,
  url,
}: {
  name: string;
  role?: string;
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(role ? { jobTitle: role } : {}),
    ...(image ? { image } : {}),
    url,
  };
}

export function faqJsonLd(items: readonly { readonly question: string; readonly answer: string }[]) {
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

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
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

export function videoJsonLd({
  name,
  description,
  videoId,
  uploadDate,
  duration = 'PT35S',
}: {
  name: string;
  description: string;
  videoId: string;
  uploadDate: string;
  duration?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    uploadDate: uploadDate.includes('T') ? uploadDate : `${uploadDate}T00:00:00+02:00`,
    duration,
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    publisher: {
      '@type': 'Organization',
      name: 'Jobsingles Magazin',
      url: 'https://jobsingles.de/magazin',
    },
  };
}

export function extractYoutubeEmbed(content: unknown): { videoId: string; title: string } | null {
  const root = content && typeof content === 'object' && 'node' in content
    ? (content as { node: unknown }).node
    : content;
  let found: { videoId: string; title: string } | null = null;

  function walk(n: unknown): void {
    if (found || !n || typeof n !== 'object') return;
    const node = n as {
      type?: string;
      name?: string;
      tag?: string;
      attributes?: { url?: string; title?: string };
      children?: unknown[];
    };
    const tagName = node.tag ?? node.name;
    if (node.type === 'tag' && tagName === 'youtube') {
      const url = node.attributes?.url;
      const title = node.attributes?.title ?? '';
      if (url) {
        const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([^&\s?]+)/);
        if (m) {
          found = { videoId: m[1], title };
          return;
        }
      }
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  }
  walk(root);
  return found;
}

export function collectionPageJsonLd({
  name,
  description,
  url,
  items,
  dateModified,
  about,
}: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string }[];
  dateModified?: string;
  /** Ortsbezug der Sammelseite. jobsingles-Städte haben keine Geo-Koordinaten (Zensus-Textdaten),
   *  daher region/Land statt erfundener lat/lon. */
  about?: { name: string; region?: string; lat?: number; lon?: number };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    inLanguage: 'de-DE',
    ...(dateModified ? { dateModified } : {}),
    ...(about
      ? {
          about: {
            '@type': 'City',
            name: about.name,
            ...(about.region
              ? { address: { '@type': 'PostalAddress', addressRegion: about.region, addressCountry: 'DE' } }
              : {}),
            ...(typeof about.lat === 'number' && typeof about.lon === 'number'
              ? { geo: { '@type': 'GeoCoordinates', latitude: about.lat, longitude: about.lon } }
              : {}),
          },
        }
      : {}),
    isPartOf: {
      '@type': 'WebSite',
      name: 'Jobsingles Magazin',
      url: 'https://jobsingles.de/magazin',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: it.url,
      })),
    },
  };
}

/**
 * WebPage mit Ortsbezug — für Leaf-Landingpages (z.B. Stadt×Intent), die KEINE
 * Unterseiten-Sammlung sind (also kein CollectionPage/ItemList) und kein Blogartikel.
 */
export function webPageJsonLd({
  name,
  description,
  url,
  dateModified,
  about,
}: {
  name: string;
  description: string;
  url: string;
  dateModified?: string;
  about?: { name: string; region?: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    inLanguage: 'de-DE',
    ...(dateModified ? { dateModified } : {}),
    ...(about
      ? {
          about: {
            '@type': 'City',
            name: about.name,
            ...(about.region
              ? { address: { '@type': 'PostalAddress', addressRegion: about.region, addressCountry: 'DE' } }
              : {}),
          },
        }
      : {}),
    isPartOf: {
      '@type': 'WebSite',
      name: 'Jobsingles Magazin',
      url: 'https://jobsingles.de/magazin',
    },
  };
}

export function placeJsonLd({
  name,
  description,
  url,
  kanton,
}: {
  name: string;
  description: string;
  url: string;
  kanton: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name,
    description,
    url,
    address: {
      '@type': 'PostalAddress',
      addressRegion: kanton,
      addressCountry: 'CH',
    },
    containedInPlace: {
      '@type': 'Country',
      name: 'Schweiz',
    },
  };
}

function parseIntFromText(s?: string): number | undefined {
  if (!s) return undefined;
  const m = s.replace(/\./g, '').match(/(\d{2,7})/);
  return m ? parseInt(m[1], 10) : undefined;
}


export function vereinOrgJsonLd({
  name,
  url,
  webseite,
  address,
  bundesland,
  mitgliederzahl,
  mutterverband,
}: {
  name: string;
  url: string;
  webseite?: string;
  address?: string;
  bundesland: string;
  mitgliederzahl?: string;
  mutterverband?: string;
}) {
  const members = parseIntFromText(mitgliederzahl);
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name,
    url,
    ...(webseite ? { sameAs: [webseite] } : {}),
    ...(address ? {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
        addressRegion: bundesland,
        addressCountry: 'DE',
      },
    } : {
      address: {
        '@type': 'PostalAddress',
        addressRegion: bundesland,
        addressCountry: 'DE',
      },
    }),
    ...(members ? { numberOfEmployees: { '@type': 'QuantitativeValue', value: members } } : {}),
    areaServed: {
      '@type': 'AdministrativeArea',
      name: bundesland,
    },
    ...(mutterverband ? { parentOrganization: { '@type': 'Organization', name: mutterverband } } : {}),
  };
}

export function organizationJsonLd({
  name,
  alternateName,
  url,
  parentName,
  parentUrl,
  description,
  foundingDate,
  memberOfBjae,
}: {
  name: string;
  alternateName?: string;
  url?: string;
  parentName?: string;
  parentUrl?: string;
  description?: string;
  foundingDate?: string;
  memberOfBjae?: boolean;
}) {
  const memberOf: any[] = [];
  if (parentName) memberOf.push({
    '@type': 'Organization',
    name: parentName,
    ...(parentUrl ? { url: parentUrl } : {}),
  });
  if (memberOfBjae) memberOf.push({
    '@type': 'Organization',
    name: 'Verband der Köche Deutschlands (VKD)',
      url: 'https://www.vkd.com',
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    ...(alternateName ? { alternateName } : {}),
    ...(url ? { url } : {}),
    ...(description ? { description } : {}),
    ...(foundingDate ? { foundingDate } : {}),
    areaServed: {
      '@type': 'Country',
      name: 'Deutschland',
      sameAs: 'https://www.wikidata.org/wiki/Q183',
    },
    ...(memberOf.length ? { memberOf } : {}),
  };
}
