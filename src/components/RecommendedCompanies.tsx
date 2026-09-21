import React from "react";
import { Calculator, ClipboardList, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";

interface RecommendedCompaniesProps {
  selectedGeographicZone?: string;
  onZoneSelect?: (zoneName: string) => void;
}

/**
 * Commercial handoff for the single provider connected to this implementation.
 * MudanzaPro remains the planning layer; Mudanzas Miranda is the provider layer.
 */
export default function RecommendedCompanies({ selectedGeographicZone, onZoneSelect }: RecommendedCompaniesProps) {
  const handleStartQuote = () => {
    window.dispatchEvent(new CustomEvent("mudanzapro:intent", { detail: { intent: "presupuesto", source: "mudanzapro" } }));
    window.location.hash = "calculadora";
  };

  const handleChecklist = () => {
    window.dispatchEvent(new CustomEvent("mudanzapro:intent", { detail: { intent: "planificar", source: "mudanzapro" } }));
    window.location.hash = "checklist";
  };

  return (
    <section id="soluciones-mudanzapro" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#009966] bg-[#07BE8A]/10 px-3 py-1 rounded-full uppercase tracking-wider">
            MUDANZAPRO · SIGUIENTE PASO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#06434A] tracking-tight">
            Prepará tu solicitud para Mudanzas Miranda
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            MudanzaPro organiza los datos de tu traslado. Mudanzas Miranda es el proveedor al que podés dirigir la solicitud de presupuesto.
          </p>
        </div>

        {selectedGeographicZone && selectedGeographicZone !== "all" && (
          <div className="mt-8 rounded-2xl border border-[#07BE8A]/20 bg-[#07BE8A]/5 p-4 text-center text-sm text-[#06434A]">
            Zona seleccionada: <strong>{selectedGeographicZone}</strong>
            {onZoneSelect && <button type="button" onClick={() => onZoneSelect("all")} className="ml-3 underline underline-offset-2">cambiar</button>}
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-[#06434A]/10 bg-[#FAF9F5] p-7 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold text-[#06434A]">Mudanzas Miranda</p>
              <p className="mt-1 max-w-xl text-sm leading-6 text-gray-600">
                Recibirá la solicitud con los datos que prepares en MudanzaPro. El precio y las condiciones finales se definen al evaluar el traslado real.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-[#06434A]">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#009966]" />Sin precio inventado</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#009966]" />Datos del recorrido</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#009966]" />Solicitud preparada</span>
              </div>
            </div>
            <button type="button" onClick={handleStartQuote} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#06434A] px-5 text-sm font-bold text-white transition hover:bg-[#05373D]">
              Calcular mi mudanza <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <button type="button" onClick={handleStartQuote} className="group rounded-2xl border border-gray-200 bg-white p-6 text-left transition hover:border-[#07BE8A] hover:shadow-md">
            <div className="flex items-center justify-between"><Calculator className="h-6 w-6 text-[#009966]" /><ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#009966]" /></div>
            <h3 className="mt-4 text-lg font-bold text-[#06434A]">Calcular el recorrido</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">Obtené distancia y duración estimadas antes de pedir presupuesto.</p>
          </button>
          <button type="button" onClick={handleChecklist} className="group rounded-2xl border border-gray-200 bg-white p-6 text-left transition hover:border-[#07BE8A] hover:shadow-md">
            <div className="flex items-center justify-between"><ClipboardList className="h-6 w-6 text-[#009966]" /><ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#009966]" /></div>
            <h3 className="mt-4 text-lg font-bold text-[#06434A]">Preparar la mudanza</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">Ordená las tareas antes de enviar la solicitud al proveedor.</p>
          </button>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-sm text-gray-500">
          <MessageSquare className="h-5 w-5 shrink-0 text-[#009966] mt-0.5" />
          <p>MudanzaPro no fija el precio del servicio. Su función es preparar información útil para que Mudanzas Miranda pueda evaluar el traslado.</p>
        </div>
      </div>
    </section>
  );
}
