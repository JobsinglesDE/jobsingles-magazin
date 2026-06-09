'use client';

import { useEffect, useRef, useState } from 'react';

type Check = { ok: boolean; weight: number; label: string; hint?: string };

type ScoreResult = {
  type: string;
  slug: string;
  title: string;
  score: number;
  earned: number;
  totalWeight: number;
  words: number;
  checks: Check[];
};

const TYPES = ['articles', 'regional', 'series', 'stories'] as const;

function scoreColor(score: number): string {
  if (score >= 85) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 50) return 'text-orange-500';
  return 'text-red-500';
}

function scoreBg(score: number): string {
  if (score >= 85) return 'bg-green-500/10 border-green-500/30';
  if (score >= 70) return 'bg-yellow-500/10 border-yellow-500/30';
  if (score >= 50) return 'bg-orange-500/10 border-orange-500/30';
  return 'bg-red-500/10 border-red-500/30';
}

export default function SeoCheckPage() {
  const [type, setType] = useState<(typeof TYPES)[number]>('articles');
  const [slug, setSlug] = useState('partnersuche-koeche');
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const autoRan = useRef(false);

  async function runCheck(t = type, s = slug) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/magazin/api/seo-check/${t}/${encodeURIComponent(s.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `HTTP ${res.status}`);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoRan.current) return;
    const params = new URLSearchParams(window.location.search);
    const qType = params.get('type');
    const qSlug = params.get('slug');
    if (qType && qSlug && (TYPES as readonly string[]).includes(qType)) {
      autoRan.current = true;
      setType(qType as (typeof TYPES)[number]);
      setSlug(qSlug);
      runCheck(qType as (typeof TYPES)[number], qSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-3xl font-bold mb-2">SEO-Check</h1>
      <p className="text-foreground/60 mb-2">Live-Score für Keystatic-Artikel — direkt aus dem Repo gelesen.</p>
      <details className="mb-6">
        <summary className="text-sm text-brand-orange cursor-pointer">📌 1-Klick-Bookmarklet (einmalig in Lesezeichenleiste ziehen)</summary>
        <div className="mt-3 p-4 rounded border border-foreground/10 bg-foreground/5 text-sm">
          <p className="mb-2">Diesen Link in deine Browser-Lesezeichenleiste ziehen. Dann beim Editieren in Keystatic <strong>einmal anklicken</strong> → öffnet automatisch den Score für den aktuellen Artikel:</p>
          <p className="my-3">
            <a
              href={`javascript:(function(){var m=location.pathname.match(/\\/keystatic\\/.*\\/collection\\/([^/]+)\\/item\\/([^/?#]+)/);if(!m){alert('Kein Keystatic-Artikel-URL gefunden.');return;}var t=decodeURIComponent(m[1]);var s=decodeURIComponent(m[2]);window.open('https://jobsingles.de/magazin/seo-check?type='+t+'&slug='+encodeURIComponent(s),'seocheck','width=520,height=900');})();`}
              className="inline-block px-4 py-2 bg-brand-orange text-white rounded font-bold no-underline"
              onClick={(e) => e.preventDefault()}
            >
              SEO-Check
            </a>
          </p>
          <p className="text-xs text-foreground/60">Funktioniert auf <code>/keystatic/branch/main/collection/&lt;type&gt;/item/&lt;slug&gt;</code> URLs (also direkt im Backend).</p>
        </div>
      </details>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as (typeof TYPES)[number])}
          className="px-4 py-2 rounded border border-foreground/20 bg-background text-foreground"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-des-artikels"
          className="flex-1 px-4 py-2 rounded border border-foreground/20 bg-background text-foreground"
          onKeyDown={(e) => e.key === 'Enter' && runCheck()}
        />
        <button
          onClick={() => runCheck()}
          disabled={loading || !slug.trim()}
          className="px-6 py-2 rounded bg-brand-orange text-white font-bold disabled:opacity-50"
        >
          {loading ? 'Check…' : 'Check'}
        </button>
      </div>

      {error && (
        <div className="rounded border border-red-500/30 bg-red-500/10 p-4 mb-6">
          <p className="text-red-500 font-bold">Fehler</p>
          <p className="text-foreground/70 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <>
          <div className={`rounded-2xl border-2 p-6 mb-6 ${scoreBg(result.score)}`}>
            <div className="flex items-baseline gap-4">
              <div className={`text-6xl font-bold ${scoreColor(result.score)}`}>{result.score}</div>
              <div className="text-foreground/60">/ 100</div>
            </div>
            <p className="text-sm text-foreground/60 mt-2">
              {result.title} — {result.words} Wörter, {result.earned}/{result.totalWeight} Punkte
            </p>
          </div>

          <ul className="space-y-2">
            {result.checks.map((c, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 p-3 rounded border ${
                  c.ok ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'
                }`}
              >
                <span className={c.ok ? 'text-green-500' : 'text-red-500'}>{c.ok ? '✓' : '✗'}</span>
                <div className="flex-1">
                  <div className="font-medium">{c.label}</div>
                  {c.hint && <div className="text-xs text-foreground/50 mt-0.5">{c.hint}</div>}
                </div>
                <span className="text-xs text-foreground/40">{c.weight}p</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
