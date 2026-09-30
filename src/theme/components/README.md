# theme-mudanzas-canonical

Base visual canónica para Mudanzas Miranda, Mudanzas en Mendoza y MudanzaPro.

## Scope

Reusable layout primitives only: Header, Hero, Section, FormSection and Footer.

Site-specific content, SEO, routes, commercial data, branding overrides and page copy remain outside the shared component contracts.

## Architecture

theme-mudanzas-canonical
  -> shared layout/components
       -> Mudanzas Miranda
       -> Mudanzas en Mendoza
       -> MudanzaPro

## UX rules

- Direct navigation; no dropdown/mega-menu requirement.
- Desktop and mobile navigation use the same navigation data.
- Header CTA is configuration-driven.
- Hero separates hierarchy from media and actions.
- Sections share spacing, typography and container geometry.
- FormSection owns conversion-section layout; form implementation remains site/capability-specific.
- Footer owns structure; contact, links and social data are injected.
- No new copy is introduced by the theme layer.

## Source of truth

The branch is created from the current main of popnegro/mudanzas-miranda.
The previous theme-mudanzas branch is not used as a code source.