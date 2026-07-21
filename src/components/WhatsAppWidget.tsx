import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Check,
  AlertCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BrandConfig } from "../types";
import { useWhatsAppForm } from "../hooks/useWhatsAppForm";

interface WhatsAppWidgetProps {
  activeBrand: BrandConfig;
  viewMode: "user" | "dashboard";
}

export default function WhatsAppWidget({
  activeBrand,
  viewMode,
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    waName,
    waMsg,
    waErrors,
    setWaErrors,
    handleWaNameChange,
    handleWaMsgChange,
    getWaMsgHint,
    resetForm,
  } = useWhatsAppForm();

  // Show a welcoming tooltip 3 seconds after load to grab attention gently
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Hide widget entirely if in admin dashboard mode
  if (viewMode === "dashboard") return null;

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = !waName.trim()
      ? "El nombre es obligatorio."
      : waName.trim().length < 3
        ? "El nombre debe tener al menos 3 caracteres."
        : "";
    const msgErr = !waMsg.trim()
      ? "La consulta es obligatoria."
      : waMsg.trim().length < 10
        ? "La consulta debe tener al menos 10 caracteres."
        : "";

    if (nameErr || msgErr) {
      setWaErrors({ name: nameErr, msg: msgErr });
      return;
    }

    const text = `Hola ${activeBrand.name}! Mi nombre es ${waName}. Tengo una consulta: ${waMsg}`;
    window.open(
      `https://wa.me/${activeBrand.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
    resetForm();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Tooltip Alert */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 mr-1 bg-gray-900 text-white text-[11px] font-black px-4 py-2.5 rounded-2xl shadow-xl border border-gray-800 flex items-center gap-2 max-w-[240px] leading-tight"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              ¿Necesitás cotizar? Respondé 2 preguntas por WhatsApp 🚀
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-gray-400 hover:text-white p-0.5 ml-1 rounded-full hover:bg-gray-800"
              aria-label="Cerrar sugerencia de ayuda de WhatsApp"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={isOpen ? handleClose : handleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer relative transition-all duration-300 ${
          isOpen
            ? "bg-gray-900 hover:bg-gray-800 rotate-90"
            : "bg-emerald-600 hover:bg-emerald-500"
        }`}
        aria-label={
          isOpen
            ? "Cerrar ventana de contacto por WhatsApp"
            : "Abrir ventana de contacto por WhatsApp"
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
        ) : (
          <>
            <MessageSquare
              className="w-6 h-6 fill-current stroke-[2]"
              aria-hidden="true"
            />
            <span
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white animate-ping"
              aria-hidden="true"
            />
            <span
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white"
              aria-hidden="true"
            />
          </>
        )}
      </motion.button>

      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute bottom-16 right-0 w-[350px] max-w-[90vw] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            role="dialog"
            aria-label="Formulario de contacto de WhatsApp Express"
          >
            {/* Header */}
            <div className="bg-emerald-600 text-white p-5 relative overflow-hidden shrink-0">
              <div
                className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"
                aria-hidden="true"
              />
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-sm border-2 border-emerald-400">
                    S
                  </div>
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-600 animate-pulse"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-100 leading-none">
                    WhatsApp Express
                  </h4>
                  <p className="text-base font-extrabold leading-tight mt-1">
                    Sofía - Soporte
                  </p>
                  <p className="text-[10px] text-emerald-100 font-medium mt-0.5">
                    En línea • Respuesta en menos de 5 min
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Body & Form */}
            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-4 max-h-[380px] overflow-y-auto bg-slate-50"
            >
              {/* Agent Greeting Bubble */}
              <div className="bg-white rounded-2xl rounded-tl-none p-3.5 border border-gray-100 shadow-3xs text-xs text-gray-700 leading-relaxed font-semibold">
                ¡Hola! 👋 Bienvenido al portal de{" "}
                <span className="text-emerald-700 font-black">
                  {activeBrand.name}
                </span>
                .
                <br />
                Decime tu nombre y contame brevemente qué necesitas trasladar
                (muebles, origen y destino). Te cotizo al instante por WhatsApp.
              </div>

              {/* Input Name */}
              <div className="space-y-1">
                <label
                  htmlFor="wa-name-field"
                  className="text-[9px] font-black text-gray-500 uppercase tracking-wider block"
                >
                  Tu Nombre
                </label>
                <div className="relative">
                  <input
                    id="wa-name-field"
                    type="text"
                    value={waName}
                    onChange={(e) => handleWaNameChange(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className={`w-full bg-white border text-xs ${
                      waErrors.name
                        ? "border-red-400 focus:ring-red-400 bg-red-50/10"
                        : waName.trim().length >= 3
                          ? "border-emerald-400 focus:ring-emerald-400"
                          : "border-gray-200 focus:ring-emerald-500"
                    } rounded-xl px-3 py-2.5 font-bold text-gray-700 focus:outline-none focus:ring-1 transition`}
                  />
                  {waName.trim().length >= 3 && !waErrors.name && (
                    <Check
                      className="absolute right-3 top-3 w-4 h-4 text-emerald-500 stroke-[3]"
                      aria-hidden="true"
                    />
                  )}
                </div>
                {waErrors.name && (
                  <p className="text-[9px] text-red-500 font-bold flex items-center gap-1 animate-fade-in">
                    <AlertCircle
                      className="w-3 h-3 shrink-0"
                      aria-hidden="true"
                    />{" "}
                    {waErrors.name}
                  </p>
                )}
              </div>

              {/* Input Message */}
              <div className="space-y-1">
                <label
                  htmlFor="wa-msg-field"
                  className="text-[9px] font-black text-gray-500 uppercase tracking-wider block"
                >
                  Tu Consulta
                </label>
                <textarea
                  id="wa-msg-field"
                  rows={2}
                  value={waMsg}
                  onChange={(e) => handleWaMsgChange(e.target.value)}
                  placeholder="Ej. Traslado de heladera y sillón desde Capital a Godoy Cruz"
                  className={`w-full bg-white border text-xs ${
                    waErrors.msg
                      ? "border-red-400 focus:ring-red-400 bg-red-50/10"
                      : waMsg.trim().length >= 10
                        ? "border-emerald-400 focus:ring-emerald-400"
                        : "border-gray-200 focus:ring-emerald-500"
                  } rounded-xl px-3 py-2.5 font-bold text-gray-700 focus:outline-none focus:ring-1 transition`}
                />
                {waErrors.msg && (
                  <p className="text-[9px] text-red-500 font-bold flex items-center gap-1 animate-fade-in">
                    <AlertCircle
                      className="w-3 h-3 shrink-0"
                      aria-hidden="true"
                    />{" "}
                    {waErrors.msg}
                  </p>
                )}

                {/* Intelligent Hint Panel */}
                {(() => {
                  const hint = getWaMsgHint();
                  if (!hint) return null;
                  return (
                    <div
                      className={`p-2 rounded-lg text-[9px] mt-1 border leading-relaxed font-bold animate-fade-in ${
                        hint.type === "success"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                          : "bg-amber-50 border-amber-100 text-amber-800"
                      }`}
                    >
                      {hint.text}
                    </div>
                  );
                })()}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                aria-label="Enviar consulta y abrir conversación en WhatsApp"
              >
                <Phone
                  className="w-3.5 h-3.5 stroke-[2.5]"
                  aria-hidden="true"
                />
                <span>Iniciar Chat en WhatsApp</span>
              </button>

              {/* Security Shield */}
              <div className="flex items-center justify-center gap-1 text-[9px] text-gray-400 font-bold bg-white/40 py-1.5 rounded-lg border border-gray-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Contacto directo oficial sin intermediarios</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
