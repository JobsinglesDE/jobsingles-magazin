export const BUNDESLAENDER: Record<string, { name: string; emoji: string }> = {
  'baden-wuerttemberg': { name: 'Baden-Württemberg', emoji: '🦌' },
  'bayern': { name: 'Bayern', emoji: '🥨' },
  'berlin': { name: 'Berlin', emoji: '🐻' },
  'brandenburg': { name: 'Brandenburg', emoji: '🌲' },
  'bremen': { name: 'Bremen', emoji: '⚓' },
  'hamburg': { name: 'Hamburg', emoji: '⚓' },
  'hessen': { name: 'Hessen', emoji: '🏰' },
  'mecklenburg-vorpommern': { name: 'Mecklenburg-Vorpommern', emoji: '🌊' },
  'niedersachsen': { name: 'Niedersachsen', emoji: '🐎' },
  'nordrhein-westfalen': { name: 'Nordrhein-Westfalen', emoji: '🏭' },
  'rheinland-pfalz': { name: 'Rheinland-Pfalz', emoji: '🍇' },
  'saarland': { name: 'Saarland', emoji: '⛏️' },
  'sachsen': { name: 'Sachsen', emoji: '🎻' },
  'sachsen-anhalt': { name: 'Sachsen-Anhalt', emoji: '🏛️' },
  'schleswig-holstein': { name: 'Schleswig-Holstein', emoji: '🌾' },
  'thueringen': { name: 'Thüringen', emoji: '🌳' },
};

export const BUNDESLAND_SLUGS = Object.keys(BUNDESLAENDER);

export function bundeslandName(slug: string): string {
  return BUNDESLAENDER[slug]?.name ?? slug;
}

export function bundeslandEmoji(slug: string): string {
  return BUNDESLAENDER[slug]?.emoji ?? '📍';
}
