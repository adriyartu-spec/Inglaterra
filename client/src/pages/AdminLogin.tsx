// NUEVO: Panel CMS - Login para maestras
// Ruta: /admin/login
// Supabase Auth con email + password

import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Correo o contraseña incorrectos. Por favor verifique.");
      setLoading(false);
      return;
    }

    setLocation("/admin");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--color-ei-navy-dark)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663744735795/fwbUywmTVnttLNyf.png"
            alt="Escudo Escuela Inglaterra"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1
            className="text-white text-2xl font-bold"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Panel de Administración
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Escuela Inglaterra · Aula Verde
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2
            className="text-[oklch(0.22_0.07_255)] font-bold text-xl mb-6"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Iniciar sesión
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all"
                placeholder="maestra@escuela.com"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-inst flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Ingresando...</>
              ) : (
                <><LogIn size={16} /> Ingresar</>
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
