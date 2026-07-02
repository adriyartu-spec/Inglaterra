/* =============================================================
   VIDA ESTUDIANTIL SECTION
   CAMBIOS:
   - Click en tarjeta con reconocimiento → abre modal con imagen
   - Click en tarjeta sin reconocimiento → scroll a su sección
   - Modal con imagen, título y descripción del logro
   - Estado modalRec para controlar el modal
   ============================================================= */

import { useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";
import { Music, Trophy, FlaskConical, Cpu, Leaf, Star, Palette, Users, Loader2, ArrowRight, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const areas = [
  { icon: <Palette size={28} />, title: "Arte", desc: "Expresión creativa a través de pintura, dibujo, manualidades y artes visuales que desarrollan la sensibilidad estética.", color: "oklch(0.55 0.18 255)" },
  { icon: <Music size={28} />, title: "Música", desc: "Formación musical que incluye canto coral, instrumentos y apreciación musical como parte del desarrollo integral.", color: "oklch(0.72 0.12 75)" },
  { icon: <Trophy size={28} />, title: "Deportes", desc: "Actividades deportivas que fomentan el trabajo en equipo, la disciplina y el desarrollo físico saludable.", color: "oklch(0.45 0.15 255)" },
  { icon: <FlaskConical size={28} />, title: "Ciencia", desc: "Proyectos científicos y ferias de ciencias que despiertan la curiosidad y el pensamiento crítico.", color: "oklch(0.35 0.09 255)" },
  { icon: <Cpu size={28} />, title: "Tecnología", desc: "Laboratorio de cómputo y actividades digitales que preparan a los estudiantes para el mundo tecnológico.", color: "oklch(0.22 0.07 255)" },
  { icon: <Leaf size={28} />, title: "Ambiente", desc: "Proyectos de educación ambiental y sostenibilidad que forman ciudadanos conscientes del entorno natural.", color: "oklch(0.45 0.15 145)" },
  { icon: <Star size={28} />, title: "Valores", desc: "Programas de formación en valores que refuerzan el respeto, la honestidad y la solidaridad.", color: "oklch(0.62 0.18 30)" },
  { icon: <Users size={28} />, title: "Extracurriculares", desc: "Clubes, talleres y actividades complementarias que enriquecen la experiencia educativa más allá del aula.", color: "oklch(0.50 0.12 300)" },
];

interface Reconocimiento {
  tipo: string; titulo: string; descripcion: string | null; imagen_url: string | null;
}

const TARJETAS_CONFIG = [
  { tipo: "promedio",  icon: "🌟", label: "Primeros promedios del semestre", seccion: "#estudiantes-destacados" },
  { tipo: "proyecto",  icon: "🔬", label: "Proyecto sobresaliente",          seccion: "#esta-semana" },
  { tipo: "deportivo", icon: "🏆", label: "Logro deportivo",                 seccion: "#esta-semana" },
  { tipo: "artistico", icon: "🎨", label: "Logro artístico",                 seccion: "#esta-semana" },
  { tipo: "solidario", icon: "🤝", label: "Acción solidaria",                seccion: "#comunicados" },
  { tipo: "memorable", icon: "📸", label: "Momento memorable",               seccion: "#esta-semana" },
];

export default function VidaEstudiantilSection() {
  const { ref, visible } = useReveal(0.08);
  const [reconocimientos, setReconocimientos] = useState<Record<string, Reconocimiento>>({});
  const [loading, setLoading] = useState(true);
  const [modalRec, setModalRec] = useState<Reconocimiento | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const { data: escuela } = await supabase
          .from("escuelas").select("id").eq("subdominio", "inglaterra").single();
        if (!escuela) return;
        const { data } = await supabase
          .from("reconocimientos")
          .select("tipo, titulo, descripcion, imagen_url")
          .eq("escuela_id", escuela.id)
          .eq("publicado", true)
          .order("fecha", { ascending: false });
        if (data) {
          const mapa: Record<string, Reconocimiento> = {};
          data.forEach((r) => { if (!mapa[r.tipo]) mapa[r.tipo] = r; });
          setReconocimientos(mapa);
        }
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    }
    cargar();
  }, []);

  // Bloquear scroll cuando modal abierto
  useEffect(() => {
    document.body.style.overflow = modalRec ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalRec]);

  const handleTarjetaClick = (rec: Reconocimiento | undefined, seccion: string) => {
    if (rec) {
      setModalRec(rec);
    } else {
      const el = document.querySelector(seccion);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <section id="vida-estudiantil" className="py-16 sm:py-20 lg:py-28 bg-[oklch(0.97_0.005_255)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Encabezado */}
          <div ref={ref} className={`mb-12 lg:mb-16 reveal ${visible ? "visible" : ""}`}>
            <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">Más allá del aula</p>
            <h2 className="text-[oklch(0.22_0.07_255)] text-3xl sm:text-4xl lg:text-5xl font-bold gold-underline"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Vida Estudiantil
            </h2>
            <p className="text-gray-600 mt-5 max-w-2xl leading-relaxed text-sm sm:text-base">
              En la Escuela Inglaterra creemos en la formación integral. Nuestros estudiantes participan en una amplia variedad de actividades que complementan su desarrollo académico y personal.
            </p>
          </div>

          {/* Grid de áreas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 lg:mb-16">
            {areas.map((area, i) => (
              <div key={area.title}
                className={`bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md border border-gray-100 hover:-translate-y-1 transition-all duration-200 reveal ${visible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 text-white" style={{ background: area.color }}>
                  {area.icon}
                </div>
                <h3 className="text-[oklch(0.22_0.07_255)] font-bold text-base sm:text-lg mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {area.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>

          {/* Orgullo Inglaterra */}
          <div className={`bg-[oklch(0.22_0.07_255)] rounded-2xl p-6 sm:p-8 lg:p-12 reveal ${visible ? "visible" : ""}`}
            style={{ transitionDelay: "600ms" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="inline-flex items-center gap-2 bg-[oklch(0.72_0.12_75/0.2)] border border-[oklch(0.72_0.12_75/0.4)] text-[oklch(0.85_0.09_75)] px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                  <Star size={14} /> Reconocimientos
                </div>
                <h3 className="text-white text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Orgullo Inglaterra
                </h3>
                <p className="text-white/70 leading-relaxed mb-4 text-sm sm:text-base">
                  Cada semestre reconocemos los logros de nuestra comunidad educativa. Destacamos el esfuerzo y la dedicación de estudiantes y proyectos que hacen grande a nuestra institución.
                </p>
                {loading && (
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Loader2 size={14} className="animate-spin" /> Cargando logros...
                  </div>
                )}
              </div>

              {/* Tarjetas */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {TARJETAS_CONFIG.map((config) => {
                  const rec = reconocimientos[config.tipo];
                  return (
                    <button key={config.tipo}
                      onClick={() => handleTarjetaClick(rec, config.seccion)}
                      className="group relative bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 sm:p-4 text-left transition-all duration-200 hover:-translate-y-0.5 overflow-hidden min-h-[100px]">
                      {rec?.imagen_url && (
                        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                          <img src={rec.imagen_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="relative z-10">
                        <div className="text-xl sm:text-2xl mb-1.5">{config.icon}</div>
                        <p className="text-white/90 text-xs font-semibold leading-tight mb-1">{config.label}</p>
                        {rec ? (
                          <p className="text-white/70 text-xs leading-snug line-clamp-2 font-medium">{rec.titulo}</p>
                        ) : loading ? (
                          <div className="h-2.5 w-16 bg-white/10 rounded animate-pulse mt-1" />
                        ) : (
                          <p className="text-white/30 text-xs italic">Por publicar</p>
                        )}
                        <div className="flex items-center gap-1 mt-2 text-white/40 group-hover:text-white/70 transition-colors">
                          <ArrowRight size={10} />
                          <span className="text-xs">{rec ? "Ver detalle" : "Ver más"}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal de reconocimiento ── */}
      {modalRec && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setModalRec(null)}
        >
          <div
            className="relative bg-[oklch(0.22_0.07_255)] rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen */}
            {modalRec.imagen_url && (
              <img
                src={modalRec.imagen_url}
                alt={modalRec.titulo}
                className="w-full h-56 sm:h-72 object-cover"
              />
            )}
            {/* Contenido */}
            <div className="p-6">
              <h3
                className="text-white text-xl sm:text-2xl font-bold mb-3"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {modalRec.titulo}
              </h3>
              {modalRec.descripcion && (
                <p className="text-white/70 text-sm leading-relaxed">
                  {modalRec.descripcion}
                </p>
              )}
              <button
                onClick={() => setModalRec(null)}
                className="mt-5 text-sm text-white/50 hover:text-white transition-colors"
              >
                Cerrar
              </button>
            </div>
            {/* X button */}
            <button
              className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 rounded-full p-1.5 transition-colors"
              onClick={() => setModalRec(null)}
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
