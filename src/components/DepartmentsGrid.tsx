import React, { useState, useEffect } from 'react';
import { Department } from '../types';
import { DEPARTMENTS } from '../data';
import { MapPin, ArrowRight, Activity, CalendarCheck, TrendingUp, Sparkles } from 'lucide-react';

interface DepartmentsGridProps {
  selectedGeographicZone?: string;
  onZoneSelect?: (zoneName: string) => void;
}

export default function DepartmentsGrid({ selectedGeographicZone, onZoneSelect }: DepartmentsGridProps) {
  const [selectedRegion, setSelectedRegion] = useState<'gran_mendoza' | 'valle_de_uco' | 'zona_sur'>('gran_mendoza');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('capital');

  const REGIONS = [
    { id: 'gran_mendoza', name: 'Gran Mendoza', desc: 'Núcleo urbano principal' },
    { id: 'valle_de_uco', name: 'Valle de Uco', desc: 'Fincas y bodegas boutique' },
    { id: 'zona_sur', name: 'Zona Sur / Distancia', desc: 'Traslados interurbanos extensos' }
  ] as const;

  const getRegionForDept = (id: string): 'gran_mendoza' | 'valle_de_uco' | 'zona_sur' => {
    if (['tunuyan', 'tupungato', 'san_carlos'].includes(id)) return 'valle_de_uco';
    if (['san_rafael', 'general_alvear', 'malargue'].includes(id)) return 'zona_sur';
    return 'gran_mendoza';
  };

  const filteredDepts = DEPARTMENTS.filter(d => getRegionForDept(d.id) === selectedRegion);
  const activeDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];

  const handleRegionChange = (regionId: 'gran_mendoza' | 'valle_de_uco' | 'zona_sur') => {
    setSelectedRegion(regionId);
    const regionDepts = DEPARTMENTS.filter(d => getRegionForDept(d.id) === regionId);
    if (regionDepts.length > 0) {
      setSelectedDeptId(regionDepts[0].id);
    }

    if (onZoneSelect) {
      const regionToZoneMap: Record<'gran_mendoza' | 'valle_de_uco' | 'zona_sur', string> = {
        gran_mendoza: 'Gran Mendoza',
        valle_de_uco: 'Valle de Uco',
        zona_sur: 'Zona Sur'
      };
      onZoneSelect(regionToZoneMap[regionId]);
    }
  };

  const handleDeptSelect = (deptId: string) => {
    setSelectedDeptId(deptId);
    const regionId = getRegionForDept(deptId);
    if (onZoneSelect) {
      const regionToZoneMap: Record<'gran_mendoza' | 'valle_de_uco' | 'zona_sur', string> = {
        gran_mendoza: 'Gran Mendoza',
        valle_de_uco: 'Valle de Uco',
        zona_sur: 'Zona Sur'
      };
      onZoneSelect(regionToZoneMap[regionId]);
    }
  };

  // Sync state if selectedGeographicZone changes from another component (like the Calculator)
  useEffect(() => {
    if (selectedGeographicZone && selectedGeographicZone !== 'all') {
      const zoneToRegionMap: Record<string, 'gran_mendoza' | 'valle_de_uco' | 'zona_sur'> = {
        'Gran Mendoza': 'gran_mendoza',
        'Valle de Uco': 'valle_de_uco',
        'Zona Sur': 'zona_sur'
      };
      const newRegion = zoneToRegionMap[selectedGeographicZone];
      if (newRegion && newRegion !== selectedRegion) {
        setSelectedRegion(newRegion);
        const regionDepts = DEPARTMENTS.filter(d => getRegionForDept(d.id) === newRegion);
        if (regionDepts.length > 0) {
          // If current selected dept is not in the new region, select the first one of the new region
          if (!regionDepts.some(d => d.id === selectedDeptId)) {
            setSelectedDeptId(regionDepts[0].id);
          }
        }
      }
    }
  }, [selectedGeographicZone]);

  return (
    <div id="cobertura-seccion" className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            SITUADO EN EL DIRECTORIO DE EMPRESAS (JERARQUÍA DE ZONAS)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Directorio de Fletes Local de Mendoza
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Hacemos mudanzas locales en todos los distritos del Gran Mendoza, Valle de Uco y Zona Sur. Filtra por zona según tu punto de origen.
          </p>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white p-1.5 rounded-2xl border border-gray-200/60 shadow-xs max-w-full overflow-x-auto gap-1">
            {REGIONS.map(reg => {
              const isSelected = selectedRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => handleRegionChange(reg.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-gray-950 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-slate-50'
                  }`}
                >
                  {reg.name}
                  <span className="block text-[9px] font-medium opacity-80">{reg.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List of Departments (Left Column) */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 tracking-wide block uppercase">
                DEPARTAMENTOS EN {REGIONS.find(r => r.id === selectedRegion)?.name.toUpperCase()}
              </span>
              <span className="text-[10px] font-semibold text-amber-600">
                {filteredDepts.length} Zonas listas
              </span>
            </div>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredDepts.map(dept => {
                const isSelected = dept.id === selectedDeptId;
                return (
                  <button
                    key={dept.id}
                    onClick={() => handleDeptSelect(dept.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center cursor-pointer ${
                      isSelected
                        ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500/10'
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-500'}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{dept.name}</h4>
                        <p className="text-[10px] text-gray-400">Ver estadísticas y barrios destacados</p>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition ${isSelected ? 'translate-x-1 text-amber-600' : 'text-gray-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Department Info (Right Column) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-black text-amber-600 uppercase">INFORME DE MOVILIDAD LOCAL</span>
                <h3 className="text-2xl font-black text-gray-900 mt-0.5">{activeDept.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Multiplicador tarifario base: x{activeDept.baseRateMultiplier}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-gray-400 font-bold leading-none">COSTO PROM. MUDANZA</p>
                <p className="text-lg font-black text-gray-800 mt-1">${activeDept.movingStats.avgCost.toLocaleString('es-AR')}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wide">CARACTERÍSTICAS DE TRÁNSITO</span>
              <p className="text-xs text-gray-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {activeDept.description}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">VOLUMEN MENSUAL</span>
                  <span className="text-sm font-bold text-gray-800">{activeDept.movingStats.monthlyVolume} servicios</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">MÁS DEMANDADO</span>
                  <span className="text-sm font-bold text-gray-800">{activeDept.movingStats.popularTime}</span>
                </div>
              </div>
            </div>

            {/* Neighborhoods list (Highly important for SEO targeting keywords!) */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">BARRIOS Y SECTORES DE COBERTURA FRECUENTE</span>
              <div className="flex flex-wrap gap-2">
                {activeDept.featuredNeighborhoods.map(hood => (
                  <span
                    key={hood}
                    className="text-xs bg-slate-50 text-gray-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/10 transition cursor-default flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {hood}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick callout */}
            <div className="p-3 bg-amber-50/30 border border-amber-100/60 rounded-xl flex items-center gap-2 text-[11px] text-amber-800">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>¿Mudándote hacia o desde {activeDept.name}? Tenemos tarifas especiales sin costo de retorno en camiones.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
