import React, { useState } from 'react';
import { MENDOZA_FAQ } from '../data';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(prev => prev === idx ? null : idx);
  };

  return (
    <div 
      id="faq-seccion" 
      className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            RESPUESTAS RÁPIDAS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Preguntas Frecuentes sobre Mudanzas
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            ¿Tienes dudas sobre los costos, seguros o permisos municipales en Mendoza? Encuentra las respuestas comunes a continuación.
          </p>
        </div>

        <div className="space-y-4">
          {MENDOZA_FAQ.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                layout
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-white border-amber-500/30 shadow-md ring-1 ring-amber-500/5' 
                    : 'bg-white border-gray-100 hover:border-gray-200 shadow-2xs'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-5 flex justify-between items-center gap-4 transition-colors cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isOpen ? 'text-amber-500' : 'text-gray-400'}`} aria-hidden="true" />
                    <span itemProp="name" className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                      {item.q}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-gray-400'}`}>
                    {isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-label={`Respuesta a: ${item.q}`}
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-slate-50">
                        <div itemProp="text" className="bg-slate-50/70 p-4 rounded-xl text-xs text-gray-600 border border-slate-100 leading-relaxed">
                          {item.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
