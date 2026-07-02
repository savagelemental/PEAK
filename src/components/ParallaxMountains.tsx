import React, { useState, useEffect } from "react";
import { ChevronDown, ArrowUpRight, TrendingUp } from "lucide-react";

export default function ParallaxMountains() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calcular desplazamientos para lograr el efecto Parallax
  // Las capas más cercanas se mueven más rápido (mayor multiplicador)
  // Las capas más lejanas se mueven más lento
  const skyY = scrollY * 0.05;
  const sunY = scrollY * 0.12;
  const peakY = scrollY * 0.22;       // La cumbre nevada se desplaza sutilmente
  const midPeakY = scrollY * 0.42;    // Capa de glaciares intermedia
  const forestY = scrollY * 0.65;     // Colinas medias
  const foregroundY = scrollY * 0.88; // Primer plano se desplaza rápido

  // Controlar opacidad de elementos fijos para desvanecerse al bajar
  const heroTextOpacity = Math.max(0, 1 - scrollY / 450);
  const heroTextY = scrollY * 0.35;

  return (
    <div
      id="parallax-hero-section"
      className="relative w-full h-[95vh] min-h-[600px] overflow-hidden bg-[#0a0a0b] select-none"
    >
      {/* CAPA 0: CIELO Y GRADIENTE DE SOL / LUNA ANDINA (Atrás de todo) */}
      <div
        className="absolute inset-0 w-full h-[120%] pointer-events-none"
        style={{
          transform: `translateY(${skyY}px)`,
          backgroundImage: "linear-gradient(to bottom, #0a0a0b 0%, #121214 40%, #1e1e22 70%, #2a2a30 100%)",
        }}
      />

      {/* RESPLANDOR DE LUZ ANDINA SOBRIA */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[18%] w-[250px] md:w-[350px] aspect-square rounded-full pointer-events-none opacity-60 mix-blend-screen"
        style={{
          transform: `translate3d(-50%, ${sunY}px, 0)`,
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(148,163,184,0.3) 35%, rgba(255,255,255,0) 70%)",
          filter: "blur(15px)",
        }}
      />

      {/* TEXTO HERO SUPERPUESTO (Sube flotando y se desvanece al hacer scroll) */}
      <div
        className="absolute inset-x-0 top-[22%] z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
        style={{
          opacity: heroTextOpacity,
          transform: `translateY(${heroTextY}px)`,
        }}
      >
        <span className="font-mono text-xs md:text-sm tracking-[0.4em] uppercase text-gray-400 bg-white/5 px-4 py-1.5 rounded-sm border border-white/10 flex items-center gap-1.5 mb-4">
          <TrendingUp size={14} className="animate-pulse" /> ANDEAN TRADING EXCELLENCE
        </span>
        <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase italic">
          Domina la <br className="md:hidden" />
          <span className="text-transparent" style={{ WebkitTextStroke: "1px white" }}>
            Cumbre
          </span>
        </h1>
        <p className="mt-4 font-sans text-sm md:text-base text-gray-400 max-w-lg md:max-w-xl mx-auto font-light leading-relaxed">
          Domina los mercados con la precisión de depredadores de alta montaña. Nuestra academia provee el oxígeno técnico para sobrevivir en los climas financieros más volátiles del mundo.
        </p>

        {/* Pequeña indicación de scroll */}
        <div className="mt-12 animate-bounce flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">Desliza para escalar</span>
          <ChevronDown size={18} className="text-white" />
        </div>
      </div>

      {/* RAYAS DE ACCIÓN DE MERCADO DECORATIVAS EN ESCALA DE GRISES PREMIUM */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none opacity-5"
        style={{ transform: `translateY(${skyY}px)` }}
      >
        <svg className="w-full h-full">
          <path d="M 0,200 L 200,180 L 400,240 L 600,150 L 800,220 L 1000,100 L 1200,190 L 1500,80 L 1920,130" fill="none" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 0,400 L 300,320 L 600,380 L 900,260 L 1200,340 L 1500,210 L 1920,290" fill="none" stroke="#ffffff" strokeWidth="1" />
        </svg>
      </div>

      {/* ==================== CAPAS DE MONTAÑAS PARALLAX ==================== */}

      {/* CAPA 1: CUMBRE NEVADA DE LOS ANDES (Más lejana) */}
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-[65%] min-h-[400px] pointer-events-none overflow-visible"
        style={{ transform: `translateY(${peakY}px)` }}
      >
        <defs>
          <linearGradient id="andesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1c" />
            <stop offset="100%" stopColor="#0a0a0b" />
          </linearGradient>
          <linearGradient id="snowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a1a1aa" />
          </linearGradient>
        </defs>

        {/* Silueta Base de las Montañas Altas */}
        <path
          d="M 0 600 L 0 250 L 150 180 L 320 280 L 480 120 L 650 220 L 820 90 L 1020 230 L 1220 110 L 1440 220 L 1440 600 Z"
          fill="url(#andesGradient)"
        />

        {/* Cimas Nevadas (Puntas blancas de los Andes al estilo Elegant Dark) */}
        <path d="M 150 180 L 100 203 L 130 215 L 150 210 L 170 218 L 200 203 Z" fill="url(#snowGradient)" opacity="0.9" />
        <path d="M 480 120 L 410 155 L 450 170 L 480 162 L 510 172 L 550 155 Z" fill="url(#snowGradient)" opacity="0.9" />
        <path d="M 820 90 L 740 140 L 780 152 L 820 145 L 860 156 L 900 140 Z" fill="url(#snowGradient)" opacity="0.9" />
        <path d="M 1220 110 L 1160 143 L 1195 152 L 1220 148 L 1245 153 L 1280 143 Z" fill="url(#snowGradient)" opacity="0.9" />
      </svg>

      {/* CAPA 2: GLACIARES INTERMEDIOS */}
      <svg
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-[55%] min-h-[350px] pointer-events-none overflow-visible"
        style={{ transform: `translateY(${midPeakY}px)` }}
      >
        <defs>
          <linearGradient id="glacierGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#252529" />
            <stop offset="100%" stopColor="#0a0a0b" />
          </linearGradient>
        </defs>
        <path
          d="M 0 500 L 0 310 L 110 260 L 260 330 L 400 210 L 590 320 L 720 180 L 910 320 L 1120 220 L 1310 310 L 1440 240 L 1440 500 Z"
          fill="url(#glacierGradient)"
          opacity="0.95"
        />
        {/* Niebla andina elegante */}
        <ellipse cx="650" cy="400" rx="400" ry="60" fill="#18181b" opacity="0.2" filter="blur(20px)" />
      </svg>

      {/* CAPA 3: COLINAS MEDIAS CON DETALLES DE LINEAS ALCISTAS */}
      <svg
        viewBox="0 0 1440 450"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-[45%] min-h-[280px] pointer-events-none overflow-visible"
        style={{ transform: `translateY(${forestY}px)` }}
      >
        <defs>
          <linearGradient id="hillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#333338" />
            <stop offset="100%" stopColor="#0a0a0b" />
          </linearGradient>
        </defs>
        <path
          d="M 0 450 L 0 360 L 180 290 L 380 370 L 550 250 L 780 360 L 980 230 L 1200 340 L 1440 250 L 1440 450 Z"
          fill="url(#hillGradient)"
        />
        <path
          d="M 0 360 L 180 290 L 380 370 L 550 250 L 780 360 L 980 230 L 1200 340 L 1440 250"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.75"
          opacity="0.15"
        />
      </svg>

      {/* CAPA 4: PRIMER PLANO (Mezcla perfecta con el color de fondo de la página #0a0a0b) */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        className="absolute bottom-[-1px] left-0 w-full h-[35%] min-h-[220px] pointer-events-none overflow-visible z-20"
        style={{ transform: `translateY(${foregroundY}px)` }}
      >
        <defs>
          <linearGradient id="foregroundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="40%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#0a0a0b" />
          </linearGradient>
        </defs>
        <path
          d="M 0 400 L 0 350 C 150 330, 250 380, 420 340 C 600 300, 750 360, 950 310 C 1150 260, 1300 330, 1440 290 L 1440 400 Z"
          fill="url(#foregroundGradient)"
        />
      </svg>

      {/* Gradiente oscuro inferior para asegurar que la transición de color sea 100% suave al fondo #0a0a0b */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0a0a0b] to-transparent z-20 pointer-events-none" />
    </div>
  );
}
