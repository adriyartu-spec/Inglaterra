/* =============================================================
   COMUNICADOS SECTION – Avisos a padres de familia
   NUEVO: Conectado a Supabase tabla comunicados
   - Lee comunicados publicados y vigentes
   - Fallback si Supabase está vacío
   - Tipos: general, urgente, informativo, actividad, logro
   ============================================================= */

import { useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";
import { Megaphone, AlertTriangle, Info, Calendar, Star, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Comunicado {
  id: string;
  titulo: string;
  contenido: string;
  tipo: string;
  fecha_publicacion: string;
  fecha_vencimiento: string | null;
}

const comunicadosFallback: Comunicado[] = [
  {
    id: "1",
    titulo: "Bienvenida al año lectivo 2026",
    contenido: "Estimadas familias, les damos la más cordial bienvenida al nuevo año lectivo. Las clases inician el lunes 10 de febrero. Por favor asegúrese de que su hijo(a) traiga todos los útiles escolares.",
    tipo: "general",
    fecha_publicacion: "2026-02-01",
    fecha_vencimiento: null,
  },
  {
    id: "2",
    titulo: "Reunión de padres de familia — Marzo",
    contenido: "Se convoca a todos los padres de familia a la reunión informativa del primer trimestre. Fecha: viernes 22 de marzo a las 5:00 p.m. en el salón principal.",
    tipo: "actividad",
    fecha_publicacion: "2026-03-10",
    fecha_vencimiento: "2026-03-22",
  },
];

const tipoConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  urgente:     { label: "Urgente",     color: "text-red-700",    bg: "bg-red-50 border-red-200",    icon: <AlertTriangle size={14} /> },
  general:     { label: "General",     color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   icon: <Megaphone size={14} /> },
  informativo: { label: "Informativo", color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",   icon: <Info size={14} /> },
  actividad:   { label: "Actividad",   color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: <Calendar size={14} /> },
  logro:       { label: "Logro",       color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",  icon: <Star size={14} /> },
};

function formatFecha(fecha: string): string {
  return new Date(fecha + "T12:00:00").toLocaleDateString("es-CR", {
    day: "numeric", month: "long", year: "numeric"
  });
}

export default function ComunicadosSection() {
  const { ref, visible } = useReveal(0.08);
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const { data: escuela } = await supabase
          .from("escuelas").select("id").eq("subdominio", "inglaterra").single();

        if (!escuela) { setComunicados(comunicadosFallback); return; }

        const hoy = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("comunicados")
          .select("id, titulo, contenido, tipo, fecha_publicacion, fecha_vencimiento")
          .eq("escuela_id", escuela.id)
          .eq("publicado", true)
          .or(`fecha_vencimiento.is.null,fecha_vencimiento.gte.${hoy}`)
          .order("fecha_publicacion", { ascending: false })
          .limit(10);

        setComunicados(error || !data || data.length === 0 ? comunicadosFallback : data);
      } catch {
        setComunicados(comunicadosFallback);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  return (
    <section id="comunicados" className="py-20 lg:py-28 bg-[oklch(0.97_0.005_255)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div ref={ref} className={`mb-16 reveal ${visible ? "visible" : ""}`}>
          <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
            Información para las familias
          </p>
          <h2
            className="text-[oklch(0.22_0.07_255)] text-3xl sm:text-4xl lg:text-5xl font-bold gold-underline"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Comunicados
          </h2>
          <p className="text-gray-500 mt-6 max-w-2xl text-sm leading-relaxed">
            Avisos, noticias y comunicaciones oficiales de la Escuela Inglaterra
            para toda la comunidad educativa.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="text-gray-300 animate-spin" />
          </div>
        )}

        {/* Lista de comunicados */}
        {!loading && (
          <div className="space-y-4 max-w-3xl">
            {comunicados.map((com, i) => {
              const config = tipoConfig[com.tipo] ?? tipoConfig.general;
              const abierto = expandido === com.id;

              return (
                <div
                  key={com.id}
                  className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 reveal ${visible ? "visible" : ""}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Header del comunicado */}
                  <button
                    className="w-full text-left p-5 flex items-start gap-4"
                    onClick={() => setExpandido(abierto ? null : com.id)}
                  >
                    {/* Badge tipo */}
                    <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-[oklch(0.22_0.07_255)] font-bold text-base leading-snug mb-1"
                        style={{ fontFamily: "'DM Serif Display', serif" }}
                      >
                        {com.titulo}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {formatFecha(com.fecha_publicacion)}
                        {com.fecha_vencimiento && (
                          <span className="ml-2">· Vigente hasta {formatFecha(com.fecha_vencimiento)}</span>
                        )}
                      </p>
                    </div>

                    {/* Toggle */}
                    <span className="flex-shrink-0 text-gray-400 text-lg leading-none mt-0.5">
                      {abierto ? "−" : "+"}
                    </span>
                  </button>

                  {/* Contenido expandido */}
                  {abierto && (
                    <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {com.contenido}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
