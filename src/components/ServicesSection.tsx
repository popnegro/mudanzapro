import React from 'react';
import { SERVICES } from '../data';
import { Truck, Sparkles, Archive, Users, Warehouse, ShieldAlert, Check, ArrowUpCircle, Award } from 'lucide-react';

interface ServicesSectionProps {
  onPageSelect?: (page: string) => void;
}

export default function ServicesSection({ onPageSelect }: ServicesSectionProps) {
  // Map icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck': return <Truck className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Archive': return <Archive className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      case 'Warehouse': return <Warehouse className="w-6 h-6" />;
      case 'ArrowUpCircle': return <ArrowUpCircle className="w-6 h-6" />;
      case 'Award': return <Award className="w-6 h-6" />;
      default: return <Truck className="w-6 h-6" />;
    }
  };

  const getCostTier = (basePrice: number) => {
    if (basePrice < 35000) return { label: 'Muy Accesible', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
    if (basePrice < 60000) return { label: 'Económico', color: 'text-teal-700 bg-teal-50 border-teal-100' };
    if (basePrice < 85000) return { label: 'Estándar', color: 'text-amber-700 bg-amber-50 border-amber-100' };
    return { label: 'Servicio Premium', color: 'text-indigo-700 bg-indigo-50 border-indigo-100' };
  };

  return (
    <div id="servicios-seccion" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            NUESTROS SERVICIOS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            ¿Qué Ofrecemos en el Portal de Mudanzas?
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Disponemos de una flota variada para cubrir todo tipo de necesidades, desde traslados rápidos hasta mudanzas premium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(srv => {
            return (
              <div
                key={srv.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 hover:border-gray-200 shadow-3xs hover:shadow-md transition-all duration-250 flex flex-col justify-between space-y-6"
                role="region"
                aria-label={`Tarjeta del servicio de ${srv.name}`}
              >
                <div className="space-y-4">
                  {/* Service Icon Banner */}
                  <div className="flex justify-between items-center">
                    <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100" aria-hidden="true">
                      {getIcon(srv.icon)}
                    </div>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                      {srv.priceDetail}
                    </span>
                  </div>

                  {/* Header */}
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">{srv.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{srv.description}</p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 pt-2" aria-label={`Características de ${srv.name}`}>
                    {srv.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-emerald-500 font-bold mt-0.5" aria-hidden="true"><Check className="w-3.5 h-3.5" /></span>
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing / CTA */}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold leading-none mb-1">RANGO DE INVERSIÓN</p>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase ${getCostTier(srv.basePrice).color}`}>
                      {getCostTier(srv.basePrice).label}
                    </span>
                  </div>
                  <a
                    id={`cta-srv-${srv.id}`}
                    href="/calculadora"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onPageSelect) {
                        onPageSelect('calculadora');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition cursor-pointer"
                    aria-label={`Calcular volumen para servicio de ${srv.name}`}
                  >
                    Cotizar
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Protection / Trust Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm" role="region" aria-label="Garantía de transporte seguro">
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>GARANTÍA DE TRANSPORTE Y PROTECCIÓN TOTAL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">¿Tus objetos son frágiles o extremadamente pesados?</h3>
            <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
              Contamos con grúas especiales y herramientas específicas para el traslado seguro de pianos, heladeras de doble puerta, equipos industriales de salud o vajilla fina. Nuestro personal cuenta con cursos de estiba técnica homologados.
            </p>
          </div>
          <a
            id="insurance-btn"
            href="/contacto"
            onClick={(e) => {
              e.preventDefault();
              if (onPageSelect) {
                onPageSelect('contacto');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="bg-amber-500 text-gray-950 font-extrabold text-xs px-6 py-3.5 rounded-xl hover:bg-amber-400 transition whitespace-nowrap cursor-pointer"
            aria-label="Obtener más información sobre el seguro de mercancías y cobertura de protección"
          >
            Saber Más Sobre Seguros
          </a>
        </div>
      </div>
    </div>
  );
}
