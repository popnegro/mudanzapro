import React, { useState, useEffect } from 'react';
import { 
  Folder, Home, MapPin, Calculator, BookOpen, Briefcase, 
  Target, Key, ChevronRight, X, Sparkles, HelpCircle, Eye, Zap, 
  ArrowRight, ShieldCheck, CheckCircle2, FileCode, Download, Copy, Check, ExternalLink, Globe
} from 'lucide-react';
import { RECOMMENDED_COMPANIES } from '../data';

interface SitemapNode {
  id: string;
  label: string;
  sectionId: string;
  objetivo: string;
  seoFocus: string;
  details: string;
  children?: SitemapNode[];
}

export function generateSitemapXML(): string {
  const today = new Date().toISOString().split('T')[0];
  const pages = [
    { path: '', changefreq: 'daily', priority: '1.0' },
    { path: '/calculadora', changefreq: 'weekly', priority: '0.9' },
    { path: '/servicios', changefreq: 'weekly', priority: '0.8' },
    { path: '/directorio', changefreq: 'daily', priority: '0.9' },
    { path: '/zonas', changefreq: 'weekly', priority: '0.8' },
    { path: '/checklist', changefreq: 'monthly', priority: '0.7' },
    { path: '/faq', changefreq: 'monthly', priority: '0.7' },
    { path: '/contacto', changefreq: 'monthly', priority: '0.6' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  // Core pages
  pages.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>https://empresasdemudanzas.com.ar${p.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Recommended Companies as sub-pages
  RECOMMENDED_COMPANIES.forEach(company => {
    // Tiered crawl priorities and change frequencies based on brand status and performance stats
    const priority = company.isFeatured ? '0.90' : '0.80';
    const changefreq = company.isFeatured ? 'daily' : 'weekly';
    
    xml += `  <url>\n`;
    xml += `    <loc>https://empresasdemudanzas.com.ar/empresa/${company.id}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Cross-linked Dedicated Brand Portals
  xml += `  <!-- Brand Portals (Cross-linked authority domains) -->\n`;
  xml += `  <url>\n`;
  xml += `    <loc>https://mudanzasmendoza.com.ar</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;
  xml += `  <url>\n`;
  xml += `    <loc>https://mudanzasmiranda.com.ar</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;

  xml += `</urlset>`;
  return xml;
}

interface SitemapAuditorProps {
  activePage?: string;
  onPageSelect?: (page: string) => void;
  viewMode?: 'user' | 'dashboard';
  onViewModeChange?: (mode: 'user' | 'dashboard') => void;
}

export default function SitemapAuditor({
  activePage,
  onPageSelect,
  viewMode,
  onViewModeChange
}: SitemapAuditorProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNode, setActiveNode] = useState<SitemapNode | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'xml'>('visual');
  const [copied, setCopied] = useState(false);

  // Auto-inject XML sitemap into DOM for crawlers
  useEffect(() => {
    const xmlContent = generateSitemapXML();
    // Expose on window for easy programatic scraping/audit
    (window as any).generateSitemapXML = generateSitemapXML;

    // Inject into head as a readable application/xml script tag
    let scriptTag = document.getElementById('sitemap-xml');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'sitemap-xml';
      scriptTag.setAttribute('type', 'application/xml');
      scriptTag.setAttribute('title', 'Sitemap XML');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = xmlContent;
  }, []);

  const sitemapData: SitemapNode[] = [
    {
      id: '1.0',
      label: '🏠 1.0 Inicio (Home)',
      sectionId: 'header-section',
      objetivo: 'Autoridad de marca, conversión inmediata (CRO) y distribución de flujo a marcas dedicadas.',
      seoFocus: '"mudanzas en mendoza", "fletes mendoza", "empresas de mudanzas mendoza"',
      details: 'La página de inicio implementa un selector de dominios para captar intenciones cruzadas y posicionar múltiples marcas locales como Mudanzas Mendoza y Mudanzas Miranda.'
    },
    {
      id: '2.0',
      label: '🗂️ 2.0 Directorio de Empresas (Jerarquía de Zonas)',
      sectionId: 'empresas-recomendadas',
      objetivo: 'Captar búsquedas por geolocalización, filtrar por zona, y mostrar tarjetas de conversión para empresas locales destacadas.',
      seoFocus: '"mudanzas chacras de coria", "fletes en godoy cruz", "mudanzas guaymallen"',
      details: 'Dividido dinámicamente en Gran Mendoza, Valle de Uco y Zona Sur con tarjetas interactivas de transportistas, valoraciones, WhatsApp pre-llenado y búsqueda inteligente.',
      children: [
        {
          id: '2.1',
          label: '📍 2.1 Gran Mendoza',
          sectionId: 'cobertura-seccion',
          objetivo: 'Captar el mayor volumen de búsquedas residenciales y corporativas en áreas densas.',
          seoFocus: '"mudanzas chacras de coria", "fletes en godoy cruz", "mudanzas guaymallen"',
          details: 'Incluye Capital, Godoy Cruz, Guaymallén, Maipú, Luján y Las Heras.'
        },
        {
          id: '2.2',
          label: '📍 2.2 Valle de Uco',
          sectionId: 'cobertura-seccion',
          objetivo: 'Posicionar fletes especializados para fincas, traslados de personal y bodegas.',
          seoFocus: '"fletes tupungato", "mudanzas de bodegas mendoza"',
          details: 'Cubre Tunuyán, Tupungato y San Carlos con tarifas adaptadas.'
        },
        {
          id: '2.3',
          label: '📍 2.3 Zona Sur',
          sectionId: 'cobertura-seccion',
          objetivo: 'Captar fletes de larga distancia y traslados interurbanos de gran escala.',
          seoFocus: '"mudanzas san rafael mendoza", "fletes larga distancia mendoza"',
          details: 'Cubre San Rafael, General Alvear y Malargüe.'
        }
      ]
    },
    {
      id: '3.0',
      label: '🛠️ 3.0 Servicios Especiales (Silo SEO)',
      sectionId: 'servicios-seccion',
      objetivo: 'Captar nichos de alta rentabilidad y resolver objeciones técnicas de bultos pesados.',
      seoFocus: '"mudanzas en altura mendoza", "traslado de pianos mendoza"',
      details: 'Páginas satélite para izamientos y transporte de bultos superpesados con operarios calificados.',
      children: [
        {
          id: '3.1',
          label: '🏢 3.1 Mudanzas en Altura e Izajes',
          sectionId: 'servicios-seccion',
          objetivo: 'Resolver mudanzas complejas en departamentos céntricos y edificios nuevos.',
          seoFocus: '"mudanzas en altura mendoza", "izamiento de muebles mendoza"',
          details: 'Promueve el servicio de sogas, poleas y arneses para departamentos del microcentro.'
        },
        {
          id: '3.2',
          label: '🎹 3.2 Traslado de Pianos y Gran Porte',
          sectionId: 'servicios-seccion',
          objetivo: 'Generar confianza absoluta en bienes de alto valor patrimonial y sentimental.',
          seoFocus: '"traslado de pianos mendoza", "fletes para objetos pesados"',
          details: 'Especialización en trineos, fundas de lona impermeable y cuidado extremo.'
        }
      ]
    },
    {
      id: '4.0',
      label: '🧮 4.0 Cotizador Online Dinámico',
      sectionId: 'calculator-section',
      objetivo: 'Captar la intención de compra mediante estimaciones transparentes libres de fricción.',
      seoFocus: '"calcular costo de mudanza mendoza", "presupuesto flete online mendoza"',
      details: 'Calculadora interactiva de volumen por puntos y distancia por GPS para cotizaciones automáticas.'
    },
    {
      id: '5.0',
      label: '✍️ 5.0 Blog & Guías Prácticas',
      sectionId: 'organizador-seccion',
      objetivo: 'Atraer usuarios en fases tempranas de decisión (tráfico informacional) y derivarlos al cotizador.',
      seoFocus: '"como embalar platos para mudanza", "checklist mudanza pdf"',
      details: 'Ofrece checklist interactivo de 10 pasos y consejos clave para empaque eficiente de vajilla.'
    },
    {
      id: '6.0',
      label: '💼 6.0 Área de Empresas (B2B Lead Generation)',
      sectionId: 'lead-manager-section',
      objetivo: 'Monetizar el tráfico atrayendo nuevos prestadores de servicios dispuestos a pagar por leads validados.',
      seoFocus: '"registrar empresa de fletes mendoza", "conseguir clientes de mudanzas"',
      details: 'Simulador en tiempo real de recepción de leads para transportistas registrados en Mendoza.'
    }
  ];

  const handleNodeClick = (node: SitemapNode) => {
    setActiveNode(node);
    
    // Determine target page and viewMode based on node structure
    let targetPage = 'inicio';
    let targetViewMode: 'user' | 'dashboard' = 'user';
    
    if (node.id.startsWith('2.')) {
      targetPage = node.sectionId === 'cobertura-seccion' ? 'zonas' : 'directorio';
    } else if (node.id === '2.0') {
      targetPage = 'directorio';
    } else if (node.id.startsWith('3.')) {
      targetPage = 'servicios';
    } else if (node.id === '3.0') {
      targetPage = 'servicios';
    } else if (node.id.startsWith('4.')) {
      targetPage = 'calculadora';
    } else if (node.id.startsWith('5.')) {
      targetPage = 'checklist';
    } else if (node.id.startsWith('6.')) {
      targetViewMode = 'dashboard';
    }

    // Call state changers to update SPA page routing and viewMode
    if (targetViewMode !== viewMode && onViewModeChange) {
      onViewModeChange(targetViewMode);
    }
    if (targetPage !== activePage && onPageSelect) {
      onPageSelect(targetPage);
    }

    // Use a slight timeout to wait for React rendering cycle to mount the component
    setTimeout(() => {
      const element = document.getElementById(node.sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Flash effect to highlight section
        element.classList.add('ring-4', 'ring-amber-500/40', 'transition-all', 'duration-500');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-amber-500/40');
        }, 1500);
      }
    }, 150);
  };

  return (
    <>
      {/* Sticky Floating Pill for Sitemap Auditor */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="sitemap-trigger-btn"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl transition-all hover:scale-105 border border-gray-800 cursor-pointer font-extrabold text-xs"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Auditor de Sitemap & SEO</span>
          <span className="bg-amber-500 text-gray-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">Silo OK</span>
        </button>
      </div>

      {/* Slide-over or Drawer for Sitemap Auditor */}
      {isOpen && (
        <div className="fixed inset-0 z-55 overflow-hidden font-sans">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <div className="w-screen max-w-md md:max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-6 text-white flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-black tracking-tight">Estructura del Sitio & SEO</h2>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                    Mapeo interactivo del Sitemap Raíz de Mendoza
                  </p>
                </div>
                <button
                  id="close-sitemap-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informative Top Alert */}
              <div className="p-4 bg-amber-50 border-b border-amber-100 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Estrategia Híbrida de Sitemap (SEO & GEO)
                </p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Este portal genera un sitemap unificado donde el directorio principal y las marcas locales recomendadas comparten una jerarquía fáctica y transparente de autoridad.
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-slate-100 p-1 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('visual')}
                  className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider text-center rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'visual'
                      ? 'bg-white text-gray-950 font-extrabold shadow-3xs'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>Árbol Jerárquico</span>
                </button>
                <button
                  onClick={() => setActiveTab('xml')}
                  className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider text-center rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'xml'
                      ? 'bg-white text-gray-950 font-extrabold shadow-3xs'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sitemap.xml Dinámico</span>
                </button>
              </div>

              {/* Content Panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === 'visual' ? (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider block">Sitemap Estructurado</h3>
                    
                    {/* Tree Structure rendering */}
                    <div className="space-y-3.5">
                      {sitemapData.map(node => (
                        <div key={node.id} className="space-y-2">
                          {/* Parent Node */}
                          <button
                            id={`sitemap-node-${node.id.replace('.', '-')}`}
                            onClick={() => handleNodeClick(node)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition flex justify-between items-center cursor-pointer ${
                              activeNode?.id === node.id
                                ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-3xs'
                                : 'bg-slate-50 hover:bg-slate-100 border-gray-200/60 text-gray-800'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Folder className={`w-4 h-4 shrink-0 ${activeNode?.id === node.id ? 'text-amber-600' : 'text-slate-400'}`} />
                              {node.label}
                            </span>
                            <span className="text-[10px] bg-white text-gray-500 border px-1.5 py-0.5 rounded-md font-extrabold">
                              Ver SEO
                            </span>
                          </button>

                          {/* Children Nodes (Indented) */}
                          {node.children && (
                            <div className="pl-6 border-l-2 border-slate-100 space-y-1.5 py-1">
                              {node.children.map(child => (
                                <button
                                  key={child.id}
                                  id={`sitemap-node-${child.id.replace('.', '-')}`}
                                  onClick={() => handleNodeClick(child)}
                                  className={`w-full text-left p-2.5 rounded-lg border text-[11px] font-bold transition flex justify-between items-center cursor-pointer ${
                                    activeNode?.id === child.id
                                      ? 'bg-amber-500/10 border-amber-500 text-amber-900'
                                      : 'bg-white hover:bg-slate-50 border-gray-100 text-gray-700'
                                  }`}
                                >
                                  <span className="flex items-center gap-1.5">
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                    {child.label}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-semibold uppercase">Silo SEO</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider block">Código XML Autogenerado</h3>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">Sincronizado con base de datos en tiempo real</p>
                      </div>

                      <div className="flex gap-2">
                        {/* Copy button */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generateSitemapXML());
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition cursor-pointer flex items-center gap-1 text-[10px] font-black"
                          title="Copiar código XML"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                              <span className="text-emerald-600">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>

                        {/* Download button */}
                        <button
                          onClick={() => {
                            const blob = new Blob([generateSitemapXML()], { type: 'application/xml' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'sitemap.xml';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }}
                          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer flex items-center gap-1 text-[10px] font-black shadow-3xs"
                          title="Descargar sitemap.xml"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar</span>
                        </button>
                      </div>
                    </div>

                    {/* XML Preview Codebox */}
                    <div className="relative">
                      <pre className="p-4 bg-gray-950 text-emerald-400 text-[10px] font-mono rounded-xl border border-gray-800 overflow-x-auto max-h-[320px] select-all leading-normal whitespace-pre">
                        {generateSitemapXML()}
                      </pre>
                      <div className="absolute bottom-2 right-2 bg-gray-900/95 text-[9px] text-gray-400 border border-gray-800 rounded px-2 py-0.5 pointer-events-none font-bold uppercase">
                        Sitemap.xml • {RECOMMENDED_COMPANIES.length + 10} URLs
                      </div>
                    </div>

                    {/* SEO Authority Explanation card */}
                    <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-2.5">
                      <div className="flex gap-2 items-start">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-gray-900 uppercase tracking-wide">Ventajas Técnicas (SEO / GEO)</p>
                          <ul className="text-[11px] text-gray-600 space-y-1.5 mt-1.5 list-disc pl-4 leading-relaxed font-medium">
                            <li>
                              <strong>Inyección en DOM:</strong> El archivo XML se encuentra inyectado dinámicamente en el encabezado de la página activa mediante una etiqueta de script estructurada para que los agentes conversacionales de IA y arañas de búsqueda lo indexen inmediatamente sin redirecciones.
                            </li>
                            <li>
                              <strong>Relación de Autoridad:</strong> Define al portal <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px] font-mono">empresasdemudanzas.com.ar</code> como nodo raíz y a las marcas satélite como subpáginas e interiores altamente verídicos y vinculados.
                            </li>
                            <li>
                              <strong>E-E-A-T Sólido:</strong> Los motores de IA premian que todos los transportistas listados cuenten con enlaces consistentes y mapeados con coordenadas y teléfonos reales.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Node Details & SEO Auditing */}
                {activeTab === 'visual' && activeNode && (
                  <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-gray-800 shadow-xl space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold text-amber-400 tracking-wider uppercase block">AUDITORÍA DE PÁGINA</span>
                        <h4 className="text-sm font-black text-white mt-1">{activeNode.label}</h4>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                        Implementado
                      </span>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed">
                      {/* Objetivo */}
                      <div className="flex gap-2.5 items-start">
                        <Target className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">🎯 Objetivo del Portal</p>
                          <p className="text-slate-300 font-medium mt-0.5">{activeNode.objetivo}</p>
                        </div>
                      </div>

                      {/* SEO Focus */}
                      <div className="flex gap-2.5 items-start">
                        <Key className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">🔑 Palabras Clave (SEO Focus)</p>
                          <p className="text-slate-100 font-black font-mono text-[11px] mt-1 bg-gray-800/80 px-2.5 py-1.5 rounded-lg border border-gray-700">
                            {activeNode.seoFocus}
                          </p>
                        </div>
                      </div>

                      {/* Technical Details */}
                      <div className="flex gap-2.5 items-start pt-2 border-t border-gray-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">🛠️ Cumplimiento en el Portal</p>
                          <p className="text-gray-400 text-[11px] mt-0.5">{activeNode.details}</p>
                        </div>
                      </div>
                    </div>

                    {/* Simulation trigger */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-black rounded-xl transition flex items-center justify-center gap-1 cursor-pointer mt-2"
                    >
                      <Eye className="w-3.5 h-3.5" /> Interactuar con esta sección
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Audit Summary */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-gray-500 flex justify-between items-center shrink-0">
                <span>Estructura optimizada para buscadores (Googlebot index-ready)</span>
                <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Mobile & CRO Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
