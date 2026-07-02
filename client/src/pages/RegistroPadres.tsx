/* =============================================================
   REGISTRO DE PADRES – Escuela Inglaterra / Aula Verde
   Ruta: /registro
   NUEVO: Flujo híbrido — padre se registra, maestra aprueba
   - Registro con cédula, email, teléfono
   - Datos del estudiante con fecha de nacimiento
   - Estado pendiente hasta aprobación del admin
   ============================================================= */

import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { CheckCircle, AlertCircle, Loader2, UserPlus, ArrowLeft } from "lucide-react";

type Estado = "idle" | "loading" | "success" | "error";

export default function RegistroPadres() {
  const [, setLocation] = useLocation();
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    // Datos del padre/tutor
    nombre: "",
    apellidos: "",
    cedula: "",
    email: "",
    telefono: "",
    // Datos del estudiante
    nombre_estudiante: "",
    apellidos_estudiante: "",
    grado: "",
    seccion: "",
    fecha_nacimiento: "",
  });

  const GRADOS = ["Kínder", "Preparatoria", "1°", "2°", "3°", "4°", "5°", "6°"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("loading");
    setErrorMsg("");

    try {
      // Obtener escuela_id
      const { data: escuela, error: escuelaError } = await supabase
        .from("escuelas").select("id").eq("subdominio", "inglaterra").single();

      if (escuelaError || !escuela) throw new Error("No se pudo identificar la escuela.");

      // Verificar si la cédula ya está registrada
      const { data: existente } = await supabase
        .from("padres_familia")
        .select("id")
        .eq("escuela_id", escuela.id)
        .eq("cedula", form.cedula)
        .single();

      if (existente) {
        throw new Error("Esta cédula ya está registrada. Si necesita ayuda, contacte a la escuela.");
      }

      // Registrar padre
      const { data: padre, error: padreError } = await supabase
        .from("padres_familia")
        .insert({
          escuela_id: escuela.id,
          cedula: form.cedula,
          nombre: form.nombre,
          apellidos: form.apellidos,
          email: form.email,
          telefono: form.telefono || null,
          verificado: false,
          activo: true,
        })
        .select("id")
        .single();

      if (padreError || !padre) throw new Error("Error al registrar. Por favor intente de nuevo.");

      // Registrar estudiante
      const { error: estudianteError } = await supabase
        .from("estudiantes")
        .insert({
          escuela_id: escuela.id,
          padre_id: padre.id,
          nombre: form.nombre_estudiante,
          apellidos: form.apellidos_estudiante,
          grado: form.grado,
          seccion: form.seccion || null,
          fecha_nacimiento: form.fecha_nacimiento || null,
          activo: true,
        });

      if (estudianteError) throw new Error("Error al registrar al estudiante.");

      setEstado("success");

    } catch (err: any) {
      setErrorMsg(err.message ?? "Error inesperado. Por favor intente de nuevo.");
      setEstado("error");
    }
  };

  // ── Estado éxito ──
  if (estado === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--color-ei-navy-dark)" }}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-[oklch(0.22_0.07_255)] font-bold text-2xl mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
            ¡Registro exitoso!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Su solicitud fue recibida. La dirección de la escuela verificará sus datos y le notificará por correo electrónico cuando su registro sea aprobado.
          </p>
          <button onClick={() => setLocation("/")} className="btn-inst w-full flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Volver al sitio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "var(--color-ei-navy-dark)" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663744735795/fwbUywmTVnttLNyf.png"
            alt="Escudo Escuela Inglaterra"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-white text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Registro de Familias
          </h1>
          <p className="text-white/50 text-sm mt-2">
            Escuela Inglaterra · San Rafael de Montes de Oca
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Error */}
            {estado === "error" && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Sección padre/tutor */}
            <div>
              <h3 className="text-[oklch(0.22_0.07_255)] font-bold text-base mb-4 pb-2 border-b border-gray-100" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Datos del padre / madre / tutor
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Nombre" disabled={estado === "loading"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                  <input type="text" required value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                    placeholder="Apellidos" disabled={estado === "loading"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label>
                  <input type="text" required value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                    placeholder="Ej: 1-1234-5678" disabled={estado === "loading"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="(506) 0000-0000" disabled={estado === "loading"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="correo@ejemplo.com" disabled={estado === "loading"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all" />
                </div>
              </div>
            </div>

            {/* Sección estudiante */}
            <div>
              <h3 className="text-[oklch(0.22_0.07_255)] font-bold text-base mb-4 pb-2 border-b border-gray-100" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Datos del estudiante
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del estudiante *</label>
                  <input type="text" required value={form.nombre_estudiante} onChange={(e) => setForm({ ...form, nombre_estudiante: e.target.value })}
                    placeholder="Nombre" disabled={estado === "loading"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos del estudiante *</label>
                  <input type="text" required value={form.apellidos_estudiante} onChange={(e) => setForm({ ...form, apellidos_estudiante: e.target.value })}
                    placeholder="Apellidos" disabled={estado === "loading"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grado *</label>
                  <select required value={form.grado} onChange={(e) => setForm({ ...form, grado: e.target.value })}
                    disabled={estado === "loading"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all">
                    <option value="">Seleccione el grado</option>
                    {GRADOS.map((g) => <option key={g} value={g}>{g} grado</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sección</label>
                  <input type="text" value={form.seccion} onChange={(e) => setForm({ ...form, seccion: e.target.value })}
                    placeholder="Ej: A, B, C" disabled={estado === "loading"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de nacimiento del estudiante
                    <span className="text-gray-400 font-normal ml-1">(para avisos de cumpleaños)</span>
                  </label>
                  <input type="date" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                    disabled={estado === "loading"}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all" />
                </div>
              </div>
            </div>

            {/* Nota */}
            <p className="text-gray-400 text-xs leading-relaxed border-t border-gray-100 pt-4">
              Su solicitud quedará pendiente de aprobación por parte de la dirección de la escuela.
              Recibirá una notificación en su correo electrónico cuando sea aprobada.
            </p>

            {/* Submit */}
            <button type="submit" disabled={estado === "loading"}
              className="btn-inst w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {estado === "loading" ? (
                <><Loader2 size={16} className="animate-spin" /> Registrando...</>
              ) : (
                <><UserPlus size={16} /> Enviar registro</>
              )}
            </button>
          </form>
        </div>

        <p className="text-white/30 text-xs text-center mt-6">
          Plataforma Aula Verde · greenjoy.travel
        </p>
      </div>
    </div>
  );
}
