import type { ReactNode, MouseEvent } from 'react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  brandName: string;
  description?: ReactNode;
  contact?: ReactNode;
  columns?: FooterColumn[];
  legal?: ReactNode;
  socialLinks?: FooterLink[];
  onNavigate?: (href: string) => void;
}

export default function Footer({
  brandName,
  description,
  contact,
  columns = [],
  legal,
  socialLinks = [],
  onNavigate,
}: FooterProps) {
  const handleLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!onNavigate || href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <footer className="border-t border-line bg-surface text-ink-tertiary" aria-label={brandName}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <section className="space-y-4" aria-labelledby="footer-brand-title">
          <h2 id="footer-brand-title" className="text-sm font-bold uppercase tracking-wider text-ink">{brandName}</h2>
          {description && <div className="text-sm leading-relaxed text-ink-secondary">{description}</div>}
        </section>

        {contact && (
          <section className="space-y-4" aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title" className="text-sm font-bold uppercase tracking-wider text-ink">Contacto</h2>
            <div className="text-sm">{contact}</div>
          </section>
        )}

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink">{column.title}</h2>
            <ul className="space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(event) => handleLink(event, link.href)} className="text-sm font-medium text-ink-tertiary transition-colors hover:text-brand">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line bg-background-soft py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-ink-subtle sm:flex-row sm:px-6 lg:px-8">
          <div>{legal}</div>
          {socialLinks.length > 0 && (
            <nav aria-label="Redes sociales" className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
