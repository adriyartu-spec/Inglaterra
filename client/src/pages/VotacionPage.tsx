/* =============================================================
   VOTACIÓN PAGE – "Mi Uniforme, Mi Voz"
   Ruta: /voto
   NUEVO: Experiencia WOW para padres
   - Countdown en tiempo real hasta cierre
   - Galería de diseños con zoom
   - Votación con animación confetti
   - Recibo digital personalizado
   - PWA ready
   ============================================================= */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle, AlertCircle, Loader2, Clock, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface Concurso {
  id: string; titulo: string; descripcion: string | null;
  fecha_inicio: string; fecha_cierre: string; activo: boolean;
  opciones: OpcionVoto[];
}
interface OpcionVoto {
  id: string; titulo: string; descripcion: string | null; imagen_url: string | null; orden: number;
}
interface CountdownTime {
  dias: number; horas: number; minutos: number; segundos: number;
}

// Confetti simple sin librería
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#FFD700", "#1565C0", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"][Math.floor(Math.random() * 6)],
    size: Math.random() * 8 + 4,
    delay: Math.random() * 1.5,
    duration: Math.random() * 2 + 2,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {pieces.map((p) => (
        <div key={p.id} className="absolute rounded-sm animate-confetti-fall"
          style={{
            left: `${p.x}%`, top: "-10px",
            width: p.size, height: p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }} />
      ))}
    </div>
  );
}

