import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc';
import React, { type ReactNode } from 'react';
import { InstagramEmbed } from './InstagramEmbed';
import { AnimatedGradientBorder } from '@/components/ui/AnimatedGradientBorder';

function YouTubeEmbed({ url, title }: { url: string; title?: string }) {
  const videoId = url.match(/(?:v=|youtu\.be\/|shorts\/)([^&\s?]+)/)?.[1];
  if (!videoId) return null;
  return (
    <div className="my-8 flex justify-center">
      <AnimatedGradientBorder borderRadius={16} borderWidth={3} className="w-full max-w-xs">
        <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title || 'YouTube Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </AnimatedGradientBorder>
    </div>
  );
}

function toId(text: string) {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function collectText(children: any[]): string {
  return children
    .map((c) => (typeof c === 'string' ? c : ''))
    .join('');
}

const BASE_PATH = '/magazin';

function prefixInternalHref(href: string): string {
  if (!href) return href;
  // Externe Links, Anchor-Links, mailto: unberührt
  if (href.startsWith('//') || /^[a-z]+:/i.test(href) || href.startsWith('#')) return href;
  // Bereits prefixed
  if (href.startsWith(`${BASE_PATH}/`) || href === BASE_PATH) return href;
  // Root-relative interne Links bekommen Prefix
  if (href.startsWith('/')) return `${BASE_PATH}${href}`;
  return href;
}

const markdocConfig = {
  tags: {
    instagram: {
      render: 'InstagramEmbed',
      attributes: {
        url: { type: String, required: true },
        caption: { type: String },
        handle: { type: String },
      },
    },
    youtube: {
      render: 'YouTube',
      attributes: {
        url: { type: String, required: true },
        title: { type: String },
      },
    },
  },
  nodes: {
    heading: {
      render: 'heading',
      attributes: {
        level: { type: Number, required: true },
      },
      transform(node: any, config: any) {
        const children = node.transformChildren(config);
        const level = node.attributes.level;
        const attrs = level === 2 ? { id: toId(collectText(children)) } : {};
        return new Markdoc.Tag(`h${level}`, attrs, children);
      },
    },
    link: {
      render: 'a',
      attributes: {
        href: { type: String, required: true },
        title: { type: String },
      },
      transform(node: any, config: any) {
        const children = node.transformChildren(config);
        const rawHref = node.attributes.href as string;
        const href = prefixInternalHref(rawHref);
        const attrs: Record<string, string> = { href };
        if (node.attributes.title) attrs.title = node.attributes.title;
        // External links: nofollow noopener noreferrer + target=_blank
        // Nur jobsingles.de (eigene Domain) bleibt follow. Alle anderen externen Links —
        // auch zu Netzwerk-Sites wie jobsingles/seeside aus Content — werden nofollow,
        // damit Link-Equity nicht inflationär verschenkt wird.
        const isExternal = /^https?:\/\//i.test(rawHref) && !/^https?:\/\/(www\.)?jobsingles\.de/i.test(rawHref);
        if (isExternal) {
          attrs.rel = 'nofollow noopener noreferrer';
          attrs.target = '_blank';
        }
        return new Markdoc.Tag('a', attrs, children);
      },
    },
  },
};

const proseClasses = "prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/85 prose-a:text-brand-orange prose-strong:text-foreground prose-code:text-brand-orange dark:prose-invert";

type Props = {
  content: { node: any } | any[];
  /** Insert this element after the Nth H2 heading */
  insertAfterH2?: number;
  /** The element to insert */
  insertElement?: ReactNode;
};

export function ArticleBody({ content, insertAfterH2, insertElement }: Props) {
  const node = 'node' in content ? content.node : content;
  const renderable = Markdoc.transform(node, markdocConfig);

  if (!insertAfterH2 || !insertElement) {
    return (
      <div className={proseClasses}>
        {Markdoc.renderers.react(renderable, React, { components: { InstagramEmbed, YouTube: YouTubeEmbed } })}
      </div>
    );
  }

  // Split the Markdoc tree at the Nth H2, before rendering
  const topChildren = Array.isArray(renderable) ? renderable : (renderable as any)?.children ?? [];
  let h2Count = 0;
  let splitIndex = -1;

  for (let i = 0; i < topChildren.length; i++) {
    const child = topChildren[i];
    const tag = typeof child === 'object' && child !== null && 'name' in child ? (child as any).name : null;
    if (tag === 'h2') {
      h2Count++;
      if (h2Count === insertAfterH2) {
        // Insert before the NEXT h2
        for (let j = i + 1; j < topChildren.length; j++) {
          const next = topChildren[j];
          const nextTag = typeof next === 'object' && next !== null && 'name' in next ? (next as any).name : null;
          if (nextTag === 'h2') {
            splitIndex = j;
            break;
          }
        }
        if (splitIndex === -1) splitIndex = Math.min(i + 4, topChildren.length);
        break;
      }
    }
  }

  if (splitIndex === -1) {
    return (
      <div className={proseClasses}>
        {Markdoc.renderers.react(renderable, React, { components: { InstagramEmbed, YouTube: YouTubeEmbed } })}
      </div>
    );
  }

  // Build two separate trees
  const firstHalf = { ...renderable as any, children: topChildren.slice(0, splitIndex) };
  const secondHalf = { ...renderable as any, children: topChildren.slice(splitIndex) };

  return (
    <>
      <div className={proseClasses}>
        {Markdoc.renderers.react(firstHalf, React, { components: { InstagramEmbed, YouTube: YouTubeEmbed } })}
      </div>
      {insertElement}
      <div className={proseClasses}>
        {Markdoc.renderers.react(secondHalf, React, { components: { InstagramEmbed, YouTube: YouTubeEmbed } })}
      </div>
    </>
  );
}
