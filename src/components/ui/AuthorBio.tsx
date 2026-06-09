import Link from 'next/link';
import { withBasePath } from '@/lib/url';

interface AuthorBioProps {
  name: string;
  slug?: string;
  role?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: ReadonlyArray<{ readonly platform: string; readonly url: string | null }>;
}

export function AuthorBio({ name, slug, role, bio, avatar, socialLinks }: AuthorBioProps) {
  return (
    <div className="flex gap-5 items-start p-6 rounded-2xl bg-surface ambient-shadow my-12" itemScope itemType="https://schema.org/Person">
      {avatar ? (
        <img width="600" height="400"
          src={withBasePath(avatar)}
          alt={`${name} — Autor beim Jobsingles Magazin`}
          itemProp="image"
          className="w-16 h-16 rounded-full object-cover shrink-0 ring-2 ring-brand-orange/20"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange/20 to-primary/20 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-brand-orange">
            {name.charAt(0)}
          </span>
        </div>
      )}
      <div className="min-w-0">
        <p className="font-bold text-foreground text-lg" itemProp="name">{name}</p>
        {role && (
          <p className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-2">{role}</p>
        )}
        {bio && (
          <p className="text-sm text-foreground/60 leading-relaxed line-clamp-3">{bio}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-3 items-center">
          {slug && (
            <Link
              href={`/autor/${slug}`}
              className="text-xs font-semibold text-brand-orange hover:underline"
            >
              Mehr über {name} →
            </Link>
          )}
          {socialLinks && socialLinks.filter((link) => link.url).map((link) => (
            <a
              key={link.url}
              href={link.url!}
              className="text-xs text-foreground/40 hover:text-brand-orange transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
