'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * „Starte direkt mit deiner Suche" — Ich suche [Frauen/Männer] in [Stadt].
 * Führt auf die passende Intent-Unterseite (single-frauen / single-maenner).
 */
export function CitySearchBox({ stadtName, cityBase }: { stadtName: string; cityBase: string }) {
  const router = useRouter();
  const [sucht, setSucht] = useState<'single-frauen' | 'single-maenner'>('single-frauen');

  return (
    <section className="my-8 rounded-2xl border border-foreground/10 bg-surface p-5 sm:p-6">
      <h2 className="text-lg font-bold mb-4">Starte direkt mit deiner Suche</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`${cityBase}/${sucht}`);
        }}
        className="flex flex-wrap items-center gap-3 text-sm"
      >
        <span className="text-foreground/70">Ich suche</span>
        <select
          aria-label="Geschlecht"
          value={sucht}
          onChange={(e) => setSucht(e.target.value as 'single-frauen' | 'single-maenner')}
          className="rounded-lg border border-foreground/15 bg-background px-3 py-2 font-semibold text-foreground focus:border-primary focus:outline-none"
        >
          <option value="single-frauen">Single-Frauen</option>
          <option value="single-maenner">Single-Männer</option>
        </select>
        <span className="text-foreground/70">in</span>
        <span className="rounded-lg border border-foreground/15 bg-background px-3 py-2 font-semibold text-foreground">
          {stadtName}
        </span>
        <button
          type="submit"
          className="rounded-lg bg-primary px-5 py-2 font-bold text-on-primary hover:opacity-90 transition-opacity"
        >
          Suchen
        </button>
      </form>
    </section>
  );
}
