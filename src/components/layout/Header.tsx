import Image from 'next/image';
import Link from 'next/link';
import { MenuHoverNav } from '@/components/ui/MenuHoverNav';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 glass-nav">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-orange focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Zum Inhalt springen
      </a>
      <div className="flex justify-between items-center px-6 h-20 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logos/jobsingles-logo.png"
            alt="Jobsingles Magazin"
            width={44}
            height={44}
            priority
            className="rounded-lg"
          />
          <span className="font-bold text-xl text-foreground tracking-tight">
            <span>Jobsingles</span><span className="text-brand-orange-text"> Magazin</span>
          </span>
        </Link>

        {/* Navigation + Theme */}
        <div className="flex items-center gap-2">
          <MenuHoverNav />
          <ThemeToggle />
        </div>
      </div>
      {/* Animated gradient border */}
      <div className="animated-gradient-line h-[2px]" />
    </header>
  );
}
