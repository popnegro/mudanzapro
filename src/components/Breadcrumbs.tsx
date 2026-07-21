import React from "react";
import { Home, ChevronRight, Sparkles, Globe } from "lucide-react";
import { BrandConfig, BrandId } from "../types";

interface BreadcrumbsProps {
  activeBrand: BrandConfig;
  activeBrandId: BrandId;
  activePage: string;
  onBrandSelect: (brandId: BrandId) => void;
  onPageSelect: (pageName: string) => void;
}

export default function Breadcrumbs({
  activeBrand,
  activeBrandId,
  activePage,
  onBrandSelect,
  onPageSelect,
}: BreadcrumbsProps) {
  // Map page values to friendly display text
  const getPageLabel = (page: string): string => {
    switch (page) {
      case "calculadora":
        return "Cotizador Virtual";
      case "servicios":
        return "Servicios y Tarifas";
      case "directorio":
        return "Directorio de Empresas";
      case "zonas":
        return "Zonas de Cobertura";
      case "checklist":
        return "Checklist Organizador";
      case "faq":
        return "Preguntas Frecuentes";
      case "contacto":
        return "Contacto Directo";
      case "inicio":
      default:
        return "Inicio";
    }
  };

  // Build breadcrumb items based on hierarchy
  // Item structure: { label: string; action: () => void; isLink: boolean; url: string }
  const items = [];

  // 1. Root: Directory Home (empresasdemudanzas.com.ar)
  items.push({
    label: "Empresas de Mudanzas",
    url: "https://empresasdemudanzas.com.ar",
    isLink: activeBrandId !== "empresas" || activePage !== "inicio",
    action: () => {
      onBrandSelect("empresas");
      onPageSelect("inicio");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    icon: Home,
  });

  // 2. Intermediate: Active Brand (Mendoza / Miranda / etc.) if not 'empresas'
  if (activeBrandId !== "empresas") {
    items.push({
      label:
        activeBrandId === "mendoza" ? "Mudanzas Mendoza" : "Mudanzas Miranda",
      url: `https://${activeBrandId === "mendoza" ? "mudanzasmendoza.com.ar" : "mudanzasmiranda.com.ar"}`,
      isLink: activePage !== "inicio",
      action: () => {
        onBrandSelect(activeBrandId);
        onPageSelect("inicio");
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      icon: Globe,
    });
  }

  // 3. Leaf: Active Page within the active brand (if not 'inicio')
  if (activePage !== "inicio") {
    const brandPath = activeBrandId === "empresas" ? "" : `/${activeBrandId}`;
    items.push({
      label: getPageLabel(activePage),
      url: `https://empresasdemudanzas.com.ar${brandPath}/${activePage}`,
      isLink: false,
      action: () => {},
      icon: null,
    });
  }

  return (
    <div
      id="dynamic-breadcrumbs-container"
      className="bg-white border-b border-gray-100 py-3 px-4 sm:px-6 lg:px-8"
    >
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs"
      >
        {/* Schema-friendly list */}
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="flex flex-wrap items-center gap-2 text-gray-500 font-medium"
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === items.length - 1;

            return (
              <li
                key={idx}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center gap-2"
              >
                {/* Separator icon (not on first item) */}
                {idx > 0 && (
                  <ChevronRight
                    className="w-3.5 h-3.5 text-gray-300 shrink-0"
                    aria-hidden="true"
                  />
                )}

                {item.isLink ? (
                  <a
                    href={item.url}
                    onClick={(e) => {
                      e.preventDefault();
                      item.action();
                    }}
                    itemProp="item"
                    className="hover:text-amber-600 transition flex items-center gap-1.5 focus:outline-none focus:underline"
                  >
                    {Icon && (
                      <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    )}
                    <span itemProp="name">{item.label}</span>
                  </a>
                ) : (
                  <span
                    className={`flex items-center gap-1.5 ${isLast ? "text-gray-900 font-bold" : "text-gray-500"}`}
                    itemProp="item"
                  >
                    {Icon && (
                      <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    )}
                    <span itemProp="name">{item.label}</span>
                  </span>
                )}

                {/* Position meta-tag for SEO schema */}
                <meta itemProp="position" content={(idx + 1).toString()} />
              </li>
            );
          })}
        </ol>

        {/* Local authority indicator badge for indexers and users */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200/50 rounded-full px-2.5 py-1 text-[10px] font-black uppercase text-gray-500 tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <span>
            Nodo de Autoridad:{" "}
            {activeBrandId === "empresas"
              ? "Directorio Central"
              : `Socio Verificado (${activeBrand.name})`}
          </span>
        </div>
      </nav>
    </div>
  );
}
