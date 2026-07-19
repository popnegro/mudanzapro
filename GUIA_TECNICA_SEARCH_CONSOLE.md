# Guía Técnica: Integración de Sitemap Dinámico y Google Search Console
## Para Directorio de Mudanzas y Subdominios de Marcas (Mendoza y Miranda)

Esta guía técnica describe el proceso detallado para dar de alta, verificar e integrar el sitemap dinámico generado por nuestra aplicación en **Google Search Console (GSC)**, estructurando de manera óptima las propiedades para maximizar la autoridad local (**Local SEO**) y cumplir con los criterios **E-E-A-T** (Experiencia, Especialización, Autoridad y Confiabilidad) de Google.

---

## 1. Planificación de la Estructura de Propiedades en GSC

Para un directorio multimarca que opera con un dominio central y subdominios o directorios dedicados para marcas locales (Mendoza y Miranda), existen dos estrategias recomendadas para dar de alta el sitio en GSC. **Se recomienda implementar ambas de forma complementaria:**

### A. Propiedad de Dominio (Recomendada para Consolidación)
*   **Formato:** `tu-directorio.com` (sin `https://` ni `www`)
*   **Alcance:** Agrupa automáticamente el dominio raíz, subdominios (p. ej., `mendoza.tu-directorio.com`, `miranda.tu-directorio.com`) y todos los protocolos (`http` y `https`).
*   **Beneficio:** Permite monitorizar el rendimiento global de indexación y flujos de autoridad global en un único panel.

### B. Propiedades de Prefijo de URL (Críticas para SEO Local de Marcas)
Para optimizar el posicionamiento local y analizar de forma independiente el rendimiento de cada marca, debes crear propiedades de prefijo individuales:
1.  **Directorio Principal:** `https://tu-directorio.com/` (o subdominio general)
2.  **Portal Mendoza:** `https://mendoza.tu-directorio.com/` o `https://tu-directorio.com/?brand=mendoza` (según se configure la resolución final de rutas DNS/Reverse Proxy).
3.  **Portal Miranda:** `https://miranda.tu-directorio.com/` o `https://tu-directorio.com/?brand=miranda`.

---

## 2. Proceso Paso a Paso para Alta y Verificación

