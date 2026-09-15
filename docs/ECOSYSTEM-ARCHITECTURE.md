# Ecosistema Mudanzas — Arquitectura estratégica

## Rol del proyecto

**MudanzaPro = QUÉ HACER / RESOLVER**

Este dominio funciona como capa de herramienta y decisión. Su objetivo es transformar la intención del usuario en una acción concreta: calcular, planificar, organizar y generar una solicitud de presupuesto.

## Principios

1. No competir con Mudanzas en Mendoza como fuente editorial principal.
2. No presentarse como empresa de mudanzas.
3. Priorizar tareas, resultados y reducción de fricción.
4. La estimación debe identificarse como orientativa cuando no exista una cotización real.
5. Los leads deben terminar en persistencia central y no depender de localStorage como almacenamiento primario.

## Arquitectura de información objetivo

- Inicio
- Planificar mi mudanza
- Calculadora
- Servicios que necesito
- Checklist personalizado
- Directorio/Soluciones
- Preguntas frecuentes
- Mis solicitudes
- Necesito una empresa → Mudanzas Miranda

## Journey principal

Usuario → problema → acción → datos → resultado → siguiente acción.

La calculadora debe seguir este flujo:

`QuoteCalculator → validación → POST /api/leads → persistencia → estado del lead → proveedor/cotización`

## Clusters SEO/GEO

- calculadora de mudanza
- calcular precio/estimación de mudanza
- planificar mudanza
- organizar mudanza
- checklist de mudanza
- presupuesto de mudanza
- resolver necesidades de una mudanza

## Transferencias del ecosistema

- Mudanzas en Mendoza → MudanzaPro para tareas y herramientas.
- MudanzaPro → Mudanzas Miranda cuando existe intención de contratar.
- No afirmar que MudanzaPro es proveedor.

## UX/UI

La interfaz debe comportarse como producto: acciones primarias claras, progreso visible, formularios cortos, resultados comprensibles y siguiente paso evidente. Mantener el Design System compartido, pero con expresión de herramienta.

## Datos y seguridad

Los leads contienen PII y deben validarse server-side, persistirse en backend y protegerse con autenticación/autorización, rate limiting y controles de logging cuando se implemente la capa de producción.

## QA

Baseline visual antes de cambios globales: 375×812, 768×1024 y 1440×900. Los journeys críticos deberán cubrirse con E2E y visual regression.
