# Arquitectura de cobranding — MudanzaPro

## Rol de cada marca

| Marca | Rol | Función |
|---|---|---|
| Mudanzas en Mendoza | QUÉ SABER | Autoridad temática e información para investigar y entender una mudanza en Mendoza. |
| MudanzaPro | QUÉ HACER / RESOLVER | Herramientas de planificación, estimación y preparación de la solicitud. |
| Mudanzas Miranda | QUIÉN | Proveedor/comercializador de la contratación cuando corresponda. |

## Regla principal

MudanzaPro no debe presentarse como una empresa de mudanzas, un marketplace ni un directorio de prestadores.

La aplicación debe ayudar al usuario a pasar por este recorrido:

`información → planificación → estimación → intención → presupuesto → proveedor`

## Cambios de esta rama

- Se reemplazó el módulo de empresas recomendadas por una capa neutral de conversión.
- Se eliminaron del módulo público los mensajes de "prestadores verificados", "empresas recomendadas" y reputación de terceros.
- Las rutas SEO ya no describen MudanzaPro como un directorio.
- Se mantienen las herramientas existentes de cálculo, servicios, zonas y checklist.
- El handoff comercial debe ocurrir después de que el usuario defina su necesidad.

## Integración con Mudanzas en Mendoza

La integración pública debe usar enlaces contextuales hacia MudanzaPro desde contenido de intención, por ejemplo:

- calcular el volumen de una mudanza;
- preparar una solicitud de presupuesto;
- organizar una mudanza;
- comparar variables de un servicio.

No se debe convertir Mudanzas en Mendoza en un marketplace.

## Proveedor

Cuando el flujo requiera una contratación concreta, la identidad y los datos comerciales del proveedor deben proceder de una fuente verificable y mantenerse separados de la capa editorial de Mudanzas en Mendoza y de las herramientas neutrales de MudanzaPro.

## Datos pendientes de fuente de verdad

No se deben reintroducir en la interfaz pública ratings, cantidades de reseñas, direcciones, teléfonos, precios de mercado, volúmenes mensuales, etiquetas de "verificado" o afirmaciones equivalentes sin una fuente comercial verificable y mantenida.
