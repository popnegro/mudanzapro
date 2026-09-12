import React, { useEffect, useMemo } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  ClipboardList,
  MapPin,
  Menu,
  Route,
  Truck,
  X,
} from 'lucide-react';
import LeadManager from './components/LeadManager';
import SeoManager from './components/SeoManager';
import FAQSection from './components/FAQSection';
import QuoteCalculator from './components/QuoteCalculator';
import ServicesSection from './components/ServicesSection';
import DepartmentsGrid from './components/DepartmentsGrid';
import Checklist from './components/Checklist';
import RecommendedCompanies from './components/RecommendedCompanies';
import { BRANDS } from './data';
import { BrandConfig } from './types';
import { useLeads } from './hooks/useLeads';
import { useAppNavigation } from './hooks/useAppNavigation';

const neutralBrand: BrandConfig = {
  ...BRANDS.empresas,
  name: 'MudanzaPro',
  tagline: 'Herramientas para planificar, estimar y preparar tu mudanza en Mendoza',
  primaryColor: 'from-[#06434A] to-[#07BE8A]',
  secondaryColor: '#06434A',
  accentColor: '#07BE8A',
  gradientFrom: '#06434A',
  gradientTo: '#07BE8A',
  domain: 'mudanzapro.vercel.app',
  phone: '',
  email: '',
  address: '',
  reviewCount: 0,
  avgRating: 0,
};

const toolCards = [
  { id: 'calculadora', icon: Calculator, title: 'Calcular mi mudanza', text: 'Estimá volumen, distancia y servicios antes de pedir presupuesto.' },
  { id: 'checklist', icon: ClipboardList, title: 'Organizar el traslado', text: 'Ordená tareas y fechas para llegar al día de la mudanza con todo listo.' },
  { id: 'servicios', icon: Truck, title: 'Entender los servicios', text: 'Compará qué incluye cada modalidad y qué variables pueden cambiar el costo.' },
  { id: 'zonas', icon: MapPin, title: 'Revisar recorridos', text: 'Consultá departamentos y recorridos habituales dentro de Mendoza.' },
];

function LoadingSpinner() {
  return <div className="min-h-[40vh] grid place-items-center text-sm text-slate-500">Cargando herramienta…</div>;
}

