import React from "react";

export default function Testimonials() {
  const reviews = [
    {
      quote: "PEAK no es un juguete de chat. Es una herramienta matemática extremadamente seria que cambió para siempre la forma en que auditamos nuestras transacciones algorítmicas de alto riesgo.",
      author: "Marc-André Girard",
      title: "Director de Algoritmos, Geneva Capital Trust"
    },
    {
      quote: "La atención al detalle tipográfico y la latencia sub-milisegundo se sienten más como hardware aeroespacial que como una aplicación de software. Simplemente extraordinario.",
      author: "Elena Rostova",
      title: "Arquitecta de Sistemas Principales, BioTech Zurich Institute"
    }
  ];

  return (
    <section
      id="testimonials"
      className="bg-[#0c0c0e] text-white py-24 md:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Section Heading */}
        <div className="mb-20 md:mb-28 text-center max-w-3xl mx-auto">
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
            09 / OPINIONES DE NUESTROS CLIENTES
          </p>
          <div className="h-[1px] w-12 bg-[#00f2ff] mx-auto mb-8" />
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[-0.04em] leading-tight">
            Validado por Líderes de la Industria<span className="text-[#00f2ff]">.</span>
          </h2>
        </div>

        {/* Testimonials Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-[#0f0f12] border border-white/[0.04] p-8 md:p-12 rounded-sm flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.5)]"
            >
              <div className="space-y-6">
                <span className="font-mono text-[45px] text-[#00f2ff]/10 font-bold leading-none block select-none">“</span>
                <p className="font-sans font-light text-lg md:text-xl text-gray-300 italic leading-relaxed -mt-4">
                  {review.quote}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between">
                <div>
                  <h4 className="font-sans font-bold text-sm text-white tracking-tight">{review.author}</h4>
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">{review.title}</p>
                </div>
                <span className="font-mono text-[9px] text-[#00f2ff] tracking-[0.2em] uppercase font-bold">VERIFICADO</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
