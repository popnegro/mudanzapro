import React, { useState, useMemo } from 'react';
import { QuoteLead, BrandConfig } from '../types';
import { DEPARTMENTS } from '../data';
import LeadManager from './LeadManager';
import SitemapAuditor from './SitemapAuditor';
import { 
  TrendingUp, Users, DollarSign, Award, Clock, Truck, 
  MapPin, ShieldCheck, Activity, CheckCircle, Search, Sparkles,
  RefreshCw, Wrench, AlertTriangle, LayoutDashboard, Globe, FileText,
  LogOut, ArrowLeftRight, Check, ChevronRight, MessageSquare, Terminal
} from 'lucide-react';

interface AdminDashboardProps {
  leads: QuoteLead[];
  onUpdateLeadStatus: (leadId: string, newStatus: QuoteLead['status']) => void;
  onDeleteLead: (leadId: string) => void;
  activeBrand: BrandConfig;
  onExitDashboard: () => void;
}

interface FleetTruck {
  id: string;
  driver: string;
  phone: string;
  type: 'Chico' | 'Mediano' | 'Grande';
  currentZone: string;
  status: 'disponible' | 'viaje' | 'mantenimiento';
}

const INITIAL_FLEET: FleetTruck[] = [
  { id: 'M-01', driver: 'Carlos Gómez', phone: '+54 9 261 555-0122', type: 'Grande', currentZone: 'Gran Mendoza', status: 'disponible' },
  { id: 'M-02', driver: 'Mariano Rossi', phone: '+54 9 261 555-0145', type: 'Mediano', currentZone: 'Valle de Uco', status: 'viaje' },
  { id: 'M-03', driver: 'Eduardo Páez', phone: '+54 9 261 555-0189', type: 'Chico', currentZone: 'Gran Mendoza', status: 'disponible' },
  { id: 'M-04', driver: 'Juan Castro', phone: '+54 9 260 555-0211', type: 'Grande', currentZone: 'Zona Sur', status: 'viaje' },
  { id: 'M-05', driver: 'Lucas Ortiz', phone: '+54 9 261 555-0299', type: 'Mediano', currentZone: 'Gran Mendoza', status: 'mantenimiento' },
];

