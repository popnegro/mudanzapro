import React, { useState } from 'react';
import { MENDOZA_FAQ } from '../data';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

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

        <div className="space-y-3">
          {MENDOZA_FAQ.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-5 flex justify-between items-center gap-4 hover:bg-slate-50/50 transition cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <span itemProp="name" className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                      {item.q}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div 
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                    className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-slate-50"
                  >
                    <div itemProp="text" className="bg-slate-50 p-4 rounded-xl text-xs text-gray-600">
                      {item.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
