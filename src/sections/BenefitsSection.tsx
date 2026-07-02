import React from "react";
import { Zap, ShieldAlert, Heart, Code, Sparkles, Sliders } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <Zap className="text-[#00f2ff]" size={20} />,
      title: "Latencia Sub-milisegundo",
      description: "Nuestra red neuronal se compila directamente en silicio virtual, alcanzando tiempos de respuesta récord menores a 0.82 milisegundos por inferencia cognitiva."
    },
    {
      icon: <ShieldAlert className="text-[#00f2ff]" size={20} />,
      title: "Mitigación Extrema de Riesgo",
      description: "Integración nativa de filtros de Drawdown estricto inspirados en la disciplina suiza y la aclimatación de alta montaña. Cuidamos tu capital como a la vida."
    },
    {
      icon: <Sparkles className="text-[#00f2ff]" size={20} />,
      title: "Claridad Cinematográfica",
      description: "Toda la información compleja se presenta a través de interfaces minimalistas de primer nivel que reducen la fatiga visual y facilitan decisiones rápidas."
    },
    {
      icon: <Code className="text-[#00f2ff]" size={20} />,
      title: "Optimización Lighthouse 95+",
      description: "Código diseñado por ingenieros frontend expertos con Lazy Loading, Code Splitting y optimización de renderizado para cargar instantáneamente."
    },
    {
      icon: <Heart className="text-[#00f2ff]" size={20} />,
      title: "0% Estrés de Operación",
      description: "Deja que el piloto automático inteligente gestione la volatilidad por ti, eliminando las decisiones impulsivas y el desgaste mental diario."
    },
    {
      icon: <Sliders className="text-[#00f2ff]" size={20} />,
      title: "Afinación Personalizada",
      description: "Toma el control absoluto de la entropía de tu modelo. Desde configuraciones ultra-conservadoras hasta predicciones altamente creativas."
    }
  ];

  return (
    <section
      id="benefits"
      className="bg-[#0c0c0e] text-white py-24 md:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,242,255,0.02),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Section Heading */}
        <div className="mb-20 md:mb-28 text-center max-w-3xl mx-auto">
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
            04 / BENEFICIOS PRINCIPALES
          </p>
          <div className="h-[1px] w-12 bg-[#00f2ff] mx-auto mb-8" />
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[-0.04em] leading-tight">
            Diseñado para la Excelencia Absoluta<span className="text-[#00f2ff]">.</span>
          </h2>
          <p className="font-sans font-light text-gray-400 text-base md:text-lg mt-6 leading-relaxed">
            Eliminamos la complejidad técnica innecesaria. Cada beneficio se ha pulido con la precisión de un relojero suizo para entregarte pureza operacional.
          </p>
        </div>

        {/* Benefits Grid - Apple/Stripe Elegant Bento-like style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-[#0f0f12] border border-white/[0.04] p-8 rounded-sm hover:border-white/10 transition-all duration-300 flex flex-col justify-between group shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
            >
              <div className="space-y-6">
                <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-sm w-fit transition-all duration-300 group-hover:bg-[#00f2ff]/[0.05] group-hover:border-[#00f2ff]/20">
                  {benefit.icon}
                </div>
                <h3 className="font-sans font-bold text-lg text-white group-hover:text-[#00f2ff] transition-colors">
                  {benefit.title}
                </h3>
                <p className="font-sans font-light text-gray-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Elegant index tag */}
              <div className="pt-8 flex justify-end">
                <span className="font-mono text-[10px] text-gray-600 font-bold">
                  // {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
