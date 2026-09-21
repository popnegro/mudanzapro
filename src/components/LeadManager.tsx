import React, { useState } from "react";
import { QuoteLead } from "../types";
import { DEPARTMENTS } from "../data";
import { FolderOpen, Calendar, Search, Phone, Trash2, MessageSquare, ArrowUpRight } from "lucide-react";

interface LeadManagerProps {
  leads: QuoteLead[];
  onUpdateLeadStatus: (leadId: string, newStatus: QuoteLead["status"]) => void;
  onDeleteLead: (leadId: string) => void;
}

export default function LeadManager({ leads, onUpdateLeadStatus, onDeleteLead }: LeadManagerProps) {
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesBrand = filterBrand === "all" || lead.brand === filterBrand;
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    const query = searchTerm.toLowerCase();
    const matchesSearch = lead.customerName.toLowerCase().includes(query) || lead.email.toLowerCase().includes(query) || lead.phone.includes(searchTerm);
    return matchesBrand && matchesStatus && matchesSearch;
  });

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId);
  const departmentName = (id: string) => DEPARTMENTS.find((d) => d.id === id)?.name || id;
  const moveSizeLabel = (size: QuoteLead["moveSize"]) => size === "chico" ? "Pequeña" : size === "mediano" ? "Mediana" : "Grande";
  const formatDate = (value: string) => { try { return new Date(value).toLocaleDateString("es-AR", { dateStyle: "medium" }); } catch { return value; } };
  const getWhatsAppMessage = (lead: QuoteLead) => `Hola ${lead.customerName}. Recibimos tu solicitud de presupuesto para el ${lead.scheduledDate}.\n\nOrigen: ${lead.originAddress || departmentName(lead.originDept)}\nDestino: ${lead.destinationAddress || departmentName(lead.destDept)}\nTamaño: ${moveSizeLabel(lead.moveSize)}${lead.distanceKm ? `\nDistancia: ${lead.distanceKm.toFixed(1)} km` : ""}${lead.routeDurationMinutes ? `\nDuración estimada del recorrido: ${lead.routeDurationMinutes} min` : ""}\n\nPor favor, evaluar el traslado y enviar el presupuesto correspondiente.`;

  return (
    <div id="lead-manager-section" className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 text-white border-b border-gray-950">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">GESTIÓN DE SOLICITUDES</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Solicitudes de presupuesto</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">Panel interno para revisar solicitudes recibidas desde MudanzaPro y preparar el contacto con Mudanzas Miranda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-slate-800 p-5 sm:p-6 rounded-3xl border border-slate-700/60 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-base font-extrabold flex items-center gap-2"><FolderOpen className="w-5 h-5 text-emerald-400" /> Solicitudes ({filteredLeads.length})</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 font-semibold"><option value="all">Todas</option><option value="mendoza">Mudanzas Mendoza</option><option value="miranda">Mudanzas Miranda</option></select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 font-semibold"><option value="all">Todos los estados</option><option value="new">Nuevo</option><option value="contacted">Contactado</option><option value="completed">Completado</option></select>
              </div>
            </div>
            <div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input type="text" placeholder="Buscar por cliente, email o teléfono..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500" /></div>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredLeads.length === 0 ? <div className="text-center py-12 text-slate-500 text-xs">No se encontraron solicitudes.</div> : filteredLeads.map((lead) => {
                const selected = lead.id === selectedLeadId;
                return <button key={lead.id} type="button" onClick={() => setSelectedLeadId(lead.id)} className={`w-full p-4 rounded-2xl border transition-all text-left text-xs ${selected ? "bg-slate-900 border-emerald-500 shadow-md" : "bg-slate-900/45 border-slate-700/50 hover:bg-slate-900/80"}`}>
                  <div className="flex justify-between items-start gap-3"><div className="space-y-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="font-bold text-sm text-white">{lead.customerName}</span><span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{lead.brand === "miranda" ? "MIRANDA" : "MENDOZA"}</span></div><p className="text-[10px] text-slate-400 truncate">{lead.originAddress || departmentName(lead.originDept)} → {lead.destinationAddress || departmentName(lead.destDept)}</p><p className="text-[10px] text-slate-500">Recibido: {formatDate(lead.createdAt)}</p></div><span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${lead.status === "new" ? "bg-emerald-500/10 text-emerald-400" : lead.status === "contacted" ? "bg-amber-500/10 text-amber-400" : "bg-sky-500/10 text-sky-400"}`}>{lead.status === "new" ? "Nuevo" : lead.status === "contacted" ? "Contactado" : "Completado"}</span></div>
                </button>;
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-800 p-5 sm:p-6 rounded-3xl border border-slate-700/60 shadow-xl">
            {selectedLead ? <div className="space-y-6">
              <div className="flex justify-between items-start gap-2 pb-4 border-b border-slate-700/60"><div><span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Solicitud</span><h4 className="text-lg font-black text-white mt-1">{selectedLead.customerName}</h4><p className="text-[10px] text-slate-400 mt-0.5">{selectedLead.email || "Sin email"}</p></div><button type="button" onClick={() => { onDeleteLead(selectedLead.id); setSelectedLeadId(null); }} className="p-2 bg-slate-900 hover:bg-rose-950/45 text-slate-500 hover:text-rose-400 rounded-xl border border-slate-700/50 transition"><Trash2 className="w-4 h-4" /></button></div>
              <div className="grid grid-cols-2 gap-3 text-xs"><div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/40"><span className="text-[9px] text-slate-500 font-bold block">TELÉFONO</span><a href={`tel:${selectedLead.phone}`} className="font-bold text-white mt-1 hover:underline flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-400" />{selectedLead.phone}</a></div><div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/40"><span className="text-[9px] text-slate-500 font-bold block">FECHA ESTIMADA</span><p className="font-bold text-white mt-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-400" />{selectedLead.scheduledDate}</p></div></div>
              <div className="rounded-2xl bg-slate-900/60 p-4 space-y-3"><p className="text-[9px] text-slate-500 font-bold">RECORRIDO</p><p className="text-sm text-white">{selectedLead.originAddress || departmentName(selectedLead.originDept)}</p><p className="text-xs text-slate-500">↓</p><p className="text-sm text-white">{selectedLead.destinationAddress || departmentName(selectedLead.destDept)}</p><div className="flex gap-4 text-xs text-slate-400 pt-2 border-t border-slate-700">{selectedLead.distanceKm ? <span>{selectedLead.distanceKm.toFixed(1)} km</span> : <span>Distancia no disponible</span>}{selectedLead.routeDurationMinutes ? <span>{selectedLead.routeDurationMinutes} min aprox.</span> : null}</div></div>
              <div className="rounded-2xl border border-slate-700 p-4"><p className="text-[9px] text-slate-500 font-bold">TAMAÑO</p><p className="mt-1 text-sm font-bold text-white">{moveSizeLabel(selectedLead.moveSize)}</p></div>
              {selectedLead.notes && <div className="rounded-2xl border border-slate-700 p-4"><p className="text-[9px] text-slate-500 font-bold">OBSERVACIONES</p><p className="mt-1 text-sm text-slate-300 whitespace-pre-wrap">{selectedLead.notes}</p></div>}
              <div className="space-y-2"><span className="text-[9px] text-slate-500 font-bold block">ESTADO</span><div className="grid grid-cols-3 gap-2 text-xs font-bold"><button type="button" onClick={() => onUpdateLeadStatus(selectedLead.id, "new")} className={`px-3 py-2 rounded-xl border ${selectedLead.status === "new" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500" : "bg-slate-900 border-slate-700 text-slate-400"}`}>Nuevo</button><button type="button" onClick={() => onUpdateLeadStatus(selectedLead.id, "contacted")} className={`px-3 py-2 rounded-xl border ${selectedLead.status === "contacted" ? "bg-amber-500/20 text-amber-400 border-amber-500" : "bg-slate-900 border-slate-700 text-slate-400"}`}>Contactado</button><button type="button" onClick={() => onUpdateLeadStatus(selectedLead.id, "completed")} className={`px-3 py-2 rounded-xl border ${selectedLead.status === "completed" ? "bg-sky-500/20 text-sky-400 border-sky-500" : "bg-slate-900 border-slate-700 text-slate-400"}`}>Completado</button></div></div>
              <div className="bg-slate-900 p-4 rounded-2xl"><p className="text-[9px] text-slate-500 font-bold">MENSAJE PARA MIRANDA</p><p className="mt-2 text-xs leading-5 text-slate-300 whitespace-pre-wrap">{getWhatsAppMessage(selectedLead)}</p><a href="https://wa.link/zn3zij" target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#07BE8A] px-4 text-xs font-bold text-[#06434A] hover:bg-[#009966] hover:text-white"><MessageSquare className="w-4 h-4" /> Abrir WhatsApp de Mudanzas Miranda <ArrowUpRight className="w-3.5 h-3.5" /></a></div>
            </div> : <div className="min-h-[360px] flex items-center justify-center text-center text-slate-500 text-sm px-8">Seleccioná una solicitud para revisar sus datos y preparar el contacto con Mudanzas Miranda.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
