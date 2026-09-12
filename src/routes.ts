import { ComponentLoaderKeys } from "./componentTypes";

export interface RouteConfig {
  id: string;
  label: string;
  prefetchKeys?: ComponentLoaderKeys[];
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * MudanzaPro is the action/planning layer of the cobranding architecture:
 * Mudanzas en Mendoza = QUÉ SABER
 * MudanzaPro = QUÉ HACER / RESOLVER
 * Mudanzas Miranda = QUIÉN / proveedor
 *
 * This route map therefore avoids positioning the app as a provider directory.
 */
export const ALL_ROUTES: RouteConfig[] = [
  {
    id: "inicio",
    label: "Inicio",
    seoTitle: "MudanzaPro — Planificá y prepará tu mudanza en Mendoza",
    seoDescription:
      "Herramientas para planificar una mudanza en Mendoza: estimación, servicios, zonas, checklist y preparación de la solicitud de presupuesto.",
  },
  {
    id: "calculadora",
    label: "Calculadora",
    prefetchKeys: ["QuoteCalculator"],
    seoTitle: "Calculadora de Mudanza en Mendoza | MudanzaPro",
    seoDescription:
      "Estimá el volumen de tu mudanza y organizá los datos necesarios para solicitar un presupuesto.",
  },
  {
    id: "servicios",
    label: "Servicios",
    prefetchKeys: ["ServicesSection"],
    seoTitle: "Servicios de Mudanza en Mendoza | MudanzaPro",
    seoDescription:
      "Conocé los tipos de servicios y variables que conviene considerar antes de pedir una cotización.",
  },
  {
    id: "directorio",
    label: "Soluciones",
    prefetchKeys: ["RecommendedCompanies", "DepartmentsGrid"],
    seoTitle: "Soluciones para tu Mudanza en Mendoza | MudanzaPro",
    seoDescription:
      "Elegí el próximo paso: estimar, planificar y preparar tu solicitud de presupuesto. MudanzaPro no es un directorio de prestadores.",
  },
  {
    id: "zonas",
    label: "Zonas",
    prefetchKeys: ["DepartmentsGrid"],
    seoTitle: "Zonas y traslados en Mendoza | MudanzaPro",
    seoDescription:
      "Consultá información territorial útil para planificar un traslado dentro de Mendoza.",
  },
  {
    id: "checklist",
    label: "Checklist",
    prefetchKeys: ["Checklist"],
    seoTitle: "Checklist para organizar una mudanza | MudanzaPro",
    seoDescription:
      "Organizá tareas, embalaje y decisiones de tu mudanza con una lista de control paso a paso.",
  },
  {
    id: "faq",
    label: "FAQ",
    prefetchKeys: ["FAQSection"],
    seoTitle: "Preguntas frecuentes sobre mudanzas | MudanzaPro",
    seoDescription:
      "Respuestas prácticas para preparar y solicitar un presupuesto de mudanza.",
  },
  {
    id: "contacto",
    label: "Presupuesto",
    seoTitle: "Solicitar presupuesto de mudanza | MudanzaPro",
    seoDescription:
      "Prepará los datos de tu traslado para avanzar hacia una solicitud de presupuesto.",
  },
];

export const ROUTES: RouteConfig[] = ALL_ROUTES.filter((r) =>
  ["inicio", "calculadora", "servicios", "directorio", "contacto"].includes(r.id),
);

export const VALID_PAGE_IDS = ALL_ROUTES.map((r) => r.id);

export function getRouteById(id: string): RouteConfig | undefined {
  return ALL_ROUTES.find((r) => r.id === id);
}

export function getPageFromPath(path: string): string {
  const cleanPath = path.replace(/^\/|\/$/g, "");
  return VALID_PAGE_IDS.includes(cleanPath) ? cleanPath : "inicio";
}
