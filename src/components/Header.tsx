import React, { useState, useEffect, useRef } from "react";
import { BrandConfig, BrandId } from "../types"; // Added useRef
import {
  Truck,
  Menu,
  X,
  Globe,
  Calculator,
  Award,
  ClipboardList,
  HelpCircle,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Star,
  ChevronRight,
} from "lucide-react";
import { ComponentLoaderKeys } from "../componentTypes";
import { ROUTES, getRouteById } from "../routes";

const routeIcons: Record<
  string,
  {
    icon: React.ComponentType<any>;
    colorClass: string;
    bgClass: string;
    label: string;
  }
> = {
  inicio: {
    icon: Globe,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-100",
    label: "Página de Inicio",
  },
  calculadora: {
    icon: Calculator,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-100",
    label: "Cotizador de Mudanzas",
  },
  directorio: {
    icon: Award,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-100",
    label: "Empresas Verificadas",
  },
  zonas: {
    icon: MapPin,
    colorClass: "text-rose-600",
    bgClass: "bg-rose-100",
    label: "Zonas de Cobertura",
  },
  checklist: {
    icon: ClipboardList,
    colorClass: "text-orange-600",
    bgClass: "bg-orange-100",
    label: "Checklist Organizador",
  },
  faq: {
    icon: HelpCircle,
    colorClass: "text-sky-600",
    bgClass: "bg-sky-100",
    label: "Preguntas Frecuentes",
  },
  contacto: {
    icon: Phone,
    colorClass: "text-teal-600",
    bgClass: "bg-teal-100",
    label: "Hablemos Directo",
  },
};

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
  const mobileMenuRef = useRef<HTMLDivElement>(null); // Ref for the mobile menu container
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null); // Ref for the hamburger button
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to prefetch the correct component chunk based on target page to minimize TTI/FID/INP latency
  const handlePagePrefetch = (page: string) => {
    if (!onPrefetch) return;
    const route = getRouteById(page);
    if (route?.prefetchKeys) {
      route.prefetchKeys.forEach((key) => onPrefetch(key));
    }
  };

  // Theme-specific visual helpers
  const brandThemes = {
    mendoza: {
      hoverText: "hover:text-amber-600",
      activeText:
        "text-amber-600 font-extrabold border-amber-500 bg-amber-50/50",
      activeBorder: "border-amber-600",
      pillBg: "bg-amber-50 text-amber-800 border-amber-200",
    },
    miranda: {
      hoverText: "hover:text-sky-600",
      activeText: "text-sky-600 font-extrabold border-sky-500 bg-sky-50/50",
      activeBorder: "border-sky-600",
      pillBg: "bg-sky-50 text-sky-800 border-sky-200",
    },
    empresas: {
      hoverText: "hover:text-emerald-600",
      activeText:
        "text-emerald-600 font-extrabold border-emerald-500 bg-emerald-50/50",
      activeBorder: "border-emerald-600",
      pillBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
  };

  const currentTheme = brandThemes[activeBrand.id] || brandThemes.mendoza;

  const navigateTo = (page: string) => {
    onActivePageChange(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Effect for handling outside clicks, Escape key, and body scroll lock
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the click is outside the menu and outside the button that opens it
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
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling on the body
      // Set focus to the menu container itself to enable keyboard navigation within it
      mobileMenuRef.current?.focus();

      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.body.style.overflow = ""; // Restore scrolling on the body
      mobileMenuButtonRef.current?.focus(); // Return focus to the button that opened the menu, if it exists
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = ""; // Ensure scroll is restored when component unmounts or state changes
    };
  }, [isMobileMenuOpen]); // Re-run effect when isMobileMenuOpen changes

  return (
    <header
      id="header-section"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      {/* High-converting Promo Announcement Bar */}
      <div className="bg-amber-500 text-gray-950 text-[11px] font-black py-2 px-4 text-center flex items-center justify-center gap-2 tracking-wide uppercase shadow-inner">
        <Sparkles className="w-4 h-4 text-gray-950" />
        <span>
          ¡OFERTA DE TEMPORADA! 15% de Descuento en tu mudanza de Lunes a Jueves
          reservando hoy • Precios fijos garantizados
        </span>
        <span className="hidden sm:inline bg-gray-950 text-amber-400 text-[9px] px-2 py-0.5 rounded-full font-black ml-1.5">
          CUPOS LIMITADOS
        </span>
      </div>
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Info */}
          <button
            onClick={() => navigateTo("inicio")}
            className="flex items-center gap-3 shrink-0 text-left cursor-pointer focus:outline-none hover:opacity-95"
            aria-label={`Volver a la página de inicio de ${activeBrand.name}`}
          >
            <div
              className={`p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br ${activeBrand.primaryColor} text-white shadow-md`}
            >
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-gray-900">
                  {activeBrand.name}
                </span>
                <span className="hidden sm:inline-block text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  {activeBrand.domain}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] sm:text-xs text-gray-500">
                <Star
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 stroke-amber-400"
                  aria-hidden="true"
                />
                <span className="font-semibold text-gray-800">
                  {activeBrand.avgRating}
                </span>
                <span className="hidden md:inline">
                  ({activeBrand.reviewCount} opiniones de mendocinos)
                </span>
                <span className="md:hidden">
                  ({activeBrand.reviewCount} reviews)
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links - Centered & Optimal */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2 text-[10px] xl:text-xs font-extrabold tracking-wider uppercase text-gray-500"
            aria-label="Navegación principal"
          >
            {ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => navigateTo(route.id)}
                onMouseEnter={() => handlePagePrefetch(route.id)}
                onFocus={() => handlePagePrefetch(route.id)}
                className={`transition-all duration-200 px-3 py-2 rounded-xl cursor-pointer ${
                  activePage === route.id
                    ? currentTheme.activeText
                    : `text-gray-500 ${currentTheme.hoverText}`
                }`}
                aria-label={`Ir a la sección de ${route.label}`}
                aria-current={activePage === route.id ? "page" : undefined}
              >
                {route.label}
              </button>
            ))}
          </nav>

          {/* Actions & Responsive Hamburger (Right side) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Call Center Info (Hidden on tiny phones) */}
            <a
              id="call-phone"
              href={`tel:${activeBrand.phone.replace(/\s+/g, "")}`}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 text-gray-700 transition"
              aria-label={`Llamar telefónicamente a ${activeBrand.name} al número ${activeBrand.phone}`}
            >
              <Phone
                className="w-4 h-4 text-emerald-600 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] text-gray-400 font-bold leading-none uppercase">
                  Llamar Ahora
                </p>
                <p className="font-extrabold text-gray-900 text-xs mt-0.5">
                  {activeBrand.phone}
                </p>
              </div>
            </a>

            {/* Premium CTA Button (Hidden on tiny phones) */}
            <button
              onClick={() => navigateTo("calculadora")}
              onMouseEnter={() => handlePagePrefetch("calculadora")}
              onFocus={() => handlePagePrefetch("calculadora")}
              className="hidden xs:flex px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-black text-xs hover:from-amber-600 hover:to-amber-700 shadow-sm hover:shadow-md transition-all duration-200 uppercase tracking-wider items-center gap-1.5 ring-2 ring-amber-500/10 cursor-pointer"
              aria-label="Calcular volumen logístico estimado de mudanza"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Cotizar
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-btn" // Add id for ref
              ref={mobileMenuButtonRef} // Attach ref here
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition focus:outline-none cursor-pointer"
              aria-label={
                isMobileMenuOpen
                  ? "Cerrar menú de navegación"
                  : "Abrir menú de navegación"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-drawer-navigation"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Optimal for mobile clients) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-navigation" // Add id for ref
          ref={mobileMenuRef} // Attach ref here
          className="lg:hidden border-t border-gray-100 bg-white shadow-lg py-5 px-6 space-y-6 animate-fade-in divide-y divide-gray-100"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación móvil"
          tabIndex={-1} // Make the div focusable for initial focus
        >
          {/* Primary Navigation Stack */}
          <div className="space-y-1.5">
            <p
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3"
              id="mobile-nav-title"
            >
              Navegación del Portal
            </p>

            {ROUTES.map((route) => {
              const config = routeIcons[route.id] || routeIcons.inicio;
              const IconComp = config.icon;
              return (
                <button
                  key={route.id}
                  onClick={() => navigateTo(route.id)}
                  className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-2xl text-left transition ${
                    activePage === route.id
                      ? "bg-slate-100 text-gray-950 font-black"
                      : "hover:bg-slate-50 text-gray-700"
                  }`}
                  aria-label={`Ir a sección ${config.label}`}
                  aria-current={activePage === route.id ? "page" : undefined}
                >
                  <div
                    className={`p-2 rounded-xl ${activePage === route.id ? `${config.bgClass} ${config.colorClass}` : "bg-slate-100 text-gray-500"}`}
                  >
                    <IconComp className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span>{config.label}</span>
                  <ChevronRight
                    className="w-4 h-4 ml-auto text-gray-400"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* Quick Contacts Panel */}
          <div className="pt-5 space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Contacto Directo
            </p>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${activeBrand.phone.replace(/\s+/g, "")}`}
                className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 border border-gray-100 rounded-2xl text-center transition"
                aria-label={`Llamar por teléfono al ${activeBrand.phone}`}
              >
                <Phone
                  className="w-5 h-5 text-emerald-600 mb-1"
                  aria-hidden="true"
                />
                <span className="text-[10px] font-black text-gray-900 uppercase">
                  Llamar Tel
                </span>
                <span className="text-[8px] text-gray-400 font-bold truncate max-w-full mt-0.5">
                  {activeBrand.phone}
                </span>
              </a>
              <a
                href={`mailto:${activeBrand.email}`}
                className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 border border-gray-100 rounded-2xl text-center transition"
                aria-label={`Enviar correo a ${activeBrand.email}`}
              >
                <Mail
                  className="w-5 h-5 text-amber-500 mb-1"
                  aria-hidden="true"
                />
                <span className="text-[10px] font-black text-gray-900 uppercase">
                  Enviar Email
                </span>
                <span className="text-[8px] text-gray-400 font-bold truncate max-w-full mt-0.5">
                  {activeBrand.email}
                </span>
              </a>
            </div>

            <button
              onClick={() => navigateTo("calculadora")}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-black text-xs text-center rounded-2xl shadow-md hover:from-amber-600 hover:to-amber-700 transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              aria-label="Comenzar cotización virtual de volumen"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" /> ¡Cotizar
              Mudanza Ahora!
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
