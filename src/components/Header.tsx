import React, { useState } from 'react';
import { BrandConfig } from '../types';
import { Truck, ChevronDown, Menu, X, Globe, Calculator, Award, ClipboardList, HelpCircle, MapPin, MessageSquare, Phone, Mail, Sparkles, Star, ChevronRight } from 'lucide-react';

interface HeaderProps {
  activeBrand: BrandConfig;
  onBrandChange: (brandId: 'mendoza' | 'miranda' | 'empresas') => void;
  viewMode: 'user' | 'dashboard';
  onViewModeChange: (mode: 'user' | 'dashboard') => void;
  leadsCount: number;
  activePage: string;
  onActivePageChange: (page: string) => void;
  onPrefetch?: (componentName: string) => void;
}

export default function Header({ 
  activeBrand, 
  onBrandChange, 
  viewMode, 
  onViewModeChange, 
  leadsCount,
  activePage,
  onActivePageChange,
  onPrefetch
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to prefetch the correct component chunk based on target page to minimize TTI/FID/INP latency
  const handlePagePrefetch = (page: string) => {
    if (!onPrefetch) return;
    switch (page) {
      case 'calculadora':
        onPrefetch('QuoteCalculator');
        break;
      case 'servicios':
        onPrefetch('ServicesSection');
        break;
      case 'directorio':
        onPrefetch('RecommendedCompanies');
        onPrefetch('DepartmentsGrid');
        break;
      case 'zonas':
        onPrefetch('DepartmentsGrid');
        break;
      case 'checklist':
        onPrefetch('Checklist');
        break;
      case 'faq':
        onPrefetch('FAQSection');
        break;
      default:
        break;
    }
  };

  // Theme-specific visual helpers
  const brandThemes = {
    mendoza: {
      hoverText: 'hover:text-amber-600',
      activeText: 'text-amber-600 font-extrabold border-amber-500 bg-amber-50/50',
      activeBorder: 'border-amber-600',
      pillBg: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    miranda: {
      hoverText: 'hover:text-sky-600',
      activeText: 'text-sky-600 font-extrabold border-sky-500 bg-sky-50/50',
      activeBorder: 'border-sky-600',
      pillBg: 'bg-sky-50 text-sky-800 border-sky-200'
    },
    empresas: {
      hoverText: 'hover:text-emerald-600',
      activeText: 'text-emerald-600 font-extrabold border-emerald-500 bg-emerald-50/50',
      activeBorder: 'border-emerald-600',
      pillBg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }
  };

  const currentTheme = brandThemes[activeBrand.id] || brandThemes.mendoza;

  const navigateTo = (page: string) => {
    onActivePageChange(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header id="header-section" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* High-converting Promo Announcement Bar */}
      <div className="bg-amber-500 text-gray-950 text-[11px] font-black py-2 px-4 text-center flex items-center justify-center gap-2 tracking-wide uppercase shadow-inner">
        <Sparkles className="w-4 h-4 text-gray-950" />
        <span>¡OFERTA DE TEMPORADA! 15% de Descuento en tu mudanza de Lunes a Jueves reservando hoy • Precios fijos garantizados</span>
        <span className="hidden sm:inline bg-gray-950 text-amber-400 text-[9px] px-2 py-0.5 rounded-full font-black ml-1.5">CUPOS LIMITADOS</span>
      </div>
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand Info */}
          <button 
            onClick={() => navigateTo('inicio')}
            className="flex items-center gap-3 shrink-0 text-left cursor-pointer focus:outline-none hover:opacity-95"
          >
            <div className={`p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br ${activeBrand.primaryColor} text-white shadow-md`}>
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
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
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 stroke-amber-400" />
                <span className="font-semibold text-gray-800">{activeBrand.avgRating}</span>
                <span className="hidden md:inline">({activeBrand.reviewCount} opiniones de mendocinos)</span>
                <span className="md:hidden">({activeBrand.reviewCount} reviews)</span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links - Centered & Optimal */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[10px] xl:text-xs font-extrabold tracking-wider uppercase text-gray-500">
            <button
              onClick={() => navigateTo('inicio')}
              className={`transition-all duration-200 px-3 py-2 rounded-xl cursor-pointer ${
                activePage === 'inicio' ? currentTheme.activeText : `text-gray-500 ${currentTheme.hoverText}`
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => navigateTo('calculadora')}
              onMouseEnter={() => handlePagePrefetch('calculadora')}
              onFocus={() => handlePagePrefetch('calculadora')}
              className={`transition-all duration-200 px-3 py-2 rounded-xl cursor-pointer ${
                activePage === 'calculadora' ? currentTheme.activeText : `text-gray-500 ${currentTheme.hoverText}`
              }`}
            >
              Calculadora
            </button>
            <button
              onClick={() => navigateTo('servicios')}
              onMouseEnter={() => handlePagePrefetch('servicios')}
              onFocus={() => handlePagePrefetch('servicios')}
              className={`transition-all duration-200 px-3 py-2 rounded-xl cursor-pointer ${
                activePage === 'servicios' ? currentTheme.activeText : `text-gray-500 ${currentTheme.hoverText}`
              }`}
            >
              Servicios
            </button>
            <button
              onClick={() => navigateTo('directorio')}
              onMouseEnter={() => handlePagePrefetch('directorio')}
              onFocus={() => handlePagePrefetch('directorio')}
              className={`transition-all duration-200 px-3 py-2 rounded-xl cursor-pointer ${
                activePage === 'directorio' ? currentTheme.activeText : `text-gray-500 ${currentTheme.hoverText}`
              }`}
            >
              Directorio
            </button>
            <button
              onClick={() => navigateTo('zonas')}
              onMouseEnter={() => handlePagePrefetch('zonas')}
              onFocus={() => handlePagePrefetch('zonas')}
              className={`transition-all duration-200 px-3 py-2 rounded-xl cursor-pointer ${
                activePage === 'zonas' ? currentTheme.activeText : `text-gray-500 ${currentTheme.hoverText}`
              }`}
            >
              Zonas
            </button>
            <button
              onClick={() => navigateTo('checklist')}
              onMouseEnter={() => handlePagePrefetch('checklist')}
              onFocus={() => handlePagePrefetch('checklist')}
              className={`transition-all duration-200 px-3 py-2 rounded-xl cursor-pointer ${
                activePage === 'checklist' ? currentTheme.activeText : `text-gray-500 ${currentTheme.hoverText}`
              }`}
            >
              Checklist
            </button>
            <button
              onClick={() => navigateTo('faq')}
              onMouseEnter={() => handlePagePrefetch('faq')}
              onFocus={() => handlePagePrefetch('faq')}
              className={`transition-all duration-200 px-3 py-2 rounded-xl cursor-pointer ${
                activePage === 'faq' ? currentTheme.activeText : `text-gray-500 ${currentTheme.hoverText}`
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => navigateTo('contacto')}
              className={`transition-all duration-200 px-3 py-2 rounded-xl cursor-pointer ${
                activePage === 'contacto' ? currentTheme.activeText : `text-gray-500 ${currentTheme.hoverText}`
              }`}
            >
              Contacto
            </button>
          </nav>

          {/* Actions & Responsive Hamburger (Right side) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Call Center Info (Hidden on tiny phones) */}
            <a
              id="call-phone"
              href={`tel:${activeBrand.phone.replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 text-gray-700 transition"
            >
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[9px] text-gray-400 font-bold leading-none uppercase">Llamar Ahora</p>
                <p className="font-extrabold text-gray-900 text-xs mt-0.5">{activeBrand.phone}</p>
              </div>
            </a>

            {/* Premium CTA Button (Hidden on tiny phones) */}
            <button
              onClick={() => navigateTo('calculadora')}
              onMouseEnter={() => handlePagePrefetch('calculadora')}
              onFocus={() => handlePagePrefetch('calculadora')}
              className="hidden xs:flex px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-black text-xs hover:from-amber-600 hover:to-amber-700 shadow-sm hover:shadow-md transition-all duration-200 uppercase tracking-wider items-center gap-1.5 ring-2 ring-amber-500/10 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Cotizar
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition focus:outline-none cursor-pointer"
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Optimal for mobile clients) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg py-5 px-6 space-y-6 animate-fade-in divide-y divide-gray-100">
          
          {/* Primary Navigation Stack */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Navegación del Portal</p>
            
            <button
              onClick={() => navigateTo('inicio')}
              className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-2xl text-left transition ${
                activePage === 'inicio' ? 'bg-slate-100 text-gray-950 font-black' : 'hover:bg-slate-50 text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-xl ${activePage === 'inicio' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-gray-500'}`}>
                <Globe className="w-4 h-4" />
              </div>
              <span>Página de Inicio</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </button>

            <button
              onClick={() => navigateTo('calculadora')}
              className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-2xl text-left transition ${
                activePage === 'calculadora' ? 'bg-slate-100 text-gray-950 font-black' : 'hover:bg-slate-50 text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-xl ${activePage === 'calculadora' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-gray-500'}`}>
                <Calculator className="w-4 h-4" />
              </div>
              <span>Cotizador de Mudanzas</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </button>

            <button
              onClick={() => navigateTo('servicios')}
              className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-2xl text-left transition ${
                activePage === 'servicios' ? 'bg-slate-100 text-gray-950 font-black' : 'hover:bg-slate-50 text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-xl ${activePage === 'servicios' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-gray-500'}`}>
                <Truck className="w-4 h-4" />
              </div>
              <span>Servicios y Tarifas</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </button>

            <button
              onClick={() => navigateTo('directorio')}
              className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-2xl text-left transition ${
                activePage === 'directorio' ? 'bg-slate-100 text-gray-950 font-black' : 'hover:bg-slate-50 text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-xl ${activePage === 'directorio' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-gray-500'}`}>
                <Award className="w-4 h-4" />
              </div>
              <span>Empresas Verificadas</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </button>

            <button
              onClick={() => navigateTo('zonas')}
              className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-2xl text-left transition ${
                activePage === 'zonas' ? 'bg-slate-100 text-gray-950 font-black' : 'hover:bg-slate-50 text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-xl ${activePage === 'zonas' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-gray-500'}`}>
                <MapPin className="w-4 h-4" />
              </div>
              <span>Zonas de Cobertura</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </button>

            <button
              onClick={() => navigateTo('checklist')}
              className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-2xl text-left transition ${
                activePage === 'checklist' ? 'bg-slate-100 text-gray-950 font-black' : 'hover:bg-slate-50 text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-xl ${activePage === 'checklist' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-gray-500'}`}>
                <ClipboardList className="w-4 h-4" />
              </div>
              <span>Checklist Organizador</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </button>

            <button
              onClick={() => navigateTo('faq')}
              className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-2xl text-left transition ${
                activePage === 'faq' ? 'bg-slate-100 text-gray-950 font-black' : 'hover:bg-slate-50 text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-xl ${activePage === 'faq' ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-gray-500'}`}>
                <HelpCircle className="w-4 h-4" />
              </div>
              <span>Preguntas Frecuentes</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </button>

            <button
              onClick={() => navigateTo('contacto')}
              className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-2xl text-left transition ${
                activePage === 'contacto' ? 'bg-slate-100 text-gray-950 font-black' : 'hover:bg-slate-50 text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-xl ${activePage === 'contacto' ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-gray-500'}`}>
                <Phone className="w-4 h-4" />
              </div>
              <span>Hablemos Directo</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
            </button>
          </div>

          {/* Quick Contacts Panel */}
          <div className="pt-5 space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacto Directo</p>
            
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${activeBrand.phone.replace(/\s+/g, '')}`}
                className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 border border-gray-100 rounded-2xl text-center transition"
              >
                <Phone className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[10px] font-black text-gray-900 uppercase">Llamar Tel</span>
                <span className="text-[8px] text-gray-400 font-bold truncate max-w-full mt-0.5">{activeBrand.phone}</span>
              </a>
              <a
                href={`mailto:${activeBrand.email}`}
                className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 border border-gray-100 rounded-2xl text-center transition"
              >
                <Mail className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-[10px] font-black text-gray-900 uppercase">Enviar Email</span>
                <span className="text-[8px] text-gray-400 font-bold truncate max-w-full mt-0.5">{activeBrand.email}</span>
              </a>
            </div>

            <button
              onClick={() => navigateTo('calculadora')}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-black text-xs text-center rounded-2xl shadow-md hover:from-amber-600 hover:to-amber-700 transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> ¡Cotizar Mudanza Ahora!
            </button>
          </div>

        </div>
      )}
    </header>
  );
}
