/* =============================================================
   useParallax hook – Escuela Inglaterra
   Efecto parallax suave basado en scroll
   NUEVO: Fase 1 WOW Visual
   ============================================================= */

import { useEffect, useRef, useState } from "react";

export function useParallax(speed = 0.4) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeta preferencias de movimiento reducido
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Solo calculamos cuando la sección es visible
      if (rect.bottom < 0 || rect.top > viewH) return;
      const progress = (viewH - rect.top) / (viewH + rect.height);
      setOffset((progress - 0.5) * speed * 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // valor inicial
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return { ref, offset };
}
