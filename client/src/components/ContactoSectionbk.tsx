/* =============================================================
   CONTACTO SECTION – Formulario, mapa y datos de contacto
   Diseño: Fondo blanco con mapa de Google Maps integrado
   ============================================================= */

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { MapPin, Phone, Mail, Facebook, Send, CheckCircle } from "lucide-react";
import { MapView } from "@/components/Map";

export default function ContactoSection() {
  const { ref, visible } = useReveal(0.08);
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setForm({ nombre: "", email: "", mensaje: "" });
    }, 4000);
  };

  const handleMapReady = (map: google.maps.Map) => {
    const schoolLocation = { lat: 9.9355, lng: -84.0477 };
    map.setCenter(schoolLocation);
    map.setZoom(16);

    new google.maps.Marker({
      position: schoolLocation,
      map,
      title: "Escuela Inglaterra",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#1e3a8a",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });
  };

  return (
    <>
      {/* Sección de comunidad */}
      <section className="py-16 lg:py-24 bg-[oklch(0.22_0.07_255)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`reveal ${visible ? "visible" : ""}`}
            style={{ transitionDelay: "0ms" }}
          >
            <p className="text-[oklch(0.85_0.09_75)] font-semibold text-sm uppercase tracking-widest mb-4">
              Nuestra comunidad
            </p>
            <h2
              className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-8"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Ubicación en el corazón de San Rafael
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/comunidad.png"
                alt="Comunidad de Sabanilla"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de contacto */}
      <section id="contacto" className="py-20 lg:py-28 bg-[oklch(0.97_0.005_255)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div ref={ref} className={`mb-16 reveal ${visible ? "visible" : ""}`}>
          <p className="text-[oklch(0.72_0.12_75)] font-semibold text-sm uppercase tracking-widest mb-3">
            Estamos para servirle
          </p>
          <h2
            className="text-[oklch(0.22_0.07_255)] text-3xl sm:text-4xl lg:text-5xl font-bold gold-underline"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Contacto
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Columna izquierda: info + formulario */}
          <div>
            {/* Datos de contacto */}
            <div
              className={`space-y-5 mb-10 reveal ${visible ? "visible" : ""}`}
              style={{ transitionDelay: "100ms" }}
            >
              <ContactItem icon={<MapPin size={20} />} label="Dirección">
                Avenida 21, San Rafael de Montes de Oca, San José, Costa Rica
              </ContactItem>
              <ContactItem icon={<Phone size={20} />} label="Teléfono">
                (506) 2273-3968
              </ContactItem>
              <ContactItem icon={<Mail size={20} />} label="Correo electrónico">
                esc.inglaterra@mep.go.cr
              </ContactItem>
              <ContactItem icon={<Facebook size={20} />} label="Facebook">
                <a
                  href="https://www.facebook.com/p/Escuela-Inglaterra-100057559746553/?locale=es_LA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.45_0.15_255)] hover:underline"
                >
                  Escuela Inglaterra – Facebook
                </a>
              </ContactItem>
            </div>

            {/* Formulario */}
            <div
              className={`bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 reveal ${visible ? "visible" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <h3
                className="text-[oklch(0.22_0.07_255)] font-bold text-xl mb-6"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Envíenos un mensaje
              </h3>

              {enviado ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle size={48} className="text-green-500 mb-4" />
                  <p className="text-[oklch(0.22_0.07_255)] font-semibold text-lg">
                    ¡Mensaje enviado!
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Nos pondremos en contacto con usted a la brevedad.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] focus:border-transparent transition-all"
                      placeholder="Su nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] focus:border-transparent transition-all"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.mensaje}
                      onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.15_255)] focus:border-transparent transition-all resize-none"
                      placeholder="Escriba su mensaje aquí..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-inst w-full flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Enviar mensaje
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Columna derecha: mapa */}
          <div
            className={`reveal ${visible ? "visible" : ""}`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-full min-h-[400px] lg:min-h-[600px]">
              <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.5!2d-84.0477!3d9.9355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEscuela+Inglaterra+San+Rafael+Montes+de+Oca!5e0!3m2!1ses!2scr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Escuela Inglaterra"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[oklch(0.22_0.07_255)] flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-gray-700 text-sm">{children}</p>
      </div>
    </div>
  );
}
