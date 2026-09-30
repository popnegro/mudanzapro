import type { ReactNode } from 'react';

export interface SectionProps {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  tone?: 'surface' | 'background' | 'soft';
  align?: 'left' | 'center';
  className?: string;
}

const tones = {
  surface: 'bg-surface',
  background: 'bg-background',
  soft: 'bg-background-soft',
};

export default function Section({
  id,
  title,
  description,
  children,
  tone = 'surface',
  align = 'center',
  className = '',
}: SectionProps) {
  return (
    <section id={id} className={[tones[tone], 'border-b border-line py-20', className].join(' ')}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <header className={['mx-auto mb-12 max-w-3xl space-y-3', align === 'center' ? 'text-center' : 'text-left'].join(' ')}>
            {title && <h2 className="text-3xl font-serif font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>}
            {description && <p className="text-sm leading-relaxed text-ink-secondary sm:text-base">{description}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
