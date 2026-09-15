# SEO/GEO map — MudanzaPro

## Primary intent

Tool/decision: **QUÉ HACER / RESOLVER**.

## Topic ownership

| Cluster | Intent | Destination |
|---|---|---|
| calculadora de mudanza | tool | MudanzaPro |
| calcular mudanza | tool | MudanzaPro |
| estimar precio mudanza | tool | MudanzaPro |
| planificar mudanza | action | MudanzaPro |
| organizar mudanza | action | MudanzaPro |
| checklist mudanza | action | MudanzaPro |
| presupuesto mudanza | commercial | MudanzaPro → provider |
| empresa de mudanzas | provider | Mudanzas Miranda |

## Product-language rule

MudanzaPro is a planning/decision product, not a moving company. Estimated values must be explicitly presented as estimates unless backed by a real provider quote.

## Conversion architecture

`information → tool → result → lead → provider`

## GEO requirements

The application should expose direct answers around calculation methodology, planning steps and next actions. Tool results must be understandable without hidden UI state.

## Structured data

Prefer `WebApplication`/`SoftwareApplication` for the product, plus `WebSite`, `BreadcrumbList` and FAQ where applicable. Provider/business schema belongs to the provider domain.
