'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  url: string;
  caption?: string;
  handle?: string;
};

declare global {
  interface Window {
    instgrm?: {
      Embeds?: { process: () => void };
    };
  }
}

/**
 * Instagram-Embed mit Click-to-Load (TDDDG-konform).
 *
 * Default: Platzhalter mit Klick-Button. Erst nach User-Konsent wird
 * embed.js von instagram.com geladen — keine IG-Cookies vor Konsent.
 *
 * Markdoc-Aufruf:
 *   {% instagram url="https://www.instagram.com/p/CxYz123/" caption="..." handle="ellenpompeo" /%}
 */
export function InstagramEmbed({ url, caption, handle }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const blockquoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    if (!loaded) return;
    if (scriptReady) {
      window.instgrm?.Embeds?.process();
      return;
    }
    const existing = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    );
    if (existing) {
      window.instgrm?.Embeds?.process();
      setScriptReady(true);
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    s.onload = () => {
      window.instgrm?.Embeds?.process();
      setScriptReady(true);
    };
    document.body.appendChild(s);
  }, [loaded, scriptReady]);

  if (!loaded) {
    return (
      <div className="my-8 rounded-2xl border border-foreground/15 bg-background/50 p-6 not-prose">
        <div className="flex items-center gap-3 mb-3">
          <svg
            className="w-6 h-6 text-foreground/70"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.74 2.69 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
          </svg>
          <span className="font-semibold text-foreground/80">
            Instagram-Beitrag
            {handle && (
              <span className="font-normal text-foreground/60">
                {' '}
                von @{handle}
              </span>
            )}
          </span>
        </div>
        {caption && (
          <p className="text-sm text-foreground/70 italic mb-4 line-clamp-3">
            „{caption}"
          </p>
        )}
        <p className="text-xs text-foreground/55 mb-4">
          Inhalt wird von Meta Platforms Ireland Ltd geladen. Klicken bedeutet
          Zustimmung zum Setzen von Cookies und zur Datenübertragung an Meta.
          Mehr Informationen in unserer{' '}
          <a
            href="/magazin/datenschutz"
            className="underline text-brand-orange hover:opacity-80"
          >
            Datenschutzerklärung
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="inline-flex items-center gap-2 rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
        >
          Instagram-Beitrag laden
        </button>
        <a
          href={url}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex items-center ml-3 text-sm text-foreground/60 hover:text-foreground/90 underline"
        >
          Auf Instagram öffnen ↗
        </a>
      </div>
    );
  }

  return (
    <div className="my-8 not-prose">
      <blockquote
        ref={blockquoteRef}
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '3px',
          boxShadow:
            '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '0 auto',
          maxWidth: '540px',
          minWidth: '326px',
          padding: 0,
          width: '99.375%',
        }}
      >
        <a href={url} target="_blank" rel="nofollow noopener noreferrer">
          Beitrag auf Instagram ansehen
        </a>
      </blockquote>
    </div>
  );
}
