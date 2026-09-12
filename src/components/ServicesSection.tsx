import React from "react";
import {
  Archive,
  ArrowUpCircle,
  Boxes,
  Check,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

interface ServicesSectionProps {
  onPageSelect?: (page: string) => void;
}

type ServiceGuide = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  when: string;
};

const SERVICE_GUIDE: ServiceGuide[] = [
  {
    id: "transporte",
    name: "Transporte",
    description:
      "Traslado de tus pertenencias entre el punto de origen y el destino.",
    icon: <Truck className="h-5 w-5" aria-hidden="true" />,
    when: "Siempre que necesitás mover tus pertenencias.",
  },
  {
    id: "carga-descarga",
    name: "Carga y descarga",
    description:
      "Manipulación de muebles, cajas y otros objetos para subirlos y bajarlos del vehículo.",
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
    when: "Útil cuando no querés ocuparte de la carga por tu cuenta.",
  },
  {
    id: "embalaje",
    name: "Embalaje",
    description:
      "Preparación y protección de muebles, objetos frágiles y pertenencias antes del traslado.",
    icon: <Archive className="h-5 w-5" aria-hidden="true" />,
    when: "Conviene considerarlo si necesitás ayuda para preparar tus cosas.",
  },
  {
    id: "desmontaje-montaje",
    name: "Desmontaje y montaje",
    description:
      "Desarme y armado de muebles que necesitan preparación para poder trasladarse.",
    icon: <Boxes className="h-5 w-5" aria-hidden="true" />,
    when: "Puede ser necesario para muebles grandes o difíciles de manipular.",
  },
  {
    id: "altura",
    name: "Mudanzas en altura",
    description:
      "Alternativas para objetos que no pueden salir fácilmente por escaleras, puertas o ascensores.",
    icon: <ArrowUpCircle className="h-5 w-5" aria-hidden="true" />,
    when: "Revisalo si tenés objetos voluminosos o accesos complicados.",
  },
  {
    id: "guardamuebles",
    name: "Guardamuebles",
    description:
      "Almacenamiento temporal cuando necesitás liberar uno de los espacios antes de completar el traslado.",
    icon: <Warehouse className="h-5 w-5" aria-hidden="true" />,
    when: "Puede servir si las fechas de salida y entrada no coinciden.",
  },
];

export default function ServicesSection({ onPageSelect }: ServicesSectionProps) {
  return (
    <section
      id="servicios-seccion"
      className="border-b border-gray-100 bg-white px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="servicios-title"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="max-w-2xl space-y-3">
          <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
            Guía para planificar
          </span>
          <h2
            id="servicios-title"
            className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            Servicios de mudanza
          </h2>
          <p className="text-base leading-7 text-gray-600 sm:text-lg">
            Entendé qué puede incluir un traslado antes de pedir presupuesto.
            No todos los servicios son necesarios en todas las mudanzas.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICE_GUIDE.map((service) => (
            <article
              key={service.id}
              className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm sm:p-6"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {service.description}
              </p>
              <div className="mt-auto border-t border-gray-100 pt-4">
                <div className="flex gap-2 text-sm leading-5 text-gray-600">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span>{service.when}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-2xl bg-[#06434A] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Próximo paso
              </p>
              <h3 className="text-xl font-bold sm:text-2xl">
                ¿Ya sabés qué necesitás para tu traslado?
              </h3>
              <p className="text-sm leading-6 text-teal-50">
                Calculá tu mudanza y reuní la información necesaria antes de
                solicitar un presupuesto.
              </p>
            </div>
            <a
              href="/calculadora"
              onClick={(event) => {
                event.preventDefault();
                onPageSelect?.("calculadora");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#07BE8A] px-5 py-3 text-sm font-bold text-[#06434A] transition hover:bg-[#009966] hover:text-white"
            >
              Calcular mi mudanza
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
