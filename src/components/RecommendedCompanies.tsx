import React, { useState, useMemo } from 'react';
import { RECOMMENDED_COMPANIES, DEPARTMENTS } from '../data';
import { RecommendedCompany, BrandId } from '../types';
import { 
  Star, MapPin, Phone, MessageSquare, ShieldCheck, 
  Search, SlidersHorizontal, CheckCircle, Sparkles, Truck, 
  Layers, ArrowRight, DollarSign, Award, HelpCircle, Globe
} from 'lucide-react';
import LazyImage from './LazyImage';

const getCompanyImageUrl = (id: string): string => {
  switch (id) {
    case 'emp-mendoza-mza':
      return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80';
    case 'emp-miranda-mza':
      return 'https://images.unsplash.com/photo-1512756290469-ec0602047974?w=500&auto=format&fit=crop&q=80';
    case 'emp-mudanzas-elvasco':
      return 'https://images.unsplash.com/photo-1516575150278-77136aed6920?w=500&auto=format&fit=crop&q=80';
    case 'emp-cuyo-log':
      return 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=80';
    case 'emp-altura-pro':
    default:
      return 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=500&auto=format&fit=crop&q=80';
  }
};

interface RecommendedCompaniesProps {
  selectedGeographicZone?: string;
  onZoneSelect?: (zoneName: string) => void;
  onBrandSelect?: (brandId: BrandId) => void;
  onViewModeChange?: (mode: 'user' | 'dashboard') => void;
}