function Home({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="overflow-hidden">
      <section className="bg-[#FAF9F5] border-b border-[#06434A]/10">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:grid lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center rounded-full border border-[#07BE8A]/30 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#06434A]">
              Herramientas para tu mudanza en Mendoza
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-[-.035em] text-[#06434A] sm:text-6xl lg:text-7xl lg:leading-[1.02]">
              Planificá tu mudanza antes de pedir presupuesto.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Calculá, organizá y prepará tu traslado con información clara. Después, elegí cómo querés resolverlo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => onNavigate('calculadora')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#06434A] px-6 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#05373D] focus:outline-none focus:ring-2 focus:ring-[#07BE8A] focus:ring-offset-2">
                Calcular mi mudanza <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#06434A]/15 bg-white px-6 py-3.5 text-sm font-bold text-[#06434A] transition hover:border-[#06434A]/30 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#07BE8A] focus:ring-offset-2">
                Ver cómo funciona
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-500">MudanzaPro no es una empresa de mudanzas: es la capa de planificación y decisión.</p>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="rounded-3xl border border-[#06434A]/10 bg-[#06434A] p-6 text-white shadow-xl sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-[#07BE8A]">Tu recorrido</p>
                  <h2 className="mt-1 text-xl font-extrabold">De la duda a la decisión</h2>
                </div>
                <Route className="h-7 w-7 text-[#07BE8A]" />
              </div>
              <ol className="mt-6 space-y-5">
                {['Entendé qué necesitás', 'Estimá volumen y recorrido', 'Prepará tu mudanza', 'Solicitá presupuesto'].map((step, index) => (
                  <li key={step} className="flex items-center gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-black text-[#07BE8A]">0{index + 1}</span>
                    <span className="text-sm font-semibold text-white/90">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-7 rounded-2xl bg-white/5 p-4 text-sm leading-6 text-white/70">
                Primero resolvés la información. Después elegís la empresa que hará el traslado.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20" id="herramientas">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#07BE8A]">Qué necesitás resolver</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#06434A] sm:text-4xl">Una herramienta para cada decisión.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">Sin directorios dudosos ni promesas de terceros. Solo herramientas para llegar mejor preparado al presupuesto.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {toolCards.map(({ id, icon: Icon, title, text }) => (
              <button key={id} onClick={() => onNavigate(id)} className="group min-h-56 rounded-2xl border border-slate-200 bg-[#FAF9F5] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#07BE8A]/50 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#07BE8A] focus:ring-offset-2">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#06434A] text-white"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-6 text-lg font-extrabold text-[#06434A]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-[#009966]">Abrir herramienta <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-[#FAF9F5] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#07BE8A]">Cómo funciona</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#06434A] sm:text-4xl">Primero planificás. Después contratás.</h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">La función de MudanzaPro es ayudarte a reducir incertidumbre antes de hablar con una empresa.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['01', 'Información', 'Entendé precios, variables, servicios y recorridos.'],
                ['02', 'Estimación', 'Armá una referencia del volumen y alcance de tu traslado.'],
                ['03', 'Preparación', 'Organizá tareas, tiempos y puntos que no conviene olvidar.'],
                ['04', 'Presupuesto', 'Con la información lista, pasá a la etapa comercial.'],
              ].map(([number, title, text]) => (
                <div key={number} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3"><span className="text-xs font-black text-[#07BE8A]">{number}</span><h3 className="font-extrabold text-[#06434A]">{title}</h3></div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="rounded-3xl bg-[#06434A] p-7 text-white sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#07BE8A]">Parte del ecosistema</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Información, planificación y contratación en el orden correcto.</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">Mudanzas en Mendoza te ayuda a saber. MudanzaPro te ayuda a resolver. Mudanzas Miranda puede encargarse del traslado.</p>
            </div>
            <div className="mt-6 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0">
              <a href="https://mudanzasmendoza.com.ar/mudanzas-en-mendoza.html" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-bold text-white hover:bg-white/5">Qué saber</a>
              <a href="https://wa.link/zn3zij" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#07BE8A] px-5 text-sm font-extrabold text-[#06434A] hover:bg-[#009966] hover:text-white">Solicitar presupuesto</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const { leads, handleNewLeadCreated, handleUpdateLeadStatus, handleDeleteLead } = useLeads();
  const { activePage, setActivePage, selectedGeographicZone, setSelectedGeographicZone, viewMode, setViewMode } = useAppNavigation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const activeBrand = useMemo(() => neutralBrand, []);

  useEffect(() => {
    document.body.classList.add('mudanzapro-app');
    return () => document.body.classList.remove('mudanzapro-app');
  }, []);

  const navigate = (page: string) => {
    setActivePage(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (viewMode === 'dashboard') {
      return <LeadManager leads={leads} onUpdateLeadStatus={handleUpdateLeadStatus} onDeleteLead={handleDeleteLead} />;
    }
    switch (activePage) {
      case 'calculadora': return <QuoteCalculator activeBrand={activeBrand} onNewLeadCreated={handleNewLeadCreated} onZoneSelect={setSelectedGeographicZone} onViewModeChange={setViewMode} />;
      case 'servicios': return <ServicesSection onPageSelect={navigate} />;
      case 'directorio': return <RecommendedCompanies selectedGeographicZone={selectedGeographicZone} onZoneSelect={setSelectedGeographicZone} onBrandSelect={() => navigate('inicio')} onViewModeChange={setViewMode} />;
      case 'zonas': return <DepartmentsGrid selectedGeographicZone={selectedGeographicZone} onZoneSelect={(zone) => { setSelectedGeographicZone(zone); navigate('calculadora'); }} />;
      case 'checklist': return <Checklist />;
      case 'faq': return <FAQSection />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-white text-slate-900 antialiased">
        <SeoManager activeBrand={activeBrand} activePage={activePage} />
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
            <button onClick={() => navigate('inicio')} className="flex min-h-11 items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07BE8A] focus:ring-offset-2" aria-label="Ir al inicio de MudanzaPro">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#06434A] text-white"><Truck className="h-5 w-5" /></span>
              <span className="text-lg font-black tracking-tight text-[#06434A]">MudanzaPro</span>
            </button>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
              <button onClick={() => navigate('calculadora')} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#06434A]">Calcular</button>
              <button onClick={() => navigate('checklist')} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#06434A]">Organizar</button>
              <button onClick={() => navigate('servicios')} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#06434A]">Servicios</button>
              <button onClick={() => navigate('faq')} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#06434A]">Preguntas</button>
              <button onClick={() => navigate('calculadora')} className="ml-2 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#06434A] px-4 text-sm font-extrabold text-white hover:bg-[#05373D]">Empezar <ArrowRight className="h-4 w-4" /></button>
            </nav>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="grid h-11 w-11 place-items-center rounded-xl text-[#06434A] hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#07BE8A] md:hidden" aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {mobileOpen && <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden"><div className="grid gap-1">
            {[['calculadora','Calcular mi mudanza'],['checklist','Organizar'],['servicios','Servicios'],['zonas','Recorridos'],['faq','Preguntas frecuentes']].map(([id,label]) => <button key={id} onClick={() => navigate(id)} className="min-h-11 rounded-xl px-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">{label}</button>)}
          </div></div>}
        </header>

        <main className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div key={`${viewMode}-${activePage}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .18 }}>
              <React.Suspense fallback={<LoadingSpinner />}>{renderPage()}</React.Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t border-slate-200 bg-[#FAF9F5]">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl"><div className="flex items-center gap-2 text-[#06434A]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#06434A] text-white"><Truck className="h-4 w-4" /></span><span className="font-black">MudanzaPro</span></div><p className="mt-3 text-sm leading-6 text-slate-600">Herramientas para entender, calcular y preparar una mudanza en Mendoza.</p></div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-600"><button onClick={() => navigate('calculadora')}>Calcular</button><button onClick={() => navigate('checklist')}>Organizar</button><button onClick={() => navigate('faq')}>Preguntas</button></div>
            </div>
            <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} MudanzaPro</span><span>Herramienta independiente de planificación.</span></div>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
}
