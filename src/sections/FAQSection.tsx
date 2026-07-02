import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "¿Cómo se clasifican los niveles de los agentes autónomos en PEAK?",
      a: "Definimos cuatro niveles de madurez tecnológica de IA online: el Nivel 1 (Reactivo) maneja monitoreo simple de eventos web y webhooks; el Nivel 2 (Contextual) implementa síntesis y memoria semántica mediante RAG vectorial; el Nivel 3 (Heurístico) orquesta planificación multi-paso, auto-corrección y toma de decisiones tácticas; y el Nivel 4 (Núcleo Soberano) otorga total autonomía operativa de baja latencia con compilación en silicio virtual."
    },
    {
      q: "¿Es PEAK una Inteligencia Artificial con conciencia?",
      a: "No. PEAK es un motor de procesamiento cognitivo de alta fidelidad. Aunque simula cadenas lógicas de auto-corrección sináptica complejas similares al razonamiento biológico, opera bajo un sistema estrictamente matemático, determinista y seguro."
    },
    {
      q: "¿Cómo se alcanza una latencia menor a 0.82 ms?",
      a: "Se logra compilando los grafos de cómputo directamente a silicio optimizado y eliminando la sobrecarga de solicitudes HTTP tradicionales mediante canales gRPC bidireccionales persistentes respaldados por el pipeline de renderizado de alto rendimiento."
    },
    {
      q: "¿Qué sucede si no cuento con una API Key de Gemini?",
      a: "La interfaz gráfica, la simulación física WebGL y los modeladores seguirán funcionando plenamente en modo local. La terminal interactiva de chat simulará respuestas coherentes offline para que puedas probar la experiencia interactiva sin interrupciones."
    },
    {
      q: "¿La plataforma admite integraciones con otros lenguajes de programación?",
      a: "Sí. Ofrecemos SDKs nativos totalmente documentados y probados para C++, Rust, Python, Go y TypeScript, garantizando una transferencia de datos de alto rendimiento."
    }
  ];

  return (
    <section
      id="faq"
      className="bg-[#0a0a0b] text-white py-24 md:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-4xl mx-auto w-full z-10 relative">
        
        {/* Section Heading */}
        <div className="mb-20 md:mb-24 text-center">
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
            10 / PREGUNTAS FRECUENTES
          </p>
          <div className="h-[1px] w-12 bg-[#00f2ff] mx-auto mb-8" />
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[-0.04em] leading-tight">
            Resolución de Dudas<span className="text-[#00f2ff]">.</span>
          </h2>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#0f0f12] border border-white/[0.04] rounded-sm overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-sans font-bold text-base text-white hover:text-[#00f2ff] transition-colors"
                >
                  <span className="tracking-tight">{faq.q}</span>
                  {isOpen ? <Minus size={16} className="text-[#00f2ff]" /> : <Plus size={16} className="text-gray-500" />}
                </button>

                {isOpen && (
                  <div className="p-6 pt-0 border-t border-white/[0.02] font-sans font-light text-sm text-gray-400 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