### Paso 2.1: Crear las propiedades en Google Search Console
1. Accede a [Google Search Console](https://search.google.com/search-console).
2. En el menú desplegable de propiedades arriba a la izquierda, selecciona **"Añadir propiedad"**.
3. **Para la Propiedad de Dominio:** Escribe el dominio limpio (p. ej., `tu-directorio.com`) en la columna izquierda.
4. **Para los Prefijos de URL de Marcas:** Escribe la dirección completa de cada portal (p. ej., `https://mendoza.tu-directorio.com/`) en la columna derecha.

### Paso 2.2: Métodos de Verificación

#### Método 1: Registro DNS TXT (Obligatorio para Propiedad de Dominio)
1. GSC te proporcionará un valor TXT (p. ej., `google-site-verification=XYZ...`).
2. Accede al panel de control de tu registrador de dominios (Nic.ar, Cloudflare, DonWeb, etc.).
3. Añade un nuevo registro de tipo **TXT** en tu zona DNS:
   *   **Nombre/Host:** `@` o déjalo vacío.
   *   **Valor:** El código proporcionado por Google.
   *   **TTL:** Por defecto o `3600`.
4. Vuelve a GSC y haz clic en **"Verificar"**.

#### Método 2: Etiqueta HTML o Archivo HTML (Para Prefijos de URL)
Si estás verificando las propiedades individuales de prefijos:
*   **Opción A (Recomendada):** Sube el archivo de verificación `google*.html` provisto por Google a la carpeta `/public` de tu proyecto React/Vite.
*   **Opción B (Etiqueta HTML):** Copia la etiqueta `<meta name="google-site-verification" content="..." />` e inyéctala en la sección `<head>` de tu archivo `index.html`.

---

## 3. Configuración y Publicación del Sitemap XML

Nuestra aplicación cuenta con un módulo de auditoría de SEO avanzado en `/src/components/SitemapAuditor.tsx` que genera de forma completamente dinámica el árbol XML con prioridades calculadas por prestigio de marca (E-E-A-T).

Para que Googlebot rastree este sitemap de forma consistente, dispones de dos enfoques de integración técnica:

### Enfoque A: Generación Estática Programada (Build-Time / Export)
Es el método más sencillo y eficiente si el directorio de empresas de mudanzas no cambia cada minuto:
1. Desde la interfaz del portal, navega a la sección **Auditoría de Sitemap**.
2. Haz clic en la pestaña **"Vista Sitemap XML"**.
3. Haz clic en **"Descargar XML"**.
4. Guarda el archivo como `sitemap.xml` y colócalo dentro del directorio `/public` de tu aplicación React.
5. Al compilar la aplicación (`npm run build`), el archivo estático estará disponible públicamente en `https://tu-directorio.com/sitemap.xml`.

### Enfoque B: Endpoint Dinámico (Full-Stack Express + React)
Si estás utilizando nuestra arquitectura Full-Stack (servidor Express proxy en `server.ts`), puedes exponer el sitemap XML en tiempo real de forma dinámica:
1. En tu archivo `server.ts`, importa la lista de empresas y marcas.
2. Genera la respuesta XML directamente al recibir la petición GET de Google.
3. Agrega la siguiente ruta antes de los middlewares estáticos de Express:

```typescript
// server.ts
import { RECOMMENDED_COMPANIES } from './src/data';

app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  
  const baseUrl = 'https://tu-directorio.com';
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // 1. Ruta Home
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  
  // 2. Rutas dinámicas de marcas
  RECOMMENDED_COMPANIES.forEach(company => {
    const priority = company.featured ? '0.9' : '0.7';
    xml += `  <url>\n    <loc>${baseUrl}/empresa/${company.id}</loc>\n    <lastmod>2026-07-19</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  });
  
  xml += '</urlset>';
  res.send(xml);
});
```

---

## 4. Envío del Sitemap en Search Console

Una vez verificado tu sitio y expuesto el archivo `sitemap.xml` en la raíz de tus portales:
1. Ve a la sección **"Sitemaps"** bajo la pestaña de **Indexación** en el panel izquierdo de GSC.
2. En el campo **"Añadir un nuevo sitemap"**, introduce el slug correspondiente:
   *   `sitemap.xml`
3. Haz clic en **"Enviar"**.
4. Repite el proceso para cada una de las propiedades de prefijos locales (`Mendoza` y `Miranda`), asegurándote de que los robots de Google tengan acceso irrestricto al archivo.

---

## 5. Prácticas de Optimización Local y E-E-A-T

Para garantizar que Google valore positivamente la estructura de directorios y mejore el CTR de búsqueda orgánica:

*   **Breadcrumbs con Datos Estructurados:** Nuestro componente de breadcrumbs utiliza marcado semántico de `Schema.org/BreadcrumbList`. Googlebot indexará automáticamente estos elementos y reemplazará los enlaces URL planos en las SERP con jerarquías navegables (p. ej., `Inicio > Mendoza > Mudanzas Mendoza`).
*   **Priorización Estratégica:** Las empresas premium (con certificado de habilitación y habilitadas por la municipalidad o SSN) tienen prioridad `0.9` en el sitemap dinámico para indicarle a Google que indexe e inspeccione de forma prioritaria las páginas con mayor valor fidedigno.
*   **Frecuencia de Actualización:** Mantén la etiqueta `<changefreq>` establecida en `weekly` para las empresas de mudanza y `daily` para el home del portal central. Esto informa inteligentemente al rastreador cuándo volver a pasar, optimizando tu crawl budget.
