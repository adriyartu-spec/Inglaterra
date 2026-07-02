/* =============================================================
   HISTORIA SECTION – Timeline de la Escuela Inglaterra
   CAMBIOS:
   - "Sabanilla" → "San Rafael de Montes de Oca" en toda la sección
   - Añadido bloque de créditos al Prof. Erick
   - Espacio preparado para recibir la investigación histórica del Prof. Erick
   - Foto de fachada actualizada a /Frente.png
   ============================================================= */

import { useReveal } from "@/hooks/useReveal";
import { BookOpen } from "lucide-react";

const hitos = [
  {
    year: "1936",
    title: "Fundación",
    desc: "La Escuela Inglaterra abre sus puertas en San Rafael de Montes de Oca, convirtiéndose en un pilar educativo para la comunidad y sus alrededores.",
  },
  {
    year: "1950s",
    title: "Crecimiento institucional",
    desc: "La escuela amplía su infraestructura para atender a una comunidad en crecimiento, consolidando su rol como centro educativo de referencia en el cantón de Montes de Oca.",
  },
  {
    year: "1970s",
    title: "Expansión académica",
    desc: "Se incorporan nuevos programas y actividades extracurriculares que enriquecen la formación integral de los estudiantes, incluyendo deportes, artes y ciencias.",
  },
  {
    year: "1990s",
    title: "Modernización",
    desc: "La institución se moderniza con nuevas aulas, laboratorios y espacios recreativos, respondiendo a las necesidades educativas de una nueva generación.",
  },
  {
    year: "2000s",
    title: "Innovación educativa",
    desc: "Integración de tecnología en el aula y nuevas metodologías pedagógicas que preparan a los estudiantes para los desafíos del siglo XXI.",
  },
  {
    year: "2026",
    title: "90 Años de historia",
    desc: "La Escuela Inglaterra celebra nueve décadas de excelencia educativa, orgullo comunitario y compromiso con el futuro de Costa Rica y de San Rafael de Montes de Oca.",
    highlight: true,
  },
];

export default function HistoriaSection() {
  const { ref, visible } = useReveal(0.08);

  return (
    <section
      id="historia"
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      {/* Fondo con imagen histórica */}
      <div className="absolute inset-0">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663744735795/BpPgDYJmx46K3RMxDBs7WN/historia_bg-iUhogGLXwQ6ZZo6JBqHmJo.webp"
          alt=""
          className="w-full h-full object-cover opacity-15"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[oklch(0.22_0.07_255/0.92)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div ref={ref} className={`mb-16 reveal ${visible ? "visible" : ""}`}>
          <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
            Desde 1936
          </p>
          <h2
            className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Nuestra Historia
          </h2>
          <div className="w-16 h-1 bg-[oklch(0.72_0.12_75)] mt-4 rounded" />
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-white/20" />
          <div className="space-y-10">
            {hitos.map((hito, i) => (
              <div
                key={hito.year}
                className={`relative flex gap-6 sm:gap-10 reveal ${visible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 z-10 relative ${
                      hito.highlight
                        ? "bg-[oklch(0.72_0.12_75)] border-[oklch(0.72_0.12_75)] text-[oklch(0.15_0.04_255)]"
                        : "bg-[oklch(0.22_0.07_255)] border-white/40 text-white"
                    }`}
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    {hito.year.length <= 4 ? hito.year : hito.year.slice(0, 4)}
                  </div>
                </div>
                <div
                  className={`flex-1 pb-2 ${
                    hito.highlight
                      ? "bg-[oklch(0.72_0.12_75/0.1)] border border-[oklch(0.72_0.12_75/0.3)] rounded-xl p-5"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className={`text-lg sm:text-xl font-bold ${
                        hito.highlight ? "text-[oklch(0.85_0.09_75)]" : "text-white"
                      }`}
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {hito.title}
                    </h3>
                    {hito.highlight && (
                      <span className="bg-[oklch(0.72_0.12_75)] text-[oklch(0.15_0.04_255)] text-xs font-bold px-2 py-0.5 rounded-full">
                        ¡Celebración!
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                    {hito.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Investigación histórica del Prof. Erick ── */}
        {/* NUEVO: espacio para recibir la investigación completa */}
        <div
          className={`mt-16 bg-white/5 border border-white/20 rounded-2xl p-8 lg:p-10 reveal ${visible ? "visible" : ""}`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[oklch(0.72_0.12_75)] p-2 rounded-lg">
              <BookOpen size={20} className="text-[oklch(0.15_0.04_255)]" />
            </div>
            <h3
              className="text-white text-xl font-bold"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Investigación histórica institucional
            </h3>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            {/* TODO: Reemplazar este párrafo con el contenido de la investigación del Prof. Erick */}
            Esta sección está reservada para la investigación histórica de la
            Escuela Inglaterra. El contenido será aportado próximamente por el
            equipo docente de la institución.
          </p>
          {/* Créditos al Prof. Erick */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
              Créditos de investigación
            </p>
            <p className="text-[oklch(0.85_0.09_75)] text-sm font-medium">
              Profesor Erick — Escuela Inglaterra, San Rafael de Montes de Oca
            </p>
            <p className="text-white/50 text-xs mt-1">
              Investigación histórica sobre la fundación y evolución de la
              Escuela Inglaterra. Todos los derechos de la investigación
              pertenecen a su autor.
            </p>
          </div>
        </div>

        {/* Foto del frente de la escuela */}
        <div
          className={`mt-10 reveal ${visible ? "visible" : ""}`}
          style={{ transitionDelay: "900ms" }}
        >
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
            Fachada de la institución
          </p>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src="/Frente.png"
              alt="Fachada de la Escuela Inglaterra — San Rafael de Montes de Oca"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