export default function AdminDashboard({ 
  leads, 
  onUpdateLeadStatus, 
  onDeleteLead, 
  activeBrand,
  onExitDashboard 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'fleet' | 'seo'>('overview');
  const [fleet, setFleet] = useState<FleetTruck[]>(INITIAL_FLEET);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'Iniciando consola de despacho local...',
    'Conexión segura establecida con el servidor de Fletes Mendoza',
    'Base de datos de leads sincronizada correctamente con localStorage',
    'Sitemap autogenerado cargado en caché de indexación',
  ]);

  // 1. Calculate Real-Time Dashboard Statistics
  const stats = useMemo(() => {
    const totalCount = leads.length;
    const pendingLeads = leads.filter(l => l.status === 'new').length;
    const contactedLeads = leads.filter(l => l.status === 'contacted').length;
    const completedLeads = leads.filter(l => l.status === 'completed').length;
    
    const totalEstimatedRevenue = leads
      .filter(l => l.status !== 'cancelled')
      .reduce((sum, l) => sum + l.estimatedCost, 0);

    const averageTicket = totalCount > 0 ? Math.round(totalEstimatedRevenue / totalCount) : 0;

    // Geographic volume mapping
    const zoneVolume: Record<string, number> = {
      'Gran Mendoza': 0,
      'Valle de Uco': 0,
      'Zona Sur': 0
    };

    leads.forEach(l => {
      if (['tunuyan', 'tupungato', 'san_carlos'].includes(l.originDept)) {
        zoneVolume['Valle de Uco'] += 1;
      } else if (['san_rafael', 'general_alvear', 'malargue'].includes(l.originDept)) {
        zoneVolume['Zona Sur'] += 1;
      } else {
        zoneVolume['Gran Mendoza'] += 1;
      }
    });

    return {
      totalCount,
      pendingLeads,
      contactedLeads,
      completedLeads,
      totalEstimatedRevenue,
      averageTicket,
      zoneVolume
    };
  }, [leads]);

  // Toggle Truck status
  const handleToggleTruckStatus = (truckId: string) => {
    setFleet(prev => prev.map(t => {
      if (t.id === truckId) {
        const nextStatusMap: Record<FleetTruck['status'], FleetTruck['status']> = {
          'disponible': 'viaje',
          'viaje': 'mantenimiento',
          'mantenimiento': 'disponible'
        };
        const newStatus = nextStatusMap[t.status];
        
        // Add a simulation log
        setSystemLogs(prevLogs => [
          `[LOGISTICA] Móvil ${t.id} cambiado a estado: ${newStatus.toUpperCase()}`,
          ...prevLogs.slice(0, 8)
        ]);

        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const filteredFleet = useMemo(() => {
    if (selectedZoneFilter === 'all') return fleet;
    return fleet.filter(t => t.currentZone === selectedZoneFilter);
  }, [fleet, selectedZoneFilter]);

  // Recent leads preview
  const recentLeadsPreview = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [leads]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans">
      
      {/* 1. COMPACT LEFT SIDEBAR FOR OPERATOR NAVIGATION */}
      <aside className="w-full lg:w-72 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Brand identity header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${activeBrand.primaryColor} text-white shadow-xs`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-white block">CONSOLA COMERCIAL</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fletes & Operaciones</span>
            </div>
          </div>
          
          <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="Online" />
        </div>

        {/* Selected Brand Context Badge */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Dominio activo:</span>
          <span className="font-extrabold text-amber-400 font-mono text-[11px]">{activeBrand.domain}</span>
        </div>

        {/* Sidebar Navigation Options */}
        <nav className="p-4 space-y-1.5 flex-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-amber-400 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Tablero Principal</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'crm'
                ? 'bg-slate-800 text-amber-400 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Bandeja CRM (Leads)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {stats.pendingLeads > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-gray-950 text-[9px] font-black">
                  {stats.pendingLeads}
                </span>
              )}
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </div>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'fleet'
                ? 'bg-slate-800 text-amber-400 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4" />
              <span>Despacho de Flota</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'seo'
                ? 'bg-slate-800 text-amber-400 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4" />
              <span>Consola SEO & Sitemap</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </nav>

        {/* Sidebar Footer: Return back to Client view */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
          <div className="px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Operador: <strong className="text-slate-200">Central Mendoza</strong></span>
          </div>
          
          <button
            id="back-to-site-btn"
            onClick={onExitDashboard}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Volver al Sitio Web</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN BACK-OFFICE SYSTEM GRID */}
      <main className="flex-1 min-w-0 bg-slate-950 flex flex-col">
        
        {/* Top bar header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/20 px-6 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              {activeTab === 'overview' && 'Dashboard de Desempeño'}
              {activeTab === 'crm' && 'Central de Leads / CRM de Mudanzas'}
              {activeTab === 'fleet' && 'Gestión de Unidades Activas'}
              {activeTab === 'seo' && 'Sitemap & Cobertura de Dominios'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-extrabold text-slate-200 text-[10px] uppercase">Base Sincronizada</span>
            </div>
            
            <button
              onClick={onExitDashboard}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vista Cliente</span>
            </button>
          </div>
        </header>

        {/* TAB CORE CONTENT CONTAINER */}
        <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
          
          {/* TAB 1: GENERAL SYSTEM OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Top welcome banner */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CENTRAL DE OPERACIONES ACTIVAS</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Consola de Negocios de Fletes</h1>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Usted está visualizando el desempeño comercial consolidado. Gestione leads capturados, monitoree el estado de la flota local y audite los portales de cobertura SEO.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3 shrink-0">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">SEGURIDAD LOCAL</span>
                    <span className="text-xs font-black text-emerald-400 mt-1 block">Certificado SSL Activo</span>
                  </div>
                </div>
              </div>

              {/* 1. Real-Time Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue card */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 hover:border-slate-700 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facturación Estimada</p>
                      <h4 className="text-2xl font-black text-amber-400 mt-1">${stats.totalEstimatedRevenue.toLocaleString('es-AR')}</h4>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">De cotizaciones activas (sin cancelar)</p>
                </div>

                {/* Total leads card */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 hover:border-slate-700 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Solicitudes Totales</p>
                      <h4 className="text-2xl font-black text-white mt-1">{stats.totalCount} Leads</h4>
                    </div>
                    <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> {stats.pendingLeads} Nuevos</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {stats.completedLeads} Listos</span>
                  </div>
                </div>

                {/* Average Ticket */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 hover:border-slate-700 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket Promedio</p>
                      <h4 className="text-2xl font-black text-white mt-1">${stats.averageTicket.toLocaleString('es-AR')}</h4>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Valor por servicio de traslado individual</p>
                </div>

                {/* Conversion rate */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between h-32 hover:border-slate-700 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efectividad Comercial</p>
                      <h4 className="text-2xl font-black text-emerald-400 mt-1">
                        {stats.totalCount > 0 ? Math.round(((stats.completedLeads + stats.contactedLeads) / stats.totalCount) * 100) : 0}%
                      </h4>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Clientes contactados o resueltos</p>
                </div>
              </div>

              {/* Grid: Recent Leads Quick CRM + Real-time Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent leads shortcut (7 cols) */}
                <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Últimas Solicitudes Registradas</h3>
                      <p className="text-xs text-slate-400">Procese rápidamente los requerimientos más recientes.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('crm')}
                      className="text-xs font-bold text-amber-500 hover:underline"
                    >
                      Ver todos
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {recentLeadsPreview.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No hay solicitudes guardadas todavía.</p>
                    ) : (
                      recentLeadsPreview.map((lead) => {
                        return (
                          <div 
                            key={lead.id} 
                            onClick={() => setActiveTab('crm')}
                            className="p-3.5 bg-slate-950 hover:bg-slate-800/60 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition flex items-center justify-between gap-4 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-white">{lead.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                                  {lead.brandId}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {lead.originDept.replace('_', ' ')} → {lead.destDept.replace('_', ' ')}
                              </p>
                            </div>

                            <div className="text-right space-y-1">
                              <p className="font-black text-amber-400">${lead.estimatedCost.toLocaleString('es-AR')}</p>
                              <div>
                                {lead.status === 'new' && <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[9px] uppercase">Nuevo</span>}
                                {lead.status === 'contacted' && <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold text-[9px] uppercase">Contactado</span>}
                                {lead.status === 'completed' && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[9px] uppercase">Completado</span>}
                                {lead.status === 'cancelled' && <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold text-[9px] uppercase">Cancelado</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Real-Time operations logs console (5 cols) */}
                <div className="lg:col-span-5 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xs flex flex-col justify-between h-full space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-500 animate-pulse" />
                      Auditoría Operativa en Vivo
                    </h3>
                    <p className="text-xs text-slate-400">Logs automáticos del sistema de despacho de Mendoza.</p>
                  </div>

                  <div className="flex-1 bg-slate-950 p-4 rounded-2xl border border-slate-850 font-mono text-[10px] text-emerald-400 space-y-2 leading-relaxed min-h-[160px] overflow-hidden">
                    <p className="text-slate-500 text-[9px] border-b border-slate-900 pb-1.5">// SIMULACIÓN DE DISPOSITIVOS GPS</p>
                    {systemLogs.map((log, index) => (
                      <p key={index} className="truncate">
                        <span className="text-slate-500">[{new Date().toLocaleTimeString('es-AR')}]</span> {log}
                      </p>
                    ))}
                  </div>

                  <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Protocolo: WebSockets (Offline State)</span>
                    <span>100% de Calidad</span>
                  </div>
                </div>

              </div>

              {/* Quick dispatch overview */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl w-fit">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase">Monitoreo de Logística</h4>
                  <p className="text-xs text-slate-400">
                    Cambie de pestaña para rotar el estado de viaje de los camiones de flete y coordinar las cargas.
                  </p>
                  <button 
                    onClick={() => setActiveTab('fleet')}
                    className="text-xs text-amber-500 font-extrabold hover:underline block pt-1.5"
                  >
                    Abrir Flota →
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl w-fit">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase">Portales SEO Cobertura</h4>
                  <p className="text-xs text-slate-400">
                    Verifique el estado de indexación técnica y sitemap de las localidades y departamentos mendocinos.
                  </p>
                  <button 
                    onClick={() => setActiveTab('seo')}
                    className="text-xs text-sky-500 font-extrabold hover:underline block pt-1.5"
                  >
                    Inspeccionar SEO →
                  </button>
                </div>

                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                  <span className="text-[10px] font-black text-amber-500 block uppercase">CONSEJO PARA CONVERSIÓN:</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Utilice la herramienta de marca para previsualizar los dominios. Un dominio adaptado como <strong className="text-white">mudanzasmendoza.com.ar</strong> duplica la conversión de clientes mendocinos que buscan proximidad geográfica.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CRM LEADS LIST */}
          {activeTab === 'crm' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xs">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Gestión Centralizada de Clientes (Leads CRM)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Revise los datos capturados del calculador, llame directamente por teléfono o presione el botón de WhatsApp pre-redactado para enviar presupuestos al instante.
                </p>
              </div>
              <LeadManager 
                leads={leads}
                onUpdateLeadStatus={onUpdateLeadStatus}
                onDeleteLead={onDeleteLead}
              />
            </div>
          )}

          {/* TAB 3: FLEET LOGISTICS */}
          {activeTab === 'fleet' && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Fleet Dispatch list (8 cols) */}
                <div className="lg:col-span-8 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-base font-extrabold flex items-center gap-2">
                        <Truck className="w-5 h-5 text-amber-500" />
                        Despachador de Unidades de Flete
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Controle la ubicación simulada y disponibilidad de los camiones para traslados.</p>
                    </div>
                    
                    {/* Zone Filter */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400 font-bold">Filtrar Zona:</span>
                      <select
                        value={selectedZoneFilter}
                        onChange={(e) => setSelectedZoneFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="all">Todas las Zonas</option>
                        <option value="Gran Mendoza">Gran Mendoza</option>
                        <option value="Valle de Uco">Valle de Uco</option>
                        <option value="Zona Sur">Zona Sur</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-black text-[10px]">
                          <th className="py-3">Móvil ID</th>
                          <th>Chofer Autorizado</th>
                          <th>Capacidad</th>
                          <th>Ubicación</th>
                          <th>Estado Actual</th>
                          <th className="text-right">Cambiar Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredFleet.map((truck) => {
                          return (
                            <tr key={truck.id} className="hover:bg-slate-850/50 transition-colors">
                              <td className="py-4 font-black text-amber-400">{truck.id}</td>
                              <td className="font-bold text-white">
                                <p>{truck.driver}</p>
                                <p className="text-[10px] text-slate-500 font-normal">{truck.phone}</p>
                              </td>
                              <td>
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                                  {truck.type}
                                </span>
                              </td>
                              <td className="font-semibold text-slate-300">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  {truck.currentZone}
                                </div>
                              </td>
                              <td>
                                {truck.status === 'disponible' && (
                                  <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-black text-[9px] uppercase tracking-wide border border-emerald-500/20 inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Disponible
                                  </span>
                                )}
                                {truck.status === 'viaje' && (
                                  <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 font-black text-[9px] uppercase tracking-wide border border-amber-500/20 inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-spin" />
                                    En Viaje
                                  </span>
                                )}
                                {truck.status === 'mantenimiento' && (
                                  <span className="px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 font-black text-[9px] uppercase tracking-wide border border-rose-500/20 inline-flex items-center gap-1">
                                    <Wrench className="w-3 h-3 text-rose-400" />
                                    Mantenimiento
                                  </span>
                                )}
                              </td>
                              <td className="text-right">
                                <button
                                  onClick={() => handleToggleTruckStatus(truck.id)}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-amber-500 font-bold hover:bg-amber-500 hover:text-slate-950 transition-all text-[11px] cursor-pointer"
                                >
                                  Rotar Estado
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Regional Demographics / Statistics (4 Cols) */}
                <div className="lg:col-span-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-base font-extrabold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-500" />
                      Demografía Comercial
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Volumen relativo de mudanzas registradas por zona geográfica.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {['Gran Mendoza', 'Valle de Uco', 'Zona Sur'].map(zone => {
                      const count = stats.zoneVolume[zone] || 0;
                      const percent = stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;
                      
                      return (
                        <div key={zone} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-white">{zone}</span>
                            <span className="text-slate-400">{count} servicios ({percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                zone === 'Gran Mendoza' ? 'bg-amber-500' : zone === 'Valle de Uco' ? 'bg-sky-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-xs text-slate-400 leading-relaxed space-y-2">
                    <span className="font-extrabold text-amber-400 uppercase tracking-wider block">📌 DISPONIBILIDAD REGIONAL:</span>
                    <span>
                      La gran mayoría de los tránsitos se concentran en el área de Gran Mendoza. El Valle de Uco y la Zona Sur operan principalmente bajo traslados especiales programados.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: TECHNICAL SEO AUDITOR */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xs">
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md uppercase tracking-wider border border-emerald-500/20">
                  ESTRATEGIA SEO MULTI-DOMINIO
                </span>
                <h2 className="text-lg font-black text-white mt-2 uppercase tracking-wider">Auditoría Técnica de Sitemap</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Certifique la presencia de las URL canónicas locales. El sistema autogenera enlaces SEO de cobertura para cada departamento mendocino, maximizando el posicionamiento orgánico en Google.
                </p>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xs">
                <SitemapAuditor />
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
