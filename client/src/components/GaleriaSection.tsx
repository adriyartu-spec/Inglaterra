/* =============================================================
   GALERIA SECTION – "Esta Semana en la Escuela"
   NUEVO: Fase 1 WOW Visual
   Diseño: Grid editorial masonry-style, fondo oscuro premium,
           hover cinematográfico, preparado para Supabase (Fase 2)
   CAMBIOS:
   - Sección completamente nueva
   - Grid asimétrico tipo editorial (foto grande + grid pequeñas)
   - Lightbox modal nativo (sin librería extra)
   - Datos hardcodeados ahora → conectar a Supabase en Fase 2
   - Tag de semana dinámico con fecha real
   - Botón "Ver en Facebook" preparado para Meta API (Fase 4)
   - Animaciones reveal escalonadas por foto
   ============================================================= */

import { useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";
import { Camera, Instagram, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

// ── Datos de muestra ── conectar a Supabase en Fase 2
// tabla: galeria_fotos (id, url, caption, semana, uploaded_at, uploaded_by)
const fotosSemana = [
  {
    id: 1,
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663744735795/BpPgDYJmx46K3RMxDBs7WN/estudiantes-R9zvaZNHpQn5TfKJH4JMMw.webp",
    caption: "Estudiantes participando en la feria científica anual",
    categoria: "Académico",
    destacada: true,
  },
  {
    id: 2,
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663744735795/BpPgDYJmx46K3RMxDBs7WN/hero_escuela-ZcZhc6bLeRU7JH7FSos2sD.webp",
    caption: "Entrada principal — orgullo de nuestra institución",
    categoria: "Institucional",
    destacada: false,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    caption: "Actividades deportivas en el patio escolar",
    categoria: "Deporte",
    destacada: false,
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80",
    caption: "Taller de arte y expresión creativa",
    categoria: "Arte",
    destacada: false,
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1560785496-3c9d27877182?w=800&q=80",
    caption: "Celebración cultural con toda la comunidad",
    categoria: "Cultural",
    destacada: false,
  },
];

const categoriaColor: Record<string, string> = {
  Académico:    "var(--color-ei-electric)",
  Institucional: "var(--color-ei-navy)",
  Deporte:      "#059669",
  Arte:         "#d97706",
  Cultural:     "#7c3aed",
};

// Obtiene la fecha de la semana actual en formato legible
function getSemanaLabel(): string {
  const now  = new Date();
  const day  = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const lunes = new Date(now.setDate(diff));
  const viernes = new Date(lunes);
  viernes.setDate(lunes.getDate() + 4);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
  return `${lunes.toLocaleDateString("es-CR", opts)} – ${viernes.toLocaleDateString("es-CR", opts)}`;
}

export default function GaleriaSection() {
  const { ref, visible } = useReveal(0.06);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const semanaLabel = getSemanaLabel();

  // Cerrar lightbox con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight" && lightboxIdx !== null)
        setLightboxIdx((lightboxIdx + 1) % fotosSemana.length);
      if (e.key === "ArrowLeft" && lightboxIdx !== null)
        setLightboxIdx((lightboxIdx - 1 + fotosSemana.length) % fotosSemana.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIdx]);

  // Bloquear scroll del body cuando el lightbox está abierto
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  const fotaDestacada = fotosSemana.find((f) => f.destacada)!;
  const fotosSecundarias = fotosSemana.filter((f) => !f.destacada);

  return (
    <>
      <section
        id="esta-semana"
        className="py-20 lg:py-28"
        style={{ background: "var(--color-ei-navy-dark)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Encabezado ── */}
          <div ref={ref} className={`mb-12 reveal ${visible ? "visible" : ""}`}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p
                  className="font-semibold text-sm uppercase tracking-widest mb-3"
                  style={{ color: "var(--color-ei-gold)" }}
                >
                  Vida escolar
                </p>
                <h2
                  className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  Esta Semana
                  <br />
                  <span style={{ color: "var(--color-ei-gold-light)" }}>
                    en la Escuela
                  </span>
                </h2>
              </div>
              {/* Badge de semana */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium self-start sm:self-auto"
                style={{
                  background: "var(--color-ei-electric)/15",
                  border: "1px solid var(--color-ei-electric)/30",
                  color: "white/80",
                }}
              >
                <Calendar size={14} style={{ color: "var(--color-ei-gold)" }} />
                <span className="text-white/70">{semanaLabel}</span>
              </div>
            </div>
            <p className="text-white/50 mt-4 max-w-xl leading-relaxed">
              Momentos que hacen grande a nuestra comunidad. Las maestras
              comparten cada semana los instantes más especiales.
            </p>
          </div>

          {/* ── Grid editorial asimétrico ── */}
          <div className={`reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: "150ms" }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">

              {/* Foto destacada — ocupa 7 columnas */}
              <div
                className="lg:col-span-7 relative group overflow-hidden rounded-2xl cursor-pointer"
                style={{ aspectRatio: "16/10" }}
                onClick={() => setLightboxIdx(fotosSemana.indexOf(fotaDestacada))}
              >
                <img
                  src={fotaDestacada.url}
                  alt={fotaDestacada.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay en hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: "var(--color-ei-navy)/60" }}
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Camera size={28} className="text-white" />
                  </div>
                </div>
                {/* Caption overlay inferior */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{
                    background: "linear-gradient(to top, var(--color-ei-navy-dark)/90, transparent)",
                  }}
                >
                  <span
                    className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2"
                    style={{
                      background: categoriaColor[fotaDestacada.categoria],
                      color: "white",
                    }}
                  >
                    {fotaDestacada.categoria}
                  </span>
                  <p className="text-white text-sm font-medium leading-snug">
                    {fotaDestacada.caption}
                  </p>
                </div>
                {/* Badge "Destacada" */}
                <div
                  className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "var(--color-ei-gold)/20",
                    border: "1px solid var(--color-ei-gold)/40",
                    color: "var(--color-ei-gold-light)",
                  }}
                >
                  ★ Foto de la semana
                </div>
              </div>

              {/* Grid de fotos secundarias — 5 columnas */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3 lg:gap-4">
                {fotosSecundarias.map((foto, i) => (
                  <div
                    key={foto.id}
                    className={`relative group overflow-hidden rounded-xl cursor-pointer reveal ${visible ? "visible" : ""} ${
                      i === fotosSecundarias.length - 1 && fotosSecundarias.length % 2 !== 0
                        ? "col-span-2"
                        : ""
                    }`}
                    style={{
                      aspectRatio: "4/3",
                      transitionDelay: `${200 + i * 80}ms`,
                    }}
                    onClick={() => setLightboxIdx(fotosSemana.indexOf(foto))}
                  >
                    <img
                      src={foto.url}
                      alt={foto.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                      style={{ background: "var(--color-ei-electric)/50" }}
                    />
                    {/* Caption */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-250"
                      style={{ background: "var(--color-ei-navy-dark)/85" }}
                    >
                      <span
                        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1"
                        style={{
                          background: categoriaColor[foto.categoria] ?? "var(--color-ei-electric)",
                          color: "white",
                        }}
                      >
                        {foto.categoria}
                      </span>
                      <p className="text-white/90 text-xs leading-snug line-clamp-2">
                        {foto.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Footer de la sección ── */}
          <div
            className={`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 reveal ${visible ? "visible" : ""}`}
            style={{ transitionDelay: "500ms" }}
          >
            <p className="text-white/40 text-sm">
              {fotosSemana.length} fotos esta semana · Actualizado por las maestras
            </p>
            <div className="flex items-center gap-3">
              {/* CTA Facebook — preparado para Meta API en Fase 4 */}
              <button
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "#1877F2",
                  color: "white",
                }}
                onClick={() =>
                  window.open("https://facebook.com", "_blank", "noopener")
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Ver en Facebook
              </button>
              {/* CTA Instagram — futuro */}
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "white/10",
                  border: "1px solid white/20",
                  color: "white/80",
                }}
              >
                <Instagram size={15} />
                Instagram
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox Modal ── */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen */}
            <img
              src={fotosSemana[lightboxIdx].url}
              alt={fotosSemana[lightboxIdx].caption}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {/* Caption */}
            <div className="mt-4 text-center">
              <span
                className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2"
                style={{
                  background: categoriaColor[fotosSemana[lightboxIdx].categoria],
                  color: "white",
                }}
              >
                {fotosSemana[lightboxIdx].categoria}
              </span>
              <p className="text-white/80 text-sm">
                {fotosSemana[lightboxIdx].caption}
              </p>
            </div>
            {/* Controles */}
            <button
              className="absolute top-3 right-3 bg-white/15 hover:bg-white/25 rounded-full p-2 transition-colors"
              onClick={() => setLightboxIdx(null)}
              aria-label="Cerrar"
            >
              <X size={20} className="text-white" />
            </button>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 rounded-full p-3 transition-colors"
              onClick={() =>
                setLightboxIdx((lightboxIdx - 1 + fotosSemana.length) % fotosSemana.length)
              }
              aria-label="Anterior"
            >
              <ChevronLeft size={22} className="text-white" />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 rounded-full p-3 transition-colors"
              onClick={() =>
                setLightboxIdx((lightboxIdx + 1) % fotosSemana.length)
              }
              aria-label="Siguiente"
            >
              <ChevronRight size={22} className="text-white" />
            </button>
            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-4">
              {fotosSemana.map((_, i) => (
                <button
                  key={i}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === lightboxIdx ? 20 : 8,
                    height: 8,
                    background:
                      i === lightboxIdx
                        ? "var(--color-ei-gold)"
                        : "white/30",
                  }}
                  onClick={() => setLightboxIdx(i)}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
