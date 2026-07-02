import React from "react";
import { Share2, Database, ShieldCheck, Cpu, Terminal, Layers } from "lucide-react";

export default function Integrations() {
  const partners = [
    { name: "Google Cloud Vertex AI", status: "Sincronizado", icon: <Database size={18} /> },
    { name: "Hugging Face Models", status: "Sincronizado", icon: <Share2 size={18} /> },
    { name: "Amazon Web Services (AWS)", status: "Sincronizado", icon: <Layers size={18} /> },
    { name: "Nvidia TensorRT Pipeline", status: "Nativo", icon: <Cpu size={18} /> },
    { name: "Docker & Kubernetes", status: "Sincronizado", icon: <Terminal size={18} /> },
    { name: "Cloudflare Workers", status: "Sincronizado", icon: <ShieldCheck size={18} /> }
  ];

  return (
    <section
      id="integrations"
      className="bg-[#0c0c0e] text-white py-24 md:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,242,255,0.015),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Section Heading */}
        <div className="mb-20 md:mb-28 text-center max-w-3xl mx-auto">
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
            07 / ECOSISTEMA E INTEGRACIONES
          </p>
          <div className="h-[1px] w-12 bg-[#00f2ff] mx-auto mb-8" />
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[-0.04em] leading-tight">
            Compatibilidad Sin Esfuerzo<span className="text-[#00f2ff]">.</span>
          </h2>
          <p className="font-sans font-light text-gray-400 text-base md:text-lg mt-6 leading-relaxed">
            Nuestros microservicios exponen endpoints gRPC y REST ultra-rápidos que se integran con su infraestructura actual en cuestión de minutos.
          </p>
        </div>

        {/* Dynamic partners Grid with clean typography */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="bg-[#0f0f12] border border-white/[0.04] p-6 rounded-sm hover:border-white/10 hover:bg-white/[0.01] transition-all duration-300 flex items-center justify-between shadow-[0_10px_25px_rgba(0,0,0,0.3)] group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-sm text-gray-400 group-hover:text-[#00f2ff] transition-colors">
                  {partner.icon}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm text-white tracking-tight">{partner.name}</h3>
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">Ecosistema Seguro</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 bg-white/[0.02] border border-white/[0.04] px-2.5 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[8px] text-gray-400 font-bold uppercase tracking-widest">{partner.status}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