export default function VotacionPage() {
  const [concurso, setConcurso] = useState<Concurso | null>(null);
  const [loading, setLoading] = useState(true);
  const [fase, setFase] = useState<"anuncio" | "votacion" | "cerrado">("anuncio");
  const [countdown, setCountdown] = useState<CountdownTime>({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [cedula, setCedula] = useState("");
  const [step, setStep] = useState<"cedula" | "diseños" | "confirmacion" | "votado" | "yaVoto">("cedula");
  const [votando, setVotando] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [reciboData, setReciboData] = useState<{ nombre: string; opcion: string; fecha: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [nombrePadre, setNombrePadre] = useState("");

  // Cargar concurso activo
  useEffect(() => {
    async function cargar() {
      const { data: escuela } = await supabase.from("escuelas").select("id").eq("subdominio", "inglaterra").single();
      if (!escuela) { setLoading(false); return; }
      const { data } = await supabase.from("concursos_votacion")
        .select("*, opciones:opciones_votacion(*)")
        .eq("escuela_id", escuela.id)
        .eq("activo", true)
        .eq("publicado", true)
        .order("created_at", { ascending: false })
        .limit(1).single();
      if (data) {
        // Ordenar opciones
        data.opciones = data.opciones?.sort((a: OpcionVoto, b: OpcionVoto) => a.orden - b.orden) ?? [];
        setConcurso(data);
      }
      setLoading(false);
    }
    cargar();
  }, []);

  // Countdown en tiempo real
  useEffect(() => {
    if (!concurso) return;
    const calcular = () => {
      const hoy = new Date();
      const inicio = new Date(concurso.fecha_inicio + "T00:00:00");
      const cierre = new Date(concurso.fecha_cierre + "T23:59:59");
      let target: Date;
      if (hoy < inicio) { setFase("anuncio"); target = inicio; }
      else if (hoy <= cierre) { setFase("votacion"); target = cierre; }
      else { setFase("cerrado"); return; }
      const diff = target.getTime() - hoy.getTime();
      setCountdown({
        dias: Math.floor(diff / 86400000),
        horas: Math.floor((diff % 86400000) / 3600000),
        minutos: Math.floor((diff % 3600000) / 60000),
        segundos: Math.floor((diff % 60000) / 1000),
      });
    };
    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [concurso]);

  // Bloquear scroll en lightbox
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  // Verificar cédula
  const verificarCedula = async () => {
    if (!cedula.trim() || !concurso) return;
    setVotando(true); setErrorMsg("");
    try {
      // Verificar si ya votó
      const { data: votoExistente } = await supabase.from("votos")
        .select("id").eq("concurso_id", concurso.id).eq("cedula_tutor", cedula.trim()).single();
      if (votoExistente) { setStep("yaVoto"); setVotando(false); return; }

      // Verificar que está en padrón o padres_familia
      const { data: padre } = await supabase.from("padres_familia")
        .select("nombre, apellidos").eq("cedula", cedula.trim()).eq("verificado", true).single();
      if (!padre) {
        setErrorMsg("Cédula no encontrada. Asegurate de estar registrado como padre/madre verificado en la escuela.");
        setVotando(false); return;
      }
      setNombrePadre(`${padre.nombre} ${padre.apellidos}`);
      setStep("diseños");
    } catch { setErrorMsg("Error al verificar. Por favor intentá de nuevo."); }
    finally { setVotando(false); }
  };

  // Confirmar selección
  const confirmarSeleccion = () => {
    if (!selectedId) return;
    setStep("confirmacion");
  };

  // Emitir voto
  const emitirVoto = async () => {
    if (!selectedId || !concurso) return;
    setVotando(true);
    try {
      const opcionSeleccionada = concurso.opciones.find((o) => o.id === selectedId);
      const { error } = await supabase.from("votos").insert({
        concurso_id: concurso.id,
        opcion_id: selectedId,
        cedula_tutor: cedula.trim(),
        escuela_id: (await supabase.from("escuelas").select("id").eq("subdominio", "inglaterra").single()).data?.id,
      });
      if (error) {
        if (error.code === "23505") { setStep("yaVoto"); return; }
        throw error;
      }
      setReciboData({
        nombre: nombrePadre,
        opcion: opcionSeleccionada?.titulo ?? "",
        fecha: new Date().toLocaleString("es-CR"),
      });
      setStep("votado");
      setConfetti(true);
      setTimeout(() => setConfetti(false), 4000);
    } catch { setErrorMsg("Error al emitir voto. Intentá de nuevo."); setStep("diseños"); }
    finally { setVotando(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-ei-navy-dark)" }}>
      <Loader2 size={36} className="text-white animate-spin" />
    </div>
  );

  if (!concurso) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--color-ei-navy-dark)" }}>
      <div className="text-center">
        <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663744735795/fwbUywmTVnttLNyf.png" alt="Escudo" className="h-16 mx-auto mb-6" />
        <h1 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>No hay votación activa</h1>
        <p className="text-white/50 text-sm">Cuando la dirección active un concurso, podrás votar aquí.</p>
        <a href="/" className="inline-block mt-6 text-sm text-white/40 hover:text-white/70 transition-colors">← Volver al sitio</a>
      </div>
    </div>
  );

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <span className="text-white font-bold text-2xl sm:text-3xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-white/50 text-xs mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <>
      <Confetti active={confetti} />

      <div className="min-h-screen" style={{ background: "var(--color-ei-navy-dark)" }}>

        {/* Header */}
        <div className="border-b border-white/10 px-4 py-4 flex items-center gap-3">
          <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663744735795/fwbUywmTVnttLNyf.png" alt="Escudo" className="h-10 w-auto" />
          <div>
            <p className="text-white font-bold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>Aula Verde</p>
            <p className="text-white/40 text-xs">Escuela Inglaterra · Votación comunitaria</p>
          </div>
          <a href="/" className="ml-auto text-white/40 hover:text-white/70 text-xs transition-colors">← Sitio</a>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">

          {/* Título del concurso */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[oklch(0.72_0.12_75/0.2)] border border-[oklch(0.72_0.12_75/0.4)] text-[oklch(0.85_0.09_75)] px-4 py-2 rounded-full text-sm font-medium mb-4">
              🗳️ Votación comunitaria
            </div>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {concurso.titulo}
            </h1>
            {concurso.descripcion && (
              <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">{concurso.descripcion}</p>
            )}
          </div>

          {/* Countdown */}
          {fase !== "cerrado" && (
            <div className="text-center mb-10">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <Clock size={12} />
                {fase === "anuncio" ? "La votación abre en" : "La votación cierra en"}
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <CountdownBox value={countdown.dias} label="días" />
                <span className="text-white/40 text-2xl font-bold mb-4">:</span>
                <CountdownBox value={countdown.horas} label="horas" />
                <span className="text-white/40 text-2xl font-bold mb-4">:</span>
                <CountdownBox value={countdown.minutos} label="min" />
                <span className="text-white/40 text-2xl font-bold mb-4">:</span>
                <CountdownBox value={countdown.segundos} label="seg" />
              </div>
            </div>
          )}

          {/* FASE ANUNCIO */}
          {fase === "anuncio" && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📣</div>
              <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>¡Próximamente!</h2>
              <p className="text-white/50 text-sm">La votación abrirá el {new Date(concurso.fecha_inicio + "T12:00:00").toLocaleDateString("es-CR", { weekday: "long", day: "numeric", month: "long" })}.</p>
              {concurso.opciones.length > 0 && (
                <div className="mt-8">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Diseños que estarán en concurso</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {concurso.opciones.map((op) => (
                      <div key={op.id} className="relative overflow-hidden rounded-xl border border-white/10">
                        {op.imagen_url ? (
                          <img src={op.imagen_url} alt={op.titulo} className="w-full aspect-square object-cover filter blur-sm opacity-50" />
                        ) : (
                          <div className="w-full aspect-square bg-white/5 flex items-center justify-center">
                            <span className="text-white/20 text-4xl">🎨</span>
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/40 text-xs font-medium">Próximamente</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FASE CERRADO */}
          {fase === "cerrado" && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏁</div>
              <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>Votación cerrada</h2>
              <p className="text-white/50 text-sm">La votación ya finalizó. Los resultados serán anunciados por la dirección.</p>
            </div>
          )}

          {/* FASE VOTACIÓN */}
          {fase === "votacion" && (
            <>
              {/* STEP: Verificar cédula */}
              {step === "cedula" && (
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">🔐</div>
                      <h2 className="text-[oklch(0.22_0.07_255)] font-bold text-xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Verificá tu identidad
                      </h2>
                      <p className="text-gray-500 text-sm mt-2">Ingresá tu número de cédula para acceder a la votación.</p>
                    </div>
                    {errorMsg && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                        <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />{errorMsg}
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de cédula</label>
                        <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && verificarCedula()}
                          placeholder="Ej: 1-1234-5678"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all text-center tracking-wider" />
                      </div>
                      <button onClick={verificarCedula} disabled={votando || !cedula.trim()}
                        className="btn-inst w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-60">
                        {votando ? <><Loader2 size={18} className="animate-spin" /> Verificando...</> : "Continuar →"}
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs text-center mt-4">Solo padres verificados por la escuela pueden votar.</p>
                  </div>
                </div>
              )}

              {/* STEP: Elegir diseño */}
              {step === "diseños" && (
                <div>
                  <div className="text-center mb-6">
                    <p className="text-white/60 text-sm mb-1">Hola, <span className="text-white font-semibold">{nombrePadre}</span></p>
                    <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Elegí tu diseño favorito</h2>
                    <p className="text-white/50 text-sm mt-1">Hacé clic en el diseño para seleccionarlo. Podés hacer zoom para ver el detalle.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {concurso.opciones.map((op, i) => (
                      <div key={op.id}
                        onClick={() => setSelectedId(op.id)}
                        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                          selectedId === op.id
                            ? "border-[oklch(0.72_0.12_75)] scale-[1.02] shadow-2xl shadow-[oklch(0.72_0.12_75/0.3)]"
                            : "border-white/10 hover:border-white/30 hover:scale-[1.01]"
                        }`}>
                        {/* Imagen */}
                        {op.imagen_url ? (
                          <img src={op.imagen_url} alt={op.titulo} className="w-full aspect-[3/4] object-cover" />
                        ) : (
                          <div className="w-full aspect-[3/4] bg-white/5 flex items-center justify-center">
                            <span className="text-white/20 text-5xl">🎨</span>
                          </div>
                        )}

                        {/* Overlay seleccionado */}
                        {selectedId === op.id && (
                          <div className="absolute inset-0 bg-[oklch(0.72_0.12_75/0.2)] flex items-center justify-center">
                            <div className="bg-[oklch(0.72_0.12_75)] rounded-full p-3">
                              <CheckCircle size={28} className="text-white" fill="white" />
                            </div>
                          </div>
                        )}

                        {/* Badge número */}
                        <div className="absolute top-3 left-3 bg-[oklch(0.22_0.07_255)] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          Diseño {i + 1}
                        </div>

                        {/* Botón zoom */}
                        <button onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                          className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors">
                          <ZoomIn size={14} />
                        </button>

                        {/* Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4"
                          style={{ background: "linear-gradient(to top, rgba(10,15,40,0.95), transparent)" }}>
                          <h3 className="text-white font-bold text-sm">{op.titulo}</h3>
                          {op.descripcion && <p className="text-white/60 text-xs mt-0.5">{op.descripcion}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button onClick={confirmarSeleccion} disabled={!selectedId}
                      className="btn-inst px-10 py-4 text-base flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                      {selectedId ? `Votar por "${concurso.opciones.find((o) => o.id === selectedId)?.titulo}"` : "Seleccioná un diseño"}
                      {selectedId && " →"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP: Confirmación */}
              {step === "confirmacion" && (() => {
                const opcion = concurso.opciones.find((o) => o.id === selectedId);
                return (
                  <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
                      <div className="text-4xl mb-4">🗳️</div>
                      <h2 className="text-[oklch(0.22_0.07_255)] font-bold text-xl mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Confirmá tu voto
                      </h2>
                      <p className="text-gray-500 text-sm mb-6">Esta acción es <strong>inamovible</strong>. Solo podés votar una vez.</p>

                      {opcion?.imagen_url && (
                        <img src={opcion.imagen_url} alt={opcion.titulo}
                          className="w-40 h-40 object-cover rounded-xl mx-auto mb-4 border-4 border-[oklch(0.72_0.12_75)]" />
                      )}

                      <div className="bg-[oklch(0.97_0.005_255)] rounded-xl p-4 mb-6 text-left">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tu voto</p>
                        <p className="text-[oklch(0.22_0.07_255)] font-bold">{opcion?.titulo}</p>
                        <p className="text-xs text-gray-400 mt-1">Padre/Madre: {nombrePadre}</p>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep("diseños")} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                          ← Cambiar
                        </button>
                        <button onClick={emitirVoto} disabled={votando}
                          className="flex-1 btn-inst py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                          {votando ? <><Loader2 size={16} className="animate-spin" /> Votando...</> : "✓ Confirmar voto"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* STEP: Voto exitoso */}
              {step === "votado" && reciboData && (
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                    {/* Header recibo */}
                    <div className="p-6 text-center" style={{ background: "var(--color-ei-navy-dark)" }}>
                      <div className="text-5xl mb-3">🎉</div>
                      <h2 className="text-white font-bold text-2xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        ¡Voto registrado!
                      </h2>
                      <p className="text-white/60 text-sm mt-1">Tu voto ha sido emitido exitosamente</p>
                    </div>

                    {/* Cuerpo recibo */}
                    <div className="p-6">
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 mb-5">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 text-center">Recibo digital</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Concurso</span>
                            <span className="text-gray-800 font-medium text-right max-w-[60%]">{concurso.titulo}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Votante</span>
                            <span className="text-gray-800 font-medium">{reciboData.nombre}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Diseño elegido</span>
                            <span className="text-[oklch(0.42_0.22_255)] font-bold">{reciboData.opcion}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Fecha y hora</span>
                            <span className="text-gray-800 text-xs">{reciboData.fecha}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-dashed border-gray-200 text-center">
                          <p className="text-xs text-gray-400">Escuela Inglaterra · San Rafael de Montes de Oca</p>
                          <p className="text-xs text-gray-300 mt-0.5">Plataforma Aula Verde</p>
                        </div>
                      </div>
                      <a href="/" className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
                        Volver al sitio →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP: Ya votó */}
              {step === "yaVoto" && (
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-[oklch(0.22_0.07_255)] font-bold text-xl mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                      Ya registraste tu voto
                    </h2>
                    <p className="text-gray-500 text-sm mb-6">
                      Esta cédula ya participó en este concurso. Solo se permite un voto por familia.
                    </p>
                    <a href="/" className="btn-inst inline-block px-8 py-3">Volver al sitio</a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox de diseños */}
      {lightboxIdx !== null && concurso.opciones[lightboxIdx] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onClick={() => setLightboxIdx(null)}>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            {concurso.opciones[lightboxIdx].imagen_url && (
              <img src={concurso.opciones[lightboxIdx].imagen_url!} alt={concurso.opciones[lightboxIdx].titulo}
                className="w-full max-h-[80vh] object-contain rounded-2xl" />
            )}
            <div className="mt-4 text-center">
              <h3 className="text-white font-bold text-lg">{concurso.opciones[lightboxIdx].titulo}</h3>
              {concurso.opciones[lightboxIdx].descripcion && (
                <p className="text-white/60 text-sm mt-1">{concurso.opciones[lightboxIdx].descripcion}</p>
              )}
            </div>
            <button onClick={() => setLightboxIdx(null)} className="absolute top-3 right-3 bg-white/15 hover:bg-white/25 rounded-full p-2 transition-colors">
              <X size={20} className="text-white" />
            </button>
            {lightboxIdx > 0 && (
              <button onClick={() => setLightboxIdx(lightboxIdx - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 rounded-full p-3 transition-colors">
                <ChevronLeft size={22} className="text-white" />
              </button>
            )}
            {lightboxIdx < concurso.opciones.length - 1 && (
              <button onClick={() => setLightboxIdx(lightboxIdx + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 rounded-full p-3 transition-colors">
                <ChevronRight size={22} className="text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* CSS para confetti */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </>
  );
}
