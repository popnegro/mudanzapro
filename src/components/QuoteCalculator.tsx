import React, { useState } from "react";
import { QuoteLead, BrandConfig, MoveSize } from "../types";
import { ArrowLeft, ArrowRight, Check, MapPin, Route, Clock3 } from "lucide-react";
import AddressAutocomplete from "./AddressAutocomplete";

interface QuoteCalculatorProps {
  activeBrand: BrandConfig;
  onNewLeadCreated: (lead: QuoteLead) => void;
  onZoneSelect?: (zone: string) => void;
  onViewModeChange?: (mode: "user" | "dashboard") => void;
}

const MOVE_OPTIONS: { id: MoveSize; label: string; detail: string }[] = [
  { id: "chico", label: "Pequeña", detail: "Monoambiente o pocos muebles" },
  { id: "mediano", label: "Mediana", detail: "1–2 dormitorios" },
  { id: "grande", label: "Grande", detail: "3 o más dormitorios" },
];

const getRegionForDept = (id: string) => {
  if (["tunuyan", "tupungato", "san_carlos"].includes(id)) return "Valle de Uco";
  if (["san_rafael", "general_alvear", "malargue"].includes(id)) return "Zona Sur";
  return "Gran Mendoza";
};

interface RouteEstimate {
  distanceKm: number;
  durationMinutes: number | null;
  distanceText: string;
  durationText: string | null;
  source: "google-routes";
}

