import { useState } from "react";

export function useWhatsAppForm() {
  const [waName, setWaName] = useState<string>("");
  const [waMsg, setWaMsg] = useState<string>("");
  const [waErrors, setWaErrors] = useState<{ name?: string; msg?: string }>({});

  const handleWaNameChange = (val: string) => {
    setWaName(val);
    const trimmed = val.trim();
    if (!trimmed) {
      setWaErrors((prev) => ({ ...prev, name: "El nombre es obligatorio." }));
    } else if (trimmed.length < 3) {
      setWaErrors((prev) => ({
        ...prev,
        name: "El nombre debe tener al menos 3 caracteres.",
      }));
    } else if (/\d/.test(trimmed)) {
      setWaErrors((prev) => ({
        ...prev,
        name: "El nombre no debe contener números.",
      }));
    } else if (!trimmed.includes(" ")) {
      setWaErrors((prev) => ({
        ...prev,
        name: "Recomendado: ingrese nombre y apellido para una cotización oficial.",
      }));
    } else {
      setWaErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleWaMsgChange = (val: string) => {
    setWaMsg(val);
    const trimmed = val.trim();
    if (!trimmed) {
      setWaErrors((prev) => ({
        ...prev,
        msg: "La consulta rápida es obligatoria.",
      }));
    } else if (trimmed.length < 10) {
      setWaErrors((prev) => ({
        ...prev,
        msg: "La consulta debe tener al menos 10 caracteres para mayor claridad.",
      }));
    } else {
      setWaErrors((prev) => ({ ...prev, msg: "" }));
    }
  };

  const getWaMsgHint = () => {
    if (!waMsg.trim()) return null;
    if (waMsg.trim().length < 10) return null;

    const lowerMsg = waMsg.toLowerCase();
    const suggestions: string[] = [];

    const hasOriginOrDest =
      lowerMsg.includes("desde") ||
      lowerMsg.includes("hacia") ||
      lowerMsg.includes("origen") ||
      lowerMsg.includes("destino") ||
      lowerMsg.includes(" a ") ||
      lowerMsg.includes("mendoza");
    if (!hasOriginOrDest) {
      suggestions.push("¿de dónde a dónde te mudas?");
    }

    const hasBienes =
      lowerMsg.includes("mueble") ||
      lowerMsg.includes("sillon") ||
      lowerMsg.includes("heladera") ||
      lowerMsg.includes("caja") ||
      lowerMsg.includes("camas") ||
      lowerMsg.includes("lavarropas") ||
      lowerMsg.includes("cosa") ||
      lowerMsg.includes("piano") ||
      lowerMsg.includes("mesa") ||
      lowerMsg.includes("traslado") ||
      lowerMsg.includes("mudanza");
    if (!hasBienes) {
      suggestions.push("qué cosas trasladas");
    }

    const hasDate =
      lowerMsg.includes("fecha") ||
      lowerMsg.includes("dia") ||
      lowerMsg.includes("mañana") ||
      lowerMsg.includes("sabado") ||
      lowerMsg.includes("domingo") ||
      /\d{1,2}[-/]\d{1,2}/.test(lowerMsg);
    if (!hasDate) {
      suggestions.push("para qué fecha estimada");
    }

    if (suggestions.length > 0) {
      return {
        type: "info",
        text:
          "💡 Tip para cotización instantánea por WhatsApp: especifica " +
          suggestions.join(", ") +
          ".",
      };
    }

    return {
      type: "success",
      text: "✨ ¡Excelente detalle! Tu consulta incluye los datos necesarios para cotizarte de inmediato.",
    };
  };

  const resetForm = () => {
    setWaName("");
    setWaMsg("");
    setWaErrors({});
  };

  return {
    waName,
    waMsg,
    waErrors,
    setWaErrors,
    handleWaNameChange,
    handleWaMsgChange,
    getWaMsgHint,
    resetForm,
  };
}
