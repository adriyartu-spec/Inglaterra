/* =============================================================
   VIDA ESTUDIANTIL SECTION – Actividades y logros estudiantiles
   CAMBIOS:
   - Sección "Orgullo Inglaterra" conectada a Supabase:
     · Primeros promedios → tabla estudiantes_destacados (lugar=1)
     · Logro deportivo → galeria_fotos categoria Deportes
     · Logro artístico → galeria_fotos categoria Arte
     · Proyecto sobresaliente → galeria_fotos categoria Académico
     · Acción solidaria → comunicados tipo logro
     · Momentos memorables → scroll a sección galería
   - Cada tarjeta es clickeable y navega a su sección
   - Imagen de fondo real en tarjetas con foto
   - Loading skeleton mientras carga
   - Full responsive: 1 col mobile / 2 col tablet / 4 col desktop
   ============================================================= */

import { useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";
import { Music, Trophy, FlaskConical, Cpu, Leaf, Star, Palette, Users, Loader2, ArrowRight } from "lucide-react";
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

interface OrgulloData {
  promedioNombre: string | null;
  promedioGrado: string | null;
  deporteCaption: string | null;
  deporteUrl: string | null;
  arteCaption: string | null;
  arteUrl: string | null;
  proyectoCaption: string | null;
  proyectoUrl: string | null;
  logroCaption: string | null;
}

export default function VidaEstudiantilSection() {
  const { ref, visible } = useReveal(0.08);
  const [orgullo, setOrgullo] = useState<OrgulloData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const { data: escuela } = await supabase
          .from("escuelas").select("id").eq("subdominio", "inglaterra").single();
        if (!escuela) return;
        const eid = escuela.id;

        const [destRes, deporteRes, arteRes, proyectoRes, logroRes] = await Promise.all([
          supabase.from("estudiantes_destacados")
            .select("nombre, grado").eq("escuela_id", eid).eq("publicado", true).eq("lugar", 1)
            .order("semestre", { ascending: false }).limit(1).single(),
          supabase.from("galeria_fotos")
            .select("caption, url").eq("escuela_id", eid).eq("publicada", true).eq("categoria", "Deportes")
            .order("created_at", { ascending: false }).limit(1).single(),
          supabase.from("galeria_fotos")
            .select("caption, url").eq("escuela_id", eid).eq("publicada", true).eq("categoria", "Arte")
            .order("created_at", { ascending: false }).limit(1).single(),
          supabase.from("galeria_fotos")
            .select("caption, url").eq("escuela_id", eid).eq("publicada", true).eq("categoria", "Académico")
            .order("created_at", { ascending: false }).limit(1).single(),
          supabase.from("comunicados")
            .select("titulo").eq("escuela_id", eid).eq("publicado", true).eq("tipo", "logro")
            .order("fecha_publicacion", { ascending: false }).limit(1).single(),
        ]);

        setOrgullo({
          promedioNombre: destRes.data?.nombre ?? null,
          promedioGrado:  destRes.data?.grado ?? null,
          deporteCaption: deporteRes.data?.caption ?? null,
          deporteUrl:     deporteRes.data?.url ?? null,
          arteCaption:    arteRes.data?.caption ?? null,
          arteUrl:        arteRes.data?.url ?? null,
          proyectoCaption: proyectoRes.data?.caption ?? null,
          proyectoUrl:    proyectoRes.data?.url ?? null,
          logroCaption:   logroRes.data?.titulo ?? null,
        });
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    }
    cargar();
  }, []);

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  const tarjetas = [
    {
      icon: "🌟", label: "Primeros promedios del semestre",
      detalle: orgullo?.promedioNombre ? `${orgullo.promedioNombre} · ${orgullo.promedioGrado} grado` : null,
      imagen: null, onClick: () => scrollTo("#estudiantes-destacados"),
    },
    {
      icon: "🔬", label: "Proyecto sobresaliente",
      detalle: orgullo?.proyectoCaption ?? null,
      imagen: orgullo?.proyectoUrl ?? null, onClick: () => scrollTo("#esta-semana"),
    },
    {
      icon: "🏆", label: "Logro deportivo",
      detalle: orgullo?.deporteCaption ?? null,
      imagen: orgullo?.deporteUrl ?? null, onClick: () => scrollTo("#esta-semana"),
    },
    {
      icon: "🎨", label: "Logro artístico",
      detalle: orgullo?.arteCaption ?? null,
      imagen: orgullo?.arteUrl ?? null, onClick: () => scrollTo("#esta-semana"),
    },
    {
      icon: "🤝", label: "Acción solidaria",
      detalle: orgullo?.logroCaption ?? null,
      imagen: null, onClick: () => scrollTo("#comunicados"),
    },
    {
      icon: "📸", label: "Momentos memorables",
      detalle: "Ver galería completa",
      imagen: null, onClick: () => scrollTo("#esta-semana"),
    },
  ];

  return (
    <section id="vida-estudiantil" className="py-16 sm:py-20 lg:py-28 bg-[oklch(0.97_0.005_255)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div ref={ref} className={`mb-12 lg:mb-16 reveal ${visible ? "visible" : ""}`}>
          <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
            Más allá del aula
          </p>
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

            {/* Texto */}
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

            {/* Tarjetas clickeables con datos reales */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {tarjetas.map((item) => (
                <button key={item.label} onClick={item.onClick}
                  className="group relative bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 sm:p-4 text-left transition-all duration-200 hover:-translate-y-0.5 overflow-hidden min-h-[100px]">
                  {/* Imagen de fondo real si existe */}
                  {item.imagen && (
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <img src={item.imagen} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="text-xl sm:text-2xl mb-1.5">{item.icon}</div>
                    <p className="text-white/90 text-xs font-semibold leading-tight mb-1">{item.label}</p>
                    {item.detalle ? (
                      <p className="text-white/60 text-xs leading-snug line-clamp-2">{item.detalle}</p>
                    ) : loading ? (
                      <div className="h-2.5 w-16 bg-white/10 rounded animate-pulse mt-1" />
                    ) : (
                      <p className="text-white/30 text-xs italic">Por publicar</p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-white/40 group-hover:text-white/70 transition-colors">
                      <ArrowRight size={10} /><span className="text-xs">Ver más</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
