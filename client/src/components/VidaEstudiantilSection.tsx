/* =============================================================
   VIDA ESTUDIANTIL SECTION – Actividades y logros estudiantiles
   CAMBIOS:
   - "Estudiante de la semana" → "Primeros promedios del semestre"
   - Eliminado "Docente destacado"
   - "Momentos por Semana" → "Momentos Memorables"
   ============================================================= */

import { useReveal } from "@/hooks/useReveal";
import { Music, Trophy, FlaskConical, Cpu, Leaf, Star, Palette, Users } from "lucide-react";

const areas = [
  {
    icon: <Palette size={28} />,
    title: "Arte",
    desc: "Expresión creativa a través de pintura, dibujo, manualidades y artes visuales que desarrollan la sensibilidad estética.",
    color: "oklch(0.55 0.18 255)",
  },
  {
    icon: <Music size={28} />,
    title: "Música",
    desc: "Formación musical que incluye canto coral, instrumentos y apreciación musical como parte del desarrollo integral.",
    color: "oklch(0.72 0.12 75)",
  },
  {
    icon: <Trophy size={28} />,
    title: "Deportes",
    desc: "Actividades deportivas que fomentan el trabajo en equipo, la disciplina y el desarrollo físico saludable.",
    color: "oklch(0.45 0.15 255)",
  },
  {
    icon: <FlaskConical size={28} />,
    title: "Ciencia",
    desc: "Proyectos científicos y ferias de ciencias que despiertan la curiosidad y el pensamiento crítico en los estudiantes.",
    color: "oklch(0.35 0.09 255)",
  },
  {
    icon: <Cpu size={28} />,
    title: "Tecnología",
    desc: "Laboratorio de cómputo y actividades digitales que preparan a los estudiantes para el mundo tecnológico actual.",
    color: "oklch(0.22 0.07 255)",
  },
  {
    icon: <Leaf size={28} />,
    title: "Ambiente",
    desc: "Proyectos de educación ambiental y sostenibilidad que forman ciudadanos conscientes del entorno natural.",
    color: "oklch(0.45 0.15 145)",
  },
  {
    icon: <Star size={28} />,
    title: "Valores",
    desc: "Programas de formación en valores que refuerzan el respeto, la honestidad y la solidaridad en la vida cotidiana.",
    color: "oklch(0.62 0.18 30)",
  },
  {
    icon: <Users size={28} />,
    title: "Extracurriculares",
    desc: "Clubes, talleres y actividades complementarias que enriquecen la experiencia educativa más allá del aula.",
    color: "oklch(0.50 0.12 300)",
  },
];

export default function VidaEstudiantilSection() {
  const { ref, visible } = useReveal(0.08);

  return (
    <section id="vida-estudiantil" className="py-20 lg:py-28 bg-[oklch(0.97_0.005_255)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div ref={ref} className={`mb-16 reveal ${visible ? "visible" : ""}`}>
          <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
            Más allá del aula
          </p>
          <h2
            className="text-[oklch(0.22_0.07_255)] text-3xl sm:text-4xl lg:text-5xl font-bold gold-underline"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Vida Estudiantil
          </h2>
          <p className="text-gray-600 mt-6 max-w-2xl leading-relaxed">
            En la Escuela Inglaterra creemos en la formación integral. Nuestros
            estudiantes participan en una amplia variedad de actividades que
            complementan su desarrollo académico y personal.
          </p>
        </div>

        {/* Grid de áreas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {areas.map((area, i) => (
            <div
              key={area.title}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-gray-100 hover:-translate-y-1 transition-all duration-200 reveal ${visible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                style={{ background: area.color }}
              >
                {area.icon}
              </div>
              <h3
                className="text-[oklch(0.22_0.07_255)] font-bold text-lg mb-2"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {area.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{area.desc}</p>
            </div>
          ))}
        </div>

        {/* Orgullo Inglaterra — CAMBIOS: sin Docente Destacado, semestre en vez de semana */}
        <div
          className={`bg-[oklch(0.22_0.07_255)] rounded-2xl p-8 lg:p-12 reveal ${visible ? "visible" : ""}`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[oklch(0.72_0.12_75/0.2)] border border-[oklch(0.72_0.12_75/0.4)] text-[oklch(0.85_0.09_75)] px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                <Star size={14} />
                Reconocimientos
              </div>
              <h3
                className="text-white text-2xl sm:text-3xl font-bold mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Orgullo Inglaterra
              </h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Cada semestre reconocemos los logros de nuestra comunidad
                educativa. Destacamos el esfuerzo y la dedicación de
                estudiantes y proyectos que hacen grande a nuestra institución.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                /* CAMBIO: "Estudiante de la semana" → "Primeros promedios del semestre" */
                { label: "Primeros promedios del semestre", icon: "🌟" },
                /* ELIMINADO: Docente destacado */
                { label: "Proyecto sobresaliente", icon: "🔬" },
                { label: "Logro deportivo", icon: "🏆" },
                { label: "Logro artístico", icon: "🎨" },
                { label: "Acción solidaria", icon: "🤝" },
                /* CAMBIO: Momentos memorables */
                { label: "Momentos memorables", icon: "📸" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-center transition-colors cursor-default"
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-white/80 text-xs leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
