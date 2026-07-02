/* =============================================================
   HOME PAGE – Escuela Inglaterra
   CAMBIOS:
   - Añadida OfertaAcademicaSection después de IdentidadSection
   - Eliminada NoticiasSection
   ============================================================= */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IdentidadSection from "@/components/IdentidadSection";
import OfertaAcademicaSection from "@/components/OfertaAcademicaSection"; // ← NUEVO
import HistoriaSection from "@/components/HistoriaSection";
import VidaEstudiantilSection from "@/components/VidaEstudiantilSection";
import GaleriaSection from "@/components/GaleriaSection";
import JuntaSection from "@/components/JuntaSection";
import CalendarioSection from "@/components/CalendarioSection";
// NoticiasSection ELIMINADA por solicitud de la escuela
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
      <GaleriaSection />
      <JuntaSection />
      <CalendarioSection />
      <GreenJoySection />
      <ContactoSection />
      <Footer />
    </div>
  );
}
