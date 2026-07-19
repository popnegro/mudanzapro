import React from 'react';
import { BrandConfig } from '../types';
import { ShieldCheck, Truck, Clock, Sparkles, Star, MapPin, Compass } from 'lucide-react';

interface HeroProps {
  activeBrand: BrandConfig;
  onZoneSelect?: (zone: string) => void;
  onPageSelect?: (page: string) => void;
  onPrefetch?: (componentName: string) => void;
}

export default function Hero({ activeBrand, onZoneSelect, onPageSelect, onPrefetch }: HeroProps) {
  const handleQuickZoneClick = (zone: string) => {
    if (onZoneSelect) {
      onZoneSelect(zone);
      
      // Smooth scroll to the recommended companies list
      const element = document.getElementById('empresas-recomendadas');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  return (
    <div className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 border-b border-gray-100">
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
                {activeBrand.id === 'empresas' 
                  ? 'Directorio de Transportistas Habilitados en Argentina' 
                  : `Camiones Disponibles en ${activeBrand.id === 'miranda' ? 'Buenos Aires' : 'Mendoza'} Hoy`
                }
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {activeBrand.id === 'empresas' ? (
                <>
                  Compara y Cotiza las Mejores{' '}
                  <span className={`bg-gradient-to-r ${activeBrand.primaryColor} bg-clip-text text-transparent`}>
                    Empresas de Mudanzas
                  </span>
                </>
              ) : (
                <>
                  Mudanzas Simples y sin Estrés en{' '}
                  <span className={`bg-gradient-to-r ${activeBrand.primaryColor} bg-clip-text text-transparent`}>
                    {activeBrand.id === 'mendoza' ? 'Mendoza' : 'GBA y CABA'}
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              {activeBrand.tagline}. Evita sorpresas o costos ocultos de último momento. Obtené tu presupuesto 100% digital en 1 minuto y congelá tu tarifa hoy mismo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                id="hero-calc-btn"
                href="/calculadora"
                onClick={(e) => {
                  e.preventDefault();
                  if (onPageSelect) {
                    onPageSelect('calculadora');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onMouseEnter={() => onPrefetch && onPrefetch('QuoteCalculator')}
                onFocus={() => onPrefetch && onPrefetch('QuoteCalculator')}
                className={`px-8 py-4.5 rounded-2xl bg-gradient-to-r ${activeBrand.primaryColor} text-white font-extrabold text-sm text-center hover:opacity-95 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 tracking-wide uppercase cursor-pointer`}
              >
                <Sparkles className="w-4 h-4 text-white" /> Cotizar Mudanza en 1 Minuto
              </a>
              <a
                id="hero-contact-btn"
                href="/directorio"
                onClick={(e) => {
                  e.preventDefault();
                  if (onPageSelect) {
                    onPageSelect('directorio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onMouseEnter={() => {
                  if (onPrefetch) {
                    onPrefetch('RecommendedCompanies');
                    onPrefetch('DepartmentsGrid');
                  }
                }}
                onFocus={() => {
                  if (onPrefetch) {
                    onPrefetch('RecommendedCompanies');
                    onPrefetch('DepartmentsGrid');
                  }
                }}
                className="px-8 py-4.5 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm text-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                Ver Transportistas Recomendados
              </a>
            </div>

            {/* Localized Portal Quick-Router */}
            <div className="bg-slate-100/60 border border-slate-200/40 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">🔎 Acceso Rápido por Zona Geográfica</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleQuickZoneClick('Gran Mendoza')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-gray-800 transition flex items-center gap-1.5 cursor-pointer hover:border-amber-500/55 shadow-3xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Gran Mendoza
                </button>
                <button 
                  onClick={() => handleQuickZoneClick('Valle de Uco')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-gray-800 transition flex items-center gap-1.5 cursor-pointer hover:border-sky-500/55 shadow-3xs"
                >
                  <Compass className="w-3.5 h-3.5 text-sky-500" />
                  Valle de Uco
                </button>
                <button 
                  onClick={() => handleQuickZoneClick('Zona Sur')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-gray-800 transition flex items-center gap-1.5 cursor-pointer hover:border-emerald-500/55 shadow-3xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  Zona Sur
                </button>
              </div>
            </div>

            {/* Reassurance Badges Row for High Trust / Low Friction */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-200/80">
              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100 shadow-3xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900">Tarifas Congeladas</h4>
                  <p className="text-[10px] text-gray-500">Precio final escrito en cotización</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100 shadow-3xs">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900">Seguro de Carga</h4>
                  <p className="text-[10px] text-gray-500">Pólizas Allianz Seguros Mendoza</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100 shadow-3xs">
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-800 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900">Puntualidad Certificada</h4>
                  <p className="text-[10px] text-gray-500">Garantía de salida a término</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust rating panel & Image */}
          <div className="lg:col-span-5 h-full">
            {/* Sleek, Modern Moving Truck Image Card */}
            <div className="relative h-72 sm:h-96 lg:h-full lg:min-h-[440px] rounded-3xl overflow-hidden border border-gray-200/50 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80"
                alt="Servicio de Mudanza Profesional Mendoza"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
              {/* Subtle ambient gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              
              {/* Floating Badge on the image */}
              <div className="absolute bottom-6 left-6">
                <span className="text-[10px] sm:text-xs font-black text-white bg-slate-950/85 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10 uppercase tracking-wider flex items-center gap-2 shadow-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Unidades Con Monitoreo Satelital GPS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
