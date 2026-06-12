import Link from 'next/link';
import { TAB_INTENTS } from '@/lib/intents';

/**
 * Top-Menü pro Stadt — wie meinestadt.de. Auf JEDER Stadt-/Intent-Seite,
 * aktiver Punkt hervorgehoben. cityBase = /singles-regional/staedte/{bundesland}/{stadt}
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
      className="border-b border-foreground/10 bg-surface/60 backdrop-blur sticky top-0 z-20"
    >
      <ul className="max-w-5xl mx-auto flex gap-1 overflow-x-auto px-4 py-2 text-sm whitespace-nowrap">
        <li>
          <Link
            href={cityBase}
            className={`inline-block px-3 py-1.5 rounded-full transition-colors ${
              !activeSlug
                ? 'bg-primary text-on-primary font-semibold'
                : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
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
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
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
