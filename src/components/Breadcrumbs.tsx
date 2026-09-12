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
  const getPageLabel = (page: string): string => {
    switch (page) {
      case "calculadora":
        return "Cotizador Virtual";
      case "servicios":
        return "Guía de servicios";
      case "directorio":
        return "Soluciones";
      case "zonas":
        return "Zonas de Cobertura";
      case "checklist":
        return "Checklist Organizador";
      case "faq":
        return "Preguntas Frecuentes";
      case "contacto":
        return "Presupuesto";
      case "inicio":
      default:
        return "Inicio";
    }
  };

  const items = [];

  items.push({
    label: "MudanzaPro",
    url: "/",
    isLink: activePage !== "inicio",
    action: () => {
      onPageSelect("inicio");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    icon: Home,
  });

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

  if (activePage !== "inicio") {
    const brandPath = activeBrandId === "empresas" ? "" : `/${activeBrandId}`;
    items.push({
      label: getPageLabel(activePage),
      url: `${brandPath}/${activePage}`,
      isLink: false,
      action: () => {},
      icon: null,
    });
  }

  return (
    <div
      id="dynamic-breadcrumbs-container"
      className="border-b border-gray-100 bg-white px-4 py-3 sm:px-6 lg:px-8"
    >
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs"
      >
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="flex flex-wrap items-center gap-2 font-medium text-gray-500"
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
                {idx > 0 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 text-gray-300"
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
                    className="flex items-center gap-1.5 transition hover:text-emerald-700 focus:outline-none focus:underline"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
                    <span itemProp="name">{item.label}</span>
                  </a>
                ) : (
                  <span
                    className={`flex items-center gap-1.5 ${isLast ? "font-bold text-gray-900" : "text-gray-500"}`}
                    itemProp="item"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
                    <span itemProp="name">{item.label}</span>
                  </span>
                )}

                <meta itemProp="position" content={(idx + 1).toString()} />
              </li>
            );
          })}
        </ol>

        <div className="hidden items-center gap-1.5 rounded-full border border-slate-200/50 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500 sm:flex">
          <Sparkles className="h-3 w-3 shrink-0 text-emerald-600" />
          <span>Herramienta de planificación</span>
        </div>
      </nav>
    </div>
  );
}