export default function QuoteCalculator({ activeBrand, onNewLeadCreated, onZoneSelect }: QuoteCalculatorProps) {
  const [step, setStep] = useState(1);
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [originCoords, setOriginCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [originDept, setOriginDept] = useState("capital");
  const [destDept, setDestDept] = useState("godoy_cruz");
  const [scheduledDate, setScheduledDate] = useState("");
  const [moveSize, setMoveSize] = useState<MoveSize>("mediano");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [routeEstimate, setRouteEstimate] = useState<RouteEstimate | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const calculateRoute = async () => {
    setRouteLoading(true);
    setRouteError("");
    try {
      const response = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: { address: originAddress, ...(originCoords ? { latLng: originCoords } : {}) },
          destination: { address: destinationAddress, ...(destinationCoords ? { latLng: destinationCoords } : {}) },
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.code || "ROUTES_API_ERROR");
      setRouteEstimate(payload as RouteEstimate);
    } catch (routeCalculationError) {
      console.error("Route calculation failed", routeCalculationError);
      setRouteEstimate(null);
      setRouteError("No pudimos calcular el recorrido ahora. Podés continuar y solicitar el presupuesto igualmente.");
    } finally {
      setRouteLoading(false);
    }
  };

  const handleAddress = (kind: "origin" | "destination", address: string, departmentId: string, lat?: number, lng?: number) => {
    const coordinates = typeof lat === "number" && typeof lng === "number" ? { latitude: lat, longitude: lng } : null;
    if (kind === "origin") {
      setOriginAddress(address);
      setOriginCoords(coordinates);
      if (departmentId) {
        setOriginDept(departmentId);
        onZoneSelect?.(getRegionForDept(departmentId));
      }
    } else {
      setDestinationAddress(address);
      setDestinationCoords(coordinates);
      if (departmentId) setDestDept(departmentId);
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!originAddress.trim() || !destinationAddress.trim()) {
        setError("Completá origen y destino.");
        return false;
      }
      if (!scheduledDate) {
        setError("Indicá la fecha estimada de mudanza.");
        return false;
      }
    }
    if (step === 3) {
      if (!customerName.trim() || customerName.trim().length < 2) {
        setError("Indicá tu nombre.");
        return false;
      }
      if (!phone.trim() || phone.replace(/\D/g, "").length < 8) {
        setError("Indicá un teléfono válido.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const next = async () => {
    if (!validateStep()) return;
    if (step === 1 && !routeEstimate) await calculateRoute();
    setStep((current) => Math.min(current + 1, 3));
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep()) return;
    const lead: QuoteLead = {
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      brand: "miranda",
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      originDept,
      destDept,
      originAddress: originAddress.trim(),
      destinationAddress: destinationAddress.trim(),
      moveSize,
      furnitureList: [],
      servicesSelected: [],
      ...(routeEstimate ? { distanceKm: routeEstimate.distanceKm } : {}),
      scheduledDate,
      estimatedCost: 0,
      routeDurationMinutes: routeEstimate?.durationMinutes ?? undefined,
      status: "new",
      notes: notes.trim() || undefined,
    };
    onNewLeadCreated(lead);
    setSuccess(true);
  };

  if (success) {
    return (
      <section className="bg-[#FAF9F5] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#06434A]/10 bg-white p-8 shadow-sm sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#07BE8A]/10 text-[#009966]"><Check className="h-6 w-6" /></div>
          <h2 className="mt-5 text-center text-2xl font-bold tracking-tight text-[#06434A]">Mudanzas Miranda puede evaluar tu traslado</h2>
          <p className="mt-3 text-center text-sm leading-6 text-slate-600">Ya tenemos los datos básicos del recorrido. El siguiente paso es solicitar un presupuesto con las condiciones reales de tu mudanza.</p>
          <div className="mt-6 rounded-2xl bg-[#FAF9F5] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#009966]">Tu traslado</p>
            <p className="mt-2 text-sm font-semibold text-[#06434A]">{originAddress}</p>
            <p className="py-1 text-xs text-slate-400">↓</p>
            <p className="text-sm font-semibold text-[#06434A]">{destinationAddress}</p>
            {routeEstimate && <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-200 pt-4 text-xs text-slate-600"><span className="inline-flex items-center gap-1.5"><Route className="h-3.5 w-3.5 text-[#009966]" />{routeEstimate.distanceText}</span>{routeEstimate.durationText && <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-[#009966]" />{routeEstimate.durationText}</span>}</div>}
          </div>
          <div className="mt-5 rounded-2xl border border-[#06434A]/10 p-5">
            <p className="text-lg font-bold text-[#06434A]">Mudanzas Miranda</p>
            <p className="mt-1 text-sm text-slate-600">Proveedor para solicitar el presupuesto de tu traslado.</p>
            <a href="https://wa.link/zn3zij" target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-[#07BE8A] px-5 text-sm font-bold text-[#06434A] transition hover:bg-[#009966] hover:text-white">Hablar con Mudanzas Miranda por WhatsApp</a>
          </div>
          <button type="button" onClick={() => { setSuccess(false); setStep(1); }} className="mt-5 min-h-11 w-full rounded-xl border border-slate-200 px-5 text-sm font-semibold text-[#06434A]">Modificar datos</button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FAF9F5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-7">
          <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-500"><span>Paso {step} de 3</span><span>{step === 1 ? "Trayecto" : step === 2 ? "Tamaño" : "Contacto"}</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-[#07BE8A] transition-all" style={{ width: `${(step / 3) * 100}%` }} /></div>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-[#06434A]/10 bg-white p-5 shadow-sm sm:p-8">
          {step === 1 && <div className="space-y-6">
            <div><h1 className="text-2xl font-bold tracking-tight text-[#06434A]">¿De dónde a dónde?</h1><p className="mt-1 text-sm text-slate-500">Usamos el recorrido para conocer la distancia real del traslado.</p></div>
            <div className="space-y-4">
              <AddressAutocomplete value={originAddress} onChange={(value) => { setOriginAddress(value); setOriginCoords(null); setRouteEstimate(null); }} onSelectAddress={(address, departmentId, lat, lng) => handleAddress("origin", address, departmentId, lat, lng)} placeholder="Dirección de origen" label="Origen" brandId="mendoza" />
              <AddressAutocomplete value={destinationAddress} onChange={(value) => { setDestinationAddress(value); setDestinationCoords(null); setRouteEstimate(null); }} onSelectAddress={(address, departmentId, lat, lng) => handleAddress("destination", address, departmentId, lat, lng)} placeholder="Dirección de destino" label="Destino" brandId="mendoza" />
              <div><label htmlFor="scheduled-date" className="mb-2 block text-sm font-semibold text-slate-700">Fecha estimada</label><input id="scheduled-date" type="date" value={scheduledDate} min={new Date().toISOString().split("T")[0]} onChange={(event) => setScheduledDate(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#07BE8A] focus:ring-2 focus:ring-[#07BE8A]/15" /></div>
            </div>
          </div>}

          {step === 2 && <div className="space-y-6">
            <div><h2 className="text-2xl font-bold tracking-tight text-[#06434A]">¿Qué tamaño tiene?</h2><p className="mt-1 text-sm text-slate-500">Elegí una aproximación. No usamos este dato para inventar un precio.</p></div>
            <div className="grid gap-3">{MOVE_OPTIONS.map((option) => { const selected = moveSize === option.id; return <button key={option.id} type="button" onClick={() => setMoveSize(option.id)} className={`min-h-16 rounded-2xl border p-4 text-left transition ${selected ? "border-[#07BE8A] bg-[#07BE8A]/5 ring-2 ring-[#07BE8A]/10" : "border-slate-200 bg-white hover:border-slate-300"}`}><span className="block text-sm font-bold text-[#06434A]">{option.label}</span><span className="mt-0.5 block text-xs text-slate-500">{option.detail}</span></button>; })}</div>
            <div className="rounded-2xl bg-[#FAF9F5] p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#009966]">Datos del recorrido</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-2 text-sm text-slate-700"><MapPin className="h-4 w-4 text-[#009966]" />{routeEstimate?.distanceText || "Distancia no disponible"}</div><div className="flex items-center gap-2 text-sm text-slate-700"><Clock3 className="h-4 w-4 text-[#009966]" />{routeEstimate?.durationText || "Duración no disponible"}</div></div>{routeLoading && <p className="mt-3 text-xs text-slate-500">Calculando recorrido...</p>}{routeError && <p className="mt-3 text-xs leading-5 text-slate-500">{routeError}</p>}</div>
          </div>}

          {step === 3 && <div className="space-y-6">
            <div><h2 className="text-2xl font-bold tracking-tight text-[#06434A]">¿Cómo te contactamos?</h2><p className="mt-1 text-sm text-slate-500">Estos datos se usan para solicitar el presupuesto a Mudanzas Miranda.</p></div>
            <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><label htmlFor="customer-name" className="mb-2 block text-sm font-semibold text-slate-700">Nombre</label><input id="customer-name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Tu nombre" autoComplete="name" className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#07BE8A] focus:ring-2 focus:ring-[#07BE8A]/15" /></div><div><label htmlFor="customer-phone" className="mb-2 block text-sm font-semibold text-slate-700">Teléfono</label><input id="customer-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Tu teléfono" autoComplete="tel" inputMode="tel" className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#07BE8A] focus:ring-2 focus:ring-[#07BE8A]/15" /></div><div><label htmlFor="customer-email" className="mb-2 block text-sm font-semibold text-slate-700">Email <span className="font-normal text-slate-400">(opcional)</span></label><input id="customer-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@email.com" autoComplete="email" className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#07BE8A] focus:ring-2 focus:ring-[#07BE8A]/15" /></div></div>
            <div><label htmlFor="quote-notes" className="mb-2 block text-sm font-semibold text-slate-700">Observaciones <span className="font-normal text-slate-400">(opcional)</span></label><textarea id="quote-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Piano, muebles grandes, acceso complicado..." className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#07BE8A] focus:ring-2 focus:ring-[#07BE8A]/15" /></div>
            <div className="rounded-2xl bg-[#06434A] p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-[#07BE8A]">Siguiente paso</p><p className="mt-2 text-sm leading-6 text-white/80">Al enviar, tu solicitud queda preparada para pedir un presupuesto a Mudanzas Miranda. El precio final lo determina la empresa según las condiciones reales del traslado.</p></div>
          </div>}

          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
          <div className="mt-7 flex gap-3">{step > 1 && <button type="button" onClick={back} className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-[#06434A]"><ArrowLeft className="mr-1 inline h-4 w-4" /> Atrás</button>}{step < 3 ? <button type="button" onClick={next} disabled={routeLoading} className="min-h-11 flex-1 rounded-xl bg-[#06434A] px-5 text-sm font-bold text-white transition hover:bg-[#07545c] disabled:cursor-wait disabled:opacity-60">{routeLoading ? "Calculando recorrido..." : "Continuar"} <ArrowRight className="ml-1 inline h-4 w-4" /></button> : <button type="submit" className="min-h-11 flex-1 rounded-xl bg-[#07BE8A] px-5 text-sm font-bold text-[#06434A] transition hover:bg-[#009966] hover:text-white">Solicitar presupuesto a Mudanzas Miranda</button>}</div>
        </form>
      </div>
    </section>
  );
}
