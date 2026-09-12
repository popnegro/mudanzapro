import React, { useMemo, useState } from "react";
import { QuoteLead, BrandConfig, MoveSize } from "../types";
import { DEPARTMENTS } from "../data";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import AddressAutocomplete from "./AddressAutocomplete";

interface QuoteCalculatorProps {
  activeBrand: BrandConfig;
  onNewLeadCreated: (lead: QuoteLead) => void;
  onZoneSelect?: (zone: string) => void;
  onViewModeChange?: (mode: "user" | "dashboard") => void;
}

const MOVE_OPTIONS: { id: MoveSize; label: string; detail: string; points: number }[] = [
  { id: "chico", label: "Pequeña", detail: "Monoambiente o pocos muebles", points: 10 },
  { id: "mediano", label: "Mediana", detail: "1–2 dormitorios", points: 30 },
  { id: "grande", label: "Grande", detail: "3 o más dormitorios", points: 55 },
];

const getRegionForDept = (id: string) => {
  if (["tunuyan", "tupungato", "san_carlos"].includes(id)) return "Valle de Uco";
  if (["san_rafael", "general_alvear", "malargue"].includes(id)) return "Zona Sur";
  return "Gran Mendoza";
};

export default function QuoteCalculator({
  activeBrand,
  onNewLeadCreated,
  onZoneSelect,
}: QuoteCalculatorProps) {
  const [step, setStep] = useState(1);
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [originDept, setOriginDept] = useState("capital");
  const [destDept, setDestDept] = useState("godoy_cruz");
  const [scheduledDate, setScheduledDate] = useState("");
  const [moveSize, setMoveSize] = useState<MoveSize>("mediano");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const distanceKm = useMemo(() => {
    if (originDept === destDept) return 8;
    if (originDept === "san_rafael" || destDept === "san_rafael") return 230;
    return 18;
  }, [originDept, destDept]);

  const estimatedCost = useMemo(() => {
    const option = MOVE_OPTIONS.find((item) => item.id === moveSize)!;
    const origin = DEPARTMENTS.find((item) => item.id === originDept);
    const destination = DEPARTMENTS.find((item) => item.id === destDept);
    const multiplier = ((origin?.baseRateMultiplier || 1) + (destination?.baseRateMultiplier || 1)) / 2;
    const distanceCost = Math.max(0, distanceKm - 10) * 1200;
    return Math.round((45000 + distanceCost + Math.max(0, option.points - 15) * 1500) * multiplier);
  }, [distanceKm, destDept, moveSize, originDept]);

  const handleAddress = (kind: "origin" | "destination", address: string, departmentId: string) => {
    if (kind === "origin") {
      setOriginAddress(address);
      if (departmentId) {
        setOriginDept(departmentId);
        onZoneSelect?.(getRegionForDept(departmentId));
      }
    } else {
      setDestinationAddress(address);
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

  const next = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, 3));
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep()) return;
    const option = MOVE_OPTIONS.find((item) => item.id === moveSize)!;
    const lead: QuoteLead = {
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      brand: activeBrand.id,
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
      distanceKm,
      hasElevatorOrigin: true,
      hasElevatorDest: true,
      floorOrigin: 0,
      floorDest: 0,
      scheduledDate,
      estimatedCost,
      status: "new",
      notes: notes.trim() || `Tamaño estimado: ${option.label}`,
    };
    onNewLeadCreated(lead);
    setSuccess(true);
  };

  if (success) {
    return (
      <section className="bg-[#FAF9F5] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#06434A]/10 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#07BE8A]/10 text-[#009966]"><Check className="h-6 w-6" /></div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#06434A]">Solicitud enviada</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Recibimos tus datos. La estimación orientativa es de <strong>${estimatedCost.toLocaleString("es-AR")}</strong>.</p>
          <button type="button" onClick={() => { setSuccess(false); setStep(1); }} className="mt-6 min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-[#06434A]">Hacer otra cotización</button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FAF9F5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-7">
          <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-500"><span>Paso {step} de 3</span><span>{step === 1 ? "Trayecto" : step === 2 ? "Mudanza" : "Contacto"}</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-[#07BE8A] transition-all" style={{ width: `${(step / 3) * 100}%` }} /></div>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-[#06434A]/10 bg-white p-5 shadow-sm sm:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div><h1 className="text-2xl font-bold tracking-tight text-[#06434A]">¿De dónde a dónde?</h1><p className="mt-1 text-sm text-slate-500">Origen, destino y fecha. Nada más.</p></div>
              <div className="space-y-4">
                <AddressAutocomplete value={originAddress} onChange={setOriginAddress} onSelectAddress={(address, departmentId) => handleAddress("origin", address, departmentId)} placeholder="Dirección de origen" label="Origen" brandId={activeBrand.id} />
                <AddressAutocomplete value={destinationAddress} onChange={setDestinationAddress} onSelectAddress={(address, departmentId) => handleAddress("destination", address, departmentId)} placeholder="Dirección de destino" label="Destino" brandId={activeBrand.id} />
                <div><label htmlFor="scheduled-date" className="mb-2 block text-sm font-semibold text-slate-700">Fecha estimada</label><input id="scheduled-date" type="date" value={scheduledDate} min={new Date().toISOString().split("T")[0]} onChange={(event) => setScheduledDate(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#07BE8A] focus:ring-2 focus:ring-[#07BE8A]/15" /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div><h2 className="text-2xl font-bold tracking-tight text-[#06434A]">¿Qué tamaño tiene?</h2><p className="mt-1 text-sm text-slate-500">Una aproximación es suficiente.</p></div>
              <div className="grid gap-3">
                {MOVE_OPTIONS.map((option) => { const selected = moveSize === option.id; return <button key={option.id} type="button" onClick={() => setMoveSize(option.id)} className={`min-h-16 rounded-2xl border p-4 text-left transition ${selected ? "border-[#07BE8A] bg-[#07BE8A]/5 ring-2 ring-[#07BE8A]/10" : "border-slate-200 bg-white hover:border-slate-300"}`}><span className="block text-sm font-bold text-[#06434A]">{option.label}</span><span className="mt-0.5 block text-xs text-slate-500">{option.detail}</span></button>; })}
              </div>
              <div className="rounded-2xl bg-[#FAF9F5] p-4"><div className="flex items-end justify-between gap-4"><span className="text-sm font-semibold text-slate-600">Estimación orientativa</span><strong className="text-xl text-[#06434A]">${estimatedCost.toLocaleString("es-AR")}</strong></div></div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div><h2 className="text-2xl font-bold tracking-tight text-[#06434A]">¿Cómo te contactamos?</h2><p className="mt-1 text-sm text-slate-500">Nombre y teléfono son suficientes.</p></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label htmlFor="customer-name" className="mb-2 block text-sm font-semibold text-slate-700">Nombre</label><input id="customer-name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Tu nombre" autoComplete="name" className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#07BE8A] focus:ring-2 focus:ring-[#07BE8A]/15" /></div>
                <div><label htmlFor="customer-phone" className="mb-2 block text-sm font-semibold text-slate-700">Teléfono</label><input id="customer-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="11 1234 5678" autoComplete="tel" inputMode="tel" className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#07BE8A] focus:ring-2 focus:ring-[#07BE8A]/15" /></div>
                <div><label htmlFor="customer-email" className="mb-2 block text-sm font-semibold text-slate-700">Email <span className="font-normal text-slate-400">(opcional)</span></label><input id="customer-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@email.com" autoComplete="email" className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#07BE8A] focus:ring-2 focus:ring-[#07BE8A]/15" /></div>
              </div>
              <div><label htmlFor="quote-notes" className="mb-2 block text-sm font-semibold text-slate-700">Observaciones <span className="font-normal text-slate-400">(opcional)</span></label><textarea id="quote-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Piano, muebles grandes, acceso complicado..." className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#07BE8A] focus:ring-2 focus:ring-[#07BE8A]/15" /></div>
              <div className="rounded-2xl bg-[#06434A] p-5 text-white"><div className="flex items-center justify-between gap-4"><span className="text-sm text-white/70">Estimación orientativa</span><strong className="text-xl">${estimatedCost.toLocaleString("es-AR")}</strong></div></div>
            </div>
          )}

          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
          <div className="mt-7 flex gap-3">
            {step > 1 && <button type="button" onClick={back} className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-[#06434A]"><ArrowLeft className="mr-1 inline h-4 w-4" /> Atrás</button>}
            {step < 3 ? <button type="button" onClick={next} className="min-h-11 flex-1 rounded-xl bg-[#06434A] px-5 text-sm font-bold text-white transition hover:bg-[#07545c]">Continuar <ArrowRight className="ml-1 inline h-4 w-4" /></button> : <button type="submit" className="min-h-11 flex-1 rounded-xl bg-[#07BE8A] px-5 text-sm font-bold text-[#06434A] transition hover:bg-[#009966] hover:text-white">Solicitar presupuesto</button>}
          </div>
        </form>
      </div>
    </section>
  );
}
