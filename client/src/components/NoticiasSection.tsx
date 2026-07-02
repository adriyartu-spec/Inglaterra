/* =============================================================
   NOTICIAS SECTION – Noticias y actividades institucionales
   Diseño: Fondo azul marino con tarjetas blancas
   ============================================================= */

import { useReveal } from "@/hooks/useReveal";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

const noticias = [
  {
    categoria: "Aniversario",
    fecha: "2026",
    titulo: "Preparativos para los 90 años de la Escuela Inglaterra",
    resumen:
      "La comunidad educativa se organiza para celebrar nueve décadas de historia con una serie de actividades especiales que incluirán exposiciones, actos culturales y la inauguración del nuevo sitio web institucional.",
    tag: "Destacado",
  },
  {
    categoria: "Académico",
    fecha: "2025",
    titulo: "Excelentes resultados en las Pruebas Nacionales",
    resumen:
      "Nuestros estudiantes de sexto grado obtuvieron resultados sobresalientes en las pruebas nacionales, reflejando el compromiso del cuerpo docente con la calidad educativa.",
    tag: "Logro",
  },
  {
    categoria: "Infraestructura",
    fecha: "2025",
    titulo: "Mejoras en las instalaciones deportivas",
    resumen:
      "Gracias a la gestión de la Junta Educativa y el apoyo de la comunidad, se realizaron importantes mejoras en las canchas deportivas y espacios recreativos de la institución.",
    tag: "Proyecto",
  },
  {
    categoria: "Comunidad",
    fecha: "2025",
    titulo: "Feria de Ciencias: innovación estudiantil",
    resumen:
      "Los estudiantes presentaron proyectos científicos creativos e innovadores en la Feria de Ciencias anual, demostrando su capacidad de investigación y pensamiento crítico.",
    tag: "Actividad",
  },
  {
    categoria: "Cultural",
    fecha: "2024",
    titulo: "Festival de Arte y Cultura",
    resumen:
      "El Festival Anual de Arte reunió a toda la comunidad en una celebración de la creatividad estudiantil, con presentaciones de danza, música, teatro y artes visuales.",
    tag: "Evento",
  },
  {
    categoria: "Deportes",
    fecha: "2024",
    titulo: "Campeones interescolares de fútbol",
    resumen:
      "El equipo de fútbol de la Escuela Inglaterra se coronó campeón en el torneo interescolar del cantón de Montes de Oca, orgullo para toda la institución.",
    tag: "Logro",
  },
];

const tagColors: Record<string, string> = {
  Destacado: "bg-[oklch(0.72_0.12_75)] text-[oklch(0.15_0.04_255)]",
  Logro: "bg-green-500 text-white",
  Proyecto: "bg-blue-500 text-white",
  Actividad: "bg-purple-500 text-white",
  Evento: "bg-orange-500 text-white",
};

export default function NoticiasSection() {
  const { ref, visible } = useReveal(0.08);

  return (
    <section id="noticias" className="py-20 lg:py-28 bg-[oklch(0.22_0.07_255)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div
          ref={ref}
          className={`mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6 reveal ${visible ? "visible" : ""}`}
        >
          <div>
            <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
              Actualidad
            </p>
            <h2
              className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Noticias Institucionales
            </h2>
            <div className="w-16 h-1 bg-[oklch(0.72_0.12_75)] mt-4 rounded" />
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Newspaper size={16} />
            <span>Información actualizada por la institución</span>
          </div>
        </div>

        {/* Grid de noticias */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((noticia, i) => (
            <article
              key={noticia.titulo}
              className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col reveal ${visible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Header de la tarjeta */}
              <div className="bg-[oklch(0.96_0.005_255)] px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[oklch(0.45_0.15_255)] text-xs font-medium">
                  <Calendar size={13} />
                  <span>{noticia.categoria} · {noticia.fecha}</span>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${tagColors[noticia.tag] || "bg-gray-200 text-gray-700"}`}
                >
                  {noticia.tag}
                </span>
              </div>

              {/* Contenido */}
              <div className="p-5 flex-1 flex flex-col">
                <h3
                  className="text-[oklch(0.22_0.07_255)] font-bold text-lg mb-3 leading-snug"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {noticia.titulo}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {noticia.resumen}
                </p>
                <button className="mt-4 flex items-center gap-1.5 text-[oklch(0.45_0.15_255)] text-sm font-medium hover:gap-2.5 transition-all duration-150">
                  Leer más <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
