import React from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle, Quote, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarousel } from '../hooks/useCarousel';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  avatarBg: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "María Inés Gutierrez",
    location: "Chacras de Coria, Luján de Cuyo",
    rating: 5,
    date: "Hace 2 semanas",
    text: "Excelente servicio de principio a fin. Trasladamos toda nuestra casa familiar. El equipo fue extremadamente cuidadoso con los muebles de madera maciza, la cristalería y las plantas del jardín. Una experiencia sin estrés.",
    avatarBg: "bg-amber-100 text-amber-800",
    initials: "MG"
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    location: "Ciudad de Mendoza",
    rating: 5,
    date: "Hace 1 mes",
    text: "Puntualidad impecable. Llegaron exactamente a la hora pactada y el proceso de carga y descarga fue sumamente organizado. El chofer manejó con total precaución y todo llegó en perfecto estado. Altamente recomendados.",
    avatarBg: "bg-emerald-100 text-emerald-800",
    initials: "CM"
  },
  {
    id: 3,
    name: "Valentina Rodríguez",
    location: "San Rafael, Mendoza",
    rating: 5,
    date: "Hace 3 semanas",
    text: "Realicé una mudanza de larga distancia desde el Gran Mendoza hasta San Rafael. Mantuvieron comunicación continua durante todo el trayecto. El personal que ayudó con la carga fue muy educado y profesional.",
    avatarBg: "bg-sky-100 text-sky-800",
    initials: "VR"
  },
  {
    id: 4,
    name: "Jorge Legrand",
    location: "Guaymallén",
    rating: 5,
    date: "Hace 5 días",
    text: "Súper atentos y muy rápidos. Contratamos el servicio de embalaje completo y fue la mejor decisión. En pocas horas guardaron y etiquetaron todo perfectamente. El chofer demostró gran destreza en calles complejas.",
    avatarBg: "bg-indigo-100 text-indigo-800",
    initials: "JL"
  },
  {
    id: 5,
    name: "Sofía Toledano",
    location: "Godoy Cruz, Mendoza",
    rating: 5,
    date: "Hace 2 meses",
    text: "Un servicio excepcional para nuestro traslado de oficina. El cuidado que tuvieron con los equipos de computación y los archivos fue óptimo. Coordinación perfecta y excelente disposición de todos los operarios.",
    avatarBg: "bg-rose-100 text-rose-800",
    initials: "ST"
  }
];

export default function TestimonialsSection() {
  const { currentIndex, handlePrev, handleNext, handleDotClick, touchHandlers } = useCarousel({
    itemCount: TESTIMONIALS.length,
    autoplay: true,
    autoplayInterval: 6000,
  });

  return (
    <section 
      id="testimonials-section" 
      className="bg-slate-50 py-16 sm:py-20 border-y border-gray-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-wider mb-3">
            <ThumbsUp className="w-3 h-3" /> Reseñas de Clientes Satisfechos
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
            La confianza de quienes ya se mudaron
          </h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Conoce las experiencias reales y verificadas de familias y empresas de Mendoza que confiaron en nuestros servicios recomendados para un traslado exitoso.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-12">
          
          {/* Arrow Left */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 z-10 p-3 bg-white hover:bg-slate-50 border border-gray-200/80 rounded-full text-gray-700 shadow-md transition hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer hidden sm:flex"
            aria-label="Reseña anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Arrow Right */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 z-10 p-3 bg-white hover:bg-slate-50 border border-gray-200/80 rounded-full text-gray-700 shadow-md transition hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer hidden sm:flex"
            aria-label="Siguiente reseña"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Slides Window */}
          <div 
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            {...touchHandlers}
          >
            <div className="relative min-h-[340px] sm:min-h-[260px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {TESTIMONIALS.map((testimonial, idx) => {
                  if (idx !== currentIndex) return null;
                  return (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-full bg-white border border-gray-100 shadow-lg shadow-gray-100/50 rounded-3xl p-6 sm:p-10 flex flex-col justify-between relative"
                    >
                      {/* Decorative Quote Icon */}
                      <Quote className="absolute right-6 top-6 sm:right-10 sm:top-10 w-10 h-10 text-slate-100 pointer-events-none" />

                      {/* Stars Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium mb-6 relative z-10 italic">
                        "{testimonial.text}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center gap-4 border-t border-gray-100 pt-5">
                        <div className={`w-12 h-12 rounded-full ${testimonial.avatarBg} flex items-center justify-center text-sm font-black tracking-wider shadow-inner`}>
                          {testimonial.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-gray-950">{testimonial.name}</span>
                            <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-500/10 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                              <CheckCircle className="w-2.5 h-2.5 fill-emerald-500 text-white" /> Verificado
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-xs text-slate-500 font-bold">{testimonial.location}</span>
                            <span className="text-[10px] text-slate-600 font-semibold">{testimonial.date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center items-center gap-1 mt-6">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className="w-11 h-11 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-full"
                aria-label={`Ir a la reseña ${index + 1}`}
              >
                <span className={`h-2 rounded-full transition-all duration-350 ${
                  index === currentIndex ? 'w-6 bg-emerald-700' : 'w-2 bg-slate-300 hover:bg-slate-400' 
                }`} />
              </button>
            ))}
          </div>

          {/* Swipe indicator helper for mobile devices */}
          <div className="text-center mt-4 text-xs text-gray-400 font-medium sm:hidden">
            <p>Desliza para ver más reseñas</p>
          </div>
        </div>
      </div>
    </section>
  );
}