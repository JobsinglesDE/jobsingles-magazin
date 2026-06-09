import { AnimatedGradientBorder } from '@/components/ui/AnimatedGradientBorder';

interface TocItem {
  label: string;
  id: string;
}

interface Props {
  items: TocItem[];
  showFaq?: boolean;
}

export function TableOfContents({ items, showFaq = true }: Props) {
  const allItems = showFaq
    ? [...items, { label: 'Häufige Fragen', id: 'haeufige-fragen' }]
    : items;
  if (allItems.length === 0) return null;

  return (
    <AnimatedGradientBorder borderRadius={12} borderWidth={2} className="mb-8">
      <nav className="p-4 text-sm">
        <p className="font-semibold text-foreground mb-3 uppercase tracking-wide text-xs">
          Inhaltsverzeichnis
        </p>
        <ol className="space-y-1 list-none pl-0">
          {allItems.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-brand-orange hover:underline"
              >
                {i + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </AnimatedGradientBorder>
  );
}
