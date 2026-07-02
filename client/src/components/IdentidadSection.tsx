/* =============================================================
   IDENTIDAD SECTION – Misión, Visión y Valores
   CAMBIOS:
   - Misión actualizada al texto oficial del MEP
   - Visión actualizada al texto oficial del MEP
   - Valores reemplazados por los 4 valores institucionales del MEP
     con definiciones contextualizadas para la Escuela Inglaterra
   ============================================================= */

import { useReveal } from "@/hooks/useReveal";
import { Target, Eye, Heart } from "lucide-react";

const valores = [
  {
    nombre: "Compromiso",
    definicion:
      "Cada docente, funcionario y estudiante de la Escuela Inglaterra actúa con entrega y dedicación que va más allá de lo mínimo requerido, poniendo el corazón en cada tarea.",
  },
  {
    nombre: "Respeto",
    definicion:
      "Reconocemos la dignidad humana y la diversidad de nuestra comunidad, fomentando un ambiente donde cada niño y niña se siente valorado y escuchado.",
  },
  {
    nombre: "Transparencia",
    definicion:
      "Garantizamos el acceso a información veraz y confiable para las familias y la comunidad, construyendo confianza a través de la comunicación abierta.",
  },
  {
    nombre: "Responsabilidad",
    definicion:
      "Asumimos de forma consciente y oportuna nuestros deberes como institución educativa, respondiendo ante las familias y la sociedad costarricense.",
  },
];

export default function IdentidadSection() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section id="identidad" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div ref={ref} className={`mb-16 reveal ${visible ? "visible" : ""}`}>
          <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
            Quiénes somos
          </p>
          <h2
            className="text-[oklch(0.22_0.07_255)] text-3xl sm:text-4xl lg:text-5xl font-bold gold-underline"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Nuestra Identidad
          </h2>
        </div>

        {/* Grid misión + visión */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* MISIÓN — texto oficial MEP */}
          <div
            className={`border-l-4 border-[oklch(0.22_0.07_255)] bg-[oklch(0.96_0.005_255)] rounded-r-xl p-6 lg:p-8 reveal ${visible ? "visible" : ""}`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[oklch(0.22_0.07_255)]"><Target size={28} /></div>
              <h3
                className="text-[oklch(0.22_0.07_255)] text-xl font-bold"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Misión
              </h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                El MEP es el ente rector que garantiza a los habitantes del
                país el derecho fundamental a una educación de calidad.
              </p>
              <p>
                Se asegura el acceso equitativo e inclusivo, con aprendizajes
                pertinentes y relevantes.
              </p>
              <p>
                Busca la formación plena e integral de las personas y la
                convivencia social.
              </p>
            </div>
          </div>

          {/* VISIÓN — texto oficial MEP */}
          <div
            className={`border-l-4 border-[oklch(0.22_0.07_255)] bg-[oklch(0.96_0.005_255)] rounded-r-xl p-6 lg:p-8 reveal ${visible ? "visible" : ""}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[oklch(0.22_0.07_255)]"><Eye size={28} /></div>
              <h3
                className="text-[oklch(0.22_0.07_255)] text-xl font-bold"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Visión
              </h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                Ser una institución reconocida a nivel nacional e internacional
                como la rectora del sistema educativo costarricense.
              </p>
              <p>
                Lograrlo mediante el mejoramiento continuo de la gestión, con
                estándares modernos de eficacia, eficiencia y transparencia.
              </p>
              <p>
                Orientarse hacia la construcción de una sociedad inclusiva e
                integrada.
              </p>
            </div>
          </div>
        </div>

        {/* VALORES — 4 valores del MEP con definiciones contextualizadas */}
        <div
          className={`bg-[oklch(0.22_0.07_255)] rounded-2xl p-8 lg:p-12 reveal ${visible ? "visible" : ""}`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[oklch(0.72_0.12_75)] p-2 rounded-lg">
              <Heart size={22} className="text-[oklch(0.15_0.04_255)]" />
            </div>
            <h3
              className="text-white text-2xl font-bold"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Nuestros Valores
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {valores.map((valor, i) => (
              <div
                key={valor.nombre}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
                style={{ transitionDelay: `${400 + i * 60}ms` }}
              >
                <h4
                  className="text-[oklch(0.85_0.09_75)] font-bold text-base mb-2"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {valor.nombre}
                </h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  {valor.definicion}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Foto de estudiantes */}
        <div
          className={`mt-12 grid md:grid-cols-2 gap-8 items-center reveal ${visible ? "visible" : ""}`}
          style={{ transitionDelay: "500ms" }}
        >
          <div>
            <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
              Comunidad educativa
            </p>
            <h3
              className="text-[oklch(0.22_0.07_255)] text-2xl sm:text-3xl font-bold mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Formando el futuro de Costa Rica
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              La Escuela Inglaterra es un espacio donde cada niño y niña
              encuentra las herramientas para crecer como persona y como
              ciudadano. Nuestro equipo docente trabaja con dedicación para
              garantizar una educación de calidad, accesible e inclusiva.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Desde 1936, hemos sido parte del tejido social de San Rafael de
              Montes de Oca, acompañando generaciones de familias
              costarricenses en su camino hacia el conocimiento.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663744735795/BpPgDYJmx46K3RMxDBs7WN/estudiantes-R9zvaZNHpQn5TfKJH4JMMw.webp"
              alt="Estudiantes de la Escuela Inglaterra"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
