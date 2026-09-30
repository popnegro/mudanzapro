import { Menu, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

export interface HeaderNavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeaderProps {
  logoSrc: string;
  logoAlt: string;
  homeHref?: string;
  navItems: HeaderNavItem[];
  ctaLabel: string;
  ctaHref: string;
  mobileCtaLabel?: string;
  onNavigate?: (href: string) => void;
}

export default function Header({
  logoSrc,
  logoAlt,
  homeHref = '/',
  navItems,
  ctaLabel,
  ctaHref,
  mobileCtaLabel = ctaLabel,
  onNavigate,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);
  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!onNavigate || href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      close();
      return;
    }
    event.preventDefault();
    close();
    onNavigate(href === '/' ? '' : href);
  };

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 w-full border-b border-line/80 bg-surface/95 backdrop-blur-md',
        'transition-shadow duration-200',
        scrolled ? 'shadow-md shadow-ink/5' : '',
      ].join(' ')}
    >
      <div className="mx-auto flex min-h-[70px] max-w-7xl items-center justify-between gap-4 px-4 sm:min-h-[78px] sm:px-6 lg:px-8">
        <a
          href={homeHref}
          onClick={(event) => handleNavigation(event, homeHref)}
          className="flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          aria-label={logoAlt}
        >
          <img src={logoSrc} alt={logoAlt} className="block h-10 w-auto max-w-[55vw] object-contain object-left sm:h-11" />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavigation(event, item.href)}
              aria-current={item.active ? 'page' : undefined}
              className={['nav-link-desktop', item.active ? 'nav-link-desktop--active' : ''].join(' ')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <a href={ctaHref} className="header-cta-button">{ctaLabel}</a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-ink-secondary hover:bg-background-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 lg:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-line bg-surface px-4 pb-6 pt-4 shadow-xl sm:px-6 lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavigation(event, item.href)}
                aria-current={item.active ? 'page' : undefined}
                className="nav-link-mobile"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 border-t border-line pt-4">
            <a href={ctaHref} onClick={(event) => handleNavigation(event, ctaHref)} className="header-cta-button flex w-full justify-center">
              {mobileCtaLabel}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
