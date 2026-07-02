/* =============================================================
   HERO SECTION – Escuela Inglaterra
   FASE 1 WOW VISUAL: Parallax real + paleta escudo + microinteracciones
   CAMBIOS:
   - Parallax en imagen de fondo (useParallax hook)
   - Azul eléctrico real extraído del escudo (#1565C0 / oklch 0.42 0.20 255)
   - Línea dorada animada bajo el título
   - Badge con pulso y texto del aniversario mejorado
   - Partículas flotantes sutiles (CSS puro, sin librería)
   - Estadísticas con barra de progreso animada
   - Scroll indicator mejorado con loop suave
   ============================================================= */

import { useEffect, useRef, useState } from "react";
import { ChevronDown, GraduationCap } from "lucide-react";
import { useParallax } from "@/hooks/useParallax";

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const stats = [
  { value: 90,   suffix: " años",  label: "De historia",       progress: 100 },
  { value: 600,  suffix: "+",      label: "Estudiantes",       progress: 75  },
  { value: 1936, suffix: "",       label: "Año de fundación",  progress: null },
];

// Partículas decorativas (posición fija, sin animación pesada)
const particles = [
  { top: "15%", left: "8%",  size: 4,  opacity: 0.12, delay: "0s"    },
  { top: "28%", left: "92%", size: 6,  opacity: 0.10, delay: "1.2s"  },
  { top: "55%", left: "5%",  size: 3,  opacity: 0.15, delay: "0.6s"  },
  { top: "72%", left: "88%", size: 5,  opacity: 0.08, delay: "1.8s"  },
  { top: "40%", left: "95%", size: 3,  opacity: 0.12, delay: "2.4s"  },
  { top: "85%", left: "12%", size: 4,  opacity: 0.10, delay: "0.9s"  },
];

export default function HeroSection() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [titleVisible, setTitleVisible]   = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, offset: parallaxOffset } = useParallax(0.35);

  // Animación de entrada del título (500ms delay para efecto cinematográfico)
  useEffect(() => {
    const t = setTimeout(() => setTitleVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Intersection Observer para estadísticas
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToNext = () => {
    const el = document.querySelector("#identidad");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--color-ei-navy-dark)" }}
    >
      {/* ── Imagen con parallax real ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <img
          src="/Frente.png"
          alt=""
          className="w-full h-[115%] object-cover object-center"
          style={{
            transform: `translateY(${parallaxOffset}px)`,
            willChange: "transform",
            opacity: 1,
          }}
        />
        {/* Gradiente inferior para transición suave a la siguiente sección */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--color-ei-navy-dark))",
          }}
        />
      </div>

      {/* ── Partículas flotantes decorativas ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-particle"
            style={{
              top: p.top,
              left: p.left,
              width:  p.size,
              height: p.size,
              background: "var(--color-ei-gold)",
              opacity: p.opacity,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Número 90 decorativo de fondo ── */}
      <div
        className="absolute right-[-2%] top-1/2 -translate-y-1/2 select-none pointer-events-none"
        aria-hidden="true"
      >
        <span
          className="font-bold leading-none"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(180px, 28vw, 480px)",
            color: "var(--color-ei-electric)",
            opacity: 0.07,
          }}
        >
          90
        </span>
      </div>

      {/* ── Contenido principal ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 lg:py-36">
          <div className="max-w-3xl">

            {/* Badge aniversario mejorado */}
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold mb-8 transition-all duration-700 ${
                titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                background: "var(--color-ei-gold)/15",
                border: "1px solid var(--color-ei-gold)/40",
                color: "var(--color-ei-gold-light)",
                transitionDelay: "0ms",
              }}
            >
              <GraduationCap size={15} />
              <span>90 Años · 1936 – 2026 · San Rafael de Montes de Oca</span>
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--color-ei-gold)" }}
              />
            </div>

            {/* Título con animación de entrada escalonada */}
            <div
              className={`transition-all duration-800 ${
                titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <h1
                className="text-white leading-[1.05] mb-2"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                }}
              >
                Escuela
              </h1>
              {/* "Inglaterra" con subrayado dorado animado */}
              <div className="relative inline-block mb-8">
                <h1
                  className="leading-[1.05]"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                    color: "var(--color-ei-gold-light)",
                  }}
                >
                  Inglaterra
                </h1>
                {/* Línea dorada animada */}
                <div
                  className="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-1000"
                  style={{
                    width: titleVisible ? "100%" : "0%",
                    background: "linear-gradient(90deg, var(--color-ei-gold), var(--color-ei-gold-light))",
                    transitionDelay: "600ms",
                  }}
                />
              </div>
            </div>

            <p
              className={`text-white/80 text-lg sm:text-xl leading-relaxed mb-4 max-w-xl transition-all duration-700 ${
                titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              San Rafael de Montes de Oca, Costa Rica
            </p>

            <p
              className={`text-white/65 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl transition-all duration-700 ${
                titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              Nueve décadas formando ciudadanos íntegros, comprometidos con el
              aprendizaje y el desarrollo de nuestra comunidad.
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 ${
                titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <button
                onClick={() => {
                  document.querySelector("#identidad")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-inst"
              >
                Conocer más
              </button>
              <button
                onClick={() => {
                  document.querySelector("#esta-semana")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-inst-outline border-white/50 text-white hover:bg-white hover:text-[var(--color-ei-navy)]"
              >
                Esta semana →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Estadísticas mejoradas con barra de progreso ── */}
      <div
        ref={statsRef}
        className="relative z-10 border-t"
        style={{
          background: "var(--color-ei-navy)/70",
          borderColor: "white/10",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {stats.map((stat, i) => (
              <StatItem key={i} stat={stat} visible={statsVisible} delay={i * 150} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors group"
        aria-label="Desplazarse hacia abajo"
      >
        <span className="text-xs tracking-widest uppercase font-medium text-white/30 group-hover:text-white/60 transition-colors">
          Descubrir
        </span>
        <ChevronDown size={22} className="animate-bounce" />
      </button>
    </section>
  );
}

function StatItem({
  stat,
  visible,
  delay,
}: {
  stat: { value: number; suffix: string; label: string; progress: number | null };
  visible: boolean;
  delay: number;
}) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setActive(true), delay);
      return () => clearTimeout(t);
    }
  }, [visible, delay]);
  const count = useCountUp(stat.value, 1800, active);

  return (
    <div className="py-7 px-4 sm:px-8 text-center">
      <div
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        {count}
        <span style={{ color: "var(--color-ei-gold-light)" }}>{stat.suffix}</span>
      </div>
      <div className="text-white/55 text-xs sm:text-sm mb-3">{stat.label}</div>
      {/* Barra de progreso animada */}
      {stat.progress !== null && (
        <div className="h-0.5 rounded-full mx-auto max-w-[60px]" style={{ background: "white/10" }}>
          <div
            className="h-full rounded-full transition-all duration-1500"
            style={{
              width: active ? `${stat.progress}%` : "0%",
              background: "var(--color-ei-gold)",
              transitionDelay: `${delay + 400}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}
