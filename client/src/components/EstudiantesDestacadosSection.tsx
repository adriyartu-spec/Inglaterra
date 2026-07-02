/* =============================================================
   ESTUDIANTES DESTACADOS SECTION
   NUEVO: Conectado a Supabase tabla estudiantes_destacados
   - Primeros promedios por semestre (1°, 2°, 3° lugar)
   - Fallback si Supabase está vacío
   - Selector de semestre dinámico
   ============================================================= */

import { useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";
import { Trophy, Star, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Estudiante {
  id: string; nombre: string; grado: string;
  promedio: number | null; semestre: string;
  lugar: number; foto_url: string | null; logro: string | null;
}

const estudiantesFallback: Estudiante[] = [
  { id: "1", nombre: "María González",  grado: "6°", promedio: 98.5, semestre: "I-2026", lugar: 1, foto_url: null, logro: "Excelencia académica" },
  { id: "2", nombre: "Carlos Rodríguez", grado: "5°", promedio: 97.2, semestre: "I-2026", lugar: 2, foto_url: null, logro: "Mejor promedio en ciencias" },
  { id: "3", nombre: "Sofía Jiménez",   grado: "6°", promedio: 96.8, semestre: "I-2026", lugar: 3, foto_url: null, logro: "Destacada en matemáticas" },
];

const lugarConfig = [
  { lugar: 1, emoji: "🥇", color: "#FFD700", bg: "bg-amber-50",  border: "border-amber-200",  label: "Primer lugar"  },
  { lugar: 2, emoji: "🥈", color: "#A0A0A0", bg: "bg-gray-50",   border: "border-gray-200",   label: "Segundo lugar" },
  { lugar: 3, emoji: "🥉", color: "#CD7F32", bg: "bg-orange-50", border: "border-orange-200", label: "Tercer lugar"  },
];

export default function EstudiantesDestacadosSection() {
  const { ref, visible } = useReveal(0.08);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [semestres, setSemestres] = useState<string[]>([]);
  const [semestreActivo, setSemestreActivo] = useState<string>("");

  useEffect(() => {
    async function cargar() {
      try {
        const { data: escuela } = await supabase
          .from("escuelas").select("id").eq("subdominio", "inglaterra").single();

        if (!escuela) { setEstudiantes(estudiantesFallback); setSemestres(["I-2026"]); setSemestreActivo("I-2026"); return; }

        const { data, error } = await supabase
          .from("estudiantes_destacados")
          .select("id, nombre, grado, promedio, semestre, lugar, foto_url, logro")
          .eq("escuela_id", escuela.id)
          .eq("publicado", true)
          .order("semestre", { ascending: false })
          .order("lugar", { ascending: true });

        if (error || !data || data.length === 0) {
          setEstudiantes(estudiantesFallback);
          setSemestres(["I-2026"]);
          setSemestreActivo("I-2026");
        } else {
          setEstudiantes(data);
          const semUnicos = [...new Set(data.map((e) => e.semestre))];
          setSemestres(semUnicos);
          setSemestreActivo(semUnicos[0]);
        }
      } catch {
        setEstudiantes(estudiantesFallback);
        setSemestres(["I-2026"]);
        setSemestreActivo("I-2026");
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  const filtrados = estudiantes.filter((e) => e.semestre === semestreActivo);

  return (
    <section id="estudiantes-destacados" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div ref={ref} className={`mb-12 reveal ${visible ? "visible" : ""}`}>
          <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
            Excelencia académica
          </p>
          <h2 className="text-[oklch(0.22_0.07_255)] text-3xl sm:text-4xl lg:text-5xl font-bold gold-underline"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Estudiantes Destacados
          </h2>
          <p className="text-gray-500 mt-6 max-w-2xl text-sm leading-relaxed">
            Reconocemos el esfuerzo y dedicación de nuestros estudiantes con los mejores promedios del semestre.
          </p>
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 size={32} className="text-gray-300 animate-spin" /></div>}

        {!loading && (
          <>
            {semestres.length > 1 && (
              <div className={`flex gap-2 mb-8 flex-wrap reveal ${visible ? "visible" : ""}`}>
                {semestres.map((sem) => (
                  <button key={sem} onClick={() => setSemestreActivo(sem)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${semestreActivo === sem ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    style={semestreActivo === sem ? { background: "var(--color-ei-electric)" } : {}}>
                    Semestre {sem}
                  </button>
                ))}
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {lugarConfig.map((config, i) => {
                const est = filtrados.find((e) => e.lugar === config.lugar);
                return (
                  <div key={config.lugar}
                    className={`rounded-2xl border p-6 text-center hover:shadow-md transition-all reveal ${visible ? "visible" : ""} ${config.bg} ${config.border}`}
                    style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="text-5xl mb-4">{config.emoji}</div>
                    {est ? (
                      <>
                        {est.foto_url ? (
                          <img src={est.foto_url} alt={est.nombre} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2" style={{ borderColor: config.color }} />
                        ) : (
                          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white" style={{ background: config.color }}>
                            {est.nombre.charAt(0)}
                          </div>
                        )}
                        <h3 className="text-[oklch(0.22_0.07_255)] font-bold text-base mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>{est.nombre}</h3>
                        <p className="text-gray-500 text-sm mb-2">{est.grado} grado</p>
                        {est.promedio && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold mb-2"
                            style={{ background: config.color + "30", color: config.color }}>
                            <Trophy size={14} />{est.promedio.toFixed(1)}
                          </div>
                        )}
                        {est.logro && <p className="text-gray-500 text-xs">{est.logro}</p>}
                      </>
                    ) : (
                      <div className="text-gray-400 text-sm py-4">
                        <Star size={24} className="mx-auto mb-2 opacity-30" />
                        {config.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={`text-center reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: "400ms" }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: "oklch(0.22 0.07 255 / 0.08)", color: "oklch(0.22 0.07 255)" }}>
                <Star size={14} style={{ color: "var(--color-ei-gold)" }} />
                Semestre {semestreActivo} · Escuela Inglaterra
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
