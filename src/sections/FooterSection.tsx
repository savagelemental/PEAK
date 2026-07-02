import React from "react";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0b] text-white py-16 md:py-24 px-6 relative border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto w-full z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Logo brand */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-7 h-7 bg-white rounded-sm">
                <div className="w-3.5 h-3.5 bg-[#0a0a0b]" />
              </div>
              <span className="font-sans font-black text-lg tracking-[-0.08em] uppercase text-white">
                PEAK
              </span>
            </div>
            <p className="font-sans font-light text-sm text-gray-400 max-w-sm leading-relaxed">
              La obra de arte definitiva en síntesis cognitiva. Diseñado con rigor matemático y elegancia cinematográfica suiza.
            </p>
          </div>

          {/* Column Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">NAVEGACIÓN</h4>
            <div className="flex flex-col space-y-2.5 font-sans text-xs text-gray-400">
              <a href="#story" className="hover:text-white transition-colors">La Historia</a>
              <a href="#tech" className="hover:text-white transition-colors">Tecnología</a>
              <a href="#workflow" className="hover:text-white transition-colors">Proceso</a>
              <a href="#cognition" className="hover:text-white transition-colors">Cognición AI</a>
            </div>
          </div>

          {/* Column Legal / Philosophy */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">FILOSOFÍA DE MARCA</h4>
            <p className="font-sans font-light text-xs text-gray-400 leading-relaxed">
              “La simplicidad es la máxima sofisticación.” Retiramos cada línea de código innecesaria y cada adorno innecesario hasta que solo queda el núcleo intelectual.
            </p>
          </div>

        </div>

        {/* Closing Signature bar */}
        <div className="border-t border-white/[0.04] mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] text-gray-600 tracking-wider">
          <p>© {currentYear} PEAK COGNITIVE INC. TODOS LOS DERECHOS RESERVADOS.</p>
          <p className="uppercase text-right">DISEÑADO // DESARROLLADO POR GUSTAVO GONZALEZ PWR GOOGLE</p>
        </div>

      </div>
    </footer>
  );
}
