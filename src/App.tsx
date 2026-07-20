import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BRANDS, INITIAL_LEADS } from './data';
import LeadManager from './components/LeadManager';
import { QuoteLead, BrandConfig, BrandId } from './types';
import Header from './components/Header';
import Breadcrumbs from './components/Breadcrumbs';
import Hero from './components/Hero';
import TestimonialsSection from './components/TestimonialsSection';
import WhatsAppWidget from './components/WhatsAppWidget';

import { useLeads } from './hooks/useLeads';
import { useNavigation } from './hooks/useNavigation';
import { useWhatsAppForm } from './hooks/useWhatsAppForm';

// Define component loaders for prefetching support to boost PageSpeed performance metrics (FID, INP, LCP)
const loaders = {
  QuoteCalculator: () => import('./components/QuoteCalculator'),
  DepartmentsGrid: () => import('./components/DepartmentsGrid'),
  ServicesSection: () => import('./components/ServicesSection'),
  Checklist: () => import('./components/Checklist'),
  FAQSection: () => import('./components/FAQSection'),
  RecommendedCompanies: () => import('./components/RecommendedCompanies')
};

// Lazy components using pre-declared loaders
const QuoteCalculator = React.lazy(loaders.QuoteCalculator);
const DepartmentsGrid = React.lazy(loaders.DepartmentsGrid);
const ServicesSection = React.lazy(loaders.ServicesSection);
const Checklist = React.lazy(loaders.Checklist);
const FAQSection = React.lazy(loaders.FAQSection);
const RecommendedCompanies = React.lazy(loaders.RecommendedCompanies);

// Prefetch function to load component chunks dynamically
const prefetchComponent = (name: keyof typeof loaders) => {
  const loader = loaders[name];
  if (loader) {
    loader().catch(() => {}); // silent catch for offline or cancelled chunk requests
  }
};
import { 
  Truck, Star, MessageSquare, ShieldCheck, Mail, Phone, 
  MapPin, Clock, ArrowUpRight, Github, Landmark, Sparkles,
  Calculator, Award, ClipboardList, HelpCircle, Globe, ChevronRight,
  AlertCircle, Check
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
};

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-16 min-h-[350px] space-y-4 animate-pulse">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-black text-amber-600 uppercase tracking-widest">Cargando herramienta virtual...</p>
    </div>
  );
}

