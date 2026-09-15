import React, { useEffect, useMemo } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  Check,
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
  { id: 'calculadora', icon: Calculator, eyebrow: '01', title: 'Calcular', text: 'Definí origen, destino y tamaño del traslado para llegar al presupuesto con mejor información.' },
  { id: 'checklist', icon: ClipboardList, eyebrow: '02', title: 'Organizar', text: 'Ordená tareas y momentos clave para no depender de la memoria el día de la mudanza.' },
  { id: 'servicios', icon: Truck, eyebrow: '03', title: 'Entender servicios', text: 'Conocé qué puede incluir un traslado y qué conviene evaluar antes de contratar.' },
  { id: 'zonas', icon: MapPin, eyebrow: '04', title: 'Revisar recorridos', text: 'Explorá departamentos y recorridos habituales dentro de Mendoza.' },
];

const processSteps = [
  ['01', 'Información', 'Entendé las variables que afectan una mudanza.'],
  ['02', 'Estimación', 'Armá una referencia de recorrido y tamaño.'],
  ['03', 'Preparación', 'Ordená tareas antes de pedir presupuesto.'],
  ['04', 'Presupuesto', 'Pasá la información necesaria a la etapa comercial.'],
];

function LoadingSpinner() {
  return <div className="grid min-h-[40vh] place-items-center text-sm text-slate-500">Cargando herramienta…</div>;
}

