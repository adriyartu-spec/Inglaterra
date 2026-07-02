/* =============================================================
   CALENDARIO SECTION – Actividades institucionales del año
   Diseño: Fondo blanco con tarjetas de eventos por mes
   ============================================================= */

import { useReveal } from "@/hooks/useReveal";
import { CalendarDays, Clock, Info } from "lucide-react";

const eventos = [
  {
    mes: "Marzo",
    actividades: [
      { tipo: "Acto cívico", titulo: "Día del Estudiante", fecha: "15 Mar" },
      { tipo: "Reunión", titulo: "Reunión de padres de familia", fecha: "22 Mar" },
    ],
  },
  {
    mes: "Abril",
    actividades: [
      { tipo: "Cultural", titulo: "Semana Santa – Actividades cívicas", fecha: "14 Abr" },
      { tipo: "Deportivo", titulo: "Torneo interescolar de fútbol", fecha: "25 Abr" },
    ],
  },
  {
    mes: "Mayo",
    actividades: [
      { tipo: "Acto cívico", titulo: "Día del Trabajo – Acto cívico", fecha: "1 May" },
      { tipo: "Feria", titulo: "Feria de Ciencias", fecha: "16 May" },
      { tipo: "Cultural", titulo: "Día de la Madre – Celebración", fecha: "30 May" },
    ],
  },
  {
    mes: "Junio",
    actividades: [
      { tipo: "Acto cívico", titulo: "Día del Padre – Celebración", fecha: "20 Jun" },
      { tipo: "Académico", titulo: "Cierre del primer semestre", fecha: "27 Jun" },
    ],
  },
  {
    mes: "Agosto",
    actividades: [
      { tipo: "Acto cívico", titulo: "Fiestas Patrias – Desfile", fecha: "15 Ago" },
      { tipo: "Cultural", titulo: "Festival de Arte y Cultura", fecha: "22 Ago" },
    ],
  },
  {
    mes: "Octubre",
    actividades: [
      { tipo: "Cultural", titulo: "Día de la Raza – Actividades", fecha: "12 Oct" },
      { tipo: "Reunión", titulo: "Reunión de padres – Tercer trimestre", fecha: "18 Oct" },
    ],
  },
  {
    mes: "Noviembre",
    actividades: [
      { tipo: "Académico", titulo: "Pruebas nacionales de sexto grado", fecha: "10 Nov" },
      { tipo: "Graduación", titulo: "Graduación de sexto grado", fecha: "28 Nov" },
    ],
  },
  {
    mes: "Diciembre",
    actividades: [
      { tipo: "Cultural", titulo: "Festival Navideño", fecha: "5 Dic" },
      { tipo: "Académico", titulo: "Clausura del curso lectivo", fecha: "12 Dic" },
    ],
  },
];

const tipoColors: Record<string, string> = {
  "Acto cívico": "bg-blue-100 text-blue-700",
  "Reunión": "bg-purple-100 text-purple-700",
  "Cultural": "bg-orange-100 text-orange-700",
  "Deportivo": "bg-green-100 text-green-700",
  "Feria": "bg-yellow-100 text-yellow-700",
  "Académico": "bg-gray-100 text-gray-700",
  "Graduación": "bg-amber-100 text-amber-700",
};

export default function CalendarioSection() {
  const { ref, visible } = useReveal(0.08);

  return (
    <section id="calendario" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div ref={ref} className={`mb-16 reveal ${visible ? "visible" : ""}`}>
          <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
            Planificación institucional
          </p>
          <h2
            className="text-[oklch(0.22_0.07_255)] text-3xl sm:text-4xl lg:text-5xl font-bold gold-underline"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Calendario de Actividades
          </h2>
          <p className="text-gray-500 mt-6 max-w-2xl text-sm leading-relaxed">
            Manténgase informado sobre las actividades, actos cívicos, reuniones
            y eventos especiales de la Escuela Inglaterra durante el año lectivo.
          </p>
        </div>

        {/* Grid de meses */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventos.map((mes, i) => (
            <div
              key={mes.mes}
              className={`bg-[oklch(0.97_0.005_255)] rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow reveal ${visible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Header del mes */}
              <div className="bg-[oklch(0.22_0.07_255)] px-4 py-3 flex items-center gap-2">
                <CalendarDays size={16} className="text-[oklch(0.72_0.12_75)]" />
                <h3
                  className="text-white font-bold text-sm"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {mes.mes}
                </h3>
              </div>

              {/* Actividades */}
              <div className="p-4 space-y-3">
                {mes.actividades.map((act) => (
                  <div key={act.titulo} className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${tipoColors[act.tipo] || "bg-gray-100 text-gray-600"}`}
                      >
                        {act.tipo}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {act.fecha}
                      </span>
                    </div>
                    <p className="text-gray-700 text-xs font-medium leading-snug">
                      {act.titulo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Nota informativa */}
        <div
          className={`mt-8 bg-[oklch(0.96_0.005_255)] border border-gray-200 rounded-xl p-4 flex items-start gap-3 reveal ${visible ? "visible" : ""}`}
          style={{ transitionDelay: "600ms" }}
        >
          <Info size={16} className="text-[oklch(0.45_0.15_255)] mt-0.5 flex-shrink-0" />
          <p className="text-gray-500 text-sm">
            Las fechas indicadas son aproximadas y pueden estar sujetas a cambios según el calendario oficial del
            Ministerio de Educación Pública. Consulte con la institución para confirmación de fechas.
          </p>
        </div>
      </div>
    </section>
  );
}
