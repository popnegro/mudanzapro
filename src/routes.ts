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
      "Herramientas para planificar una mudanza en Mendoza: recorrido, tamaño, servicios, checklist y preparación de la solicitud de presupuesto.",
  },
  {
    id: "calculadora",
    label: "Calcular",
    prefetchKeys: ["QuoteCalculator"],
    seoTitle: "Calculá tu mudanza en Mendoza | MudanzaPro",
    seoDescription:
      "Calculá el recorrido de tu mudanza con datos de ruta y prepará la información necesaria para solicitar presupuesto a Mudanzas Miranda.",
  },
  {
    id: "servicios",
    label: "Servicios",
    prefetchKeys: ["ServicesSection"],
    seoTitle: "Guía de servicios de mudanza en Mendoza | MudanzaPro",
    seoDescription:
      "Entendé qué puede incluir una mudanza y qué conviene considerar antes de solicitar un presupuesto.",
  },
  {
    id: "directorio",
    label: "Mudanzas Miranda",
    prefetchKeys: ["RecommendedCompanies"],
    seoTitle: "Mudanzas Miranda | Solicitar presupuesto | MudanzaPro",
    seoDescription:
      "Prepará los datos de tu traslado en MudanzaPro y avanzá hacia una solicitud de presupuesto a Mudanzas Miranda.",
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
