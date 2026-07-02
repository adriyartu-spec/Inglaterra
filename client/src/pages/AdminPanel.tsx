// NUEVO: Panel CMS principal
// Ruta: /admin
// Módulos: Galería, Eventos, Comunicados (expandible)
// Supabase Auth + Storage

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import {
  Images, CalendarDays, Megaphone, LogOut, Upload,
  Trash2, Star, StarOff, Loader2, CheckCircle, AlertCircle, Menu, X
} from "lucide-react";

interface Foto {
  id: string;
  url: string;
  caption: string;
  categoria: string;
  destacada: boolean;
  publicada: boolean;
  created_at: string;
}

const CATEGORIAS = ["General", "Académico", "Deportes", "Arte", "Cultural", "Institucional"];
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
  const [categoria, setCategoria] = useState("General");
  const [destacada, setDestacada] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Verificar sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { setLocation("/admin/login"); return; }
      setUsuario(data.session.user);
    });
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) setLocation("/admin/login");
    });
  }, []);

  // Obtener escuela_id
  useEffect(() => {
    if (!usuario) return;
    supabase.from("escuelas").select("id").eq("subdominio", SUBDOMINIO).single()
      .then(({ data }) => { if (data) setEscuelaId(data.id); });
  }, [usuario]);

  // Cargar fotos
  useEffect(() => {
    if (!escuelaId || modulo !== "galeria") return;
    cargarFotos();
  }, [escuelaId, modulo]);

  async function cargarFotos() {
    setLoadingFotos(true);
    const { data } = await supabase
      .from("galeria_fotos")
      .select("*")
      .eq("escuela_id", escuelaId)
      .order("created_at", { ascending: false });
    setFotos(data ?? []);
    setLoadingFotos(false);
  }

  async function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !escuelaId) return;

    setSubiendo(true);
    setUploadMsg(null);

    try {
      // Subir a Storage
      const ext = file.name.split(".").pop();
      const filename = `${escuelaId}/${Date.now()}.${ext}`;
      const { error: storageError } = await supabase.storage
        .from("aula-verde-media")
        .upload(filename, file, { cacheControl: "3600", upsert: false });

      if (storageError) throw storageError;

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from("aula-verde-media")
        .getPublicUrl(filename);

      // Insertar en tabla
      const { error: dbError } = await supabase.from("galeria_fotos").insert({
        escuela_id: escuelaId,
        url: urlData.publicUrl,
        caption: caption || "Sin descripción",
        categoria,
        destacada,
        publicada: true,
      });

      if (dbError) throw dbError;

      setUploadMsg({ tipo: "ok", texto: "¡Foto publicada exitosamente!" });
      setCaption("");
      setCategoria("General");
      setDestacada(false);
      if (fileRef.current) fileRef.current.value = "";
      cargarFotos();

    } catch (err: any) {
      setUploadMsg({ tipo: "err", texto: "Error al subir la foto. Intente de nuevo." });
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
    // Solo una foto puede ser destacada a la vez
    if (!foto.destacada) {
      await supabase.from("galeria_fotos").update({ destacada: false }).eq("escuela_id", escuelaId!);
    }
    await supabase.from("galeria_fotos").update({ destacada: !foto.destacada }).eq("id", foto.id);
    cargarFotos();
  }

  async function eliminarFoto(foto: Foto) {
    if (!confirm("¿Eliminar esta foto permanentemente?")) return;
    await supabase.from("galeria_fotos").delete().eq("id", foto.id);
    cargarFotos();
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
    { id: "galeria", label: "Galería", icon: <Images size={18} /> },
    { id: "eventos", label: "Eventos", icon: <CalendarDays size={18} />, disabled: true },
    { id: "comunicados", label: "Comunicados", icon: <Megaphone size={18} />, disabled: true },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#f8fafc" }}>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "var(--color-ei-navy-dark)" }}
      >
        {/* Header sidebar */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663744735795/fwbUywmTVnttLNyf.png"
              alt="Escudo" className="h-9 w-auto"
            />
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Aula Verde
              </p>
              <p className="text-white/40 text-xs">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { if (!item.disabled) { setModulo(item.id); setSidebarOpen(false); } }}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                modulo === item.id
                  ? "bg-white/15 text-white"
                  : item.disabled
                  ? "text-white/20 cursor-not-allowed"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
              {item.disabled && <span className="ml-auto text-xs text-white/20">Próximo</span>}
            </button>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="p-4 border-t border-white/10">
          <p className="text-white/40 text-xs mb-1 truncate">{usuario.email}</p>
          <button
            onClick={cerrarSesion}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {modulo === "galeria" && "Gestión de Galería"}
            {modulo === "eventos" && "Gestión de Eventos"}
            {modulo === "comunicados" && "Comunicados"}
          </h1>
          <a
            href="/"
            target="_blank"
            className="ml-auto text-xs text-blue-600 hover:underline"
          >
            Ver sitio →
          </a>
        </header>

        {/* Módulo Galería */}
        {modulo === "galeria" && (
          <div className="flex-1 p-4 sm:p-6 space-y-6">

            {/* Upload */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 text-base mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Subir nueva foto
              </h2>

              {uploadMsg && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-4 ${
                  uploadMsg.tipo === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {uploadMsg.tipo === "ok" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {uploadMsg.texto}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la foto</label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Ej: Estudiantes en la feria científica"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="destacada"
                  checked={destacada}
                  onChange={(e) => setDestacada(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="destacada" className="text-sm text-gray-700">
                  Marcar como foto destacada (aparece grande en la galería)
                </label>
              </div>

              {/* Área de upload */}
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                onClick={() => fileRef.current?.click()}
              >
                {subiendo ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={32} className="text-blue-500 animate-spin" />
                    <p className="text-sm text-gray-500">Subiendo foto...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} className="text-gray-300" />
                    <p className="text-sm font-medium text-gray-600">Clic para seleccionar foto</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WEBP hasta 10MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={subirFoto}
                disabled={subiendo}
              />
            </div>

            {/* Lista de fotos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 text-base mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Fotos publicadas ({fotos.length})
              </h2>

              {loadingFotos ? (
                <div className="flex justify-center py-10"><Loader2 size={28} className="text-gray-300 animate-spin" /></div>
              ) : fotos.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">No hay fotos aún. ¡Subí la primera!</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {fotos.map((foto) => (
                    <div key={foto.id} className="relative group rounded-xl overflow-hidden border border-gray-100">
                      <img src={foto.url} alt={foto.caption} className="w-full aspect-square object-cover" />

                      {/* Overlay con acciones */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end gap-1">
                          {/* Destacada */}
                          <button
                            onClick={() => toggleDestacada(foto)}
                            className={`p-1.5 rounded-lg transition-colors ${foto.destacada ? "bg-yellow-400 text-white" : "bg-white/20 text-white hover:bg-white/40"}`}
                            title={foto.destacada ? "Quitar destacada" : "Marcar destacada"}
                          >
                            {foto.destacada ? <Star size={14} fill="white" /> : <StarOff size={14} />}
                          </button>
                          {/* Eliminar */}
                          <button
                            onClick={() => eliminarFoto(foto)}
                            className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                            title="Eliminar foto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div>
                          <p className="text-white text-xs leading-snug line-clamp-2">{foto.caption}</p>
                          {/* Toggle publicada */}
                          <button
                            onClick={() => togglePublicada(foto)}
                            className={`mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${foto.publicada ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}
                          >
                            {foto.publicada ? "Publicada" : "Oculta"}
                          </button>
                        </div>
                      </div>

                      {/* Badge destacada */}
                      {foto.destacada && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                          ★ Destacada
                        </div>
                      )}
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
