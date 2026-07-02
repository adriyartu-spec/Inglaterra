/* =============================================================
   GALERIA SECTION – "Momentos Memorables"
   CAMBIOS:
   - Datos hardcodeados → Supabase tabla galeria_fotos
   - Título "Esta Semana en la Escuela" → "Momentos Memorables"
   - Estado loading mientras carga fotos
   - Fallback a fotos de muestra si Supabase está vacío
   - Obtiene escuela_id dinámicamente por subdominio
   ============================================================= */

import { useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";
import { Camera, Instagram, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Foto {
  id: string;
  url: string;
  caption: string;
  categoria: string;
  destacada: boolean;
}

const fotosFallback: Foto[] = [
  { id: "1", url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663744735795/BpPgDYJmx46K3RMxDBs7WN/estudiantes-R9zvaZNHpQn5TfKJH4JMMw.webp", caption: "Estudiantes participando en la feria científica anual", categoria: "Académico", destacada: true },
  { id: "2", url: "/Frente.png", caption: "Entrada principal — orgullo de nuestra institución", categoria: "Institucional", destacada: false },
  { id: "3", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", caption: "Actividades deportivas en el patio escolar", categoria: "Deporte", destacada: false },
  { id: "4", url: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80", caption: "Taller de arte y expresión creativa", categoria: "Arte", destacada: false },
  { id: "5", url: "https://images.unsplash.com/photo-1560785496-3c9d27877182?w=800&q=80", caption: "Celebración cultural con toda la comunidad", categoria: "Cultural", destacada: false },
];

const categoriaColor: Record<string, string> = {
  Académico: "#1565C0", Institucional: "#0d2a5e", Deporte: "#059669",
  Arte: "#d97706", Cultural: "#7c3aed", General: "#6b7280",
};

export default function GaleriaSection() {
  const { ref, visible } = useReveal(0.06);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    async function cargarFotos() {
      try {
        const { data: escuela } = await supabase
          .from("escuelas").select("id").eq("subdominio", "inglaterra").single();
        if (!escuela) { setFotos(fotosFallback); return; }
        const { data, error } = await supabase
          .from("galeria_fotos")
          .select("id, url, caption, categoria, destacada")
          .eq("escuela_id", escuela.id)
          .eq("publicada", true)
          .order("destacada", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(10);
        setFotos(error || !data || data.length === 0 ? fotosFallback : data);
      } catch { setFotos(fotosFallback); }
      finally { setLoading(false); }
    }
    cargarFotos();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight" && lightboxIdx !== null) setLightboxIdx((lightboxIdx + 1) % fotos.length);
      if (e.key === "ArrowLeft" && lightboxIdx !== null) setLightboxIdx((lightboxIdx - 1 + fotos.length) % fotos.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIdx, fotos.length]);

  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  const fotoDestacada = fotos.find((f) => f.destacada) ?? fotos[0];
  const fotosSecundarias = fotos.filter((f) => f !== fotoDestacada);

  return (
    <>
      <section id="esta-semana" className="py-20 lg:py-28" style={{ background: "var(--color-ei-navy-dark)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={ref} className={`mb-12 reveal ${visible ? "visible" : ""}`}>
            <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: "var(--color-ei-gold)" }}>
              Vida escolar
            </p>
            <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Momentos<br />
              <span style={{ color: "var(--color-ei-gold-light)" }}>Memorables</span>
            </h2>
            <p className="text-white/50 mt-4 max-w-xl leading-relaxed">
              Momentos que hacen grande a nuestra comunidad. Las maestras comparten los instantes más especiales de la Escuela Inglaterra.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={36} className="text-white/40 animate-spin" />
            </div>
          )}

          {!loading && fotos.length > 0 && fotoDestacada && (
            <>
              <div className={`reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: "150ms" }}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
                  <div className="lg:col-span-7 relative group overflow-hidden rounded-2xl cursor-pointer" style={{ aspectRatio: "16/10" }}
                    onClick={() => setLightboxIdx(fotos.indexOf(fotoDestacada))}>
                    <img src={fotoDestacada.url} alt={fotoDestacada.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ background: "rgba(13,42,94,0.6)" }}>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4"><Camera size={28} className="text-white" /></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(10,15,40,0.9), transparent)" }}>
                      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 text-white" style={{ background: categoriaColor[fotoDestacada.categoria] ?? "#6b7280" }}>
                        {fotoDestacada.categoria}
                      </span>
                      <p className="text-white text-sm font-medium leading-snug">{fotoDestacada.caption}</p>
                    </div>
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "var(--color-ei-gold-light)" }}>
                      ★ Momento destacado
                    </div>
                  </div>
                  <div className="lg:col-span-5 grid grid-cols-2 gap-3 lg:gap-4">
                    {fotosSecundarias.slice(0, 4).map((foto, i) => (
                      <div key={foto.id} className={`relative group overflow-hidden rounded-xl cursor-pointer reveal ${visible ? "visible" : ""}`}
                        style={{ aspectRatio: "4/3", transitionDelay: `${200 + i * 80}ms` }}
                        onClick={() => setLightboxIdx(fotos.indexOf(foto))}>
                        <img src={foto.url} alt={foto.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(21,101,192,0.5)" }} />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200" style={{ background: "rgba(10,15,40,0.85)" }}>
                          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 text-white" style={{ background: categoriaColor[foto.categoria] ?? "#6b7280" }}>
                            {foto.categoria}
                          </span>
                          <p className="text-white/90 text-xs leading-snug line-clamp-2">{foto.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: "500ms" }}>
                <p className="text-white/40 text-sm">{fotos.length} momentos · Actualizado por las maestras</p>
                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "#1877F2", color: "white" }}
                    onClick={() => window.open("https://www.facebook.com/p/Escuela-Inglaterra-100057559746553/", "_blank", "noopener")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Ver en Facebook
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }}>
                    <Instagram size={15} />
                    Instagram
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {lightboxIdx !== null && fotos[lightboxIdx] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.92)" }} onClick={() => setLightboxIdx(null)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={fotos[lightboxIdx].url} alt={fotos[lightboxIdx].caption} className="w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="mt-4 text-center">
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 text-white" style={{ background: categoriaColor[fotos[lightboxIdx].categoria] ?? "#6b7280" }}>
                {fotos[lightboxIdx].categoria}
              </span>
              <p className="text-white/80 text-sm">{fotos[lightboxIdx].caption}</p>
            </div>
            <button className="absolute top-3 right-3 bg-white/15 hover:bg-white/25 rounded-full p-2 transition-colors" onClick={() => setLightboxIdx(null)} aria-label="Cerrar">
              <X size={20} className="text-white" />
            </button>
            <button className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 rounded-full p-3 transition-colors"
              onClick={() => setLightboxIdx((lightboxIdx - 1 + fotos.length) % fotos.length)} aria-label="Anterior">
              <ChevronLeft size={22} className="text-white" />
            </button>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 rounded-full p-3 transition-colors"
              onClick={() => setLightboxIdx((lightboxIdx + 1) % fotos.length)} aria-label="Siguiente">
              <ChevronRight size={22} className="text-white" />
            </button>
            <div className="flex justify-center gap-2 mt-4">
              {fotos.map((_, i) => (
                <button key={i} className="rounded-full transition-all duration-200"
                  style={{ width: i === lightboxIdx ? 20 : 8, height: 8, background: i === lightboxIdx ? "var(--color-ei-gold)" : "rgba(255,255,255,0.3)" }}
                  onClick={() => setLightboxIdx(i)} aria-label={`Foto ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
