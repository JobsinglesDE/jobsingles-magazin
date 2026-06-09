import type { MetadataRoute } from 'next';

// DEMO-Phase: solange Mock-Profile (ProfileFeed-Platzhalter) ausgespielt werden,
// MUSS die Seite noindex sein (kein Doorway-Index). Erst auf false setzen, wenn
// echter ICONY-Profilfeed + echte Daten live sind.
const DEMO = true;

export default function robots(): MetadataRoute.Robots {
  // VERCEL_ENV ist nur auf Production-Deployments 'production' (Previews/Branches: 'preview')
  const isProduction = process.env.VERCEL_ENV === 'production';

  if (DEMO || !isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/keystatic/'],
    },
    sitemap: [
      'https://jobsingles.de/magazin/sitemap.xml',
      'https://jobsingles.de/magazin/news-sitemap.xml',
    ],
  };
}
