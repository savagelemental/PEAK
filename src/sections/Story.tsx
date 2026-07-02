import React from "react";
import { ArrowUpRight } from "lucide-react";
import StoryThreeCanvas from "../components/StoryThreeCanvas";

export default function Story() {
  return (
    <section
      id="story"
      className="bg-[#0a0a0b] text-white min-h-screen flex flex-col justify-center px-6 py-24 md:py-32 relative overflow-hidden"
    >
      {/* Immersive 3D Scene covering 100% of the Story section background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <StoryThreeCanvas />
        {/* Dark radial and linear overlay masks to ensure extreme content readability and focus */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-transparent to-[#0a0a0b] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0a0a0b_95%)] opacity-85" />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 relative pointer-events-none">
        
        {/* Section Heading with high-end editorial styling */}
        <div className="mb-20 md:mb-32 pointer-events-auto">
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
            01 / LA HISTORIA DE ORIGEN
          </p>
          <div className="h-[1px] w-12 bg-[#00f2ff] mb-8" />
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[-0.04em] leading-tight max-w-4xl">
            Redefiniendo la relación entre la cognición cuántica y la materia digital.
          </h2>
        </div>
 
        {/* Asymmetrical Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start pointer-events-auto">
          
          {/* Big Editorial Lead Paragraph */}
          <div className="lg:col-span-7 space-y-10">
            <p className="font-sans font-light text-2xl sm:text-3xl text-gray-200 tracking-tight leading-relaxed">
              PEAK nació del imperativo de eliminar el ruido técnico. No somos un SaaS genérico; somos un catalizador de síntesis algorítmica profunda para entornos de altísima exigencia.
            </p>
            
            <p className="font-sans text-gray-400 text-base leading-relaxed font-light">
              Nuestra meta original consistía en diseñar un motor autónomo que no solo imitara la lógica sintáctica de los grandes modelos de lenguaje, sino que emulara el proceso de aclimatación cognitiva que un escalador de élite experimenta antes de conquistar la cima más inhóspita. Cada cálculo ejecutado por el núcleo PEAK se optimiza para resistir la volatilidad predictiva y la saturación de ruido.
            </p>
 
            <div className="pt-4">
              <a
                href="#tech"
                className="inline-flex items-center space-x-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f2ff] hover:text-white transition-colors group"
              >
                <span>EXPLORAR LA CAPA DE HARDWARE</span>
                <ArrowUpRight size={14} className="transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
 
          {/* Asymmetrical Side stats card */}
          <div className="lg:col-span-5 bg-black/45 backdrop-blur-xl border border-white/[0.04] p-8 md:p-12 rounded-sm space-y-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform translate-y-6 lg:translate-y-12">
            
            <div>
              <p className="font-mono text-[#00f2ff] text-[9px] uppercase tracking-[0.35em] mb-3">CONCIENCIA DEL CONTEXTO</p>
              <h3 className="font-sans font-black text-4xl tracking-tight mb-2">2.4M</h3>
              <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                Tokens procesados simultáneamente bajo algoritmos de atención selectiva y autogestión de memoria caché.
              </p>
            </div>
 
            <div>
              <p className="font-mono text-[#00f2ff] text-[9px] uppercase tracking-[0.35em] mb-3">ARQUITECTURA FLUIDA</p>
              <h3 className="font-sans font-black text-4xl tracking-tight mb-2">60 Hz</h3>
              <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                Tasa de actualización WebGL nativa sincronizada con el motor de físicas e interfaces reactivas.
              </p>
            </div>
 
            <div>
              <p className="font-mono text-[#00f2ff] text-[9px] uppercase tracking-[0.35em] mb-3">EFICIENCIA COGNITIVA</p>
              <h3 className="font-sans font-black text-4xl tracking-tight mb-2">99.4%</h3>
              <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
                Reducción garantizada de falsos positivos en el análisis predictivo de mercados financieros complejos.
              </p>
            </div>
 
          </div>
 
        </div>
 
        {/* Large Aesthetic Quote Section with Negatives */}
        <div className="mt-32 md:mt-48 pt-16 border-t border-white/[0.04] text-center max-w-4xl mx-auto pointer-events-auto">
          <span className="font-mono text-[60px] text-white/5 font-bold leading-none block select-none">“</span>
          <p className="font-sans font-light text-xl md:text-2xl text-gray-300 italic tracking-wide leading-relaxed -mt-6">
            La verdadera obra de arte digital no es la que despliega infinitos datos, sino la que retira todo lo innecesario hasta que solo queda la verdad cognitiva del algoritmo.
          </p>
          <p className="font-mono text-[9px] text-[#00f2ff] tracking-[0.3em] uppercase mt-6 font-bold">
            — APPLE CREATIVE STUDIO DIRECTIVE
          </p>
        </div>
 
      </div>
    </section>
  );
}
