import React, { useState } from "react";
import { ArrowUpRight, TrendingUp, Cpu, HeartPulse, ShieldAlert } from "lucide-react";

export default function CaseStudies() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cases = [
    {
      icon: <TrendingUp size={24} className="text-[#00f2ff]" />,
      category: "FINANZAS CUÁNTICAS",
      title: "Arbitraje Predictivo de Alta Frecuencia",
      description: "Implementación en fondos suizos de inversión soberana. PEAK estabilizó la toma de decisiones en momentos de máxima volatilidad de tasas de interés de la Fed, reduciendo la exposición al riesgo en un 89.4%.",
      impact: "+24.8% Eficiencia de Cartera",
      metric: "0.82ms Latencia"
    },
    {
      icon: <HeartPulse size={24} className="text-[#00f2ff]" />,
      category: "BIOTECNOLOGÍA COMPUTACIONAL",
      title: "Simulación de Plegamiento de Proteínas",
      description: "Optimización de simulaciones moleculares complejas en laboratorios farmacéuticos de Ginebra. Nuestro motor redujo el tiempo de procesamiento de supercomputadoras de semanas a horas.",
      impact: "94x Reducción de Tiempo",
      metric: "99.9% Precisión"
    },
    {
      icon: <Cpu size={24} className="text-[#00f2ff]" />,
      category: "DEEP LOGISTICS",
      title: "Piloto Autónomo de Cadenas de Suministro",
      description: "Sistemas cognitivos de planeación de rutas para consorcios logísticos intercontinentales, re-calculando flujos terrestres y marítimos de forma proactiva ante contingencias geopolíticas.",
      impact: "-31% Costo Operativo",
      metric: "12M Decisiones/seg"
    }
  ];

  return (
    <section
      id="case-studies"
      className="bg-[#0a0a0b] text-white py-24 md:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Section Heading */}
        <div className="mb-20 md:mb-28">
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
            06 / CASOS DE ESTUDIO INDUSTRIAL
          </p>
          <div className="h-[1px] w-12 bg-[#00f2ff] mb-8" />
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[-0.04em] leading-tight max-w-4xl">
            Soluciones cognitivas probadas en entornos de máxima exigencia analítica.
          </h2>
        </div>

        {/* Industrial Scenarios Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cases.map((cs, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="bg-[#0f0f12] border border-white/[0.04] p-8 rounded-sm hover:border-white/10 transition-all duration-500 flex flex-col justify-between group shadow-[0_20px_45px_rgba(0,0,0,0.5)] relative overflow-hidden h-[450px]"
            >
              {/* Kinetic color overlay when hovered */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr from-[#00f2ff]/[0.02] to-transparent pointer-events-none transition-opacity duration-500 ${
                  hoveredIndex === idx ? "opacity-100" : "opacity-0"
                }`}
              />

              <div className="space-y-8 z-10 relative">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-sm">
                    {cs.icon}
                  </div>
                  <span className="font-mono text-[9px] text-[#00f2ff] uppercase tracking-[0.25em] font-bold">
                    {cs.category}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-sans font-bold text-2xl tracking-tight text-white leading-tight">
                    {cs.title}
                  </h3>
                  <p className="font-sans font-light text-gray-400 text-sm leading-relaxed">
                    {cs.description}
                  </p>
                </div>

              </div>

              {/* Bottom statistics panel */}
              <div className="border-t border-white/[0.04] pt-6 flex items-center justify-between z-10 relative">
                <div>
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">IMPACTO PROBADO</p>
                  <p className="font-sans text-xs text-white font-bold uppercase mt-1">{cs.impact}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">MÉTRICA CLAVE</p>
                  <p className="font-sans text-xs text-[#00f2ff] font-bold uppercase mt-1 text-right">{cs.metric}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
