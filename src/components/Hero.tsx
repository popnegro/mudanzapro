import React, { useState, useEffect } from "react";
import { BrandConfig } from "../types";
import {
  ShieldCheck,
  Truck,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "./LazyImage";

const CAROUSEL_IMAGES = [
  {
    id: "truck",
    src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80",
    alt: "Camión de mudanza moderno de alta gama para transporte seguro",
    badge: "Unidades Con Monitoreo Satelital GPS",
    badgeColor: "bg-emerald-400",
  },
  {
    id: "packing",
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
    alt: "Personal profesional embalando vajilla y pertenencias en cajas de alta seguridad",
    badge: "Embalaje de Alta Protección y Cuidado",
    badgeColor: "bg-amber-400",
  },
  {
    id: "warehouse",
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    alt: "Logística integrada y distribución organizada para fletes y mudanzas de larga distancia",
    badge: "Logística Eficiente y Puntualidad Certificada",
    badgeColor: "bg-sky-400",
  },
];

interface HeroProps {
  activeBrand: BrandConfig;
  onPageSelect?: (page: string) => void;
  onPrefetch?: (componentName: string) => void;
}

export default function Hero({
  activeBrand,
  onPageSelect,
  onPrefetch,
}: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Optimization: Prefetch remaining slides after initial paint is complete
    CAROUSEL_IMAGES.forEach((img, idx) => {
      if (idx !== 0) {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = img.src;
        document.head.appendChild(link);
      }
    });
  }, []);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="relative overflow-hidden bg-slate-50 pt-8 pb-16 sm:pt-12 sm:pb-24 border-b border-gray-100">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs text-xs font-bold text-emerald-800">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {activeBrand.id === "empresas"
                  ? "Directorio de Transportistas Habilitados en Argentina"
                  : `Camiones Disponibles en ${activeBrand.id === "miranda" ? "Buenos Aires" : "Mendoza"} Hoy`}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {activeBrand.id === "empresas" ? (
                <>
                  Compara y Cotiza las Mejores{" "}
                  <span
                    className={`bg-gradient-to-r ${activeBrand.primaryColor} bg-clip-text text-transparent`}
                  >
                    Empresas de Mudanzas
                  </span>
                </>
              ) : (
                <>
                  Mudanzas Simples y sin Estrés en{" "}
                  <span
                    className={`bg-gradient-to-r ${activeBrand.primaryColor} bg-clip-text text-transparent`}
                  >
                    {activeBrand.id === "mendoza" ? "Mendoza" : "GBA y CABA"}
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              {activeBrand.tagline}. Evita sorpresas o demoras de último
              momento. Calculá el volumen en m³ de tu mudanza en 1 minuto y
              reservá tu fecha preferida.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                id="hero-calc-btn"
                href="/calculadora"
                onClick={(e) => {
                  e.preventDefault();
                  if (onPageSelect) {
                    onPageSelect("calculadora");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                onMouseEnter={() => onPrefetch && onPrefetch("QuoteCalculator")}
                onFocus={() => onPrefetch && onPrefetch("QuoteCalculator")}
                className={`px-8 py-4.5 rounded-2xl bg-gradient-to-r ${activeBrand.primaryColor} text-white font-extrabold text-sm text-center hover:opacity-95 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 tracking-wide uppercase cursor-pointer`}
                aria-label="Ir a la calculadora para cotizar el volumen de tu mudanza en un minuto"
              >
                <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />{" "}
                Cotizar Mudanza en 1 Minuto
              </a>
              <a
                id="hero-contact-btn"
                href="/directorio"
                onClick={(e) => {
                  e.preventDefault();
                  if (onPageSelect) {
                    onPageSelect("directorio");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                onMouseEnter={() => {
                  if (onPrefetch) {
                    onPrefetch("RecommendedCompanies");
                    onPrefetch("DepartmentsGrid");
                  }
                }}
                onFocus={() => {
                  if (onPrefetch) {
                    onPrefetch("RecommendedCompanies");
                    onPrefetch("DepartmentsGrid");
                  }
                }}
                className="px-8 py-4.5 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm text-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                aria-label="Ver listado de empresas transportistas verificadas y recomendadas"
              >
                Ver Transportistas Recomendados
              </a>
            </div>

            {/* Reassurance Badges Row for High Trust / Low Friction */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-200/80">
              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100 shadow-3xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900">
                    Tarifas Congeladas
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    Precio final escrito en cotización
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100 shadow-3xs">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900">
                    Seguro de Carga
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    Pólizas Allianz Seguros Mendoza
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100 shadow-3xs">
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-800 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900">
                    Puntualidad Certificada
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    Garantía de salida a término
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust rating panel & Optimized Image Carousel */}
          <div className="lg:col-span-5 h-full">
            <div
              className="relative h-72 sm:h-96 lg:h-full lg:min-h-[440px] rounded-3xl overflow-hidden border border-gray-200/50 shadow-md group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              role="region"
              aria-label="Galería interactiva de servicios e infraestructura"
            >
              {/* Slides */}
              <div className="absolute inset-0 w-full h-full bg-slate-900">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <LazyImage
                      src={CAROUSEL_IMAGES[currentSlide].src}
                      alt={CAROUSEL_IMAGES[currentSlide].alt}
                      referrerPolicy="no-referrer"
                      loading={currentSlide === 0 ? "eager" : "lazy"}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Gradient Overlay to preserve readability & aesthetic pairing */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Navigation Arrows (Visible on hover on desktop, always visible on mobile) */}
              <button
                onClick={() =>
                  setCurrentSlide(
                    (prev) =>
                      (prev - 1 + CAROUSEL_IMAGES.length) %
                      CAROUSEL_IMAGES.length,
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white backdrop-blur-xs transition duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 pointer-events-auto cursor-pointer focus:outline-none border border-white/5 shadow-md flex items-center justify-center z-10"
                aria-label="Ver imagen anterior de la galería"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white backdrop-blur-xs transition duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 pointer-events-auto cursor-pointer focus:outline-none border border-white/5 shadow-md flex items-center justify-center z-10"
                aria-label="Ver siguiente imagen de la galería"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Floating Dynamic Badge based on current slide */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
                <span className="text-[10px] sm:text-xs font-black text-white bg-slate-950/85 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/10 uppercase tracking-wider flex items-center gap-2 shadow-md">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${CAROUSEL_IMAGES[currentSlide].badgeColor} animate-pulse`}
                  />
                  {CAROUSEL_IMAGES[currentSlide].badge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
