import React, { useState, useEffect, useRef } from "react";
import { BrandConfig, BrandId } from "../types";
import { Menu, X, Truck, MessageSquare } from "lucide-react";
import { ComponentLoaderKeys } from "../componentTypes";
import { ROUTES, getRouteById } from "../routes";

interface HeaderProps {
  activeBrand: BrandConfig;
  onBrandChange: (brandId: BrandId) => void;
  viewMode: "user" | "dashboard";
  onViewModeChange: (mode: "user" | "dashboard") => void;
  leadsCount: number;
  activePage: string;
  onActivePageChange: (page: string) => void;
  onPrefetch?: (componentName: ComponentLoaderKeys) => void;
}

export default function Header({
  activeBrand,
  activePage,
  onActivePageChange,
  onPrefetch,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const handlePagePrefetch = (page: string) => {
    if (!onPrefetch) return;
    const route = getRouteById(page);
    route?.prefetchKeys?.forEach((key) => onPrefetch(key));
  };

  const navigateTo = (page: string) => {
    onActivePageChange(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
  }, [isMobileMenuOpen]);

  return (
    <header
      id="header-section"
      className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigateTo("inicio")}
            className="flex items-center gap-3 shrink-0 text-left rounded-xl transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
            aria-label={`Volver a la página de inicio de ${activeBrand.name}`}
          >
            <span className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${activeBrand.primaryColor} text-white shadow-md`}>
              <Truck className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-base sm:text-xl font-extrabold tracking-tight text-slate-900">
                {activeBrand.name}
              </span>
              <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-500">
                {activeBrand.tagline}
              </span>
            </span>
            <span className="sm:hidden text-base font-extrabold tracking-tight text-slate-900">
              {activeBrand.name}
            </span>
          </button>

          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2"
            aria-label="Navegación principal"
          >
            {ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => navigateTo(route.id)}
                onMouseEnter={() => handlePagePrefetch(route.id)}
                onFocus={() => handlePagePrefetch(route.id)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                  activePage === route.id
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
                aria-label={`Ir a la sección de ${route.label}`}
                aria-current={activePage === route.id ? "page" : undefined}
              >
                {route.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <button
              onClick={() => navigateTo("calculadora")}
              onMouseEnter={() => handlePagePrefetch("calculadora")}
              onFocus={() => handlePagePrefetch("calculadora")}
              className="header-cta-button"
              aria-label="Abrir cotizador de mudanza"
            >
              <MessageSquare className="h-4 w-4" />
              Cotizar
            </button>
          </div>

          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 lg:hidden"
            aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-drawer-navigation"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-navigation"
          ref={mobileMenuRef}
          className="absolute left-0 right-0 top-full z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-5 shadow-xl lg:hidden sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación móvil"
          tabIndex={-1}
        >
          <nav className="flex flex-col gap-1.5" aria-label="Navegación móvil">
            {ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => navigateTo(route.id)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  activePage === route.id
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                aria-label={`Ir a sección ${route.label}`}
                aria-current={activePage === route.id ? "page" : undefined}
              >
                {route.label}
              </button>
            ))}
          </nav>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <button
              onClick={() => navigateTo("calculadora")}
              className="header-cta-button flex w-full justify-center"
            >
              <MessageSquare className="h-4 w-4" />
              Cotizar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
