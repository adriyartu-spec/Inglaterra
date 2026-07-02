/* =============================================================
   NAVBAR – Escuela Inglaterra
   Diseño: "Orgullo Costarricense" – Editorial Contemporáneo
   Fondo transparente → azul marino sólido al hacer scroll
   ============================================================= */

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nuestra Identidad", href: "#identidad" },
  { label: "Historia", href: "#historia" },
  { label: "Vida Estudiantil", href: "#vida-estudiantil" },
  { label: "Junta Educativa", href: "#junta" },
  { label: "Noticias", href: "#noticias" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[oklch(0.22_0.07_255)] shadow-lg shadow-[oklch(0.22_0.07_255/0.3)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo + nombre */}
            <button
              onClick={() => handleNavClick("#inicio")}
              className="flex items-center gap-3 group"
            >
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663744735795/fwbUywmTVnttLNyf.png"
                alt="Escudo Escuela Inglaterra"
                className="h-10 w-auto lg:h-12 drop-shadow-md transition-transform duration-200 group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Escuela Inglaterra
                </p>
                <p className="text-white/70 text-xs leading-tight">
                  San Rafael de Montes de Oca
                </p>
              </div>
            </button>

            {/* Links desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-150 hover:bg-white/10 rounded"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Botón mobile */}
            <button
              className="lg:hidden text-white p-2 rounded hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menú mobile */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } bg-[oklch(0.18_0.065_255)]`}
        >
          <div className="px-4 pb-4 pt-2 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-white/90 hover:text-white text-left px-3 py-3 text-sm font-medium border-b border-white/10 last:border-0 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
