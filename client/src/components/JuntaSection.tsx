/* =============================================================
   JUNTA EDUCATIVA SECTION → APOYOS ADICIONALES
   CAMBIOS:
   - Título "Junta Educativa" → "Apoyos Adicionales"
   - Eliminada sección "Próximas actividades"
   - Eliminada función "Vinculación comunitaria"
   - Texto actualizado para reflejar el nuevo enfoque
   ============================================================= */

import { useReveal } from "@/hooks/useReveal";
import { Building2, Wrench, FolderOpen } from "lucide-react";

const funciones = [
  {
    icon: <Building2 size={22} />,
    title: "Apoyo institucional",
    desc: "Respaldo a la gestión de la dirección y docentes para garantizar el buen funcionamiento de la escuela.",
  },
  {
    icon: <Wrench size={22} />,
    title: "Mejoras de infraestructura",
    desc: "Gestión de proyectos para el mantenimiento y mejora de las instalaciones físicas de la institución.",
  },
  {
    icon: <FolderOpen size={22} />,
    title: "Gestión de proyectos",
    desc: "Coordinación de iniciativas que benefician directamente a los estudiantes y la comunidad educativa.",
  },
];

export default function JuntaSection() {
  const { ref, visible } = useReveal(0.08);

  return (
    <section id="junta" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Columna izquierda: texto */}
          <div ref={ref}>
            <div className={`reveal ${visible ? "visible" : ""}`}>
              <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
                Transparencia y participación
              </p>
              {/* CAMBIO: "Junta Educativa" → "Apoyos Adicionales" */}
              <h2
                className="text-[oklch(0.22_0.07_255)] text-3xl sm:text-4xl font-bold mb-6 gold-underline"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Apoyos Adicionales
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                La Junta Educativa es el órgano de participación comunitaria que
                apoya la gestión de la Escuela Inglaterra. Trabajamos de manera
                transparente y comprometida para mejorar la calidad educativa y
                las condiciones de nuestra institución.
              </p>
            </div>

            {/* Funciones — sin Vinculación comunitaria */}
            <div className="space-y-4">
              {funciones.map((f, i) => (
                <div
                  key={f.title}
                  className={`flex gap-4 p-4 rounded-xl hover:bg-[oklch(0.96_0.005_255)] transition-colors reveal ${visible ? "visible" : ""}`}
                  style={{ transitionDelay: `${100 + i * 80}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[oklch(0.22_0.07_255)] flex items-center justify-center text-white">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[oklch(0.22_0.07_255)] mb-1">{f.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha: solo foto — sin Próximas actividades */}
          <div>
            <div
              className={`rounded-2xl overflow-hidden shadow-xl reveal ${visible ? "visible" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <img
                src="/comunidad.png"
                alt="Comunidad de la Escuela Inglaterra"
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
