import React from "react";
import { Calculator, ClipboardList, MessageSquare, ArrowRight } from "lucide-react";

interface RecommendedCompaniesProps {
  selectedGeographicZone?: string;
  onZoneSelect?: (zoneName: string) => void;
  onViewModeChange?: (mode: "user" | "dashboard") => void;
}

/**
 * MudanzaPro conversion layer.
 *
 * This component intentionally does not publish a provider directory.
 * Provider claims, ratings, prices and "verified" labels require a maintained
 * source of truth and must not be presented as factual by the neutral planning
 * layer. The commercial handoff belongs to the provider layer (e.g. Mudanzas
 * Miranda) after the user has completed the planning/quote flow.
 */
export default function RecommendedCompanies({
  selectedGeographicZone,
  onZoneSelect,
}: RecommendedCompaniesProps) {
  const handleStartQuote = () => {
    window.dispatchEvent(new CustomEvent("mudanzapro:intent", {
      detail: { intent: "presupuesto", source: "mudanzapro" },
    }));
    window.location.hash = "calculadora";
  };

  const handleChecklist = () => {
    window.dispatchEvent(new CustomEvent("mudanzapro:intent", {
      detail: { intent: "planificar", source: "mudanzapro" },
    }));
    window.location.hash = "checklist";
  };

  return (
    <section id="soluciones-mudanzapro" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">MUDANZAPRO · QUÉ HACER</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Pasá de la información a la acción</h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">MudanzaPro es la capa de planificación y conversión. Te ayuda a estimar, ordenar y preparar tu mudanza antes de solicitar una cotización a un proveedor.</p>
        </div>

        {selectedGeographicZone && selectedGeographicZone !== "all" && (
          <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-center text-sm text-amber-900">
            Zona seleccionada: <strong>{selectedGeographicZone}</strong>
            {onZoneSelect && <button type="button" onClick={() => onZoneSelect("all")} className="ml-3 underline underline-offset-2">cambiar</button>}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5 mt-10">
          <button type="button" onClick={handleStartQuote} className="group text-left rounded-3xl border border-gray-200 bg-slate-50 p-7 hover:border-amber-400 hover:shadow-md transition">
            <div className="flex items-center justify-between"><Calculator className="w-7 h-7 text-amber-600" /><ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition" /></div>
            <h3 className="mt-5 text-xl font-bold text-gray-900">Estimar mi mudanza</h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">Organizá los datos principales del traslado y prepará una base para pedir un presupuesto.</p>
          </button>

          <button type="button" onClick={handleChecklist} className="group text-left rounded-3xl border border-gray-200 bg-slate-50 p-7 hover:border-amber-400 hover:shadow-md transition">
            <div className="flex items-center justify-between"><ClipboardList className="w-7 h-7 text-amber-600" /><ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition" /></div>
            <h3 className="mt-5 text-xl font-bold text-gray-900">Planificar mi mudanza</h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">Usá el checklist para ordenar tareas, embalaje y decisiones antes del día del traslado.</p>
          </button>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-sm text-gray-500">
          <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>MudanzaPro no se presenta como una empresa de mudanzas ni como un directorio de prestadores. La contratación se deriva a la marca o proveedor correspondiente una vez definido el servicio.</p>
        </div>
      </div>
    </section>
  );
}
