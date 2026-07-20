export default function handler(req: any, res: any) {
  try {
    const host = req.headers.host || 'empresasdemudanzas.com.ar';
    
    // Determine the active domain to serve custom SEO sitemaps
    let domain = 'empresasdemudanzas.com.ar';
    let pages = ['inicio', 'calculadora', 'directorio', 'servicios', 'checklist', 'zonas', 'faq'];
    
    // Support testing via query parameters and automatic host detection
    const queryBrand = req.query?.brand as string;
    if (host.includes('mudanzasmendoza') || queryBrand === 'mendoza') {
      domain = 'mudanzasmendoza.com.ar';
      pages = ['inicio', 'calculadora', 'servicios', 'checklist', 'zonas', 'faq'];
    } else if (host.includes('mudanzasmiranda') || queryBrand === 'miranda') {
      domain = 'mudanzasmiranda.com.ar';
      pages = ['inicio', 'calculadora', 'servicios', 'checklist', 'zonas', 'faq'];
    }

    const urlsXml = pages
      .map(page => {
        const path = page === 'inicio' ? '' : page;
        const priority = page === 'inicio' ? '1.0' : (page === 'calculadora' || page === 'servicios' ? '0.9' : '0.7');
        return `  <url>
    <loc>https://${domain}/${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
      .join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

    // Set high-performance edge cache headers: s-maxage=86400 (cache at Edge for 24h), stale-while-revalidate=3600 (allow background update after 1h)
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    return res.status(200).send(sitemapXml.trim());
  } catch (error: any) {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send("Internal Server Error: " + error.message);
  }
}
