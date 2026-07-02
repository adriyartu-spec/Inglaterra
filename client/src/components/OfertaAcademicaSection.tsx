/* =============================================================
   OFERTA ACADÉMICA SECTION – Servicios y profesionales
   NUEVO: Solicitud de la escuela — después de Nuestra Identidad
   Diseño: Grid de tarjetas con íconos, fondo claro
   TODO: Actualizar la lista de servicios con los datos reales
         que provea la dirección de la escuela
   ============================================================= */

import { useReveal } from "@/hooks/useReveal";
import {
  BookOpen, Brain, Apple, Library, Monitor,
  HeartPulse, Music2, Dumbbell, Leaf, Users
} from "lucide-react";

const servicios = [
  {
    icon: <BookOpen size={28} />,
    title: "Educación General Básica",
    desc: "Formación académica de primer a sexto grado conforme al programa del Ministerio de Educación Pública de Costa Rica.",
    color: "oklch(0.42 0.22 255)",
  },
  {
    icon: <Brain size={28} />,
    title: "Orientación y Psicología",
    desc: "Apoyo emocional y psicológico para estudiantes, con atención individualizada y seguimiento del bienestar integral.",
    color: "oklch(0.62 0.18 30)",
  },
  {
    icon: <Apple size={28} />,
    title: "Comedor Escolar",
    desc: "Servicio de alimentación nutritiva y balanceada, garantizando el bienestar alimentario de nuestros estudiantes.",
    color: "oklch(0.45 0.15 145)",
  },
  {
    icon: <Library size={28} />,
    title: "Biblioteca",
    desc: "Espacio de lectura, investigación y aprendizaje con recursos bibliográficos actualizados a disposición de los estudiantes.",
    color: "oklch(0.72 0.12 75)",
  },
  {
    icon: <Monitor size={28} />,
    title: "Laboratorio de Cómputo",
    desc: "Infraestructura tecnológica para el desarrollo de habilidades digitales fundamentales en el siglo XXI.",
    color: "oklch(0.35 0.09 255)",
  },
  {
    icon: <HeartPulse size={28} />,
    title: "Educación Especial",
    desc: "Atención especializada e inclusiva para estudiantes con necesidades educativas especiales, garantizando igualdad de oportunidades.",
    color: "oklch(0.55 0.20 0)",
  },
  {
    icon: <Music2 size={28} />,
    title: "Educación Musical",
    desc: "Programa de formación musical que desarrolla la sensibilidad artística, la disciplina y la expresión creativa.",
    color: "oklch(0.50 0.12 300)",
  },
  {
    icon: <Dumbbell size={28} />,
    title: "Educación Física",
    desc: "Clases de educación física que promueven la salud, el deporte y el desarrollo motriz de los estudiantes.",
    color: "oklch(0.45 0.15 255)",
  },
  {
    icon: <Leaf size={28} />,
    title: "Educación Ambiental",
    desc: "Programas de conciencia ecológica y sostenibilidad que forman ciudadanos responsables con el entorno natural.",
    color: "oklch(0.40 0.15 160)",
  },
  {
    icon: <Users size={28} />,
    title: "Trabajo Social",
    desc: "Acompañamiento a las familias y seguimiento socioemocional de los estudiantes para garantizar su permanencia y éxito escolar.",
    color: "oklch(0.55 0.18 255)",
  },
];

export default function OfertaAcademicaSection() {
  const { ref, visible } = useReveal(0.06);

  return (
    <section id="oferta-academica" className="py-20 lg:py-28 bg-[oklch(0.97_0.005_255)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div ref={ref} className={`mb-16 reveal ${visible ? "visible" : ""}`}>
          <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
            Lo que ofrecemos
          </p>
          <h2
            className="text-[oklch(0.22_0.07_255)] text-3xl sm:text-4xl lg:text-5xl font-bold gold-underline"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Oferta Académica
          </h2>
          <p className="text-gray-600 mt-6 max-w-2xl leading-relaxed">
            La Escuela Inglaterra cuenta con un equipo interdisciplinario de
            profesionales comprometidos con la formación integral de cada
            estudiante, más allá del aula de clases.
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {servicios.map((servicio, i) => (
            <div
              key={servicio.title}
              className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 hover:-translate-y-1 transition-all duration-200 reveal ${visible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white"
                style={{ background: servicio.color }}
              >
                {servicio.icon}
              </div>
              <h3
                className="text-[oklch(0.22_0.07_255)] font-bold text-base mb-2 leading-snug"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {servicio.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">{servicio.desc}</p>
            </div>
          ))}
        </div>

        {/* Nota institucional */}
        <div
          className={`mt-12 bg-[oklch(0.22_0.07_255)] rounded-2xl p-6 lg:p-8 flex items-start gap-4 reveal ${visible ? "visible" : ""}`}
          style={{ transitionDelay: "700ms" }}
        >
          <div className="flex-shrink-0 bg-[oklch(0.72_0.12_75)] p-2 rounded-lg mt-0.5">
            <Users size={20} className="text-[oklch(0.15_0.04_255)]" />
          </div>
          <div>
            <h4
              className="text-white font-bold text-lg mb-2"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Equipo interdisciplinario
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Además de nuestro cuerpo docente, la Escuela Inglaterra cuenta con
              profesionales especializados en orientación, psicología, educación
              especial, trabajo social, biblioteca y tecnología. Juntos
              garantizamos una atención integral a cada estudiante de San Rafael
              de Montes de Oca.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
