'use client';

import { useEffect, useState } from 'react';

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

type Context = { type: string; slug: string } | null;

function parseContext(): Context {
  const m = window.location.pathname.match(/\/keystatic\/.*\/collection\/([^/]+)\/item\/([^/?#]+)/);
  if (!m) return null;
  return { type: decodeURIComponent(m[1]), slug: decodeURIComponent(m[2]) };
}

function scoreColor(score: number): string {
  if (score >= 85) return '#10b981';
  if (score >= 70) return '#f59e0b';
  if (score >= 50) return '#f97316';
  return '#ef4444';
}

export function SeoScoreWidget() {
  const [ctx, setCtx] = useState<Context>(null);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setCtx(parseContext());
    update();
    const interval = setInterval(update, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setResult(null);
    setError(null);
    setOpen(false);
  }, [ctx?.type, ctx?.slug]);

  async function runCheck() {
    if (!ctx) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/magazin/api/seo-check/${ctx.type}/${encodeURIComponent(ctx.slug)}?_cb=${Date.now()}`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      if (!res.ok) setError(data.error ?? `HTTP ${res.status}`);
      else setResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  if (!ctx) return null;

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9999, fontFamily: 'system-ui, sans-serif' }}>
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            if (!result && !loading) runCheck();
          }}
          style={{
            background: result ? scoreColor(result.score) : '#1f2937',
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            padding: '12px 18px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          aria-label="SEO-Check öffnen"
        >
          <span>SEO</span>
          {result && <span style={{ fontSize: 18, fontWeight: 800 }}>{result.score}</span>}
          {loading && <span style={{ opacity: 0.7 }}>…</span>}
        </button>
      )}

      {open && (
        <div
          style={{
            background: '#0f172a',
            color: '#fff',
            borderRadius: 12,
            padding: 16,
            width: 360,
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <strong style={{ fontSize: 14 }}>SEO-Check — {ctx.type}</strong>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={runCheck}
                disabled={loading}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {loading ? '…' : '↻'}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 8, lineHeight: 1.4 }}>
            ⚠️ Score liest vom letzten Vercel-Build. Nach Speichern ~90s warten + dann ↻ klicken, sonst zeigt's alte Werte.
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: 12 }}>{error}</div>}

          {result && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div style={{ fontSize: 42, fontWeight: 800, color: scoreColor(result.score), lineHeight: 1 }}>
                  {result.score}
                </div>
                <div style={{ opacity: 0.6, fontSize: 13 }}>/ 100 — {result.words} W.</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 12 }}>
                {result.checks.map((c, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 8,
                      padding: '6px 8px',
                      borderRadius: 6,
                      background: c.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ color: c.ok ? '#10b981' : '#ef4444', fontWeight: 700 }}>{c.ok ? '✓' : '✗'}</span>
                    <div style={{ flex: 1 }}>
                      <div>{c.label}</div>
                      {c.hint && <div style={{ opacity: 0.55, fontSize: 11, marginTop: 1 }}>{c.hint}</div>}
                    </div>
                    <span style={{ opacity: 0.4, fontSize: 11 }}>{c.weight}p</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
