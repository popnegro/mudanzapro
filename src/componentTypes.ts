/**
 * Defines the keys for dynamically loaded components.
 * This centralized type definition prevents circular dependencies when components
 * need to reference the available lazy-loaded modules.
 */
export type ComponentLoaderKeys =
  | "Hero"
  | "QuoteCalculator"
  | "DepartmentsGrid"
  | "ServicesSection"
  | "Checklist"
  | "FAQSection"
  | "RecommendedCompanies"
  | "TestimonialsSection";
