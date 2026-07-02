/* =============================================================
   GREENJOY SECTION – Sección de donación institucional
   Diseño: Solo imagen del banner GreenJoy
   ============================================================= */

import { useReveal } from "@/hooks/useReveal";

export default function GreenJoySection() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`rounded-2xl overflow-hidden reveal ${visible ? "visible" : ""}`}
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663744735795/BpPgDYJmx46K3RMxDBs7WN/greenjoy_banner-jvpxm6xBJoMZnkoHJieQeP.webp"
            alt="GreenJoy – Donación a la Escuela Inglaterra"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
