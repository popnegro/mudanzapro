import type { ReactNode } from 'react';

export interface HeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  media?: ReactNode;
  trust?: ReactNode;
}

export default function Hero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  media,
  trust,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface py-16 text-ink lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#FFFFFF_0%,#F6F7F8_100%)]" aria-hidden="true" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brand/5 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 items-center gap-x-4 gap-y-12 sm:gap-x-6">
          <div className="col-span-12 space-y-6 text-center lg:col-span-6 lg:text-left">
            {eyebrow && <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">{eyebrow}</div>}
            <h1 className="text-4xl font-serif font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">{title}</h1>
            {description && <div className="mx-auto max-w-2xl text-base leading-relaxed text-ink-secondary sm:text-lg lg:mx-0">{description}</div>}
            {(primaryAction || secondaryAction) && (
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                {primaryAction}
                {secondaryAction}
              </div>
            )}
            {trust && <div className="pt-1">{trust}</div>}
          </div>

          {media && (
            <div className="col-span-12 flex justify-center lg:col-span-6">
              <div className="w-full max-w-lg">{media}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
