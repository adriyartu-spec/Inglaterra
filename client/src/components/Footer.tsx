/* =============================================================
   FOOTER – Escuela Inglaterra
   Diseño: Azul marino muy oscuro con escudo y links
   ============================================================= */

import { Facebook, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[oklch(0.16_0.065_255)] text-white">
      {/* Franja superior */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Columna 1: Logo e identidad */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/manus-storage/Escudo_25c2020a.png"
                  alt="Escudo Escuela Inglaterra"
                  className="h-14 w-auto"
                />
                <div>
                  <p
                    className="text-white font-bold text-sm leading-tight"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    Escuela Inglaterra
                  </p>
                  <p className="text-white/50 text-xs">
                    San Rafael de Montes de Oca
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Fundada en 1936. Noventa años formando ciudadanos comprometidos
                con Costa Rica.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-[oklch(0.72_0.12_75/0.15)] border border-[oklch(0.72_0.12_75/0.3)] text-[oklch(0.85_0.09_75)] px-3 py-1.5 rounded-full text-xs font-medium">
                1936 – 2026 · 90 Años
              </div>
            </div>

            {/* Columna 2: Navegación */}
            <div>
              <h4
                className="text-white font-bold text-sm uppercase tracking-widest mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Navegación
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Inicio", href: "#inicio" },
                  { label: "Nuestra Identidad", href: "#identidad" },
                  { label: "Historia", href: "#historia" },
                  { label: "Vida Estudiantil", href: "#vida-estudiantil" },
                  { label: "Junta Educativa", href: "#junta" },
                  { label: "Noticias", href: "#noticias" },
                  { label: "Contacto", href: "#contacto" },
                ].map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 3: Información */}
            <div>
              <h4
                className="text-white font-bold text-sm uppercase tracking-widest mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Información
              </h4>
              <ul className="space-y-2">
                {[
                  "Misión y Visión",
                  "Valores institucionales",
                  "Logros académicos",
                  "Calendario escolar",
                  "Galería multimedia",
                  "Transparencia",
                ].map((item) => (
                  <li key={item}>
                    <span className="text-white/60 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 4: Contacto y redes */}
            <div>
              <h4
                className="text-white font-bold text-sm uppercase tracking-widest mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Contacto
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-white/60 text-sm">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[oklch(0.72_0.12_75)]" />
                  <span>Avenida 21, San Rafael de Montes de Oca, San José, Costa Rica</span>
                </div>
                <a
                  href="https://www.facebook.com/p/Escuela-Inglaterra-100057559746553/?locale=es_LA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                >
                  <Facebook size={14} className="text-[oklch(0.72_0.12_75)]" />
                  <span>Escuela Inglaterra</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              {/* Google Maps link */}
              <a
                href="https://maps.google.com/?q=Escuela+Inglaterra+San+Rafael+Montes+de+Oca"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs text-[oklch(0.72_0.12_75)] hover:text-[oklch(0.85_0.09_75)] transition-colors"
              >
                <MapPin size={12} />
                Ver en Google Maps
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Franja inferior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>
            © {year} Escuela Inglaterra – San Rafael de Montes de Oca, Costa Rica.
            Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5">
            Sitio web donado por{" "}
            <span className="text-green-400 font-semibold">GreenJoy</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
