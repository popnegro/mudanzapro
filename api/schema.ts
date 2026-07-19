const BRANDS_METADATA = {
  mendoza: {
    id: 'mendoza',
    name: 'Mudanzas Mendoza',
    tagline: 'Expertos en Mudanzas Locales y Fletes en la Provincia de Mendoza',
    domain: 'mudanzasmendoza.com.ar',
    phone: '+54 261 455-8899',
    email: 'contacto@mudanzasmendoza.com.ar',
    address: 'Av. San Martín 1240, Godoy Cruz, Mendoza',
    reviewCount: 342,
    avgRating: 4.9,
  },
  miranda: {
    id: 'miranda',
    name: 'Mudanzas Miranda',
    tagline: 'El Servicio de Mudanza Más Confiable y Seguro del Gran Buenos Aires',
    domain: 'mudanzasmiranda.com.ar',
    phone: '+54 11 5233-9800',
    email: 'info@mudanzasmiranda.com.ar',
    address: 'Av. Cabildo 2200, Belgrano, CABA',
    reviewCount: 489,
    avgRating: 4.8,
  },
  empresas: {
    id: 'empresas',
    name: 'Empresas de Mudanzas',
    tagline: 'Directorio Líder de Transportistas y Mudanzas Verificadas en Argentina',
    domain: 'empresasdemudanzas.com.ar',
    phone: '+54 800 555-MUDAR',
    email: 'soporte@empresasdemudanzas.com.ar',
    address: 'Oficinas Centrales - Buenos Aires, Argentina',
    reviewCount: 1250,
    avgRating: 4.7,
  }
};

export default function handler(req: any, res: any) {
  try {
    const brandParam = (req.query?.brand as string) || 'mendoza';
    const pageParam = (req.query?.page as string) || 'inicio';

    // Validate brand selection
    const activeBrand = BRANDS_METADATA[brandParam as keyof typeof BRANDS_METADATA] || BRANDS_METADATA.mendoza;

    // Generate LocalBusiness Schema
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": activeBrand.id === 'empresas' ? "LocalBusiness" : "MovingCompany",
      "@id": `https://${activeBrand.domain}/#organization`,
      "name": activeBrand.name,
      "description": activeBrand.tagline,
      "url": `https://${activeBrand.domain}`,
      "telephone": activeBrand.phone,
      "email": activeBrand.email,
      "logo": "https://images.unsplash.com/photo-1512756290469-ec0602047974?w=100&auto=format&fit=crop&q=60",
      "image": [
        "https://images.unsplash.com/photo-1512756290469-ec0602047974?w=800&auto=format&fit=crop&q=60"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": activeBrand.address,
        "addressLocality": activeBrand.id === 'miranda' ? 'CABA' : (activeBrand.id === 'mendoza' ? 'Mendoza' : 'Buenos Aires'),
        "addressRegion": activeBrand.id === 'miranda' ? 'Buenos Aires' : (activeBrand.id === 'mendoza' ? 'Mendoza' : 'Buenos Aires'),
        "postalCode": activeBrand.id === 'miranda' ? 'C1428' : (activeBrand.id === 'mendoza' ? 'M5501' : 'C1001'),
        "addressCountry": "AR"
      },
      "geo": activeBrand.id === 'miranda' ? {
        "@type": "GeoCoordinates",
        "latitude": -34.5612,
        "longitude": -58.4556
      } : {
        "@type": "GeoCoordinates",
        "latitude": -32.9161,
        "longitude": -68.8458
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": activeBrand.avgRating,
        "reviewCount": activeBrand.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      },
      "priceRange": "$$$",
      ...(activeBrand.id !== 'empresas' && {
        "parentOrganization": {
          "@type": "LocalBusiness",
          "@id": "https://empresasdemudanzas.com.ar/#organization",
          "name": "Empresas de Mudanzas",
          "url": "https://empresasdemudanzas.com.ar",
          "telephone": "+54 800 555-MUDAR",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Oficinas Centrales - Buenos Aires, Argentina",
            "addressCountry": "AR"
          }
        }
      })
    };

    // Generate Service Schema
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `https://${activeBrand.domain}/#service`,
      "name": activeBrand.id === 'empresas' 
        ? "Servicio de Directorio y Comparación de Mudanzas y Fletes"
        : `Servicio de Mudanzas y Fletes - ${activeBrand.name}`,
      "serviceType": "Moving and Freight Services",
      "provider": {
        "@type": activeBrand.id === 'empresas' ? "LocalBusiness" : "MovingCompany",
        "@id": `https://${activeBrand.domain}/#organization`,
        "name": activeBrand.name,
        "telephone": activeBrand.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": activeBrand.address,
          "addressLocality": activeBrand.id === 'miranda' ? 'CABA' : (activeBrand.id === 'mendoza' ? 'Mendoza' : 'Buenos Aires'),
          "addressCountry": "AR"
        },
        ...(activeBrand.id !== 'empresas' && {
          "parentOrganization": {
            "@type": "LocalBusiness",
            "@id": "https://empresasdemudanzas.com.ar/#organization",
            "name": "Empresas de Mudanzas",
            "url": "https://empresasdemudanzas.com.ar"
          }
        })
      },
      "description": activeBrand.id === 'empresas'
        ? "Plataforma centralizada para comparar presupuestos, encontrar transportistas verificados y calcular tarifas estimadas de fletes en Argentina."
        : `Servicio profesional de mudanzas locales y fletes comerciales con personal de carga, embalaje seguro y rastreo de unidades, recomendado por el directorio central Empresas de Mudanzas.`,
      "areaServed": [
        {
          "@type": "AdministrativeArea",
          "name": activeBrand.id === 'miranda' ? "Gran Buenos Aires" : (activeBrand.id === 'mendoza' ? "Provincia de Mendoza" : "Argentina")
        },
        {
          "@type": "AdministrativeArea",
          "name": activeBrand.id === 'miranda' ? "Ciudad Autónoma de Buenos Aires" : (activeBrand.id === 'mendoza' ? "Gran Mendoza" : "Provincias Argentinas")
        }
      ],
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "ARS",
        "lowPrice": activeBrand.id === 'empresas' ? "35000" : "45000",
        "highPrice": "350000",
        "offerCount": "15"
      },
      ...(activeBrand.id !== 'empresas' && {
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://empresasdemudanzas.com.ar/#website",
          "name": "Empresas de Mudanzas",
          "url": "https://empresasdemudanzas.com.ar"
        }
      })
    };

    // Return combined schema Graph for maximum crawler efficiency
    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": [
        localBusinessSchema,
        serviceSchema
      ]
    };

    // In a dynamic serverless setup, we configure Edge Network Cache
    // s-maxage=86400 (cache at Edge for 24 hours), stale-while-revalidate=3600 (allow background update after 1 hour)
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'application/ld+json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    return res.status(200).json(schemaGraph);
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Unknown error occurred"
    });
  }
}
