import Link from 'next/link';
import { TAB_INTENTS } from '@/lib/intents';

/**
 * Intent-Tabs pro Stadt — auf JEDER Stadt-/Intent-Seite, aktiver Punkt hervorgehoben.
 * MEHRREIHIG umbrechend statt horizontalem Scroll (Tommy 2026-06-12: „links-rechts
 * scrollen macht keiner", v. a. mobil). cityBase = /singles-regional/staedte/{bl}/{stadt}
 */
export function CityIntentNav({
  cityBase,
  stadtName,
  activeSlug,
}: {
  cityBase: string;
  stadtName: string;
  activeSlug?: string;
}) {
  return (
    <nav
      aria-label={`Dating-Kategorien in ${stadtName}`}
      className="border-b border-foreground/10 bg-surface/60 backdrop-blur"
    >
      <ul className="max-w-5xl mx-auto flex flex-wrap gap-1.5 px-4 py-3 text-sm">
        <li>
          <Link
            href={cityBase}
            className={`inline-block px-3 py-1.5 rounded-full transition-colors ${
              !activeSlug
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-background border border-foreground/15 text-foreground/70 hover:text-primary hover:border-primary/40'
            }`}
          >
            Singlebörse
          </Link>
        </li>
        {TAB_INTENTS.map((i) => {
          const active = i.slug === activeSlug;
          return (
            <li key={i.slug}>
              <Link
                href={`${cityBase}/${i.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`inline-block px-3 py-1.5 rounded-full transition-colors ${
                  active
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-background border border-foreground/15 text-foreground/70 hover:text-primary hover:border-primary/40'
                }`}
              >
                {i.menuLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
