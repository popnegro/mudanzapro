import React, { useState, useEffect } from "react";
import { QuoteLead, BrandConfig, MoveSize } from "../types";
import { DEPARTMENTS, SERVICES, FURNITURE_ITEMS } from "../data";
import {
  Sparkles,
  Plus,
  Minus,
  Trash2,
  Mail,
  Phone,
  User,
  Calendar,
  Check,
  AlertCircle,
  Info,
  ArrowRight,
  Truck,
  Clock,
  ShieldCheck,
} from "lucide-react";
import AddressAutocomplete from "./AddressAutocomplete";

interface QuoteCalculatorProps {
  activeBrand: BrandConfig;
  onNewLeadCreated: (lead: QuoteLead) => void;
  onZoneSelect?: (zone: string) => void;
  onViewModeChange?: (mode: "user" | "dashboard") => void;
}

export default function QuoteCalculator({
  activeBrand,
  onNewLeadCreated,
  onZoneSelect,
  onViewModeChange,
}: QuoteCalculatorProps) {
  // Wizard steps
  const [step, setStep] = useState<number>(1);
  const [success, setSuccess] = useState<boolean>(false);

  // Address states for autocompletion
  const [originAddress, setOriginAddress] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [originLatLng, setOriginLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destinationLatLng, setDestinationLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Form state
  const [origin, setOrigin] = useState<string>("capital");
  const [destination, setDestination] = useState<string>("godoy_cruz");
  const [hasElevatorOrigin, setHasElevatorOrigin] = useState<boolean>(true);
  const [hasElevatorDest, setHasElevatorDest] = useState<boolean>(true);
  const [floorOrigin, setFloorOrigin] = useState<number>(0);
  const [floorDest, setFloorDest] = useState<number>(0);
  const [moveSize, setMoveSize] = useState<MoveSize>("mediano");

  // Selected furniture items
  const [selectedFurniture, setSelectedFurniture] = useState<
    Record<string, number>
  >({
    sofa_3c: 1,
    cama_mat: 1,
    heladera: 1,
    lavarropas: 1,
    caja_g: 5,
  });

  // Services State
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "mudanza_premium",
  ]);

  // Contact details
  const [customerName, setCustomerName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Auto-calculated fields
  const [estimatedCost, setEstimatedCost] = useState<number>(85000);
  const [totalVolumePoints, setTotalVolumePoints] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(15);

  // Form errors
  const [errors, setErrors] = useState<string[]>([]);

  // Real-time field errors state
  const [fieldErrors, setFieldErrors] = useState<{
    customerName?: string;
    email?: string;
    phone?: string;
    scheduledDate?: string;
  }>({});

  const validateName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return "El nombre completo es obligatorio.";
    }
    if (trimmed.length < 5) {
      return "El nombre es demasiado corto. Ingrese al menos 5 caracteres.";
    }
    if (/\d/.test(trimmed)) {
      return "El nombre no debe contener números.";
    }
    if (!trimmed.includes(" ")) {
      return "Por favor, ingrese nombre y apellido (con espacio) para agilizar la habilitación del seguro de traslado.";
    }
    return "";
  };

  const validateEmail = (emailVal: string) => {
    const trimmed = emailVal.trim();
    if (!trimmed) {
      return "El correo electrónico es obligatorio.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return "Ingrese un correo electrónico válido (ejemplo@dominio.com).";
    }
    const lower = trimmed.toLowerCase();
    if (
      lower.endsWith("@gamil.com") ||
      lower.endsWith("@gmial.com") ||
      lower.endsWith("@gmeil.com")
    ) {
      return "¿Detectamos un typo? Quiso decir @gmail.com. Por favor verifique.";
    }
    if (lower.endsWith("@hotamil.com") || lower.endsWith("@hormail.com")) {
      return "¿Detectamos un typo? Quiso decir @hotmail.com. Por favor verifique.";
    }
    if (lower.endsWith(".con")) {
      return "El dominio de correo electrónico no debe terminar en .con (use .com o .com.ar).";
    }
    return "";
  };

  const validatePhone = (phoneVal: string) => {
    const trimmed = phoneVal.trim();
    if (!trimmed) {
      return "El número de teléfono es obligatorio.";
    }
    const cleanPhone = trimmed.replace(/[^\d]/g, "");
    if (cleanPhone.length < 8) {
      return "El teléfono debe contener al menos 8 dígitos numéricos.";
    }
    if (cleanPhone.length > 15) {
      return "El número ingresado es demasiado largo. Verifique.";
    }
    // Check if it's an Argentine format
    const phoneRegex = /^[\d\s()+-]{8,25}$/;
    if (!phoneRegex.test(trimmed)) {
      return "El formato de teléfono no es válido.";
    }
    return "";
  };

  const validateDate = (dateVal: string) => {
    if (!dateVal) {
      return "La fecha de mudanza es obligatoria.";
    }
    const selectedDateObj = new Date(dateVal + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDateObj < today) {
      return "La fecha no puede ser anterior al día de hoy.";
    }
    // Max 1 year in advance
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);
    if (selectedDateObj > maxDate) {
      return "La fecha seleccionada no puede superar los 12 meses de planificación previa.";
    }
    return "";
  };

  const handleNameChange = (val: string) => {
    setCustomerName(val);
    setFieldErrors((prev) => ({ ...prev, customerName: validateName(val) }));
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setFieldErrors((prev) => ({ ...prev, email: validateEmail(val) }));
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    setFieldErrors((prev) => ({ ...prev, phone: validatePhone(val) }));
  };

  const handleDateChange = (val: string) => {
    setScheduledDate(val);
    setFieldErrors((prev) => ({ ...prev, scheduledDate: validateDate(val) }));
  };

  // Sync selected origin department with parent geographic zone state
  useEffect(() => {
    if (onZoneSelect && origin) {
      const getRegionForDept = (id: string): string => {
        if (["tunuyan", "tupungato", "san_carlos"].includes(id))
          return "Valle de Uco";
        if (["san_rafael", "general_alvear", "malargue"].includes(id))
          return "Zona Sur";
        return "Gran Mendoza";
      };
      onZoneSelect(getRegionForDept(origin));
    }
  }, [origin, onZoneSelect]);

  // Recalculate cost dynamically whenever inputs change
  useEffect(() => {
    // 1. Base price
    let cost = 45000;

    // 2. Distance calculation
    let km = 10;
    if (originLatLng && destinationLatLng) {
      const getHaversineDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
      ): number => {
        const R = 6371; // Earth radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const rawDistance = getHaversineDistance(
        originLatLng.lat,
        originLatLng.lng,
        destinationLatLng.lat,
        destinationLatLng.lng,
      );
      // Driving route correction factor (~1.3x straight line distance)
      km = Math.round(rawDistance * 1.3);
      if (km < 2) km = 2; // min boundary
    } else {
      if (origin === destination) {
        km = 8;
      } else if (origin === "san_rafael" || destination === "san_rafael") {
        km = 230; // Larga distancia
      } else {
        km = 18; // Distancia promedio entre depts de Mendoza
      }
    }
    setDistanceKm(km);

    // Charge per km above 10km
    if (km > 10) {
      cost += (km - 10) * 1200;
    }

    // 3. Furniture Volume Points calculation
    let points = 0;
    Object.entries(selectedFurniture).forEach(([itemId, countVal]) => {
      const count = countVal as number;
      const furnitureItem = FURNITURE_ITEMS.find((f) => f.id === itemId);
      if (furnitureItem && count > 0) {
        points += furnitureItem.volumePoints * count;
      }
    });
    setTotalVolumePoints(points);

    // Add cost based on points volume
    if (points > 15) {
      cost += (points - 15) * 1500;
    }

    // 4. Stair/Elevator surcharges
    if (!hasElevatorOrigin && floorOrigin > 0) {
      cost += floorOrigin * 4500;
    }
    if (!hasElevatorDest && floorDest > 0) {
      cost += floorDest * 4500;
    }

    // 5. Service base costs
    selectedServices.forEach((srvId) => {
      const srvItem = SERVICES.find((s) => s.id === srvId);
      if (srvItem) {
        cost += srvItem.basePrice;
      }
    });

    // 5.5 Date-based pricing adjustment
    let dateMultiplier = 1.0;
    if (scheduledDate) {
      const dateObj = new Date(scheduledDate + "T00:00:00");
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
      const dayOfMonth = dateObj.getDate();

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
      const isEndOrStartOfMonth = dayOfMonth >= 27 || dayOfMonth <= 5;

      if (isWeekend && isEndOrStartOfMonth) {
        dateMultiplier = 1.25; // High demand: weekend + end of month
      } else if (isWeekend) {
        dateMultiplier = 1.15; // Weekend high demand
      } else if (isEndOrStartOfMonth) {
        dateMultiplier = 1.15; // End of month high demand
      } else {
        dateMultiplier = 0.9; // Weekday, mid-month promotion
      }
    }

    // 6. Multipliers based on departments
    const origDept = DEPARTMENTS.find((d) => d.id === origin);
    const destDept = DEPARTMENTS.find((d) => d.id === destination);
    const baseMultiplier =
      ((origDept?.baseRateMultiplier || 1.0) +
        (destDept?.baseRateMultiplier || 1.0)) /
      2;
    cost = Math.round(cost * baseMultiplier * dateMultiplier);

    // Adjust size category based on volume
    if (points < 15) setMoveSize("chico");
    else if (points < 45) setMoveSize("mediano");
    else setMoveSize("grande");

    setEstimatedCost(cost);
  }, [
    origin,
    destination,
    hasElevatorOrigin,
    hasElevatorDest,
    floorOrigin,
    floorDest,
    selectedFurniture,
    selectedServices,
    scheduledDate,
    originLatLng,
    destinationLatLng,
  ]);

  // Handle count increments/decrements
  const adjustFurnitureCount = (itemId: string, amount: number) => {
    setSelectedFurniture((prev) => {
      const current = prev[itemId] || 0;
      const updated = current + amount;
      if (updated <= 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: updated };
    });
  };

  // Toggle Services selection
  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const handleNextStep = () => {
    // Validation
    const stepErrors: string[] = [];
    if (step === 1) {
      if (!originAddress.trim()) {
        stepErrors.push("Debe ingresar la dirección específica de origen.");
      }
      if (!destinationAddress.trim()) {
        stepErrors.push("Debe ingresar la dirección específica de destino.");
      }
      if (!origin || !destination) {
        stepErrors.push("Debe seleccionar origen y destino válidos.");
      }
      if (!scheduledDate) {
        stepErrors.push(
          "Por favor, indique la fecha estimada de su mudanza para verificar la tarifa y disponibilidad.",
        );
      }
    } else if (step === 2) {
      if (Object.keys(selectedFurniture).length === 0) {
        stepErrors.push(
          "Por favor, agregue al menos un mueble u objeto para cotizar.",
        );
      }
    }

    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors([]);
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    setErrors([]);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateName(customerName);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const dateErr = validateDate(scheduledDate);

    if (nameErr || emailErr || phoneErr || dateErr) {
      setFieldErrors({
        customerName: nameErr,
        email: emailErr,
        phone: phoneErr,
        scheduledDate: dateErr,
      });
      setErrors([
        "Por favor, corrija los campos marcados con errores antes de enviar la cotización.",
      ]);
      return;
    }

    setErrors([]);
    setFieldErrors({});

    // Create lead object
    const newLead: QuoteLead = {
      id: "lead-" + Date.now(),
      createdAt: new Date().toISOString(),
      brand: activeBrand.id,
      customerName,
      email,
      phone,
      originDept: origin,
      destDept: destination,
      originAddress: originAddress || undefined,
      destinationAddress: destinationAddress || undefined,
      moveSize,
      furnitureList: Object.entries(selectedFurniture).map(
        ([itemId, countVal]) => ({ itemId, count: countVal as number }),
      ),
      servicesSelected: selectedServices,
      distanceKm,
      hasElevatorOrigin,
      hasElevatorDest,
      floorOrigin,
      floorDest,
      scheduledDate,
      estimatedCost,
      status: "new",
      notes: notes || undefined,
    };

    onNewLeadCreated(newLead);
    setSuccess(true);
  };

  const resetForm = () => {
    setStep(1);
    setSuccess(false);
    setOriginAddress("");
    setDestinationAddress("");
    setOriginLatLng(null);
    setDestinationLatLng(null);
    setSelectedFurniture({
      sofa_3c: 1,
      cama_mat: 1,
      heladera: 1,
      lavarropas: 1,
      caja_g: 5,
    });
    setSelectedServices(["mudanza_premium"]);
    setCustomerName("");
    setEmail("");
    setPhone("");
    setScheduledDate("");
    setNotes("");
  };

  const getNameInputClass = () => {
    const base =
      "w-full bg-white border rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 font-semibold transition-all duration-150";
    if (fieldErrors.customerName) {
      return `${base} border-red-400 focus:ring-red-500 bg-red-50/10`;
    }
    if (
      customerName.trim().length >= 5 &&
      customerName.trim().includes(" ") &&
      !/\d/.test(customerName)
    ) {
      return `${base} border-emerald-400 focus:ring-emerald-500 bg-emerald-50/10`;
    }
    if (customerName.trim().length > 0) {
      return `${base} border-amber-400 focus:ring-amber-500 bg-amber-50/10`;
    }
    return `${base} border-gray-200 focus:ring-amber-500`;
  };

  const getEmailInputClass = () => {
    const base =
      "w-full bg-white border rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 font-semibold transition-all duration-150";
    if (fieldErrors.email) {
      return `${base} border-red-400 focus:ring-red-500 bg-red-50/10`;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      email.trim().length > 0 &&
      emailRegex.test(email.trim()) &&
      !email.trim().toLowerCase().endsWith(".con") &&
      !email.trim().toLowerCase().includes("gamil") &&
      !email.trim().toLowerCase().includes("gmial")
    ) {
      return `${base} border-emerald-400 focus:ring-emerald-500 bg-emerald-50/10`;
    }
    if (email.trim().length > 0) {
      return `${base} border-amber-400 focus:ring-amber-500 bg-amber-50/10`;
    }
    return `${base} border-gray-200 focus:ring-amber-500`;
  };

  const getPhoneInputClass = () => {
    const base =
      "w-full bg-white border rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 font-semibold transition-all duration-150";
    if (fieldErrors.phone) {
      return `${base} border-red-400 focus:ring-red-500 bg-red-50/10`;
    }
    const cleanPhone = phone.replace(/[^\d]/g, "");
    if (
      phone.trim().length > 0 &&
      cleanPhone.length >= 8 &&
      cleanPhone.length <= 15
    ) {
      return `${base} border-emerald-400 focus:ring-emerald-500 bg-emerald-50/10`;
    }
    if (phone.trim().length > 0) {
      return `${base} border-amber-400 focus:ring-amber-500 bg-amber-50/10`;
    }
    return `${base} border-gray-200 focus:ring-amber-500`;
  };

  const getDateInputClass = () => {
    const base =
      "w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 font-bold transition-all duration-150";
    if (fieldErrors.scheduledDate) {
      return `${base} border-red-400 focus:ring-red-500 bg-red-50/10 text-red-900`;
    }
    if (scheduledDate) {
      return `${base} border-emerald-400 focus:ring-emerald-500 bg-emerald-50/10 text-emerald-900`;
    }
    return `${base} border-gray-200 focus:ring-amber-500 bg-white text-gray-800`;
  };

  const activeOriginDept = DEPARTMENTS.find((d) => d.id === origin);
  const activeDestDept = DEPARTMENTS.find((d) => d.id === destination);

  return (
    <div
      id="calculator-section"
      className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            PRESUPUESTO INMEDIATO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Cotizador Inteligente de Mudanza
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Configura los detalles de tu mudanza en Mendoza y obtén una
            estimación de precio transparente al instante.
          </p>
        </div>

        {/* Success Screen */}
        {success ? (
          <div className="bg-emerald-50 border border-emerald-100 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-xs animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-gray-900">
                ¡Presupuesto Solicitado con Éxito!
              </h3>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                Hola <strong className="text-gray-900">{customerName}</strong>,
                hemos registrado tu solicitud para el{" "}
                <strong className="text-gray-900">
                  {new Date(scheduledDate + "T00:00:00").toLocaleDateString(
                    "es-AR",
                    { dateStyle: "long" },
                  )}
                </strong>
                .
              </p>
              <div
                itemScope
                itemType="https://schema.org/Offer"
                className="bg-white border border-emerald-100 rounded-2xl p-4 max-w-md mx-auto my-4 text-left shadow-2xs"
              >
                {/* Meta details for search crawlers & AI search aggregators */}
                <meta itemProp="priceCurrency" content="ARS" />
                <meta itemProp="price" content={estimatedCost.toString()} />
                <meta
                  itemProp="availability"
                  content="https://schema.org/InStock"
                />
                <meta
                  itemProp="validThrough"
                  content={
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                />
                <meta
                  itemProp="url"
                  content={`https://${activeBrand.domain}/calculadora`}
                />
                <span
                  itemProp="seller"
                  itemScope
                  itemType="https://schema.org/MovingCompany"
                >
                  <meta itemProp="name" content={activeBrand.name} />
                  <meta itemProp="telephone" content={activeBrand.phone} />
                  <meta itemProp="address" content={activeBrand.address} />
                </span>
                <span itemProp="description" className="hidden">
                  Cotización estimada de mudanzas por carretera desde{" "}
                  {activeOriginDept?.name} hacia {activeDestDept?.name} provista
                  por {activeBrand.name}.
                </span>

                <p
                  className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider"
                  itemProp="name"
                >
                  RESUMEN DE SOLICITUD LOGÍSTICA
                </p>
                <div className="flex justify-between items-center mt-2 border-b border-gray-100 pb-2">
                  <span className="text-xs text-gray-600">
                    Ruta ({activeOriginDept?.name} ➔ {activeDestDept?.name})
                  </span>
                  <span className="text-xs font-bold text-gray-900">
                    ~{distanceKm} km
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 border-b border-gray-100 pb-2">
                  <span className="text-xs text-gray-600">
                    Volumen ({totalVolumePoints} pts)
                  </span>
                  <span className="text-xs font-bold text-gray-900">
                    Tamaño {moveSize.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3 text-emerald-800 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-xs font-black uppercase">
                    Volumen Estimado
                  </span>
                  <span className="text-base font-black">
                    {Math.round((totalVolumePoints * 0.12 + 1.2) * 10) / 10 ||
                      1.5}{" "}
                    m³
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Te hemos enviado un correo a{" "}
              <strong className="text-gray-700">{email}</strong>. Un asesor
              técnico de {activeBrand.name} se comunicará contigo al{" "}
              <strong className="text-gray-700">{phone}</strong> por WhatsApp en
              los próximos 15 minutos para validar la lista y agendar.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={resetForm}
                className={`px-6 py-3 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition cursor-pointer`}
              >
                Hacer Otra Cotización
              </button>
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  if (onViewModeChange) {
                    onViewModeChange("dashboard");
                  }
                }}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                Ver Panel de Leads (Simulador)
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            {/* Step Indicators with CRO Progress Tracker */}
            <div className="space-y-4 mb-8 pb-6 border-b border-gray-200/60">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-gray-500">
                <span>Progreso de Cotización</span>
                <span className="text-amber-600">
                  Paso {step} de 4 ({step * 25}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${activeBrand.primaryColor} transition-all duration-300`}
                  style={{ width: `${step * 25}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-1 text-[10px] font-bold overflow-x-auto whitespace-nowrap pb-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-1.5 cursor-pointer shrink-0 ${step >= 1 ? "text-amber-600" : "text-gray-400"}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 1 ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    1
                  </span>
                  Ruta e Inmuebles
                </button>
                <div className="flex-1 min-w-4 h-0.5 bg-gray-200" />
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`flex items-center gap-1.5 cursor-pointer shrink-0 ${step >= 2 ? "text-amber-600" : "text-gray-400"}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 2 ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    2
                  </span>
                  Muebles / Cajas
                </button>
                <div className="flex-1 min-w-4 h-0.5 bg-gray-200" />
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={`flex items-center gap-1.5 cursor-pointer shrink-0 ${step >= 3 ? "text-amber-600" : "text-gray-400"}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 3 ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    3
                  </span>
                  Servicios Extra
                </button>
                <div className="flex-1 min-w-4 h-0.5 bg-gray-200" />
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className={`flex items-center gap-1.5 cursor-pointer shrink-0 ${step >= 4 ? "text-amber-600" : "text-gray-400"}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 4 ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    4
                  </span>
                  Confirmación
                </button>
              </div>
            </div>

            {/* Error notifications */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Por favor verifique los siguientes campos:</span>
                </div>
                {errors.map((err, idx) => (
                  <p key={idx}>• {err}</p>
                ))}
              </div>
            )}

            {/* STEP 1: ROUTE & ACCESS */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Origin */}
                  <div className="space-y-1">
                    <AddressAutocomplete
                      label="Dirección de Origen"
                      placeholder={
                        activeBrand.id === "miranda"
                          ? "Eje: Av. Cabildo 2200, Belgrano, CABA"
                          : "Eje: Av. Colón 450, Mendoza"
                      }
                      value={originAddress}
                      onChange={setOriginAddress}
                      onSelectAddress={(addr, deptId, lat, lng) => {
                        setOriginAddress(addr);
                        setOrigin(deptId);
                        if (lat !== undefined && lng !== undefined) {
                          setOriginLatLng({ lat, lng });
                        } else {
                          setOriginLatLng(null);
                        }
                      }}
                      brandId={activeBrand.id}
                    />
                    <div className="flex justify-between items-center text-[10px] text-gray-400 px-1 pt-1">
                      <span>
                        Zona detectada:{" "}
                        <strong className="text-gray-600 font-bold">
                          {DEPARTMENTS.find((d) => d.id === origin)?.name}
                        </strong>
                      </span>
                      <span>
                        Tarifa base:{" "}
                        <strong className="text-gray-600 font-bold">
                          x
                          {
                            DEPARTMENTS.find((d) => d.id === origin)
                              ?.baseRateMultiplier
                          }
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-1">
                    <AddressAutocomplete
                      label="Dirección de Destino"
                      placeholder={
                        activeBrand.id === "miranda"
                          ? "Eje: Av. Santa Fe 3200, Palermo, CABA"
                          : "Eje: Panamericana 2501, Godoy Cruz, Mendoza"
                      }
                      value={destinationAddress}
                      onChange={setDestinationAddress}
                      onSelectAddress={(addr, deptId, lat, lng) => {
                        setDestinationAddress(addr);
                        setDestination(deptId);
                        if (lat !== undefined && lng !== undefined) {
                          setDestinationLatLng({ lat, lng });
                        } else {
                          setDestinationLatLng(null);
                        }
                      }}
                      brandId={activeBrand.id}
                    />
                    <div className="flex justify-between items-center text-[10px] text-gray-400 px-1 pt-1">
                      <span>
                        Zona detectada:{" "}
                        <strong className="text-gray-600 font-bold">
                          {DEPARTMENTS.find((d) => d.id === destination)?.name}
                        </strong>
                      </span>
                      <span>
                        Tarifa base:{" "}
                        <strong className="text-gray-600 font-bold">
                          x
                          {
                            DEPARTMENTS.find((d) => d.id === destination)
                              ?.baseRateMultiplier
                          }
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date Selection & Availability */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-xs font-bold text-gray-800 tracking-wide uppercase flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-500" /> Fecha
                    Planificada y Disponibilidad
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-gray-700 block">
                        FECHA ESTIMADA DE MUDANZA
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 font-semibold cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-400">
                        Selecciona tu fecha para calcular dinámicamente recargos
                        por alta demanda o promociones.
                      </p>
                    </div>

                    <div className="flex flex-col justify-center">
                      {scheduledDate ? (
                        (() => {
                          const dateObj = new Date(scheduledDate + "T00:00:00");
                          const dayOfWeek = dateObj.getDay();
                          const dayOfMonth = dateObj.getDate();
                          const isWeekend =
                            dayOfWeek === 0 ||
                            dayOfWeek === 5 ||
                            dayOfWeek === 6;
                          const isPeakMonth =
                            dayOfMonth >= 27 || dayOfMonth <= 5;

                          let statusColor =
                            "text-emerald-600 bg-emerald-50 border-emerald-100";
                          let statusText =
                            "🟢 Tarifa Promocional - Mitad de Mes";
                          let detailText =
                            "Excelente fecha. Descuento del 10% aplicado sobre la tarifa base de traslado.";

                          if (isWeekend && isPeakMonth) {
                            statusColor =
                              "text-rose-600 bg-rose-50 border-rose-100";
                            statusText =
                              "🔴 Demanda Crítica (Fin de Mes + Fin de Semana)";
                            detailText =
                              "Cupos limitados. Se aplica un 25% de recargo por alta demanda operativa.";
                          } else if (isWeekend) {
                            statusColor =
                              "text-amber-600 bg-amber-50 border-amber-100";
                            statusText = "🟡 Demanda Alta (Fin de Semana)";
                            detailText =
                              "Se aplica un 15% de recargo de fin de semana. Reserva con anticipación.";
                          } else if (isPeakMonth) {
                            statusColor =
                              "text-amber-600 bg-amber-50 border-amber-100";
                            statusText = "🟡 Demanda Alta (Fin de Mes)";
                            detailText =
                              "Se aplica un 15% de recargo por recambio de alquileres. Quedan pocos camiones.";
                          }

                          return (
                            <div
                              className={`p-4 rounded-xl border text-xs space-y-1 ${statusColor}`}
                            >
                              <span className="font-extrabold block">
                                {statusText}
                              </span>
                              <p className="leading-relaxed font-medium">
                                {detailText}
                              </p>
                              <p className="text-[10px] opacity-80 pt-1 font-semibold">
                                Día seleccionado:{" "}
                                {dateObj.toLocaleDateString("es-AR", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                })}
                              </p>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="p-4 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 flex flex-col items-center justify-center text-center py-6">
                          <Clock className="w-5 h-5 text-gray-300 mb-1" />
                          <span className="font-semibold">
                            Selecciona una fecha
                          </span>
                          <span className="text-[10px]">
                            Para habilitar promociones y validar la
                            disponibilidad de camiones.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date Quick Shortcuts */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                      Sugerencias de Fechas
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const shortcuts = [];

                        // Shortcut 1: Tomorrow
                        const tom = new Date();
                        tom.setDate(tom.getDate() + 1);
                        shortcuts.push({
                          label: "Mañana",
                          date: tom.toISOString().split("T")[0],
                          icon: "⚡",
                        });

                        // Shortcut 2: Next Tuesday (off-peak usually)
                        const nextTue = new Date();
                        const currentDay = nextTue.getDay();
                        const distToTue =
                          currentDay <= 2
                            ? 2 - currentDay + 7
                            : 2 - currentDay + 14;
                        nextTue.setDate(
                          nextTue.getDate() +
                            (distToTue % 7 === 0 ? 7 : distToTue % 7),
                        );
                        shortcuts.push({
                          label: "Próximo Martes (Promo)",
                          date: nextTue.toISOString().split("T")[0],
                          icon: "🟢",
                        });

                        // Shortcut 3: Next Saturday (weekend)
                        const nextSat = new Date();
                        const distToSat = (6 - nextSat.getDay() + 7) % 7;
                        nextSat.setDate(
                          nextSat.getDate() + (distToSat === 0 ? 7 : distToSat),
                        );
                        shortcuts.push({
                          label: "Próximo Sábado",
                          date: nextSat.toISOString().split("T")[0],
                          icon: "🟡",
                        });

                        return shortcuts.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setScheduledDate(item.date)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                              scheduledDate === item.date
                                ? "bg-amber-500 border-amber-500 text-gray-950 shadow-3xs"
                                : "bg-slate-100 hover:bg-slate-200 border-transparent text-gray-700"
                            }`}
                          >
                            <span>
                              {item.icon} {item.label}
                            </span>
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                </div>

                {/* Floors & Elevators Access Details */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-xs font-bold text-gray-800 tracking-wide uppercase flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-500" /> Complejidad
                    de Accesos (Escaleras/Pisos)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Origin Access */}
                    <div className="space-y-3.5">
                      <p className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-1.5">
                        Origen (Donde cargamos)
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 flex-1">
                          ¿Tiene ascensor de carga?
                        </span>
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                          <button
                            type="button"
                            onClick={() => setHasElevatorOrigin(true)}
                            className={`px-3 py-1 rounded-md font-bold transition ${hasElevatorOrigin ? "bg-white text-gray-950 shadow-xs" : "text-gray-500"}`}
                          >
                            Sí
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasElevatorOrigin(false)}
                            className={`px-3 py-1 rounded-md font-bold transition ${!hasElevatorOrigin ? "bg-white text-gray-950 shadow-xs" : "text-gray-500"}`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 flex-1">
                          Piso de la vivienda:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setFloorOrigin((prev) => Math.max(0, prev - 1))
                            }
                            className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900">
                            {floorOrigin === 0 ? "PB" : floorOrigin}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setFloorOrigin((prev) => Math.min(25, prev + 1))
                            }
                            className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Destination Access */}
                    <div className="space-y-3.5">
                      <p className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-1.5">
                        Destino (Donde descargamos)
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 flex-1">
                          ¿Tiene ascensor de carga?
                        </span>
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                          <button
                            type="button"
                            onClick={() => setHasElevatorDest(true)}
                            className={`px-3 py-1 rounded-md font-bold transition ${hasElevatorDest ? "bg-white text-gray-950 shadow-xs" : "text-gray-500"}`}
                          >
                            Sí
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasElevatorDest(false)}
                            className={`px-3 py-1 rounded-md font-bold transition ${!hasElevatorDest ? "bg-white text-gray-950 shadow-xs" : "text-gray-500"}`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 flex-1">
                          Piso de la vivienda:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setFloorDest((prev) => Math.max(0, prev - 1))
                            }
                            className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900">
                            {floorDest === 0 ? "PB" : floorDest}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setFloorDest((prev) => Math.min(25, prev + 1))
                            }
                            className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={`flex items-center gap-1 px-6 py-3 bg-gradient-to-r ${activeBrand.primaryColor} text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-sm transition cursor-pointer`}
                  >
                    Siguiente: Elegir Muebles <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: FURNITURE SELECTOR */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-800 mb-2">
                    CANTIDAD DE BIENES A TRASLADAR
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Haz clic en los botones para indicar qué muebles y cajas vas
                    a mudar. Esto calcula el volumen necesario de camión.
                  </p>
                </div>

                {/* Highly converting time-saver advice banner */}
                <div className="bg-amber-50 border border-amber-200/60 p-3.5 rounded-2xl text-xs text-amber-900 font-bold flex items-start gap-2.5 shadow-3xs animate-fade-in">
                  <Sparkles className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-amber-800 text-xs font-black">
                      💡 ¿Prefieres agilizar tu cotización?
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium leading-relaxed mt-0.5 block">
                      Dejamos precargada una lista residencial estándar de
                      Mendoza para que no pierdas tiempo. Si no deseas detallar
                      unidad por unidad, puedes presionar{" "}
                      <strong>"Siguiente"</strong> ahora mismo; nuestro equipo
                      adaptará la lista exacta contigo por llamada telefónica o
                      WhatsApp.
                    </span>
                  </div>
                </div>

                {/* Categories of furniture */}
                {["living", "dormitorio", "cocina", "otros"].map((cat) => {
                  const itemsInCat = FURNITURE_ITEMS.filter(
                    (f) => f.category === cat,
                  );
                  return (
                    <div
                      key={cat}
                      className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-3xs"
                    >
                      <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">
                        {cat === "living"
                          ? "🛋️ Living y Comedor"
                          : cat === "dormitorio"
                            ? "🛏️ Dormitorio"
                            : cat === "cocina"
                              ? "🍳 Cocina y Lavadero"
                              : "📦 Cajas y Varios"}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {itemsInCat.map((item) => {
                          const count = selectedFurniture[item.id] || 0;
                          return (
                            <div
                              key={item.id}
                              className="flex justify-between items-center text-xs p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-gray-100 transition"
                            >
                              <span className="text-gray-700 font-medium">
                                {item.name}
                              </span>
                              <div className="flex items-center gap-2.5">
                                {count > 0 && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        adjustFurnitureCount(item.id, -1)
                                      }
                                      className="w-6 py-1 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold transition"
                                    >
                                      -
                                    </button>
                                    <span className="w-4 text-center font-black text-gray-800">
                                      {count}
                                    </span>
                                  </>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    adjustFurnitureCount(item.id, 1)
                                  }
                                  className="w-6 py-1 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center font-bold transition"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Volume Points display indicator */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex justify-between items-center text-xs text-amber-800">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-extrabold block">
                        Espacio total de carga estimado: {totalVolumePoints}{" "}
                        unidades
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Mudarás una cantidad de bultos clasificada como:{" "}
                        <strong>{moveSize.toUpperCase()}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={`flex items-center gap-1 px-6 py-3 bg-gradient-to-r ${activeBrand.primaryColor} text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-sm transition cursor-pointer`}
                  >
                    Elegir Servicios Adicionales{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SERVICE CHOICES */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-800 mb-2">
                    ELIGE EL NIVEL DE SERVICIO
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Selecciona si necesitas servicio de solo traslado, operarios
                    para carga y descarga o embalajes profesionales de
                    seguridad.
                  </p>
                </div>

                <div className="space-y-4">
                  {SERVICES.map((srv) => {
                    const isSelected = selectedServices.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleService(srv.id)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && toggleService(srv.id)
                        }
                        className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          isSelected
                            ? "bg-amber-50/30 border-amber-500 shadow-2xs"
                            : "bg-white border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-gray-900">
                              {srv.name}
                            </span>
                            {isSelected && (
                              <span className="bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
                                SELECCIONADO
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {srv.description}
                          </p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[10px] text-gray-400">
                            {srv.features.slice(0, 2).map((feat, i) => (
                              <li key={i} className="flex items-center gap-1">
                                ✓ {feat}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-right whitespace-nowrap self-end sm:self-center">
                          <p className="text-xs font-bold text-gray-400">
                            {srv.priceDetail}
                          </p>
                          <span className="inline-block text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded mt-1.5 uppercase tracking-wide">
                            Disponible
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={`flex items-center gap-1 px-6 py-3 bg-gradient-to-r ${activeBrand.primaryColor} text-white font-bold text-xs rounded-xl hover:opacity-95 shadow-sm transition cursor-pointer`}
                  >
                    Siguiente: Tus Datos <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONTACT & CONFIRMATION */}
            {step === 4 && (
              <form onSubmit={handleSubmitQuote} className="space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-800 mb-2">
                    DATOS DE CONTACTO Y RESERVA
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Ingresa tus datos para registrar formalmente tu traslado. Te
                    mostraremos tu cotización definitiva al instante.
                  </p>
                </div>

                {/* High trust price-guarantee lock banner */}
                <div className="bg-emerald-50 border border-emerald-200/60 p-4 rounded-2xl text-xs text-emerald-900 flex items-start gap-3 shadow-3xs animate-fade-in">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-emerald-800 block text-xs">
                      ✔ Tarifa Protegida y Congelada Sin Sorpresas
                    </span>
                    <span className="text-[11px] text-emerald-700 leading-relaxed font-medium mt-0.5 block">
                      Al solicitar tu presupuesto hoy, congelamos el valor de tu
                      traslado ante variaciones de precios locales en Mendoza.
                      Garantizamos transparencia absoluta.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" /> NOMBRE
                        COMPLETO
                      </span>
                      {customerName.trim().length >= 5 &&
                        !fieldErrors.customerName && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3 stroke-[3]" /> Válido
                          </span>
                        )}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Carlos Mendoza"
                      value={customerName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={getNameInputClass()}
                    />
                    {fieldErrors.customerName ? (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1.5 mt-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
                        {fieldErrors.customerName}
                      </p>
                    ) : customerName.trim().length > 0 ? (
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1 animate-fade-in">
                        <Check className="w-3.5 h-3.5 shrink-0" /> Nombre
                        registrado y habilitado para cobertura de seguro.
                      </p>
                    ) : (
                      <p className="text-[9px] text-gray-400">
                        Ingrese su nombre y apellido completo.
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />{" "}
                        FECHA ESTIMADA DE MUDANZA
                      </span>
                      {scheduledDate && !fieldErrors.scheduledDate && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3 stroke-[3]" /> Válido
                        </span>
                      )}
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={scheduledDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className={getDateInputClass()}
                    />
                    {fieldErrors.scheduledDate ? (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1.5 mt-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
                        {fieldErrors.scheduledDate}
                      </p>
                    ) : (
                      <p className="text-[9px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
                        <Check className="w-3 h-3" /> Fecha seleccionada y
                        cotizada en el Paso 1.
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" /> CORREO
                        ELECTRÓNICO
                      </span>
                      {email.trim().length > 0 && !fieldErrors.email && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3 stroke-[3]" /> Válido
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ej. juan@gmail.com"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={getEmailInputClass()}
                    />
                    {fieldErrors.email ? (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1.5 mt-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
                        {fieldErrors.email}
                      </p>
                    ) : email.trim().length > 0 ? (
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1 animate-fade-in">
                        <Check className="w-3.5 h-3.5 shrink-0" /> Email válido.
                        Te enviaremos copia del presupuesto por este medio.
                      </p>
                    ) : (
                      <p className="text-[9px] text-gray-400">
                        Recibirá una copia formal en este correo.
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" /> TELÉFONO
                        DE CONTACTO / WHATSAPP
                      </span>
                      {phone.trim().length > 0 && !fieldErrors.phone && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3 stroke-[3]" /> Válido
                        </span>
                      )}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 261 6554433"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={getPhoneInputClass()}
                    />
                    {fieldErrors.phone ? (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1.5 mt-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
                        {fieldErrors.phone}
                      </p>
                    ) : phone.trim().length > 0 ? (
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1 animate-fade-in">
                        <Check className="w-3.5 h-3.5 shrink-0" /> WhatsApp
                        válido. Un asesor de Mendoza te enviará la confirmación.
                      </p>
                    ) : (
                      <p className="text-[9px] text-gray-400">
                        Ejemplo de formato local: 261 5555555
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500">
                    INDICACIONES ADICIONALES (OPCIONAL)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Detalla si hay pasillos angostos, si necesitas subir un sillón por balcón o trasladar objetos muy pesados/frágiles."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>

                {(() => {
                  const estimatedM3 =
                    Math.round((totalVolumePoints * 0.12 + 1.2) * 10) / 10 ||
                    1.5;
                  return (
                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-left space-y-1">
                        <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider block leading-none">
                          VOLUMEN LOGÍSTICO ESTIMADO
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-gray-900">
                            {estimatedM3} m³
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">
                            ({totalVolumePoints} unidades de volumen)
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block leading-none">
                          CATEGORÍA DE TRASLADO
                        </span>
                        <p className="text-xs font-black text-gray-800 mt-1.5 uppercase">
                          {moveSize === "small"
                            ? "Personal pequeña / Utilitaria"
                            : moveSize === "medium"
                              ? "Familiar estándar / Mediana"
                              : "Residencial grande / Completa"}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    id="submit-quote"
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                  >
                    Confirmar Mi Solicitud de Volumen y Cotizar por WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
