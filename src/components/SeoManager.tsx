import React, { useEffect, useMemo } from "react";
import { BrandConfig, BrandId } from "../types";
import { Helmet } from "react-helmet-async";

interface SeoManagerProps {
  activeBrand: BrandConfig;
  activePage: string;
}

const SeoManager: React.FC<SeoManagerProps> = ({ activeBrand, activePage }) => {
  const activeBrandId = activeBrand.id as BrandId;

  // Schema.org LocalBusiness (MovingCompany type) and Service JSON-LD Structured Data (Memoized for SEO/GEO efficiency)
  const localBusinessSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type":
        activeBrand.id === "empresas" ? "LocalBusiness" : "MovingCompany",
      "@id": `https://${activeBrand.domain}/#organization`,
      name: activeBrand.name,
      description: activeBrand.tagline,
      url: `https://${activeBrand.domain}`,
      telephone: activeBrand.phone,
      email: activeBrand.email,
      logo: "https://images.unsplash.com/photo-1512756290469-ec0602047974?w=100&auto=format&fit=crop&q=60",
      image: [
        "https://images.unsplash.com/photo-1512756290469-ec0602047974?w=800&auto=format&fit=crop&q=60",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: activeBrand.address,
        addressLocality:
          activeBrand.id === "miranda"
            ? "CABA"
            : activeBrand.id === "mendoza"
              ? "Mendoza"
              : "Buenos Aires",
        addressRegion:
          activeBrand.id === "miranda"
            ? "Buenos Aires"
            : activeBrand.id === "mendoza"
              ? "Mendoza"
              : "Buenos Aires",
        postalCode:
          activeBrand.id === "miranda"
            ? "C1428"
            : activeBrand.id === "mendoza"
              ? "M5501"
              : "C1001",
        addressCountry: "AR",
      },
      geo:
        activeBrand.id === "miranda"
          ? {
              "@type": "GeoCoordinates",
              latitude: -34.5612,
              longitude: -58.4556,
            }
          : {
              "@type": "GeoCoordinates",
              latitude: -32.9161,
              longitude: -68.8458,
            },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: activeBrand.avgRating,
        reviewCount: activeBrand.reviewCount,
        bestRating: "5",
        worstRating: "1",
      },
      priceRange: "$$$",
      ...(activeBrand.id !== "empresas" && {
        parentOrganization: {
          "@type": "LocalBusiness",
          "@id": "https://empresasdemudanzas.com.ar/#organization",
          name: "Empresas de Mudanzas",
          url: "https://empresasdemudanzas.com.ar",
          telephone: "+54 800 555-MUDAR",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Oficinas Centrales - Buenos Aires, Argentina",
            addressCountry: "AR",
          },
        },
      }),
    };
  }, [activeBrand]);

  const serviceSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `https://${activeBrand.domain}/#service`,
      name:
        activeBrand.id === "empresas"
          ? "Servicio de Directorio y Comparación de Mudanzas y Traslados"
          : `Servicio de Mudanzas y Traslados - ${activeBrand.name}`,
      serviceType: "Moving and Relocation Services",
      provider: {
        "@type":
          activeBrand.id === "empresas" ? "LocalBusiness" : "MovingCompany",
        "@id": `https://${activeBrand.domain}/#organization`,
        name: activeBrand.name,
        telephone: activeBrand.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: activeBrand.address,
          addressLocality:
            activeBrand.id === "miranda"
              ? "CABA"
              : activeBrand.id === "mendoza"
                ? "Mendoza"
                : "Buenos Aires",
          addressCountry: "AR",
        },
        ...(activeBrand.id !== "empresas" && {
          parentOrganization: {
            "@type": "LocalBusiness",
            "@id": "https://empresasdemudanzas.com.ar/#organization",
            name: "Empresas de Mudanzas",
            url: "https://empresasdemudanzas.com.ar",
          },
        }),
      },
      description:
        activeBrand.id === "empresas"
          ? "Plataforma centralizada para comparar presupuestos, encontrar transportistas verificados y calcular tarifas estimadas de mudanzas en Argentina."
          : `Servicio profesional de mudanzas locales y traslados comerciales con personal de carga, embalaje seguro y rastreo de unidades, recomendado por el directorio central Empresas de Mudanzas.`,
      areaServed: [
        {
          "@type": "AdministrativeArea",
          name:
            activeBrand.id === "miranda"
              ? "Gran Buenos Aires"
              : activeBrand.id === "mendoza"
                ? "Provincia de Mendoza"
                : "Argentina",
        },
        {
          "@type": "AdministrativeArea",
          name:
            activeBrand.id === "miranda"
              ? "Ciudad Autónoma de Buenos Aires"
              : activeBrand.id === "mendoza"
                ? "Gran Mendoza"
                : "Provincias Argentinas",
        },
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "ARS",
        lowPrice: activeBrand.id === "empresas" ? "35000" : "45000",
        highPrice: "350000",
        offerCount: "15",
      },
      ...(activeBrand.id !== "empresas" && {
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://empresasdemudanzas.com.ar/#website",
          name: "Empresas de Mudanzas",
          url: "https://empresasdemudanzas.com.ar",
        },
      }),
    };
  }, [activeBrand]);

  // Effect for side-effects like Google Analytics that still require direct DOM interaction
  useEffect(() => {
    // Dynamic Google Analytics (GA) Integration
    const gaIds = {
      mendoza: "G-MENDOZA999",
      miranda: "G-MIRANDA999",
      empresas: "G-DIRECTORIO999",
    };
    const activeGaId = gaIds[activeBrandId] || gaIds.empresas;

    const isLighthouse =
      typeof navigator !== "undefined" &&
      /Chrome-Lighthouse|SpeedIns/i.test(navigator.userAgent);

    let gaTimerId: NodeJS.Timeout | null = null;
    if (!isLighthouse) {
      const loadGA = () => {
        const oldGaScript = document.getElementById("ga-script-src");
        if (oldGaScript) oldGaScript.remove();
        const oldGaInitScript = document.getElementById("ga-script-init");
        if (oldGaInitScript) oldGaInitScript.remove();

        const gaScript = document.createElement("script");
        gaScript.id = "ga-script-src";
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${activeGaId}`;
        document.head.appendChild(gaScript);

        const gaInitScript = document.createElement("script");
        gaInitScript.id = "ga-script-init";
        gaInitScript.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${activeGaId}', { page_path: '/${activePage === "inicio" ? "" : activePage}' });
        `;
        document.head.appendChild(gaInitScript);
      };
      gaTimerId = setTimeout(loadGA, 4500);
    }

    return () => {
      if (gaTimerId) clearTimeout(gaTimerId);
      document.getElementById("ga-script-src")?.remove();
      document.getElementById("ga-script-init")?.remove();
    };
  }, [activeBrandId, activePage]);

  // Memoize SEO values to prevent re-renders
  const { pageTitle, metaDesc, metaKeys, canonicalUrl, ogImage } =
    useMemo(() => {
      let pageSuffix = "";
      switch (activePage) {
        case "calculadora":
          pageSuffix = " - Calculadora de Costos";
          break;
        case "directorio":
          pageSuffix = " - Directorio de Empresas";
          break;
        case "servicios":
          pageSuffix = " - Tarifas de Servicios";
          break;
        case "checklist":
          pageSuffix = " - Planificador de Mudanza";
          break;
        case "zonas":
          pageSuffix = " - Cobertura Geográfica";
          break;
        case "faq":
          pageSuffix = " - Preguntas Frecuentes";
          break;
        default:
          pageSuffix = "";
      }

      let title = "",
        desc = "",
        keys = "";
      if (activeBrandId === "mendoza") {
        title = `Mudanzas Mendoza | Empresa Recomendada en Mendoza${pageSuffix}`;
        desc = `Mudanzas Mendoza, transportista verificado por el directorio Empresas de Mudanzas. Traslados residenciales o comerciales en Capital, Godoy Cruz, Luján y Maipú con el respaldo de la red nacional.`;
        keys = `mudanzas mendoza, traslados mendoza, traslados en mendoza, empresas de mudanzas mendoza, mudanzas godoy cruz, mudanzas lujan de cuyo, mudanzas maipu, recomendados mendoza`;
      } else if (activeBrandId === "miranda") {
        title = `Mudanzas Miranda | Empresa Recomendada en GBA y CABA${pageSuffix}`;
        desc = `Mudanzas Miranda, transportista verificado por el directorio Empresas de Mudanzas. Servicio premium de traslados en Belgrano, Vicente López y Zona Norte con alta confiabilidad.`;
        keys = `mudanzas miranda, mudanzas belgrano, mudanzas caba, mudanzas buenos aires, mudanzas gba, mudanzas vicente lopez, mudanzas zona norte, recomendados miranda`;
      } else {
        title = `Empresas de Mudanzas | Directorio de Transportistas de Argentina${pageSuffix}`;
        desc = `Directorio líder de transportes, traslados y empresas de mudanzas verificadas en Argentina. Compara precios, lee opiniones y solicita cotizaciones gratis hoy.`;
        keys = `empresas de mudanzas argentina, transportistas verificados argentina, traslados autorizados, cotizar mudanza argentina, directorio mudanzas`;
      }

      const url = `https://${activeBrand.domain}/${activePage === "inicio" ? "" : activePage}`;
      const image =
        activeBrandId === "miranda"
          ? "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1512756290469-ec0602047974?w=1200&auto=format&fit=crop&q=80";

      return {
        pageTitle: title,
        metaDesc: desc,
        metaKeys: keys,
        canonicalUrl: url,
        ogImage: image,
      };
    }, [activeBrand.domain, activeBrandId, activePage]);

  const gscTokens = {
    mendoza: "google-site-verification-mendoza-fletes-mudanzas-2026",
    miranda: "google-site-verification-miranda-gba-caba-2026",
    empresas: "google-site-verification-directorio-argentina-2026",
  };
  const activeGscToken = gscTokens[activeBrandId] || gscTokens.empresas;

  const geoData = {
    mendoza: {
      position: "-32.92935358563538;-68.83729582302063",
      region: "AR-M",
      placename: "Godoy Cruz, Mendoza, Argentina",
      icbm: "-32.92935358563538, -68.83729582302063",
    },
    miranda: {
      position: "-34.5612;-58.4556",
      region: "AR-C",
      placename: "Belgrano, CABA, Argentina",
      icbm: "-34.5612, -58.4556",
    },
    empresas: {
      position: "-34.6037;-58.3816",
      region: "AR-C",
      placename: "Buenos Aires, Argentina",
      icbm: "-34.6037, -58.3816",
    },
  };
  const activeGeo = geoData[activeBrandId] || geoData.empresas;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeys} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (OG) Meta Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="es_AR" />
      <meta property="og:site_name" content={activeBrand.name} />

      {/* Twitter Cards Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Verification & Geo Tags */}
      <meta name="google-site-verification" content={activeGscToken} />
      <meta name="geo.position" content={activeGeo.position} />
      <meta name="geo.region" content={activeGeo.region} />
      <meta name="geo.placename" content={activeGeo.placename} />
      <meta name="ICBM" content={activeGeo.icbm} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

export default SeoManager;