export default function RecommendedCompanies({ 
  selectedGeographicZone = 'all', 
  onZoneSelect,
  onBrandSelect,
  onViewModeChange
}: RecommendedCompaniesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  const selectedZone = selectedGeographicZone || 'all';
  const setSelectedZone = (zone: string) => {
    if (onZoneSelect) {
      onZoneSelect(zone);
    }
  };

  // Extract all unique zones and specialties for filtering
  const allZones = useMemo(() => {
    const zonesSet = new Set<string>();
    RECOMMENDED_COMPANIES.forEach(c => c.zones.forEach(z => zonesSet.add(z)));
    return Array.from(zonesSet);
  }, []);

  const allSpecialties = useMemo(() => {
    const specsSet = new Set<string>();
    RECOMMENDED_COMPANIES.forEach(c => {
      // Map to simplify/normalize categories for pills
      if (c.specialties.some(s => s.toLowerCase().includes('izamiento') || s.toLowerCase().includes('izaje'))) specsSet.add('Izajes');
      if (c.specialties.some(s => s.toLowerCase().includes('piano'))) specsSet.add('Traslado de Pianos');
      if (c.specialties.some(s => s.toLowerCase().includes('larga'))) specsSet.add('Larga Distancia');
      if (c.specialties.some(s => s.toLowerCase().includes('hogar') || s.toLowerCase().includes('residencial'))) specsSet.add('Hogar');
      if (c.specialties.some(s => s.toLowerCase().includes('económico') || s.toLowerCase().includes('básico') || s.toLowerCase().includes('express'))) specsSet.add('Económico');
    });
    return Array.from(specsSet);
  }, []);

  // Helper to map department ID to geographical zone name
  const getZoneForDeptId = (deptId: string): string => {
    if (['tunuyan', 'tupungato', 'san_carlos'].includes(deptId)) return 'Valle de Uco';
    if (['san_rafael', 'general_alvear', 'malargue'].includes(deptId)) return 'Zona Sur';
    return 'Gran Mendoza';
  };

  // Find all zones/regions matched by the typed search query matching a department or a featured neighborhood
  const matchedRegionsFromSearch = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const matched: string[] = [];
    
    DEPARTMENTS.forEach(dept => {
      const deptNameMatches = dept.name.toLowerCase().includes(query);
      const neighborhoodMatches = dept.featuredNeighborhoods.some(hood => 
        hood.toLowerCase().includes(query)
      );
      
      if (deptNameMatches || neighborhoodMatches) {
        const zoneName = getZoneForDeptId(dept.id);
        if (!matched.includes(zoneName)) {
          matched.push(zoneName);
        }
      }
    });
    
    return matched;
  }, [searchQuery]);

  // Filter logic
  const filteredCompanies = useMemo(() => {
    return RECOMMENDED_COMPANIES.filter(company => {
      // Check if search query matches general properties (name, location, specialties)
      const matchesTextProperties = 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Check if search query matches any neighborhood/department zone that this company serves
      const matchesNeighborhoodOrDept = matchedRegionsFromSearch.some(zone => 
        company.zones.includes(zone)
      );

      const matchesSearch = matchesTextProperties || matchesNeighborhoodOrDept;

      // Zone filter
      const matchesZone = selectedZone === 'all' || company.zones.includes(selectedZone);

      // Specialty filter mapping
      let matchesSpecialty = true;
      if (selectedSpecialty !== 'all') {
        if (selectedSpecialty === 'Izajes') {
          matchesSpecialty = company.specialties.some(s => s.toLowerCase().includes('izaje') || s.toLowerCase().includes('izamiento'));
        } else if (selectedSpecialty === 'Traslado de Pianos') {
          matchesSpecialty = company.specialties.some(s => s.toLowerCase().includes('piano'));
        } else if (selectedSpecialty === 'Larga Distancia') {
          matchesSpecialty = company.specialties.some(s => s.toLowerCase().includes('larga'));
        } else if (selectedSpecialty === 'Hogar') {
          matchesSpecialty = company.specialties.some(s => s.toLowerCase().includes('hogar') || s.toLowerCase().includes('residencial'));
        } else if (selectedSpecialty === 'Económico') {
          matchesSpecialty = company.specialties.some(s => s.toLowerCase().includes('económico') || s.toLowerCase().includes('básico') || s.toLowerCase().includes('express'));
        }
      }

      // Featured filter
      const matchesFeatured = !showOnlyFeatured || company.isFeatured;

      return matchesSearch && matchesZone && matchesSpecialty && matchesFeatured;
    });
  }, [searchQuery, selectedZone, selectedSpecialty, showOnlyFeatured, matchedRegionsFromSearch]);

  // Helper to get formatted WhatsApp URL
  const getWhatsAppUrl = (company: RecommendedCompany) => {
    // Normalize phone number for wa.me link
    let cleanPhone = company.phone.replace(/[^0-9]/g, '');
    // Standard Argentina prefix handling
    if (cleanPhone.startsWith('549')) {
      // already normalized
    } else if (cleanPhone.startsWith('54')) {
      // insert the mobile '9' digit if missing for WhatsApp routing
      if (cleanPhone.length === 12 && cleanPhone[2] === '2') {
        cleanPhone = '549' + cleanPhone.substring(2);
      }
    } else if (cleanPhone.startsWith('0')) {
      cleanPhone = '549' + cleanPhone.substring(1);
    } else {
      // standard mobile prefix default
      cleanPhone = '549' + cleanPhone;
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(company.whatsappMessage)}`;
  };

  return (
    <section id="empresas-recomendadas" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            PRESTADORES VERIFICADOS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Empresas de Mudanzas Recomendadas en Mendoza
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Compara transportistas habilitados con reputación intachable en la provincia. 
            Filtrados por zona de cobertura, especialidad de traslado y cotizaciones base verificadas.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 border border-gray-200/60 p-5 rounded-3xl shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por empresa, barrio o especialidad (ej. pianos)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-3xs"
                aria-label="Buscar empresas transportistas por nombre, barrio o especialidad"
              />
              {matchedRegionsFromSearch.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-amber-50 border border-amber-200 rounded-xl p-2.5 shadow-md z-10 text-[10px] text-amber-900 font-bold flex items-center gap-1.5 animate-fade-in">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    Filtro activo por cobertura de barrios en:{' '}
                    <span className="font-extrabold text-amber-600 underline decoration-2 decoration-amber-400/50">
                      {matchedRegionsFromSearch.join(', ')}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Quick Toggle & Filters Summary */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={showOnlyFeatured}
                  onChange={(e) => setShowOnlyFeatured(e.target.checked)}
                  className="w-4 h-4 rounded-md border-gray-300 text-amber-500 focus:ring-amber-500/20 cursor-pointer"
                  aria-label="Filtrar para mostrar únicamente empresas recomendadas y verificadas"
                />
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  Solo empresas verificadas/destacadas
                </span>
              </label>
            </div>
          </div>

          <div className="h-[1px] bg-gray-200/60" />

          {/* Quick Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Zone Filter */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Región de Cobertura</span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtros de región de cobertura">
                <button
                  onClick={() => setSelectedZone('all')}
                  aria-pressed={selectedZone === 'all'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedZone === 'all'
                      ? 'bg-gray-900 text-white shadow-2xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-label="Mostrar todas las zonas de cobertura"
                >
                  Todas las zonas
                </button>
                {allZones.map(zone => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    aria-pressed={selectedZone === zone}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedZone === zone
                        ? 'bg-amber-500 text-gray-950 shadow-2xs'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                    aria-label={`Filtrar por cobertura de zona: ${zone}`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialty Filter */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Especialidad de Servicio</span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtros de especialidad de servicio">
                <button
                  onClick={() => setSelectedSpecialty('all')}
                  aria-pressed={selectedSpecialty === 'all'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedSpecialty === 'all'
                      ? 'bg-gray-900 text-white shadow-2xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-label="Mostrar todos los tipos de especialidad de servicios"
                >
                  Todos los servicios
                </button>
                {allSpecialties.map(spec => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    aria-pressed={selectedSpecialty === spec}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedSpecialty === spec
                        ? 'bg-amber-500 text-gray-950 shadow-2xs'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                    aria-label={`Filtrar por especialidad: ${spec}`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map(company => (
              <div 
                key={company.id}
                id={`company-card-${company.id}`}
                role="region"
                aria-label={`Empresa de mudanzas verificada: ${company.name}`}
                className={`relative flex flex-col justify-between bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl overflow-hidden ${
                  company.isFeatured 
                    ? 'border-amber-400/80 shadow-md shadow-amber-500/[0.02] ring-1 ring-amber-400/20' 
                    : 'border-gray-200/60 shadow-xs'
                }`}
              >
                {/* Card Header Image */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <LazyImage 
                    src={getCompanyImageUrl(company.id)} 
                    alt={`Flota y personal de la empresa de mudanzas ${company.name}`} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {/* Visual gradient overlay for clean contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  
                  {company.isFeatured && (
                    <div className="absolute top-3 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Recomendado</span>
                    </div>
                  )}

                  {company.badge && (
                    <div className="absolute bottom-3 left-4">
                      <span className="inline-block text-[9px] font-extrabold text-amber-50 bg-amber-950/85 backdrop-blur-xs px-2.5 py-0.5 rounded-md uppercase border border-amber-500/20 tracking-wider">
                        {company.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Info Content */}
                <div className="p-6 sm:p-7 space-y-4 flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1">
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(company.rating) ? 'fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-extrabold text-gray-800 ml-1">
                          {company.rating}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          ({company.reviewsCount})
                        </span>
                      </div>

                      <h3 className="text-base font-black text-gray-900 tracking-tight leading-snug mt-1">
                        {company.name}
                      </h3>
                    </div>

                    {/* Minimalist round emblem */}
                    <div className="w-9 h-9 rounded-full bg-slate-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed flex items-start gap-2 pt-1">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{company.location}</span>
                  </p>

                  <div className="h-[1px] bg-gray-100 my-2" />

                  {/* Specialty Pills */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Servicios Clave</span>
                    <div className="flex flex-wrap gap-1" aria-label={`Especialidades ofrecidas por ${company.name}`}>
                      {company.specialties.map(spec => (
                        <span 
                          key={spec} 
                          className="text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200/50 px-2 py-0.5 rounded-md"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Features checklist */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Garantía & Seguridad</span>
                    <ul className="space-y-1.5" aria-label={`Garantías y seguridad de ${company.name}`}>
                      {company.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer with Price and Contact Action Buttons */}
                <div className="p-6 bg-slate-50/80 rounded-b-3xl border-t border-gray-100/80 flex flex-col gap-3">
                  {/* Min price display */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-semibold">Precio base est.</span>
                    <span className="font-black text-gray-900 text-sm">
                      Desde ${company.minPrice.toLocaleString('es-AR')}
                    </span>
                  </div>

                  {/* Dedicated Portal verification link */}
                  {(company.id === 'emp-mendoza-mza' || company.id === 'emp-miranda-mza') && onBrandSelect && (
                    <button
                      onClick={() => {
                        const targetBrand = company.id === 'emp-mendoza-mza' ? 'mendoza' : 'miranda';
                        onBrandSelect(targetBrand);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 text-gray-950 hover:bg-amber-400 text-xs font-black rounded-xl transition duration-200 cursor-pointer shadow-3xs"
                      aria-label={`Visitar sitio web dedicado de la empresa ${company.name}`}
                    >
                      <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Visitar Sitio Web Dedicado</span>
                    </button>
                  )}

                  {/* Interactive Button Group */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Direct Call Link */}
                    <a
                      id={`call-btn-${company.id}`}
                      href={`tel:${company.phone.replace(/\s+/g, '')}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-slate-100 text-gray-800 text-xs font-black rounded-xl transition cursor-pointer"
                      aria-label={`Llamar telefónicamente a ${company.name}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
                      <span>Llamar</span>
                    </a>

                    {/* WhatsApp prefilled message Link */}
                    <a
                      id={`whatsapp-btn-${company.id}`}
                      href={getWhatsAppUrl(company)}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition cursor-pointer shadow-3xs hover:scale-[1.02]"
                      aria-label={`Enviar un mensaje de WhatsApp prefijado a ${company.name}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search/Filters State */
          <div className="text-center bg-slate-50 border border-dashed border-gray-200 py-12 px-6 rounded-3xl max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center mx-auto text-gray-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">No encontramos resultados exactos</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Prueba borrando tu búsqueda, seleccionando "Todas las zonas" o buscando una especialidad diferente.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedZone('all');
                setSelectedSpecialty('all');
                setShowOnlyFeatured(false);
              }}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              aria-label="Restablecer todos los filtros y campos de búsqueda de empresas"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

        {/* Localized FAQ reference for Recommended Companies */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-amber-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              ¿Cómo elegimos y verificamos las empresas recomendadas?
            </h4>
            <p className="text-xs text-amber-800/80 leading-relaxed max-w-3xl">
              Nuestros prestadores deben certificar: Habilitación comercial local en Mendoza, seguros de carga vigentes provistos por aseguradoras registradas en la SSN, vehículos con inspección técnica aprobada y un índice superior a 4.5 estrellas en valoraciones reales. No cobramos comisiones por traslados, garantizando total transparencia.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <a 
              href="/admin" 
              onClick={(e) => {
                e.preventDefault();
                if (onViewModeChange) {
                  onViewModeChange('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="w-full text-center block px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-black rounded-xl transition shadow-3xs cursor-pointer"
              aria-label="Registrar mi empresa en el directorio oficial de Mendoza"
            >
              Registrar mi empresa
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
