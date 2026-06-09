import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: process.env.KEYSTATIC_GITHUB_CLIENT_ID
    ? {
        kind: 'github',
        repo: 'JobsinglesDE/jobsingles-magazin',
      }
    : { kind: 'local' },
  ui: {
    brand: { name: 'Jobsingles Magazin' },
  },
  collections: {
    articles: collection({
      label: 'Artikel',
      slugField: 'title',
      path: 'content/articles/*',
      columns: ['publishedAt', 'title', 'category', 'specialization'],
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Titel' } }),
        focusKeyword: fields.text({
          label: 'Focus-Keyword',
          description: 'Haupt-Keyword fuer SEO-Check (z.B. "Hans Sigl Bergdoktor"). Aktiviert 7 Yoast-Style-Checks im SEO-Score-Widget.',
        }),
        category: fields.select({
          label: 'Kategorie (Sektion)',
          defaultValue: 'partnersuche',
          options: [
            { label: 'Partnersuche', value: 'partnersuche' },
          ],
        }),
        show: fields.select({
          label: 'Show (nur bei TV & Koch-Shows)',
          defaultValue: '',
          options: [
            { label: '— (keine)', value: '' },
            { label: 'Kitchen Impossible', value: 'kitchen-impossible' },
            { label: 'Grill den Henssler', value: 'grill-den-henssler' },
            { label: 'Rosins Restaurants', value: 'rosins-restaurants' },
            { label: 'Promi-Köche (Porträts)', value: 'promi-koeche' },
            { label: 'Die Küchenschlacht', value: 'kuechenschlacht' },
            { label: 'The Taste', value: 'the-taste' },
          ],
        }),
        person: fields.text({
          label: 'Person-Slug (z.B. henssler, maelzer) — optional',
          defaultValue: '',
        }),
        specialization: fields.select({
          label: 'Bereich',
          defaultValue: '',
          options: [
            { label: '— (alle)', value: '' },
            { label: 'Küche', value: 'kueche' },
            { label: 'Service', value: 'service' },
            { label: 'Bar', value: 'bar' },
            { label: 'Hotel', value: 'hotel' },
            { label: 'Management', value: 'management' },
          ],
        }),
        position: fields.select({
          label: 'Position / Berufsbezeichnung',
          defaultValue: '',
          options: [
            { label: '— (allgemein)', value: '' },
            // Küche
            { label: 'Koch', value: 'koch' },
            { label: 'Küchenchef', value: 'kuechenchef' },
            { label: 'Sous Chef', value: 'sous-chef' },
            { label: 'Chef de Partie', value: 'chef-de-partie' },
            { label: 'Commis de Cuisine', value: 'commis-de-cuisine' },
            { label: 'Saucier', value: 'saucier' },
            { label: 'Entremetier', value: 'entremetier' },
            { label: 'Patissier', value: 'patissier' },
            { label: 'Garde Manger', value: 'garde-manger' },
            { label: 'Poissonnier', value: 'poissonnier' },
            { label: 'Rôtisseur', value: 'rotisseur' },
            // Service
            { label: 'Restaurantfachfrau', value: 'restaurantfachfrau' },
            { label: 'Restaurantfachmann', value: 'restaurantfachmann' },
            { label: 'Hotelfachfrau', value: 'hotelfachfrau' },
            { label: 'Hotelfachmann', value: 'hotelfachmann' },
            { label: 'Chef de Rang', value: 'chef-de-rang' },
            { label: 'Maître d\'Hôtel', value: 'maitre-d-hotel' },
            { label: 'Restaurantleiter', value: 'restaurantleiter' },
            // Bar
            { label: 'Barkeeper', value: 'barkeeper' },
            { label: 'Barkeeperin', value: 'barkeeperin' },
            { label: 'Sommelier', value: 'sommelier' },
            { label: 'Sommelière', value: 'sommeliere' },
            { label: 'Chef de Bar', value: 'chef-de-bar' },
            // Allgemein
            { label: 'Wirt / Gastronom', value: 'wirt' },
            { label: 'F&B Manager', value: 'fb-manager' },
          ],
        }),
        type: fields.select({
          label: 'Typ',
          defaultValue: 'cluster',
          options: [
            { label: 'Pillar (Haupt-Hub)', value: 'pillar' },
            { label: 'Pillar-Sub', value: 'pillar-sub' },
            { label: 'Cluster', value: 'cluster' },
            { label: 'Berufsbild-Hub', value: 'berufsbild' },
            { label: 'News', value: 'news' },
            { label: 'Gossip', value: 'gossip' },
            { label: 'Story (Legacy)', value: 'story' },
            { label: 'Serie (Legacy)', value: 'serie' },
          ],
        }),
        series: fields.select({
          label: 'Serie',
          defaultValue: '',
          options: [
            { label: 'Keine', value: '' },
            { label: 'Kitchen Impossible', value: 'kitchen-impossible' },
            { label: 'Grill den Henssler', value: 'grill-den-henssler' },
            { label: 'Rosins Restaurants', value: 'rosins-restaurants' },
            { label: 'Promiköche allgemein', value: 'promikoche' },
          ],
        }),
        excerpt: fields.text({ label: 'Auszug', multiline: true }),
        featuredImage: fields.image({
          label: 'Beitragsbild',
          directory: 'public/images/articles',
          publicPath: '/images/articles/',
        }),
        featuredImageAlt: fields.text({
          label: 'Alt-Text Beitragsbild',
          description: 'Beschreibung des Bild-Motivs (SEO + Barrierefreiheit). Beispiel: "Hans Sigl im weißen Arztkittel vor Bergpanorama". Falls leer, wird der Artikel-Titel als Fallback genutzt.',
        }),
        featuredImageCredit: fields.text({
          label: 'Bild-Credit',
          description: 'Urhebernennung unter dem Bild. Beispiel: "Foto: ZDF/Sabine Finger Fotografie" oder "© Superbass / CC BY-SA 4.0 via Wikimedia Commons". Pflicht bei Pressebildern.',
        }),
        author: fields.relationship({
          label: 'Autor',
          collection: 'authors',
        }),
        calloutQuestion: fields.text({ label: 'Callout Frage' }),
        calloutAnswer: fields.text({ label: 'Callout Antwort', multiline: true }),
        content: fields.markdoc({ label: 'Inhalt' }),
        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Frage' }),
            answer: fields.text({ label: 'Antwort', multiline: true }),
          }),
          {
            label: 'FAQ',
            itemLabel: (props) => props.fields.question.value,
          }
        ),
        takeaways: fields.array(fields.text({ label: 'Punkt' }), {
          label: 'Das Wichtigste',
        }),
        status: fields.select({
          label: 'Status',
          defaultValue: 'published',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
        }),
        isNews: fields.checkbox({ label: 'News-Artikel (NewsArticle JSON-LD)', defaultValue: false }),
        isFeatured: fields.checkbox({ label: 'Auf ICONY-Startseite anzeigen (max. 3)', defaultValue: false }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        seoTitle: fields.text({ label: 'SEO Titel' }),
        seoDescription: fields.text({ label: 'SEO Beschreibung' }),
        publishedAt: fields.date({ label: 'Veröffentlicht am' }),
        theme: fields.select({
          label: 'Theme',
          defaultValue: 'dark',
          options: [
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
          ],
        }),
      },
    }),

    stories: collection({
      label: 'Erfolgsgeschichten',
      slugField: 'title',
      path: 'content/stories/*',
      columns: ['publishedAt', 'couple', 'location'],
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Titel' } }),
        focusKeyword: fields.text({
          label: 'Focus-Keyword',
          description: 'Haupt-Keyword fuer SEO-Check (z.B. "Hans Sigl Bergdoktor"). Aktiviert 7 Yoast-Style-Checks im SEO-Score-Widget.',
        }),
        couple: fields.text({ label: 'Paar-Namen' }),
        location: fields.text({ label: 'Ort' }),
        excerpt: fields.text({ label: 'Auszug', multiline: true }),
        featuredImage: fields.image({
          label: 'Paar-Foto',
          directory: 'public/images/stories',
          publicPath: '/images/stories/',
        }),
        featuredImageAlt: fields.text({
          label: 'Alt-Text Paar-Foto',
          description: 'Beschreibung des Bild-Motivs (SEO + Barrierefreiheit). Falls leer → Titel als Fallback.',
        }),
        featuredImageCredit: fields.text({
          label: 'Bild-Credit',
          description: 'Urhebernennung unter dem Bild. Beispiel: "Foto: ZDF/Sabine Finger Fotografie" oder "© Superbass / CC BY-SA 4.0 via Wikimedia Commons". Pflicht bei Pressebildern.',
        }),
        content: fields.markdoc({ label: 'Geschichte' }),
        isFeatured: fields.checkbox({ label: 'Auf ICONY-Startseite anzeigen (max. 3)', defaultValue: false }),
        publishedAt: fields.date({ label: 'Veröffentlicht am' }),
        seoTitle: fields.text({ label: 'SEO Titel' }),
        seoDescription: fields.text({ label: 'SEO Beschreibung' }),
      },
    }),


    staedte: collection({
      label: 'Städte (Singles Regional)',
      slugField: 'title',
      path: 'content/staedte/*',
      columns: ['publishedAt', 'title', 'bundesland', 'stadt'],
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Stadtname' } }),
        bundesland: fields.select({
          label: 'Bundesland',
          defaultValue: 'baden-wuerttemberg',
          options: [
            { label: 'Baden-Württemberg', value: 'baden-wuerttemberg' },
            { label: 'Bayern', value: 'bayern' },
            { label: 'Berlin', value: 'berlin' },
            { label: 'Brandenburg', value: 'brandenburg' },
            { label: 'Bremen', value: 'bremen' },
            { label: 'Hamburg', value: 'hamburg' },
            { label: 'Hessen', value: 'hessen' },
            { label: 'Mecklenburg-Vorpommern', value: 'mecklenburg-vorpommern' },
            { label: 'Niedersachsen', value: 'niedersachsen' },
            { label: 'Nordrhein-Westfalen', value: 'nordrhein-westfalen' },
            { label: 'Rheinland-Pfalz', value: 'rheinland-pfalz' },
            { label: 'Saarland', value: 'saarland' },
            { label: 'Sachsen', value: 'sachsen' },
            { label: 'Sachsen-Anhalt', value: 'sachsen-anhalt' },
            { label: 'Schleswig-Holstein', value: 'schleswig-holstein' },
            { label: 'Thueringen', value: 'thueringen' },
            { label: 'Deutschland (bundesweit)', value: 'deutschland' },
          ],
        }),
        kreis: fields.text({ label: 'Kreis / Landkreis' }),
        stadt: fields.text({ label: 'Stadt (Slug-Form)', description: 'z.B. "konstanz", "frankfurt-am-main"' }),
        ledigeAnzahl: fields.text({ label: 'Anzahl Ledige' }),
        einwohner: fields.text({ label: 'Einwohner' }),
        altersstruktur: fields.text({ label: 'Altersstruktur' }),
        geschlechterquote: fields.text({ label: 'Geschlechterquote' }),
        stichtag: fields.text({ label: 'Stichtag', defaultValue: 'Zensus 2022' }),
        prioritaet: fields.select({
          label: 'Priorität (Build-Order)',
          defaultValue: 'MEDIUM',
          options: [
            { label: 'HIGH', value: 'HIGH' },
            { label: 'MEDIUM', value: 'MEDIUM' },
            { label: 'LOW', value: 'LOW' },
          ],
        }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        content: fields.markdoc({ label: 'Inhalt' }),
        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Frage' }),
            answer: fields.text({ label: 'Antwort', multiline: true }),
          }),
          { label: 'FAQ', itemLabel: (props) => props.fields.question.value }
        ),
        seoTitle: fields.text({ label: 'SEO Titel' }),
        seoDescription: fields.text({ label: 'SEO Beschreibung' }),
        status: fields.select({
          label: 'Status',
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
        }),
        publishedAt: fields.date({ label: 'Veröffentlicht am' }),
      },
    }),



    authors: collection({
      label: 'Autoren',
      slugField: 'name',
      path: 'content/authors/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        role: fields.text({ label: 'Rolle' }),
        bio: fields.text({ label: 'Kurz-Bio (Artikel-Box)', multiline: true }),
        longBio: fields.text({ label: 'Ausführliche Bio (Autoren-Seite)', multiline: true }),
        avatar: fields.image({
          label: 'Profilbild',
          directory: 'public/images/authors',
          publicPath: '/images/authors/',
        }),
        socialLinks: fields.array(
          fields.object({
            platform: fields.text({ label: 'Plattform' }),
            url: fields.url({ label: 'URL' }),
          }),
          { label: 'Social Links' }
        ),
      },
    }),
  },
});
