export interface RouteConfig {
  id: string;
  label: string;
  prefetchKeys?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export const ALL_ROUTES: RouteConfig[] = [
  {
    id: 'inicio',
    label: 'Inicio',
    seoTitle: 'Mudanzas Mendoza - Portal SEO Local',
    seoDescription: 'Portal de mudanzas en Mendoza. Calcula m³ de tu mudanza en tiempo real, compara empresas verificadas y solicita presupuestos.',
  },
  {
    id: 'calculadora',
    label: 'Calculadora',
    prefetchKeys: ['QuoteCalculator'],
    seoTitle: 'Calculadora de Mudanzas - Estima m³ en Mendoza',
    seoDescription: 'Calcula el volumen en metros cúbicos de tus muebles y obtén un presupuesto de mudanza estimado al instante.',
  },
  {
    id: 'servicios',
    label: 'Servicios',
    prefetchKeys: ['ServicesSection'],
    seoTitle: 'Tarifas y Servicios de Mudanzas en Mendoza',
    seoDescription: 'Conoce los precios sugeridos para traslados, carga, descarga y embalaje profesional en toda la provincia.',
  },
  {
    id: 'directorio',
    label: 'Directorio',
    prefetchKeys: ['RecommendedCompanies', 'DepartmentsGrid'],
    seoTitle: 'Empresas de Mudanzas Recomendadas en Mendoza',
    seoDescription: 'Directorio completo de empresas recomendadas y verificadas de mudanzas en Mendoza.',
  },
  {
    id: 'zonas',
    label: 'Zonas',
    prefetchKeys: ['DepartmentsGrid'],
    seoTitle: 'Zonas de Cobertura de Mudanzas Mendoza',
    seoDescription: 'Consulta el alcance del servicio de mudanzas en Godoy Cruz, Guaymallén, Luján de Cuyo, Maipú y San Rafael.',
  },
  {
    id: 'checklist',
    label: 'Checklist',
    prefetchKeys: ['Checklist'],
    seoTitle: 'Checklist Organizador de Mudanza - Plan paso a paso',
    seoDescription: 'Planifica y organiza tu mudanza semana a semana con nuestra lista de control interactiva y consejos de embalaje.',
  },
  {
    id: 'faq',
    label: 'FAQ',
    prefetchKeys: ['FAQSection'],
    seoTitle: 'Preguntas Frecuentes sobre Mudanzas y Traslados',
    seoDescription: 'Resolvemos tus dudas sobre seguros de traslado, mudanzas compartidas, peones de carga y facturación.',
  },
  {
    id: 'contacto',
    label: 'Contacto',
    seoTitle: 'Contacto - Mudanzas Mendoza',
    seoDescription: 'Ponte en contacto con empresas autorizadas o con las oficinas centrales de mudanza para un servicio personalizado.',
  },
];

export const ROUTES: RouteConfig[] = ALL_ROUTES.filter(r => ['inicio', 'calculadora', 'directorio', 'contacto'].includes(r.id));

export const VALID_PAGE_IDS = ALL_ROUTES.map(r => r.id);

export function getRouteById(id: string): RouteConfig | undefined {
  return ALL_ROUTES.find(r => r.id === id);
}

export function getPageFromPath(path: string): string {
  const cleanPath = path.replace(/^\/|\/$/g, '');
  return VALID_PAGE_IDS.includes(cleanPath) ? cleanPath : 'inicio';
}
