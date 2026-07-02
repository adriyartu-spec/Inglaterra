/* =============================================================
   CALENDARIO SECTION – Actividades institucionales
   CAMBIOS:
   - Datos hardcodeados → Supabase tabla eventos
   - Estado loading mientras carga
   - Fallback a eventos de muestra si Supabase está vacío
   - Agrupación por mes dinámica
   ============================================================= */

import { useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";
import { CalendarDays, Clock, Info, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Evento {
  id: string;
  titulo: string;
  fecha_inicio: string;
  categoria: string;
  lugar: string | null;
  hora_inicio: string | null;
}

// Eventos de muestra si Supabase está vacío
const eventosFallback = [
  { mes: "Marzo", actividades: [
    { tipo: "Acto cívico", titulo: "Día del Estudiante", fecha: "15 Mar" },
    { tipo: "Reunión", titulo: "Reunión de padres de familia", fecha: "22 Mar" },
  ]},
  { mes: "Mayo", actividades: [
    { tipo: "Acto cívico", titulo: "Día del Trabajo", fecha: "1 May" },
    { tipo: "Feria", titulo: "Feria de Ciencias", fecha: "16 May" },
  ]},
  { mes: "Agosto", actividades: [
    { tipo: "Acto cívico", titulo: "Fiestas Patrias – Desfile", fecha: "15 Ago" },
    { tipo: "Cultural", titulo: "Festival de Arte y Cultura", fecha: "22 Ago" },
  ]},
  { mes: "Noviembre", actividades: [
    { tipo: "Académico", titulo: "Pruebas nacionales de sexto grado", fecha: "10 Nov" },
    { tipo: "Graduación", titulo: "Graduación de sexto grado", fecha: "28 Nov" },
  ]},
];

const tipoColors: Record<string, string> = {
  "Acto cívico":  "bg-blue-100 text-blue-700",
  "Reunión":      "bg-purple-100 text-purple-700",
  "Cultural":     "bg-orange-100 text-orange-700",
  "Deportivo":    "bg-green-100 text-green-700",
  "Feria":        "bg-yellow-100 text-yellow-700",
  "Académico":    "bg-gray-100 text-gray-700",
  "Graduación":   "bg-amber-100 text-amber-700",
  "General":      "bg-gray-100 text-gray-600",
};

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function agruparPorMes(eventos: Evento[]) {
  const mapa: Record<string, { tipo: string; titulo: string; fecha: string }[]> = {};
  eventos.forEach((ev) => {
    const fecha = new Date(ev.fecha_inicio + "T12:00:00");
    const mes = MESES[fecha.getMonth()];
    const dia = fecha.getDate();
    const mesCorto = mes.slice(0, 3);
    if (!mapa[mes]) mapa[mes] = [];
    mapa[mes].push({
      tipo: ev.categoria,
      titulo: ev.titulo,
      fecha: `${dia} ${mesCorto}`,
    });
  });
  return Object.entries(mapa).map(([mes, actividades]) => ({ mes, actividades }));
}

export default function CalendarioSection() {
  const { ref, visible } = useReveal(0.08);
  const [grupos, setGrupos] = useState<{ mes: string; actividades: { tipo: string; titulo: string; fecha: string }[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarEventos() {
      try {
        const { data: escuela } = await supabase
          .from("escuelas").select("id").eq("subdominio", "inglaterra").single();

        if (!escuela) { setGrupos(eventosFallback); return; }

        const { data, error } = await supabase
          .from("eventos")
          .select("id, titulo, fecha_inicio, categoria, lugar, hora_inicio")
          .eq("escuela_id", escuela.id)
          .eq("publicado", true)
          .order("fecha_inicio", { ascending: true });

        if (error || !data || data.length === 0) {
          setGrupos(eventosFallback);
        } else {
          setGrupos(agruparPorMes(data));
        }
      } catch {
        setGrupos(eventosFallback);
      } finally {
        setLoading(false);
      }
    }
    cargarEventos();
  }, []);

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

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="text-gray-300 animate-spin" />
          </div>
        )}

        {/* Grid de meses */}
        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {grupos.map((mes, i) => (
              <div
                key={mes.mes}
                className={`bg-[oklch(0.97_0.005_255)] rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow reveal ${visible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="bg-[oklch(0.22_0.07_255)] px-4 py-3 flex items-center gap-2">
                  <CalendarDays size={16} className="text-[oklch(0.72_0.12_75)]" />
                  <h3 className="text-white font-bold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {mes.mes}
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {mes.actividades.map((act, j) => (
                    <div key={j} className="bg-white rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tipoColors[act.tipo] || "bg-gray-100 text-gray-600"}`}>
                          {act.tipo}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} />{act.fecha}
                        </span>
                      </div>
                      <p className="text-gray-700 text-xs font-medium leading-snug">{act.titulo}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nota informativa */}
        {!loading && (
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
        )}
      </div>
    </section>
  );
}
