import React, { useState } from "react";
import { CHECKLIST_STEPS } from "../data";
import {
  ClipboardList,
  CheckCircle2,
  Circle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Checklist() {
  const [checkedIds, setCheckedIds] = useState<string[]>([
    "check-1",
    "check-2",
  ]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id)
        ? prev.filter((currId) => currId !== id)
        : [...prev, id],
    );
  };

  const resetChecklist = () => {
    setCheckedIds([]);
  };

  const completionPercent = Math.round(
    (checkedIds.length / CHECKLIST_STEPS.length) * 100,
  );

  // Group steps by category
  const categories = [
    "4 Semanas Antes",
    "2 Semanas Antes",
    "1 Semana Antes",
    "3 Días Antes",
    "Día de la Mudanza",
  ];

  return (
    <div
      id="organizador-seccion"
      className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100"
    >
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            ORGANIZACIÓN TOTAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Checklist del Mudador Inteligente
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Planifica tu cronograma para evitar descuidos de último minuto.
            Marca las tareas completadas a continuación.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-slate-50 border border-gray-100 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-amber-100 text-amber-800 rounded-2xl">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">
                Progreso de Planificación
              </h3>
              <p className="text-xs text-gray-500">
                Completa las fases ordenadas paso a paso
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:w-48 bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="bg-amber-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
              />
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-gray-900">
                {completionPercent}%
              </span>
              <p className="text-[10px] text-gray-400 font-bold leading-none mt-0.5">
                COMPLETADO
              </p>
            </div>
            <button
              onClick={resetChecklist}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
              title="Resetear Checklist"
              aria-label="Restablecer checklist de planificación"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Checklist Categories & Steps */}
        <div className="space-y-8">
          {categories.map((cat) => {
            const stepsInCat = CHECKLIST_STEPS.filter(
              (s) => s.category === cat,
            );
            return (
              <div key={cat} className="space-y-3">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-1.5">
                  🕒 {cat}
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {stepsInCat.map((step) => {
                    const isChecked = checkedIds.includes(step.id);
                    return (
                      <motion.div
                        key={step.id}
                        layout
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        onClick={() => toggleCheck(step.id)}
                        className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-start gap-3.5 ${
                          isChecked
                            ? "bg-amber-50/10 border-amber-200/55 shadow-2xs"
                            : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-2xs"
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 transition-transform duration-100 active:scale-90"
                          aria-label={
                            isChecked
                              ? "Marcar como no completada"
                              : "Marcar como completada"
                          }
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-amber-600 fill-amber-100/60 stroke-[2.5]" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300 stroke-[2]" />
                          )}
                        </button>
                        <p
                          className={`text-xs text-gray-700 leading-normal ${isChecked ? "line-through text-gray-400" : "font-semibold text-gray-700"}`}
                        >
                          {step.text}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip of completion */}
        <AnimatePresence>
          {completionPercent === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="p-5 bg-emerald-50 border border-emerald-100 rounded-3xl text-center space-y-1 shadow-md"
            >
              <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                <Sparkles
                  className="w-4 h-4 text-emerald-600 animate-spin"
                  style={{ animationDuration: "3s" }}
                />{" "}
                ¡Estás 100% Organizado! Felicitaciones.
              </span>
              <p className="text-[10px] text-emerald-600">
                Tienes tu mudanza en Mendoza perfectamente bajo control para el
                día programado.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
