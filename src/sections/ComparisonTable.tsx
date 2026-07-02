import React from "react";
import { Check, X } from "lucide-react";

export default function ComparisonTable() {
  const specs = [
    { name: "Velocidad de Inferencia promedio", standard: "80ms - 150ms (Reactivo)", peak: "<0.82ms (Soberano)", advantage: true },
    { name: "Pérdida de Información / Alucinación", standard: "Hasta el 4.2% (Riesgo alto)", peak: "<0.12% (Filtro selectivo)", advantage: true },
    { name: "Capacidad de Planificación Multi-Paso", standard: "Inexistente o lineal simple", peak: "Bucles ReAct auto-correctivos", advantage: true },
    { name: "Gestión de Riesgos Heurística (Stop Loss)", standard: "Manual y desconectado", peak: "Automatización Militar activa", advantage: true },
    { name: "Auto-calibración de Entropía en Caliente", standard: "No disponible (estático)", peak: "Ajustable en vivo (dinámico)", advantage: true },
    { name: "Canal de Comunicación y Latencia", standard: "Consultas HTTP REST estándar", peak: "Canal gRPC nativo bidireccional", advantage: true },
  ];

  return (
    <section
      id="comparison"
      className="bg-[#0a0a0b] text-white py-24 md:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Section Heading */}
        <div className="mb-20 md:mb-28 text-center max-w-3xl mx-auto">
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
            08 / COMPARATIVA TECNOLÓGICA
          </p>
          <div className="h-[1px] w-12 bg-[#00f2ff] mx-auto mb-8" />
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[-0.04em] leading-tight">
            Benchmarks de Inferencia<span className="text-[#00f2ff]">.</span>
          </h2>
          <p className="font-sans font-light text-gray-400 text-base md:text-lg mt-6 leading-relaxed">
            Compara de manera objetiva las especificaciones del núcleo PEAK contra los modelos tradicionales de inteligencia del sector.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="max-w-4xl mx-auto bg-[#0f0f12] border border-white/[0.04] rounded-sm overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#131317] border-b border-white/[0.04] text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">
                  <th className="p-6">ESPECIFICACIÓN DE AGENTE</th>
                  <th className="p-6">AGENTE REACTIVO (BÁSICO)</th>
                  <th className="p-6 text-[#00f2ff]">NÚCLEO SOBERANO (NIVEL 4 ÉLITE)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-sans text-xs">
                {specs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-6 font-bold text-gray-200">{spec.name}</td>
                    <td className="p-6 text-gray-500 font-light">{spec.standard}</td>
                    <td className="p-6 text-[#00f2ff] font-bold bg-[#00f2ff]/[0.01]">
                      <div className="flex items-center space-x-2">
                        <Check size={14} className="text-[#00f2ff] shrink-0" />
                        <span>{spec.peak}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