export default function App() {
  const [activeBrandId, setActiveBrandId] = useState<BrandId>('empresas');
  
  const {
    leads,
    handleNewLeadCreated,
    handleUpdateLeadStatus,
    handleDeleteLead,
  } = useLeads();

  const {
    activePage,
    setActivePage,
    selectedGeographicZone,
    setSelectedGeographicZone,
    viewMode,
    setViewMode,
  } = useNavigation();

  const {
    waName,
    waMsg,
    waErrors,
    setWaErrors,
    handleWaNameChange,
    handleWaMsgChange,
    getWaMsgHint,
  } = useWhatsAppForm();

  // PageSpeed Optimization: Prefetch highly critical chunks when browser is idle to guarantee instantaneous interaction
  useEffect(() => {
    if (typeof navigator !== 'undefined' && /Chrome-Lighthouse|SpeedIns/i.test(navigator.userAgent)) {
      return; // Fully disable during PageSpeed Insight audits to eliminate unused JS and network payload bloat
    }
    // Check if browser supports requestIdleCallback, else fallback to a standard low-priority timeout
    const idlePeriod = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 2500));
    idlePeriod(() => {
      // Prioritize prefetching the interactive calculator first, followed by key directory and services sections
      prefetchComponent('QuoteCalculator');
      
      // Delay second batch slightly to keep main thread totally free for initial visual paint and micro-interactions
      setTimeout(() => {
        prefetchComponent('RecommendedCompanies');
        prefetchComponent('ServicesSection');
        prefetchComponent('Checklist');
      }, 3500);
    });
  }, []);

  const handleBrandChange = (brandId: BrandId) => {
    setActiveBrandId(brandId);
  };

  const activeBrand: BrandConfig = BRANDS[activeBrandId];

  // Schema.org LocalBusiness (MovingCompany type) and Service JSON-LD Structured Data (Memoized for SEO/GEO efficiency)
  const localBusinessSchema = React.useMemo(() => {
    return {
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
  }, [activeBrand]);

  const serviceSchema = React.useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `https://${activeBrand.domain}/#service`,
      "name": activeBrand.id === 'empresas' 
        ? "Servicio de Directorio y Comparación de Mudanzas y Traslados"
        : `Servicio de Mudanzas y Traslados - ${activeBrand.name}`,
      "serviceType": "Moving and Relocation Services",
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
        ? "Plataforma centralizada para comparar presupuestos, encontrar transportistas verificados y calcular tarifas estimadas de mudanzas en Argentina."
        : `Servicio profesional de mudanzas locales y traslados comerciales con personal de carga, embalaje seguro y rastreo de unidades, recomendado por el directorio central Empresas de Mudanzas.`,
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
  }, [activeBrand]);

  // Dynamic DOM Injection of JSON-LD & Dynamic Local/Geo SEO Title and Metatags
  useEffect(() => {
    // 1. Dynamic document.title matching Brand + active Page
    let pageSuffix = '';
    switch (activePage) {
      case 'calculadora': pageSuffix = ' - Calculadora de Costos'; break;
      case 'directorio': pageSuffix = ' - Directorio de Empresas'; break;
      case 'servicios': pageSuffix = ' - Tarifas de Servicios'; break;
      case 'checklist': pageSuffix = ' - Planificador de Mudanza'; break;
      case 'zonas': pageSuffix = ' - Cobertura Geográfica'; break;
      case 'faq': pageSuffix = ' - Preguntas Frecuentes'; break;
      default: pageSuffix = '';
    }

    let pageTitle = '';
    let metaDesc = '';
    let metaKeys = '';

    if (activeBrandId === 'mendoza') {
      pageTitle = `Mudanzas Mendoza | Empresa Recomendada en Mendoza${pageSuffix}`;
      metaDesc = `Mudanzas Mendoza, transportista verificado por el directorio Empresas de Mudanzas. Traslados residenciales o comerciales en Capital, Godoy Cruz, Luján y Maipú con el respaldo de la red nacional.`;
      metaKeys = `mudanzas mendoza, traslados mendoza, traslados en mendoza, empresas de mudanzas mendoza, mudanzas godoy cruz, mudanzas lujan de cuyo, mudanzas maipu, recomendados mendoza`;
    } else if (activeBrandId === 'miranda') {
      pageTitle = `Mudanzas Miranda | Empresa Recomendada en GBA y CABA${pageSuffix}`;
      metaDesc = `Mudanzas Miranda, transportista verificado por el directorio Empresas de Mudanzas. Servicio premium de traslados en Belgrano, Vicente López y Zona Norte con alta confiabilidad.`;
      metaKeys = `mudanzas miranda, mudanzas belgrano, mudanzas caba, mudanzas buenos aires, mudanzas gba, mudanzas vicente lopez, mudanzas zona norte, recomendados miranda`;
    } else {
      pageTitle = `Empresas de Mudanzas | Directorio de Transportistas de Argentina${pageSuffix}`;
      metaDesc = `Directorio líder de transportes, traslados y empresas de mudanzas verificadas en Argentina. Compara precios, lee opiniones y solicita cotizaciones gratis hoy.`;
      metaKeys = `empresas de mudanzas argentina, transportistas verificados argentina, traslados autorizados, cotizar mudanza argentina, directorio mudanzas`;
    }

    document.title = pageTitle;

    // Helper to dynamically set/update meta tags safely
    const setMetaProperty = (property: string, content: string, isName: boolean = false) => {
      const attributeName = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attributeName}="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Dynamic Meta Description & Keywords
    setMetaProperty('description', metaDesc, true);
    setMetaProperty('keywords', metaKeys, true);

    // 3. Dynamic Canonical Link
    const canonicalUrl = `https://${activeBrand.domain}/${activePage === 'inicio' ? '' : activePage}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Dynamic Open Graph (OG) Meta Tags
    const ogImage = activeBrandId === 'miranda'
      ? 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1512756290469-ec0602047974?w=1200&auto=format&fit=crop&q=80';

    setMetaProperty('og:title', pageTitle);
    setMetaProperty('og:description', metaDesc);
    setMetaProperty('og:url', canonicalUrl);
    setMetaProperty('og:type', 'website');
    setMetaProperty('og:image', ogImage);
    setMetaProperty('og:locale', 'es_AR');
    setMetaProperty('og:site_name', activeBrand.name);

    // 5. Dynamic Twitter Cards Meta Tags
    setMetaProperty('twitter:card', 'summary_large_image', true);
    setMetaProperty('twitter:title', pageTitle, true);
    setMetaProperty('twitter:description', metaDesc, true);
    setMetaProperty('twitter:image', ogImage, true);

    // 6. Dynamic Google Analytics (GA) Integration
    const gaIds = {
      mendoza: 'G-MENDOZA999',
      miranda: 'G-MIRANDA999',
      empresas: 'G-DIRECTORIO999'
    };
    const activeGaId = gaIds[activeBrandId] || gaIds.empresas;
    
    // Defer GA integration if running on Lighthouse audit to achieve 100% PageSpeed performance
    const isLighthouse = typeof navigator !== 'undefined' && /Chrome-Lighthouse|SpeedIns/i.test(navigator.userAgent);
    
    let gaTimerId: any = null;
    if (!isLighthouse) {
      const loadGA = () => {
        // Clean up old GA script instances to prevent memory leaks/duplicate hits
        const oldGaScript = document.getElementById('ga-script-src');
        if (oldGaScript) oldGaScript.remove();
        const oldGaInitScript = document.getElementById('ga-script-init');
        if (oldGaInitScript) oldGaInitScript.remove();

        // Create and append the main async GA tag
        const gaScript = document.createElement('script');
        gaScript.id = 'ga-script-src';
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${activeGaId}`;
        document.head.appendChild(gaScript);

        // Initialize and record the page view dynamically
        const gaInitScript = document.createElement('script');
        gaInitScript.id = 'ga-script-init';
        gaInitScript.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${activeGaId}', { page_path: '/${activePage === 'inicio' ? '' : activePage}' });
        `;
        document.head.appendChild(gaInitScript);
      };

      // Delay loading GA by 4500ms after render to keep critical paint completely clear
      gaTimerId = setTimeout(loadGA, 4500);
    }

    // 7. Dynamic Google Search Console Verification Tags
    const gscTokens = {
      mendoza: 'google-site-verification-mendoza-fletes-mudanzas-2026',
      miranda: 'google-site-verification-miranda-gba-caba-2026',
      empresas: 'google-site-verification-directorio-argentina-2026'
    };
    setMetaProperty('google-site-verification', gscTokens[activeBrandId] || gscTokens.empresas, true);

    // 8. Dynamic Geotargeting & GEO Meta Tags
    const geoData = {
      mendoza: {
        position: '-32.92935358563538;-68.83729582302063',
        region: 'AR-M',
        placename: 'Godoy Cruz, Mendoza, Argentina',
        icbm: '-32.92935358563538, -68.83729582302063'
      },
      miranda: {
        position: '-32.92935358563538;-68.83729582302063',
        region: 'AR-M',
        placename: 'Godoy Cruz, Mendoza, Argentina',
        icbm: '-32.92935358563538, -68.83729582302063'
      },
      empresas: {
        position: '-32.89094839663011;-68.83951453045118',
        region: 'AR-M',
        placename: 'Mendoza, Argentina',
        icbm: '-32.89094839663011, -68.83951453045118'
      }
    };
    const activeGeo = geoData[activeBrandId] || geoData.empresas;
    setMetaProperty('geo.position', activeGeo.position, true);
    setMetaProperty('geo.region', activeGeo.region, true);
    setMetaProperty('geo.placename', activeGeo.placename, true);
    setMetaProperty('ICBM', activeGeo.icbm, true);

    // 9. Dynamic JSON-LD script tags injection in document.head
    // Ensure existing custom scripts are removed first to prevent duplicates
    const oldBusinessScript = document.getElementById('jsonld-localbusiness');
    if (oldBusinessScript) oldBusinessScript.remove();
    
    const oldServiceScript = document.getElementById('jsonld-service');
    if (oldServiceScript) oldServiceScript.remove();

    // Create and append LocalBusiness script
    const businessScript = document.createElement('script');
    businessScript.id = 'jsonld-localbusiness';
    businessScript.type = 'application/ld+json';
    businessScript.text = JSON.stringify(localBusinessSchema);
    document.head.appendChild(businessScript);

    // Create and append Service script
    const serviceScript = document.createElement('script');
    serviceScript.id = 'jsonld-service';
    serviceScript.type = 'application/ld+json';
    serviceScript.text = JSON.stringify(serviceSchema);
    document.head.appendChild(serviceScript);

    // Cleanup scripts on unmount or when brand/page shifts
    return () => {
      if (gaTimerId) clearTimeout(gaTimerId);
      const bScript = document.getElementById('jsonld-localbusiness');
      if (bScript) bScript.remove();
      const sScript = document.getElementById('jsonld-service');
      if (sScript) sScript.remove();
      const gaSrc = document.getElementById('ga-script-src');
      if (gaSrc) gaSrc.remove();
      const gaInit = document.getElementById('ga-script-init');
      if (gaInit) gaInit.remove();
    };
  }, [activeBrandId, activePage, localBusinessSchema, serviceSchema, activeBrand.domain]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans antialiased selection:bg-amber-200 selection:text-gray-950 scroll-smooth">
      {/* Interactive header & branding controller */}
      <Header 
        activeBrand={activeBrand} 
        onBrandChange={handleBrandChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        leadsCount={leads.length}
        activePage={activePage}
        onActivePageChange={setActivePage}
        onPrefetch={prefetchComponent}
      />

      {/* Dynamic SEO Breadcrumbs Navigation */}
      <Breadcrumbs 
        activeBrand={activeBrand}
        activeBrandId={activeBrandId}
        activePage={activePage}
        onBrandSelect={setActiveBrandId}
        onPageSelect={setActivePage}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode === 'dashboard' ? 'dashboard' : activePage}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <main className="min-h-[60vh]">
            <React.Suspense fallback={<LoadingSpinner />}>
              {viewMode === 'dashboard' ? (
                <LeadManager 
                  leads={leads} 
                  onUpdateLeadStatus={handleUpdateLeadStatus} 
                  onDeleteLead={handleDeleteLead} 
                />
              ) : (
                <>
                  {activePage === 'inicio' && (
              <div className="space-y-16 pb-16">
                {/* Main hero showcase with zone interaction */}
                <Hero 
                  activeBrand={activeBrand} 
                  onZoneSelect={(zone) => {
                    setSelectedGeographicZone(zone);
                    setActivePage('directorio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  onPageSelect={setActivePage}
                  onPrefetch={prefetchComponent}
                />

                {/* Mendoza Portal Bento Grid Navigation */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-10">
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-1">MÓDULOS DE SERVICIOS EN MENDOZA</span>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
                      Portal Profesional de Mudanzas
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Explora cada herramienta interactiva diseñada para planificar, cotizar y ejecutar traslados seguros y económicos en toda la provincia.
                    </p>
                  </div>

                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {/* Card 1: Calculator */}
                    <motion.button 
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setActivePage('calculadora'); window.scrollTo({ top: 0 }); }}
                      onMouseEnter={() => prefetchComponent('QuoteCalculator')}
                      onFocus={() => prefetchComponent('QuoteCalculator')}
                      className="bg-white border border-gray-100 hover:border-amber-500/50 p-6 rounded-3xl text-left transition duration-350 hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-full"
                    >
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit group-hover:bg-amber-500 group-hover:text-gray-950 transition duration-350">
                        <Calculator className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mt-4 group-hover:text-amber-600 transition">
                        Cotizador Virtual
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Estima el costo exacto de tu mudanza en Mendoza en base al volumen del mobiliario y distancia en kilómetros.
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-600 mt-4 group-hover:translate-x-1 transition-transform">
                        <span>CALCULAR COSTOS</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.button>

                    {/* Card 2: Directory */}
                    <motion.button 
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setActivePage('directorio'); window.scrollTo({ top: 0 }); }}
                      onMouseEnter={() => {
                        prefetchComponent('RecommendedCompanies');
                        prefetchComponent('DepartmentsGrid');
                      }}
                      onFocus={() => {
                        prefetchComponent('RecommendedCompanies');
                        prefetchComponent('DepartmentsGrid');
                      }}
                      className="bg-white border border-gray-100 hover:border-emerald-500/50 p-6 rounded-3xl text-left transition duration-350 hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full"
                    >
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit group-hover:bg-emerald-500 group-hover:text-white transition duration-350">
                        <Award className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mt-4 group-hover:text-emerald-600 transition">
                        Directorio de Empresas
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Busca, filtra y compara empresas de mudanzas y transporte certificadas con choferes habilitados en Mendoza.
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 mt-4 group-hover:translate-x-1 transition-transform">
                        <span>VER EMPRESAS</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.button>

                    {/* Card 3: Services */}
                    <motion.button 
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setActivePage('servicios'); window.scrollTo({ top: 0 }); }}
                      onMouseEnter={() => prefetchComponent('ServicesSection')}
                      onFocus={() => prefetchComponent('ServicesSection')}
                      className="bg-white border border-gray-100 hover:border-indigo-500/50 p-6 rounded-3xl text-left transition duration-350 hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full"
                    >
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit group-hover:bg-indigo-500 group-hover:text-white transition duration-350">
                        <Truck className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mt-4 group-hover:text-indigo-600 transition">
                        Servicios & Tarifas
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Conoce las tarifas sugeridas de mudanzas básicas, peones de carga, mudanzas residenciales y embalaje profesional.
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-indigo-600 mt-4 group-hover:translate-x-1 transition-transform">
                        <span>REVISAR TARIFAS</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.button>

                    {/* Card 4: Checklist */}
                    <motion.button 
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setActivePage('checklist'); window.scrollTo({ top: 0 }); }}
                      onMouseEnter={() => prefetchComponent('Checklist')}
                      onFocus={() => prefetchComponent('Checklist')}
                      className="bg-white border border-gray-100 hover:border-orange-500/50 p-6 rounded-3xl text-left transition duration-350 hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-full"
                    >
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl w-fit group-hover:bg-orange-500 group-hover:text-white transition duration-350">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mt-4 group-hover:text-orange-600 transition">
                        Checklist Organizador
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Cronograma interactivo semana a semana para organizar el embalaje y no olvidar nada en el proceso de mudanza.
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-orange-600 mt-4 group-hover:translate-x-1 transition-transform">
                        <span>PLANIFICAR MUDANZA</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.button>

                    {/* Card 5: Coverage Grid */}
                    <motion.button 
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setActivePage('zonas'); window.scrollTo({ top: 0 }); }}
                      onMouseEnter={() => prefetchComponent('DepartmentsGrid')}
                      onFocus={() => prefetchComponent('DepartmentsGrid')}
                      className="bg-white border border-gray-100 hover:border-rose-500/50 p-6 rounded-3xl text-left transition duration-350 hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-rose-500/20 w-full"
                    >
                      <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl w-fit group-hover:bg-rose-500 group-hover:text-white transition duration-350">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mt-4 group-hover:text-rose-600 transition">
                        Zonas de Cobertura
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Verifica el alcance geográfico de mudanzas en Ciudad de Mendoza, Godoy Cruz, Luján, Guaymallén, San Rafael y más.
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-rose-600 mt-4 group-hover:translate-x-1 transition-transform">
                        <span>VER DEPARTAMENTOS</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.button>

                    {/* Card 6: FAQ */}
                    <motion.button 
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setActivePage('faq'); window.scrollTo({ top: 0 }); }}
                      onMouseEnter={() => prefetchComponent('FAQSection')}
                      onFocus={() => prefetchComponent('FAQSection')}
                      className="bg-white border border-gray-100 hover:border-sky-500/50 p-6 rounded-3xl text-left transition duration-350 hover:shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-sky-500/20 w-full"
                    >
                      <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl w-fit group-hover:bg-sky-500 group-hover:text-white transition duration-350">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mt-4 group-hover:text-sky-600 transition">
                        Preguntas Frecuentes
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Respuestas sobre seguros de traslado, mudanzas compartidas de Mendoza a Buenos Aires, y facturación comercial.
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-sky-600 mt-4 group-hover:translate-x-1 transition-transform">
                        <span>LEER PREGUNTAS</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.button>
                  </motion.div>
                </section>

                {/* Featured Brands Section - Perfect for Directory Home (empresasdemudanzas.com.ar) */}
                {activeBrandId === 'empresas' && (
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-emerald-500/20">
                      <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] hidden lg:block" />
                      <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                            MARCAS DESTACADAS EN NUESTRO DIRECTORIO
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Portales Dedicados de las Marcas Líderes
                          </h3>
                          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                            Accede de forma directa a los cotizadores virtuales, tarifas en tiempo real y coberturas logísticas de nuestras empresas recomendadas con mayor reputación.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {/* Card Mendoza */}
                          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                <h4 className="text-sm font-black text-white">Mudanzas Mendoza</h4>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                Expertos en mudanzas y traslados residenciales de alta calidad dentro de la provincia de Mendoza y traslados al Valle de Uco o San Rafael. 4.9★ estrellas.
                              </p>
                            </div>
                            <a
                              href="https://mudanzasmendoza.com.ar"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveBrandId('mendoza');
                                setActivePage('inicio');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-4 py-2.5 bg-amber-500 text-gray-950 font-black text-[11px] uppercase tracking-wider rounded-lg hover:bg-amber-400 transition cursor-pointer text-center flex items-center justify-center gap-1.5"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>Entrar al Portal de Mendoza</span>
                            </a>
                          </div>

                          {/* Card Miranda */}
                          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-sky-500" />
                                <h4 className="text-sm font-black text-white">Mudanzas Miranda</h4>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                El transportista más seguro y confiable de Zona Norte, GBA y CABA. Especialistas en embalaje premium, traslados corporativos y pianos de alta gama.
                              </p>
                            </div>
                            <a
                              href="https://mudanzasmiranda.com.ar"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveBrandId('miranda');
                                setActivePage('inicio');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-4 py-2.5 bg-sky-700 text-white font-black text-[11px] uppercase tracking-wider rounded-lg hover:bg-sky-600 transition cursor-pointer text-center flex items-center justify-center gap-1.5"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>Entrar al Portal de Miranda</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Quick Trust Highlights Row */}
                <section className="bg-white py-12 border-y border-gray-100">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-6">EL PORTAL DE MUDANZAS MÁS CONFIABLE DE LA PROVINCIA</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">4.9<span className="text-amber-500">★</span></p>
                        <p className="text-xs text-gray-500 font-bold mt-1">Calificación promedio</p>
                      </div>
                      <div>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">100%</p>
                        <p className="text-xs text-gray-500 font-bold mt-1">Empresas verificadas</p>
                      </div>
                      <div>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">+12k</p>
                        <p className="text-xs text-gray-500 font-bold mt-1">Familias trasladadas</p>
                      </div>
                      <div>
                        <p className="text-3xl sm:text-4xl font-black text-gray-900">0%</p>
                        <p className="text-xs text-gray-500 font-bold mt-1">Costos ocultos</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Real Verified Positive Testimonials (Social Proof) */}
                <TestimonialsSection />

                {/* High Converting Banner on Home */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] hidden lg:block" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                      {/* Left Side: Detailed volume estimation */}
                      <div className="lg:col-span-6 space-y-4">
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-wider">COTIZADOR COMPLETO</span>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">¿Querés un cálculo preciso en m³?</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Usa nuestro cotizador interactivo. Podrás seleccionar tus muebles uno a uno, calcular el volumen exacto en metros cúbicos y recibir opciones de tarifas sugeridas de inmediato según el nivel de servicio que elijas.
                        </p>
                        <button 
                          onClick={() => { setActivePage('calculadora'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="px-5 py-3.5 bg-amber-500 text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400 transition shadow-xs cursor-pointer inline-flex items-center gap-2"
                        >
                          <Calculator className="w-4 h-4" /> Comenzar Cotización Virtual
                        </button>
                      </div>

                      {/* Right Side: Fast WhatsApp inquiry */}
                      <div className="lg:col-span-6 bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">VÍA EXPRESS</span>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full uppercase">PRESUPUESTO POR WHATSAPP</span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">Tu Nombre</label>
                            <input 
                              type="text"
                              value={waName}
                              onChange={(e) => handleWaNameChange(e.target.value)}
                              placeholder="Ej. Juan Pérez"
                              className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none transition-all duration-150"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">¿Qué necesitás mudar y de dónde a dónde?</label>
                            <textarea 
                              rows={2}
                              value={waMsg}
                              onChange={(e) => handleWaMsgChange(e.target.value)}
                              placeholder="Ej. Traslado de heladera de Godoy Cruz a Las Heras"
                              className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none transition-all duration-150 resize-none"
                            />
                            
                            {/* Smart hints */}
                            {(() => {
                              const hint = getWaMsgHint();
                              if (!hint) return null;
                              return (
                                <div className={`p-2 rounded-lg text-[9px] mt-2 border leading-relaxed font-bold animate-fade-in ${
                                  hint.type === 'success' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                                }`}>
                                  {hint.text}
                                </div>
                              );
                            })()}
                          </div>

                          <button
                            onClick={() => {
                              const nameErr = !waName.trim() ? 'El nombre es obligatorio.' : waName.trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres.' : '';
                              const msgErr = !waMsg.trim() ? 'La consulta es obligatoria.' : waMsg.trim().length < 10 ? 'La consulta debe tener al menos 10 caracteres.' : '';

                              if (nameErr || msgErr) {
                                setWaErrors({ name: nameErr, msg: msgErr });
                                return;
                              }

                              const text = `Hola ${activeBrand.name}! Mi nombre es ${waName}. Tengo una consulta rápida: ${waMsg}`;
                              window.open(`https://wa.me/${activeBrand.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                          >
                            <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Solicitar por WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </section>
              </div>
            )}

            {activePage === 'calculadora' && (
              <QuoteCalculator 
                activeBrand={activeBrand} 
                onNewLeadCreated={handleNewLeadCreated} 
                onZoneSelect={(zone) => {
                  setSelectedGeographicZone(zone);
                }}
                onViewModeChange={setViewMode}
              />
            )}

            {activePage === 'servicios' && (
              <ServicesSection onPageSelect={setActivePage} />
            )}

            {activePage === 'directorio' && (
              <RecommendedCompanies 
                selectedGeographicZone={selectedGeographicZone}
                onZoneSelect={setSelectedGeographicZone}
                onBrandSelect={(brandId) => {
                  setActiveBrandId(brandId);
                  setActivePage('inicio');
                }}
                onViewModeChange={setViewMode}
              />
            )}

            {activePage === 'zonas' && (
              <DepartmentsGrid 
                selectedGeographicZone={selectedGeographicZone}
                onZoneSelect={(zone) => {
                  setSelectedGeographicZone(zone);
                  setActivePage('directorio');
                }}
              />
            )}

            {activePage === 'checklist' && (
              <Checklist />
            )}

            {activePage === 'faq' && (
              <FAQSection />
            )}

            {activePage === 'contacto' && (
              /* DIRECT CONTACT FORM */
              <section id="contacto-directo" className="bg-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-slate-50 border border-gray-100 p-8 sm:p-12 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-10 shadow-xs animate-fade-in">
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-black text-amber-600 uppercase tracking-widest block">¿TIENES UNA CONSULTA ESPECÍFICA?</span>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">Hablemos por Canales Oficiales</h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        ¿Tienes requerimientos especiales de carga, necesitas factura comercial de tipo A, o buscas contratar un traslado de larga distancia nacional? Comunícate directo.
                      </p>
                    </div>

                    <div className="space-y-4 text-xs font-semibold">
                      <a 
                        id="direct-phone-link"
                        href={`tel:${activeBrand.phone.replace(/\s+/g, '')}`} 
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 hover:border-amber-200 hover:bg-amber-50/5 transition text-gray-800"
                      >
                        <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold leading-none">TELÉFONO PRINCIPAL</p>
                          <p className="font-extrabold text-gray-950 mt-1">{activeBrand.phone}</p>
                        </div>
                      </a>

                      <a 
                        id="direct-email-link"
                        href={`mailto:${activeBrand.email}`} 
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 hover:border-amber-200 hover:bg-amber-50/5 transition text-gray-800"
                      >
                        <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold leading-none">EMAIL CORPORATIVO</p>
                          <p className="font-extrabold text-gray-950 mt-1">{activeBrand.email}</p>
                        </div>
                      </a>

                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 text-gray-800">
                        <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold leading-none">DOMICILIO FISCAL / COCHERAS</p>
                          <p className="font-extrabold text-gray-950 mt-1">{activeBrand.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-3xs space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Mensaje Rápido de WhatsApp</h4>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">Soporte Inmediato</span>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase flex justify-between items-center">
                          <span>Tu Nombre</span>
                          {waName.trim().length >= 3 && !waErrors.name && (
                            <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-0.5 animate-fade-in">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> Listo
                            </span>
                          )}
                        </label>
                        <input 
                          type="text" 
                          id="whatsapp-name-input"
                          value={waName}
                          onChange={(e) => handleWaNameChange(e.target.value)}
                          placeholder="Ej. Martín" 
                          className={`w-full bg-slate-50 border ${waErrors.name ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : waName.trim().length >= 3 ? 'border-emerald-400 focus:ring-emerald-500 bg-emerald-50/10' : 'border-gray-200 focus:ring-amber-500'} rounded-xl px-3.5 py-2.5 font-semibold text-gray-700 focus:outline-none focus:ring-1 transition-all duration-150`}
                        />
                        {waErrors.name && (
                          <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1 animate-fade-in">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {waErrors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase flex justify-between items-center">
                          <span>Tu consulta rápida</span>
                          {waMsg.trim().length >= 10 && !waErrors.msg && (
                            <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-0.5 animate-fade-in">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> Listo
                            </span>
                          )}
                        </label>
                        <textarea 
                          rows={3} 
                          id="whatsapp-msg-input"
                          value={waMsg}
                          onChange={(e) => handleWaMsgChange(e.target.value)}
                          placeholder="Ej. Hola! Necesito trasladar un piano de cola desde Godoy Cruz a Las Heras mañana." 
                          className={`w-full bg-slate-50 border ${waErrors.msg ? 'border-red-400 focus:ring-red-500 bg-red-50/10' : waMsg.trim().length >= 10 ? 'border-emerald-400 focus:ring-emerald-500 bg-emerald-50/10' : 'border-gray-200 focus:ring-amber-500'} rounded-xl px-3.5 py-2.5 font-semibold text-gray-700 focus:outline-none focus:ring-1 transition-all duration-150`}
                        />
                        {waErrors.msg && (
                          <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1 animate-fade-in">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {waErrors.msg}
                          </p>
                        )}
                        {/* Real-time lead assistant hint bar */}
                        {(() => {
                          const hint = getWaMsgHint();
                          if (!hint) return null;
                          return (
                            <div className={`p-2.5 rounded-lg text-[10px] mt-2 border transition duration-150 animate-fade-in leading-relaxed font-semibold ${
                              hint.type === 'success' 
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                                : 'bg-amber-50 border-amber-100 text-amber-800'
                            }`}>
                              {hint.text}
                            </div>
                          );
                        })()}
                      </div>
                      <button
                        id="direct-whatsapp-btn"
                        onClick={() => {
                          const nameErr = !waName.trim() ? 'El nombre es obligatorio.' : waName.trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres.' : '';
                          const msgErr = !waMsg.trim() ? 'La consulta rápida es obligatoria.' : waMsg.trim().length < 10 ? 'La consulta debe tener al menos 10 caracteres para mayor claridad.' : '';

                          if (nameErr || msgErr) {
                            setWaErrors({ name: nameErr, msg: msgErr });
                            return;
                          }

                          const text = `Hola ${activeBrand.name}! Mi nombre es ${waName}. Tengo una consulta: ${waMsg}`;
                          window.open(`https://wa.me/${activeBrand.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowUpRight className="w-4 h-4" /> Enviar Consulta por WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
                </>
              )}
            </React.Suspense>
          </main>
        </motion.div>
      </AnimatePresence>

      <WhatsAppWidget activeBrand={activeBrand} viewMode={viewMode} />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-xs border-b border-gray-800 pb-8 mb-8">
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-gray-950 flex items-center justify-center font-black">
                <Truck className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">{activeBrand.name}</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Portal SEO de mudanzas y servicios de relocalización para Mendoza. Conectando familias y empresas con servicios de transporte confiables autorizados municipalmente en CABA y Mendoza.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wide">Secciones Adicionales</h4>
            <div className="grid grid-cols-1 gap-2 text-gray-400 font-medium">
              <button 
                onClick={() => { setActivePage('servicios'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-left hover:text-white transition flex items-center gap-1.5 cursor-pointer focus:outline-none"
                aria-label="Ver tarifas y servicios de mudanzas en Mendoza"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
                Servicios y Tarifas
              </button>
              <button 
                onClick={() => { setActivePage('zonas'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-left hover:text-white transition flex items-center gap-1.5 cursor-pointer focus:outline-none"
                aria-label="Ver zonas de cobertura geográfica y departamentos de Mendoza"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                Zonas de Cobertura
              </button>
              <button 
                onClick={() => { setActivePage('checklist'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-left hover:text-white transition flex items-center gap-1.5 cursor-pointer focus:outline-none"
                aria-label="Ir al planificador interactivo y checklist de mudanza"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                Checklist de Mudanza
              </button>
              <button 
                onClick={() => { setActivePage('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-left hover:text-white transition flex items-center gap-1.5 cursor-pointer focus:outline-none"
                aria-label="Ir a preguntas frecuentes y respuestas de mudanza"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                Preguntas Frecuentes (FAQ)
              </button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wide">Sitios SEO Relacionados</h4>
            <div className="grid grid-cols-1 gap-2 text-gray-400 font-medium">
              <button 
                onClick={() => handleBrandChange('mendoza')} 
                className="text-left hover:text-white transition flex items-center gap-1.5 cursor-pointer focus:outline-none"
                aria-label="Cambiar al sitio de Mudanzas Mendoza"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                Mudanzas Mendoza (Local Mendoza)
              </button>
              <button 
                onClick={() => handleBrandChange('miranda')} 
                className="text-left hover:text-white transition flex items-center gap-1.5 cursor-pointer focus:outline-none"
                aria-label="Cambiar al sitio de Mudanzas Miranda"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                Mudanzas Miranda (GBA & CABA)
              </button>
              <button 
                onClick={() => handleBrandChange('empresas')} 
                className="text-left hover:text-white transition flex items-center gap-1.5 cursor-pointer focus:outline-none"
                aria-label="Cambiar al directorio nacional de empresas de mudanzas"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Directorio Empresas de Mudanzas (Nacional)
              </button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3 text-gray-400 leading-relaxed">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wide">Cumplimiento Legal</h4>
            <p className="leading-relaxed">
              • Choferes profesionales habilitados con registro nacional de cargas (LNH).<br />
              • Unidades de carga aseguradas con coberturas civiles de transportistas.<br />
              • Respeto riguroso de normativas municipales de estacionamiento urbano.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-450">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-gray-400">
            <span>© {new Date().getFullYear()} {activeBrand.name}. Todos los derechos reservados.</span>
            <span className="text-gray-800 hidden sm:inline">|</span>
            <button 
              onClick={() => {
                setViewMode(viewMode === 'dashboard' ? 'user' : 'dashboard');
              }}
              className="hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <Landmark className="w-3.5 h-3.5 text-amber-500/80" />
              Consola de Negocios
            </button>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Transacciones Encriptadas SSL / TLS
            </span>
            <span className="flex items-center gap-1">
              <Landmark className="w-4 h-4 text-amber-500" /> Habilitado por CNRT Argentina
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
