import React, { useState } from "react";
import { CheckCircle2, Send, ShieldCheck } from "lucide-react";
import ContactThreeCanvas from "../components/ContactThreeCanvas";

export default function CTASection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <section
      id="cta"
      className="bg-[#0c0c0e] text-white py-24 md:py-32 px-6 relative overflow-hidden"
    >
      {/* Immersive 3D Scene covering 100% of the Contact section background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <ContactThreeCanvas />
        {/* Elegant dark radial and linear overlays to ensure extreme content readability with maximum transparency */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0e] via-transparent to-[#0c0c0e] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0c0c0e_90%)] opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto w-full z-10 relative pointer-events-none">
        <div 
          className="backdrop-blur-2xl border border-white/10 p-8 md:p-16 rounded-lg shadow-[0_30px_90px_rgba(0,0,0,0.5)] relative overflow-hidden text-center space-y-8 pointer-events-auto"
          style={{ backgroundColor: "#ffffff02" }}
        >
          
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold">
            11 / CANAL DE ENLACE COGNITIVO
          </p>

          <h2 className="font-sans font-black text-4xl sm:text-5xl tracking-[-0.04em] leading-tight max-w-2xl mx-auto">
            Inicia tu Consulta de Enlace Privado<span className="text-[#00f2ff]">.</span>
          </h2>

          <p className="font-sans font-light text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Establece contacto directo con nuestros arquitectos de síntesis. Completa el formulario de validación para orquestar tus agentes autónomos online.
          </p>

          {submitted ? (
            <div className="max-w-xl mx-auto bg-white/[0.03] backdrop-blur-md border border-[#00f2ff]/30 p-8 rounded-sm space-y-4 animate-fade-in text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle2 size={36} className="text-[#00f2ff]" />
              </div>
              <p className="font-mono text-xs text-[#00f2ff] uppercase tracking-[0.2em] font-bold">
                ENLACE INICIADO CORRECTAMENTE
              </p>
              <p className="font-sans text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
                Tu mensaje ha sido cifrado y transmitido a nuestro Núcleo Soberano. Un oficial de integración de Nivel 4 se pondrá en contacto contigo mediante canales seguros.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 text-left pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-gray-500">Nombre / Institución</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Gustavo Ocampo"
                    className="w-full bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-sm px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00f2ff]/50 focus:bg-white/[0.05] transition-all placeholder-gray-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-gray-500">Email Corporativo</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@institucion.com"
                    className="w-full bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-sm px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00f2ff]/50 focus:bg-white/[0.05] transition-all placeholder-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-gray-500">Mensaje / Requerimientos Cognitivos</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detalla los desafíos de automatización o la arquitectura de agente autónomo online que buscas orquestar..."
                  className="w-full bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-sm px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00f2ff]/50 focus:bg-white/[0.05] transition-all placeholder-gray-700 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-white hover:bg-gray-100 text-black font-sans text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm active:scale-[0.99] flex items-center justify-center gap-2 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    Enviar Mensaje de Enlace <Send size={12} />
                  </span>
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center justify-center gap-2 font-mono text-[9px] text-gray-500 uppercase tracking-widest pt-4">
            <ShieldCheck size={12} className="text-[#00f2ff]" />
            <span>Verificación estricta de credenciales de riesgo corporativo activa</span>
          </div>

        </div>
      </div>
    </section>
  );
}
