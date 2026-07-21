import React, { useState } from "react";
import { QuoteLead } from "../types";
import { DEPARTMENTS, SERVICES } from "../data";
import {
  FolderOpen,
  Calendar,
  Search,
  Phone,
  Trash2,
  MessageSquare,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface LeadManagerProps {
  leads: QuoteLead[];
  onUpdateLeadStatus: (leadId: string, newStatus: QuoteLead["status"]) => void;
  onDeleteLead: (leadId: string) => void;
}

export default function LeadManager({
  leads,
  onUpdateLeadStatus,
  onDeleteLead,
}: LeadManagerProps) {
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Aggregate availability based on current leads
  const dateAvailability = React.useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      if (l.scheduledDate) {
        counts[l.scheduledDate] = (counts[l.scheduledDate] || 0) + 1;
      }
    });
    return counts;
  }, [leads]);

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesBrand = filterBrand === "all" || lead.brand === filterBrand;
    const matchesStatus =
      filterStatus === "all" || lead.status === filterStatus;
    const matchesSearch =
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    return matchesBrand && matchesStatus && matchesSearch;
  });

  const selectedLead = leads.find((l) => l.id === selectedLeadId);

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return (
        date.toLocaleDateString("es-AR", { dateStyle: "medium" }) +
        " " +
        date.toLocaleTimeString("es-AR", { timeStyle: "short" })
      );
    } catch {
      return isoString;
    }
  };

  // Generate WhatsApp text mock helper
  const getWhatsAppMessage = (lead: QuoteLead) => {
    const originName =
      DEPARTMENTS.find((d) => d.id === lead.originDept)?.name ||
      lead.originDept;
    const destName =
      DEPARTMENTS.find((d) => d.id === lead.destDept)?.name || lead.destDept;
    const servicesName =
      lead.servicesSelected
        .map((id) => SERVICES.find((s) => s.id === id)?.name)
        .join(", ") || "Mudanza Básica";

    return `Hola ${lead.customerName}! Te escribimos de Mudanzas Mendoza. Recibimos tu cotización online para el día ${lead.scheduledDate}. 

*Detalles del Servicio:*
• Origen: ${originName}
• Destino: ${destName}
• Servicios: ${servicesName}
• Precio Estimado: $${lead.estimatedCost.toLocaleString("es-AR")}

¿Te gustaría confirmar los horarios y reservar la fecha?`;
  };

  return (
    <div
      id="lead-manager-section"
      className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 text-white border-b border-gray-950"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/20">
            SIMULADOR OPERATIVO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Panel de Gestión de Leads Capturados
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Simula cómo tu equipo recibe, filtra y responde a las solicitudes de
            cotizaciones del portal SEO en tiempo real. ¡Prueba agregando un
            lead en el cotizador!
          </p>
        </div>

        {/* Filters and Table Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Leads List (Left 7 cols) */}
          <div className="lg:col-span-7 bg-slate-800 p-5 sm:p-6 rounded-3xl border border-slate-700/60 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-amber-400" />
                Listado de Leads ({filteredLeads.length})
              </h3>

              {/* Reset to show all buttons */}
              <div className="flex flex-wrap gap-2 text-xs">
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none text-slate-300 font-semibold"
                >
                  <option value="all">Todas las Marcas</option>
                  <option value="mendoza">Mudanzas Mendoza</option>
                  <option value="miranda">Mudanzas Miranda</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none text-slate-300 font-semibold"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="new">Nuevos 🟢</option>
                  <option value="contacted">Contactado 🟡</option>
                  <option value="completed">Completado 🔵</option>
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-500 font-medium"
              />
            </div>

            {/* Leads Table List */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No se encontraron solicitudes con los filtros aplicados.
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = lead.id === selectedLeadId;
                  const originName =
                    DEPARTMENTS.find((d) => d.id === lead.originDept)?.name ||
                    lead.originDept;
                  const destName =
                    DEPARTMENTS.find((d) => d.id === lead.destDept)?.name ||
                    lead.destDept;

                  return (
                    <div
                      key={lead.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs ${
                        isSelected
                          ? "bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/10"
                          : "bg-slate-900/45 border-slate-700/50 hover:bg-slate-900/80"
                      }`}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setSelectedLeadId(lead.id)
                      }
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-sm text-white">
                              {lead.customerName}
                            </span>
                            <span
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${
                                lead.brand === "mendoza"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                              }`}
                            >
                              {lead.brand === "mendoza" ? "MENDOZA" : "MIRANDA"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {originName} ➔ {destName}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Solicitado: {formatDate(lead.createdAt)}
                          </p>
                        </div>

                        <div className="text-right space-y-1.5">
                          <p className="text-xs font-black text-amber-400">
                            ${lead.estimatedCost.toLocaleString("es-AR")}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              lead.status === "new"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : lead.status === "contacted"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-sky-500/10 text-sky-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                lead.status === "new"
                                  ? "bg-emerald-400 animate-pulse"
                                  : lead.status === "contacted"
                                    ? "bg-amber-400"
                                    : "bg-sky-400"
                              }`}
                            />
                            {lead.status === "new"
                              ? "Nuevo"
                              : lead.status === "contacted"
                                ? "Contactado"
                                : "Completado"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Lead Details & Operations Panel (Right 5 cols) */}
          <div className="lg:col-span-5 bg-slate-800 p-5 sm:p-6 rounded-3xl border border-slate-700/60 shadow-xl space-y-6">
            {selectedLead ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start gap-2 pb-4 border-b border-slate-700/60">
                  <div>
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">
                      ID SOLICITUD: {selectedLead.id}
                    </span>
                    <h4 className="text-lg font-black text-white mt-1">
                      {selectedLead.customerName}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {selectedLead.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onDeleteLead(selectedLead.id);
                      setSelectedLeadId(null);
                    }}
                    className="p-2 bg-slate-900 hover:bg-rose-950/45 text-slate-500 hover:text-rose-400 rounded-xl border border-slate-700/50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info blocks */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/40">
                    <span className="text-[9px] text-slate-500 font-bold block">
                      TELÉFONO
                    </span>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="font-bold text-white mt-1 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      {selectedLead.phone}
                    </a>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/40 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block">
                        FECHA AGENDADA
                      </span>
                      <p className="font-bold text-white mt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        {selectedLead.scheduledDate}
                      </p>
                    </div>
                    {(() => {
                      const count =
                        dateAvailability[selectedLead.scheduledDate] || 0;
                      if (count > 1) {
                        return (
                          <span className="text-[8px] leading-tight text-rose-400 font-black bg-rose-500/10 px-1.5 py-0.5 rounded-md mt-2 block border border-rose-500/20 text-center uppercase tracking-wider">
                            ⚠ Flota Saturada ({count} Solicitudes)
                          </span>
                        );
                      } else {
                        return (
                          <span className="text-[8px] leading-tight text-emerald-400 font-black bg-emerald-500/10 px-1.5 py-0.5 rounded-md mt-2 block border border-emerald-500/20 text-center uppercase tracking-wider">
                            ✔ Flota con Cupo Libre
                          </span>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* Status operations */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 font-bold block">
                    CAMBIAR ESTADO DE LA SOLICITUD
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    <button
                      onClick={() => onUpdateLeadStatus(selectedLead.id, "new")}
                      className={`px-3 py-2 rounded-xl transition cursor-pointer border ${
                        selectedLead.status === "new"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500"
                          : "bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white"
                      }`}
                    >
                      Nuevo
                    </button>
                    <button
                      onClick={() =>
                        onUpdateLeadStatus(selectedLead.id, "contacted")
                      }
                      className={`px-3 py-2 rounded-xl transition cursor-pointer border ${
                        selectedLead.status === "contacted"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500"
                          : "bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white"
                      }`}
                    >
                      Contactar
                    </button>
                    <button
                      onClick={() =>
                        onUpdateLeadStatus(selectedLead.id, "completed")
                      }
                      className={`px-3 py-2 rounded-xl transition cursor-pointer border ${
                        selectedLead.status === "completed"
                          ? "bg-sky-500/20 text-sky-400 border-sky-500"
                          : "bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white"
                      }`}
                    >
                      Completar
                    </button>
                  </div>
                </div>

                {/* WhatsApp Auto-Message Simulator */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700/50 space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-extrabold tracking-wide uppercase">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <MessageSquare className="w-3.5 h-3.5" /> WHATSAPP
                      AUTOMÁTICO
                    </span>
                    <span>Copiar para enviar</span>
                  </div>
                  <pre className="text-[10px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-xl max-h-[140px] overflow-y-auto">
                    {getWhatsAppMessage(selectedLead)}
                  </pre>
                  <a
                    id="whatsapp-trigger"
                    href={`https://wa.me/${selectedLead.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(getWhatsAppMessage(selectedLead))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" /> Enviar por WhatsApp
                    Real
                  </a>
                </div>

                {selectedLead.notes && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold block">
                      NOTAS INTERNAS / CLIENTE
                    </span>
                    <p className="text-xs text-slate-300 italic bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
                      "{selectedLead.notes}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-3 text-slate-500 border-b border-slate-700/45">
                  <Clock className="w-8 h-8 text-slate-600 animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400">
                      Ningún Lead Seleccionado
                    </p>
                    <p className="text-[10px] text-slate-500 max-w-xs">
                      Selecciona un lead de la izquierda para ver el detalle y
                      gestionar la comunicación comercial.
                    </p>
                  </div>
                </div>

                {/* Fleet Availability Calendar Dashboard */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <Calendar className="w-4 h-4" /> Control de Disponibilidad
                    Operativa
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Sincronización en tiempo real de la flota de camiones basada
                    en las solicitudes agendadas de los usuarios en Mendoza.
                  </p>

                  <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700/50 space-y-3">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                      ESTADO DE RESERVAS DE FLOTA
                    </span>
                    {Object.keys(dateAvailability).length === 0 ? (
                      <p className="text-[10px] text-slate-500 text-center py-4 italic">
                        No hay mudanzas agendadas por el momento. Toda la flota
                        está libre.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        {Object.entries(dateAvailability)
                          .sort(
                            (a, b) =>
                              new Date(a[0]).getTime() -
                              new Date(b[0]).getTime(),
                          )
                          .map(([dateStr, count]) => {
                            const dateObj = new Date(dateStr + "T00:00:00");
                            const countNum = count as number;
                            const isSaturated = countNum > 1;
                            return (
                              <div
                                key={dateStr}
                                className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs"
                              >
                                <div className="space-y-0.5 text-left">
                                  <p className="font-bold text-slate-200">
                                    {dateObj.toLocaleDateString("es-AR", {
                                      day: "numeric",
                                      month: "short",
                                      weekday: "short",
                                    })}
                                  </p>
                                  <p className="text-[9px] text-slate-500">
                                    {dateStr}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                                      isSaturated
                                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    }`}
                                  >
                                    {isSaturated
                                      ? `⚠️ SATURADA (${countNum} mudanzas)`
                                      : `🟢 DISPONIBLE (${countNum} mudanza)`}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                    💡 <strong>Consejo del Operador:</strong> Cuando un día
                    tenga el estado{" "}
                    <span className="text-rose-400 font-bold">⚠️ SATURADO</span>
                    , contacta al cliente para ofrecerle un incentivo por cambio
                    de fecha (por ej. mudar el día anterior con 10% de
                    descuento) y optimizar la capacidad de carga.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
