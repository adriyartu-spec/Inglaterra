/* =============================================================
   HOME PAGE – Escuela Inglaterra
   FASE 1 WOW VISUAL — Sección GaleriaSection añadida
   CAMBIOS:
   - Import de GaleriaSection (nueva)
   - GaleriaSection colocada entre VidaEstudiantil y Junta
     (flujo: Hero → Identidad → Historia → VidaEstudiantil →
             GaleriaSection ← NUEVO → Junta → Calendario →
             Noticias → Contacto → Footer)
   ============================================================= */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IdentidadSection from "@/components/IdentidadSection";
import OfertaAcademicaSection from "@/components/OfertaAcademicaSection";
import HistoriaSection from "@/components/HistoriaSection";
import VidaEstudiantilSection from "@/components/VidaEstudiantilSection";
import GaleriaSection from "@/components/GaleriaSection"; // ← NUEVO Fase 1
import JuntaSection from "@/components/JuntaSection";
import CalendarioSection from "@/components/CalendarioSection";
import NoticiasSection from "@/components/NoticiasSection";
import GreenJoySection from "@/components/GreenJoySection";
import ContactoSection from "@/components/ContactoSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <IdentidadSection />
      <OfertaAcademicaSection />
      <HistoriaSection />
      <VidaEstudiantilSection />
      <GaleriaSection />      {/* ← NUEVO Fase 1 */}
      <JuntaSection />
      <CalendarioSection />
      <NoticiasSection />
      <GreenJoySection />
      <ContactoSection />
      <Footer />
    </div>
  );
}
