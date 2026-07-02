// CAMBIOS:
// - Módulo Familias agregado: ver padres pendientes, aprobar, rechazar
// - Muestra nombre del estudiante y fecha de nacimiento
// - Módulos Galería, Comunicados y Eventos sin cambios

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import {
  Images, CalendarDays, Megaphone, LogOut, Upload,
  Trash2, Star, StarOff, Loader2, CheckCircle, AlertCircle, Plus, X, Users
} from "lucide-react";

interface Foto {
  id: string; url: string; caption: string;
  categoria: string; destacada: boolean; publicada: boolean; created_at: string;
}
interface Comunicado {
  id: string; titulo: string; contenido: string;
  tipo: string; fecha_publicacion: string; fecha_vencimiento: string | null; publicado: boolean;
}
interface Evento {
  id: string; titulo: string; descripcion: string | null;
  fecha_inicio: string; fecha_fin: string | null;
  hora_inicio: string | null; lugar: string | null;
  categoria: string; publicado: boolean;
}
interface Padre {
  id: string; nombre: string; apellidos: string; cedula: string;
  email: string; telefono: string | null; verificado: boolean; created_at: string;
  estudiantes: { nombre: string; apellidos: string; grado: string; fecha_nacimiento: string | null }[];
}

const CATEGORIAS_FOTO = ["General", "Académico", "Deportes", "Arte", "Cultural", "Institucional"];
const TIPOS_COMUNICADO = ["general", "urgente", "informativo", "actividad", "logro"];
const CATEGORIAS_EVENTO = ["General", "Acto cívico", "Reunión", "Cultural", "Deportivo", "Feria", "Académico", "Graduación"];
const SUBDOMINIO = "inglaterra";

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [usuario, setUsuario] = useState<any>(null);
  const [escuelaId, setEscuelaId] = useState<string | null>(null);
  const [modulo, setModulo] = useState("galeria");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Galería
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loadingFotos, setLoadingFotos] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);
  const [caption, setCaption] = useState("");
  const [categoriaFoto, setCategoriaFoto] = useState("General");
  const [destacada, setDestacada] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Comunicados
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loadingCom, setLoadingCom] = useState(false);
  const [showFormCom, setShowFormCom] = useState(false);
  const [savingCom, setSavingCom] = useState(false);
  const [comMsg, setComMsg] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);
  const [formCom, setFormCom] = useState({
    titulo: "", contenido: "", tipo: "general",
    fecha_publicacion: new Date().toISOString().split("T")[0],
    fecha_vencimiento: "",
  });

  // Eventos
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loadingEv, setLoadingEv] = useState(false);
  const [showFormEv, setShowFormEv] = useState(false);
  const [savingEv, setSavingEv] = useState(false);
  const [evMsg, setEvMsg] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);
  const [formEv, setFormEv] = useState({
    titulo: "", descripcion: "", fecha_inicio: new Date().toISOString().split("T")[0],
    fecha_fin: "", hora_inicio: "", lugar: "", categoria: "General",
  });

  // Familias
  const [padres, setPadres] = useState<Padre[]>([]);
  const [loadingPadres, setLoadingPadres] = useState(false);
  const [filtroPadres, setFiltroPadres] = useState<"todos" | "pendientes" | "aprobados">("pendientes");
  const [padresMsg, setPadresMsg] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { setLocation("/admin/login"); return; }
      setUsuario(data.session.user);
    });
    supabase.auth.onAuthStateChange((_, session) => {
      if (!session) setLocation("/admin/login");
    });
  }, []);

  useEffect(() => {
    if (!usuario) return;
    supabase.from("escuelas").select("id").eq("subdominio", SUBDOMINIO).single()
      .then(({ data }) => { if (data) setEscuelaId(data.id); });
  }, [usuario]);

  useEffect(() => {
    if (!escuelaId) return;
    if (modulo === "galeria") cargarFotos();
    if (modulo === "comunicados") cargarComunicados();
    if (modulo === "eventos") cargarEventos();
    if (modulo === "familias") cargarPadres();
  }, [escuelaId, modulo]);

  useEffect(() => {
    if (escuelaId && modulo === "familias") cargarPadres();
  }, [filtroPadres]);

  // ── GALERÍA ──
  async function cargarFotos() {
    setLoadingFotos(true);
    const { data } = await supabase.from("galeria_fotos").select("*")
      .eq("escuela_id", escuelaId).order("created_at", { ascending: false });
    setFotos(data ?? []);
    setLoadingFotos(false);
  }
  async function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !escuelaId) return;
    setSubiendo(true); setUploadMsg(null);
    try {
      const ext = file.name.split(".").pop();
      const filename = `${escuelaId}/${Date.now()}.${ext}`;
      const { error: storageError } = await supabase.storage
        .from("aula-verde-media").upload(filename, file, { cacheControl: "3600", upsert: false });
      if (storageError) throw storageError;
      const { data: urlData } = supabase.storage.from("aula-verde-media").getPublicUrl(filename);
      const { error: dbError } = await supabase.from("galeria_fotos").insert({
        escuela_id: escuelaId, url: urlData.publicUrl,
        caption: caption || "Sin descripción", categoria: categoriaFoto, destacada, publicada: true,
      });
      if (dbError) throw dbError;
      setUploadMsg({ tipo: "ok", texto: "¡Foto publicada exitosamente!" });
      setCaption(""); setCategoriaFoto("General"); setDestacada(false);
      if (fileRef.current) fileRef.current.value = "";
      cargarFotos();
    } catch {
      setUploadMsg({ tipo: "err", texto: "Error al subir la foto." });
    } finally {
      setSubiendo(false);
      setTimeout(() => setUploadMsg(null), 4000);
    }
  }
  async function togglePublicada(foto: Foto) {
    await supabase.from("galeria_fotos").update({ publicada: !foto.publicada }).eq("id", foto.id);
    cargarFotos();
  }
  async function toggleDestacada(foto: Foto) {
    if (!foto.destacada) await supabase.from("galeria_fotos").update({ destacada: false }).eq("escuela_id", escuelaId!);
    await supabase.from("galeria_fotos").update({ destacada: !foto.destacada }).eq("id", foto.id);
    cargarFotos();
  }
  async function eliminarFoto(foto: Foto) {
    if (!confirm("¿Eliminar esta foto permanentemente?")) return;
    await supabase.from("galeria_fotos").delete().eq("id", foto.id);
    cargarFotos();
  }

  // ── COMUNICADOS ──
  async function cargarComunicados() {
    setLoadingCom(true);
    const { data } = await supabase.from("comunicados").select("*")
      .eq("escuela_id", escuelaId).order("fecha_publicacion", { ascending: false });
    setComunicados(data ?? []);
    setLoadingCom(false);
  }
  async function guardarComunicado(e: React.FormEvent) {
    e.preventDefault();
    if (!escuelaId) return;
    setSavingCom(true); setComMsg(null);
    try {
      const { error } = await supabase.from("comunicados").insert({
        escuela_id: escuelaId, titulo: formCom.titulo, contenido: formCom.contenido,
        tipo: formCom.tipo, fecha_publicacion: formCom.fecha_publicacion,
        fecha_vencimiento: formCom.fecha_vencimiento || null, publicado: true,
      });
      if (error) throw error;
      setComMsg({ tipo: "ok", texto: "¡Comunicado publicado!" });
      setFormCom({ titulo: "", contenido: "", tipo: "general", fecha_publicacion: new Date().toISOString().split("T")[0], fecha_vencimiento: "" });
      setShowFormCom(false); cargarComunicados();
    } catch { setComMsg({ tipo: "err", texto: "Error al guardar el comunicado." }); }
    finally { setSavingCom(false); setTimeout(() => setComMsg(null), 4000); }
  }
  async function eliminarComunicado(id: string) {
    if (!confirm("¿Eliminar este comunicado?")) return;
    await supabase.from("comunicados").delete().eq("id", id); cargarComunicados();
  }
  async function togglePublicadoCom(com: Comunicado) {
    await supabase.from("comunicados").update({ publicado: !com.publicado }).eq("id", com.id); cargarComunicados();
  }

  // ── EVENTOS ──
  async function cargarEventos() {
    setLoadingEv(true);
    const { data } = await supabase.from("eventos").select("*")
      .eq("escuela_id", escuelaId).order("fecha_inicio", { ascending: true });
    setEventos(data ?? []);
    setLoadingEv(false);
  }
  async function guardarEvento(e: React.FormEvent) {
    e.preventDefault();
    if (!escuelaId) return;
    setSavingEv(true); setEvMsg(null);
    try {
      const { error } = await supabase.from("eventos").insert({
        escuela_id: escuelaId, titulo: formEv.titulo, descripcion: formEv.descripcion || null,
        fecha_inicio: formEv.fecha_inicio, fecha_fin: formEv.fecha_fin || null,
        hora_inicio: formEv.hora_inicio || null, lugar: formEv.lugar || null,
        categoria: formEv.categoria, publicado: true,
      });
      if (error) throw error;
      setEvMsg({ tipo: "ok", texto: "¡Evento publicado!" });
      setFormEv({ titulo: "", descripcion: "", fecha_inicio: new Date().toISOString().split("T")[0], fecha_fin: "", hora_inicio: "", lugar: "", categoria: "General" });
      setShowFormEv(false); cargarEventos();
    } catch { setEvMsg({ tipo: "err", texto: "Error al guardar el evento." }); }
    finally { setSavingEv(false); setTimeout(() => setEvMsg(null), 4000); }
  }
  async function eliminarEvento(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;
    await supabase.from("eventos").delete().eq("id", id); cargarEventos();
  }
  async function togglePublicadoEv(ev: Evento) {
    await supabase.from("eventos").update({ publicado: !ev.publicado }).eq("id", ev.id); cargarEventos();
  }

  // ── FAMILIAS ──
  async function cargarPadres() {
    setLoadingPadres(true);
    let query = supabase
      .from("padres_familia")
      .select("*, estudiantes(nombre, apellidos, grado, fecha_nacimiento)")
      .eq("escuela_id", escuelaId)
      .order("created_at", { ascending: false });

    if (filtroPadres === "pendientes") query = query.eq("verificado", false);
    if (filtroPadres === "aprobados") query = query.eq("verificado", true);

    const { data } = await query;
    setPadres(data ?? []);
    setLoadingPadres(false);
  }

  async function aprobarPadre(padre: Padre) {
    const { error } = await supabase.from("padres_familia")
      .update({ verificado: true }).eq("id", padre.id);
    if (error) {
      setPadresMsg({ tipo: "err", texto: "Error al aprobar el registro." });
    } else {
      setPadresMsg({ tipo: "ok", texto: `✓ ${padre.nombre} ${padre.apellidos} aprobado.` });
      cargarPadres();
    }
    setTimeout(() => setPadresMsg(null), 3000);
  }

  async function rechazarPadre(padre: Padre) {
    if (!confirm(`¿Eliminar el registro de ${padre.nombre} ${padre.apellidos}?`)) return;
    await supabase.from("estudiantes").delete().eq("padre_id", padre.id);
    await supabase.from("padres_familia").delete().eq("id", padre.id);
    setPadresMsg({ tipo: "ok", texto: "Registro eliminado." });
    cargarPadres();
    setTimeout(() => setPadresMsg(null), 3000);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setLocation("/admin/login");
  }

  if (!usuario) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-ei-navy-dark)" }}>
      <Loader2 size={32} className="text-white animate-spin" />
    </div>
  );

  const navItems = [
    { id: "galeria",     label: "Galería",     icon: <Images size={18} />,       disabled: false },
    { id: "comunicados", label: "Comunicados", icon: <Megaphone size={18} />,    disabled: false },
    { id: "eventos",     label: "Eventos",     icon: <CalendarDays size={18} />,  disabled: false },
    { id: "familias",    label: "Familias",    icon: <Users size={18} />,         disabled: false },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#f8fafc" }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "var(--color-ei-navy-dark)" }}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663744735795/fwbUywmTVnttLNyf.png" alt="Escudo" className="h-9 w-auto" />
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>Aula Verde</p>
              <p className="text-white/40 text-xs">Panel Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button key={item.id}
              onClick={() => { if (!item.disabled) { setModulo(item.id); setSidebarOpen(false); } }}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                modulo === item.id ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-white/40 text-xs mb-1 truncate">{usuario.email}</p>
          <button onClick={cerrarSesion} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <h1 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {modulo === "galeria" && "Gestión de Galería"}
            {modulo === "comunicados" && "Comunicados"}
            {modulo === "eventos" && "Gestión de Eventos"}
            {modulo === "familias" && "Familias Registradas"}
          </h1>
          <a href="/" target="_blank" className="ml-auto text-xs text-blue-600 hover:underline">Ver sitio →</a>
        </header>

        {/* ── GALERÍA ── */}
        {modulo === "galeria" && (
          <div className="flex-1 p-4 sm:p-6 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 text-base mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>Subir nueva foto</h2>
              {uploadMsg && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-4 ${uploadMsg.tipo === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {uploadMsg.tipo === "ok" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}{uploadMsg.texto}
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Ej: Estudiantes en la feria"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select value={categoriaFoto} onChange={(e) => setCategoriaFoto(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {CATEGORIAS_FOTO.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <input type="checkbox" id="destacada" checked={destacada} onChange={(e) => setDestacada(e.target.checked)} className="w-4 h-4 rounded" />
                <label htmlFor="destacada" className="text-sm text-gray-700">Marcar como foto destacada</label>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                onClick={() => fileRef.current?.click()}>
                {subiendo ? (
                  <div className="flex flex-col items-center gap-2"><Loader2 size={32} className="text-blue-500 animate-spin" /><p className="text-sm text-gray-500">Subiendo foto...</p></div>
                ) : (
                  <div className="flex flex-col items-center gap-2"><Upload size={32} className="text-gray-300" /><p className="text-sm font-medium text-gray-600">Clic para seleccionar foto</p><p className="text-xs text-gray-400">JPG, PNG, WEBP hasta 10MB</p></div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={subirFoto} disabled={subiendo} />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 text-base mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>Fotos ({fotos.length})</h2>
              {loadingFotos ? <div className="flex justify-center py-10"><Loader2 size={28} className="text-gray-300 animate-spin" /></div>
              : fotos.length === 0 ? <p className="text-center text-gray-400 text-sm py-10">No hay fotos aún.</p>
              : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {fotos.map((foto) => (
                    <div key={foto.id} className="relative group rounded-xl overflow-hidden border border-gray-100">
                      <img src={foto.url} alt={foto.caption} className="w-full aspect-square object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => toggleDestacada(foto)} className={`p-1.5 rounded-lg ${foto.destacada ? "bg-yellow-400 text-white" : "bg-white/20 text-white"}`}>
                            {foto.destacada ? <Star size={14} fill="white" /> : <StarOff size={14} />}
                          </button>
                          <button onClick={() => eliminarFoto(foto)} className="p-1.5 rounded-lg bg-red-500 text-white"><Trash2 size={14} /></button>
                        </div>
                        <div>
                          <p className="text-white text-xs line-clamp-2">{foto.caption}</p>
                          <button onClick={() => togglePublicada(foto)} className={`mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${foto.publicada ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                            {foto.publicada ? "Publicada" : "Oculta"}
                          </button>
                        </div>
                      </div>
                      {foto.destacada && <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full font-semibold">★</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── COMUNICADOS ── */}
        {modulo === "comunicados" && (
          <div className="flex-1 p-4 sm:p-6 space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setShowFormCom(!showFormCom)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--color-ei-electric)" }}>
                {showFormCom ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nuevo comunicado</>}
              </button>
            </div>
            {comMsg && <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${comMsg.tipo === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{comMsg.tipo === "ok" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}{comMsg.texto}</div>}
            {showFormCom && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 text-base mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>Nuevo comunicado</h2>
                <form onSubmit={guardarComunicado} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                    <input type="text" required value={formCom.titulo} onChange={(e) => setFormCom({ ...formCom, titulo: e.target.value })} placeholder="Título del comunicado"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <select value={formCom.tipo} onChange={(e) => setFormCom({ ...formCom, tipo: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {TIPOS_COMUNICADO.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha publicación *</label>
                      <input type="date" required value={formCom.fecha_publicacion} onChange={(e) => setFormCom({ ...formCom, fecha_publicacion: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vigente hasta</label>
                      <input type="date" value={formCom.fecha_vencimiento} onChange={(e) => setFormCom({ ...formCom, fecha_vencimiento: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
                    <textarea required rows={5} value={formCom.contenido} onChange={(e) => setFormCom({ ...formCom, contenido: e.target.value })} placeholder="Escriba el comunicado aquí..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                  <button type="submit" disabled={savingCom} className="btn-inst flex items-center gap-2 disabled:opacity-60">
                    {savingCom ? <><Loader2 size={16} className="animate-spin" /> Publicando...</> : <><CheckCircle size={16} /> Publicar</>}
                  </button>
                </form>
              </div>
            )}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 text-base mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>Comunicados ({comunicados.length})</h2>
              {loadingCom ? <div className="flex justify-center py-10"><Loader2 size={28} className="text-gray-300 animate-spin" /></div>
              : comunicados.length === 0 ? <p className="text-center text-gray-400 text-sm py-10">No hay comunicados.</p>
              : (
                <div className="space-y-3">
                  {comunicados.map((com) => (
                    <div key={com.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${com.tipo === "urgente" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{com.tipo}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${com.publicado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{com.publicado ? "Publicado" : "Oculto"}</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm">{com.titulo}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">{com.fecha_publicacion}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePublicadoCom(com)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100">{com.publicado ? "Ocultar" : "Publicar"}</button>
                        <button onClick={() => eliminarComunicado(com.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EVENTOS ── */}
        {modulo === "eventos" && (
          <div className="flex-1 p-4 sm:p-6 space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setShowFormEv(!showFormEv)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--color-ei-electric)" }}>
                {showFormEv ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nuevo evento</>}
              </button>
            </div>
            {evMsg && <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${evMsg.tipo === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{evMsg.tipo === "ok" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}{evMsg.texto}</div>}
            {showFormEv && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 text-base mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>Nuevo evento</h2>
                <form onSubmit={guardarEvento} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                    <input type="text" required value={formEv.titulo} onChange={(e) => setFormEv({ ...formEv, titulo: e.target.value })} placeholder="Ej: Feria de Ciencias 2026"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio *</label>
                      <input type="date" required value={formEv.fecha_inicio} onChange={(e) => setFormEv({ ...formEv, fecha_inicio: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                      <input type="date" value={formEv.fecha_fin} onChange={(e) => setFormEv({ ...formEv, fecha_fin: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                      <input type="time" value={formEv.hora_inicio} onChange={(e) => setFormEv({ ...formEv, hora_inicio: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <select value={formEv.categoria} onChange={(e) => setFormEv({ ...formEv, categoria: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {CATEGORIAS_EVENTO.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
                    <input type="text" value={formEv.lugar} onChange={(e) => setFormEv({ ...formEv, lugar: e.target.value })} placeholder="Ej: Salón principal" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea rows={3} value={formEv.descripcion} onChange={(e) => setFormEv({ ...formEv, descripcion: e.target.value })} placeholder="Descripción opcional..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                  <button type="submit" disabled={savingEv} className="btn-inst flex items-center gap-2 disabled:opacity-60">
                    {savingEv ? <><Loader2 size={16} className="animate-spin" /> Publicando...</> : <><CheckCircle size={16} /> Publicar evento</>}
                  </button>
                </form>
              </div>
            )}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 text-base mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>Eventos ({eventos.length})</h2>
              {loadingEv ? <div className="flex justify-center py-10"><Loader2 size={28} className="text-gray-300 animate-spin" /></div>
              : eventos.length === 0 ? <p className="text-center text-gray-400 text-sm py-10">No hay eventos.</p>
              : (
                <div className="space-y-3">
                  {eventos.map((ev) => (
                    <div key={ev.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{ev.categoria}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.publicado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{ev.publicado ? "Publicado" : "Oculto"}</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm">{ev.titulo}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">{ev.fecha_inicio}{ev.hora_inicio ? ` · ${ev.hora_inicio}` : ""}{ev.lugar ? ` · ${ev.lugar}` : ""}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePublicadoEv(ev)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100">{ev.publicado ? "Ocultar" : "Publicar"}</button>
                        <button onClick={() => eliminarEvento(ev.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FAMILIAS ── */}
        {modulo === "familias" && (
          <div className="flex-1 p-4 sm:p-6 space-y-6">

            {padresMsg && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${padresMsg.tipo === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {padresMsg.tipo === "ok" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}{padresMsg.texto}
              </div>
            )}

            {/* Filtros */}
            <div className="flex gap-2">
              {(["pendientes", "aprobados", "todos"] as const).map((f) => (
                <button key={f} onClick={() => setFiltroPadres(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filtroPadres === f ? "text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  style={filtroPadres === f ? { background: "var(--color-ei-electric)" } : {}}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 text-base mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Familias {filtroPadres} ({padres.length})
              </h2>

              {loadingPadres ? <div className="flex justify-center py-10"><Loader2 size={28} className="text-gray-300 animate-spin" /></div>
              : padres.length === 0 ? <p className="text-center text-gray-400 text-sm py-10">No hay registros {filtroPadres}.</p>
              : (
                <div className="space-y-4">
                  {padres.map((padre) => (
                    <div key={padre.id} className={`p-4 rounded-xl border ${padre.verificado ? "border-green-100 bg-green-50/30" : "border-amber-100 bg-amber-50/30"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Estado */}
                          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${padre.verificado ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {padre.verificado ? "✓ Aprobado" : "⏳ Pendiente"}
                          </span>

                          {/* Datos del padre */}
                          <h3 className="font-bold text-gray-800 text-sm">{padre.nombre} {padre.apellidos}</h3>
                          <div className="text-gray-500 text-xs mt-1 space-y-0.5">
                            <p>📋 Cédula: {padre.cedula}</p>
                            <p>📧 {padre.email}</p>
                            {padre.telefono && <p>📞 {padre.telefono}</p>}
                          </div>

                          {/* Datos del estudiante */}
                          {padre.estudiantes?.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              {padre.estudiantes.map((est, i) => (
                                <div key={i} className="text-xs text-gray-600">
                                  <span className="font-semibold">👧 Estudiante:</span> {est.nombre} {est.apellidos} · {est.grado} grado
                                  {est.fecha_nacimiento && (
                                    <span className="ml-2 text-purple-600">🎂 {new Date(est.fecha_nacimiento + "T12:00:00").toLocaleDateString("es-CR", { day: "numeric", month: "long" })}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-gray-400 text-xs mt-2">Registrado: {new Date(padre.created_at).toLocaleDateString("es-CR")}</p>
                        </div>

                        {/* Acciones */}
                        {!padre.verificado && (
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <button onClick={() => aprobarPadre(padre)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors">
                              <CheckCircle size={13} /> Aprobar
                            </button>
                            <button onClick={() => rechazarPadre(padre)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                              <X size={13} /> Rechazar
                            </button>
                          </div>
                        )}
                        {padre.verificado && (
                          <button onClick={() => rechazarPadre(padre)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors flex-shrink-0">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