function Home({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="overflow-hidden bg-[#FAF9F5]">
      <section className="relative border-b border-[#06434A]/10 bg-[#FAF9F5]">
        <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#07BE8A]/10 blur-3xl" />
          <div className="absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-[#06434A]/5 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#07BE8A]/25 bg-white px-3.5 py-2 text-xs font-extrabold tracking-wide text-[#06434A] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#07BE8A]" aria-hidden="true" />
              Planificación de mudanzas en Mendoza
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.04] tracking-[-.045em] text-[#06434A] sm:text-6xl lg:text-7xl">
              Planificá tu mudanza antes de pedir presupuesto.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Una forma más clara de entender el traslado, preparar lo necesario y llegar mejor informado a la conversación con una empresa.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => onNavigate('calculadora')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#06434A] px-6 py-3.5 text-sm font-extrabold text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#05373D] hover:shadow-md">
                Calcular mi mudanza <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#06434A]/15 bg-white px-6 py-3.5 text-sm font-bold text-[#06434A] shadow-sm hover:-translate-y-0.5 hover:border-[#06434A]/25 hover:shadow-md">
                Ver cómo funciona
              </button>
            </div>
            <p className="mt-5 max-w-xl text-xs leading-5 text-slate-500">
              MudanzaPro no es una empresa de mudanzas: es una herramienta independiente de planificación y decisión.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-[#06434A]/10 bg-white p-5 shadow-[0_24px_70px_rgba(6,67,74,.10)] sm:p-7">
              <div className="flex items-start justify-between gap-5 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[.18em] text-[#009966]">Tu recorrido</p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-[#06434A]">De la duda a la decisión</h2>
                </div>
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#07BE8A]/10 text-[#009966]">
                  <Route className="h-5 w-5" />
                </div>
              </div>
              <ol className="mt-6 space-y-3">
                {['Entendé qué necesitás', 'Estimá volumen y recorrido', 'Prepará tu mudanza', 'Solicitá presupuesto'].map((step, index) => (
                  <li key={step} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-[#FAF9F5] p-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-xs font-black text-[#009966] shadow-sm">0{index + 1}</span>
                    <span className="text-sm font-bold text-[#12383A]">{step}</span>
                    {index < 3 && <Check className="ml-auto h-4 w-4 text-[#07BE8A]" aria-hidden="true" />}
                  </li>
                ))}
              </ol>
              <div className="mt-5 rounded-2xl border border-[#07BE8A]/15 bg-[#07BE8A]/5 p-4 text-sm leading-6 text-slate-600">
                Primero resolvés la información. Después decidís cómo contratar el traslado.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20" id="herramientas">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[.18em] text-[#009966]">Qué podés resolver</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-.03em] text-[#06434A] sm:text-4xl">Una herramienta para cada decisión.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Un sistema simple para avanzar por etapas, sin convertir la planificación en otra tarea difícil.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {toolCards.map(({ id, icon: Icon, eyebrow, title, text }) => (
              <button key={id} onClick={() => onNavigate(id)} className="group flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-[#FAF9F5] p-6 text-left shadow-sm hover:-translate-y-1 hover:border-[#07BE8A]/40 hover:bg-white hover:shadow-[0_18px_45px_rgba(6,67,74,.08)]">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#06434A] text-white"><Icon className="h-5 w-5" /></span>
                  <span className="text-xs font-black tracking-widest text-slate-400">{eyebrow}</span>
                </div>
                <h3 className="mt-7 text-lg font-extrabold text-[#06434A]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-xs font-extrabold text-[#009966]">Abrir <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="border-y border-[#06434A]/8 bg-[#F3F7F5] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.18em] text-[#009966]">Cómo funciona</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-.03em] text-[#06434A] sm:text-4xl">Primero planificás. Después contratás.</h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">MudanzaPro reduce la incertidumbre antes de que llegue el momento de pedir una cotización.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {processSteps.map(([number, title, text]) => (
                <div key={number} className="rounded-2xl border border-white bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3"><span className="text-xs font-black text-[#07BE8A]">{number}</span><span className="h-px flex-1 bg-slate-100" /><h3 className="text-sm font-extrabold text-[#06434A]">{title}</h3></div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="rounded-[2rem] border border-[#07BE8A]/20 bg-[#EAF7F2] p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-[.18em] text-[#009966]">Siguiente paso</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#06434A] sm:text-3xl">Llegá al presupuesto con la información ordenada.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Calculá tu recorrido, definí el tamaño aproximado y prepará los datos que una empresa necesita para evaluar tu traslado.</p>
            </div>
            <button onClick={() => onNavigate('calculadora')} className="mt-6 inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#06434A] px-5 text-sm font-extrabold text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#05373D] hover:shadow-md lg:mt-0">
              Empezar a calcular <ArrowRight className="h-4 w-4" />
            </button>
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
    document.documentElement.classList.add('theme-light');
    return () => {
      document.body.classList.remove('mudanzapro-app');
      document.documentElement.classList.remove('theme-light');
    };
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
      case 'directorio': return <RecommendedCompanies selectedGeographicZone={selectedGeographicZone} onZoneSelect={setSelectedGeographicZone} onViewModeChange={setViewMode} />;
      case 'zonas': return <DepartmentsGrid selectedGeographicZone={selectedGeographicZone} onZoneSelect={(zone) => { setSelectedGeographicZone(zone); navigate('calculadora'); }} />;
      case 'checklist': return <Checklist />;
      case 'faq': return <FAQSection />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <HelmetProvider>
      <div data-theme="light" className="min-h-screen bg-[#FAF9F5] text-[#12383A] antialiased">
        <SeoManager activeBrand={activeBrand} activePage={activePage} />
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
            <button onClick={() => navigate('inicio')} className="flex min-h-11 items-center gap-3 rounded-xl text-left" aria-label="Ir al inicio de MudanzaPro">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#06434A] text-white shadow-sm"><Truck className="h-5 w-5" /></span>
              <span className="text-lg font-black tracking-tight text-[#06434A]">MudanzaPro</span>
            </button>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
              {[
                ['calculadora', 'Calcular'],
                ['checklist', 'Organizar'],
                ['servicios', 'Servicios'],
                ['faq', 'Preguntas'],
              ].map(([id, label]) => (
                <button key={id} onClick={() => navigate(id)} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${activePage === id ? 'bg-[#07BE8A]/10 text-[#009966]' : 'text-slate-600 hover:bg-slate-50 hover:text-[#06434A]'}`} aria-current={activePage === id ? 'page' : undefined}>{label}</button>
              ))}
              <button onClick={() => navigate('calculadora')} className="ml-2 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#06434A] px-4 text-sm font-extrabold text-white shadow-sm hover:bg-[#05373D]">Empezar <ArrowRight className="h-4 w-4" /></button>
            </nav>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="grid h-11 w-11 place-items-center rounded-xl text-[#06434A] hover:bg-slate-50 md:hidden" aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {mobileOpen && (
            <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
              <div className="grid gap-1">
                {[['calculadora', 'Calcular mi mudanza'], ['checklist', 'Organizar'], ['servicios', 'Servicios'], ['zonas', 'Recorridos'], ['faq', 'Preguntas frecuentes']].map(([id, label]) => (
                  <button key={id} onClick={() => navigate(id)} className="min-h-11 rounded-xl px-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">{label}</button>
                ))}
              </div>
            </div>
          )}
        </header>

        <main className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div key={`${viewMode}-${activePage}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .18 }}>
              <React.Suspense fallback={<LoadingSpinner />}>{renderPage()}</React.Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-[#06434A]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#06434A] text-white"><Truck className="h-4 w-4" /></span><span className="font-black">MudanzaPro</span></div>
                <p className="mt-3 text-sm leading-6 text-slate-600">Herramientas independientes para entender, calcular y preparar una mudanza en Mendoza.</p>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-600">
                <button onClick={() => navigate('calculadora')} className="hover:text-[#009966]">Calcular</button>
                <button onClick={() => navigate('checklist')} className="hover:text-[#009966]">Organizar</button>
                <button onClick={() => navigate('servicios')} className="hover:text-[#009966]">Servicios</button>
                <button onClick={() => navigate('faq')} className="hover:text-[#009966]">Preguntas</button>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} MudanzaPro</span><span>Herramienta independiente de planificación.</span></div>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
}
