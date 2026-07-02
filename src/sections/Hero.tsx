import React from "react";
import { ArrowRight, Cpu, HelpCircle, Activity } from "lucide-react";
import { motion } from "motion/react";
import ThreeCanvas from "../components/ThreeCanvas";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#0a0a0b] flex flex-col justify-center items-center overflow-hidden px-6 pt-24 pb-12"
    >
      {/* Background Cinematic Atmosphere Grid & Luminous Points */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,242,255,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,120,255,0.04),transparent_50%)] pointer-events-none" />
      
      {/* Immersive 3D Scene covering 100% of Hero background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto">
        <ThreeCanvas />
      </div>

      {/* Editorial Vertical Lines in the margin (representing architectural honesty) */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-white/[0.02] hidden xl:block pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-white/[0.02] hidden xl:block pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 relative pointer-events-none">
        
        {/* Left Column: High-fidelity Display Typography */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-8 lg:pr-6 pointer-events-auto">
          
          {/* Subtle Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 text-[#00f2ff] bg-[#00f2ff]/[0.06] border border-[#00f2ff]/10 rounded-full px-4 py-1.5 w-fit select-none"
          >
            <Cpu size={12} className="animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] font-medium">
              SISTEMA COGNITIVO EXCLUSIVO v3.5
            </span>
          </motion.div>

          {/* Huge Display Typography - Apple Creative Director standards */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-black text-6xl sm:text-7xl xl:text-8xl tracking-[-0.05em] leading-[0.9] text-white"
          >
            P E A K<span className="text-[#00f2ff]">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="font-sans font-light text-xl sm:text-2xl tracking-tight text-gray-300 max-w-lg leading-relaxed"
          >
            La síntesis de inteligencia cognitiva más avanzada del mundo. Un lienzo analítico con profundidad cinematográfica.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="font-sans text-sm text-gray-400 max-w-md leading-relaxed font-light"
          >
            Inspirado en la perfección suiza y las geometrías de Lusion, PEAK optimiza el procesamiento neuronal a través de un núcleo predictivo en tiempo real.
          </motion.p>

          {/* CTA Group with high-contrast luxury styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <motion.a
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0, 242, 255, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              href="#cognition"
              className="px-8 py-4 bg-white text-black hover:bg-gray-100 font-sans text-xs font-bold uppercase tracking-[0.15em] text-center transition-all duration-300 rounded-sm shadow-[0_8px_30px_rgba(255,255,255,0.08)] flex items-center justify-center gap-2"
            >
              Iniciar Cognición <ArrowRight size={14} />
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
              whileTap={{ scale: 0.98 }}
              href="#story"
              className="px-8 py-4 border border-white/10 hover:border-white/20 text-white font-sans text-xs font-bold uppercase tracking-[0.15em] text-center transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
            >
              Nuestra Historia
            </motion.a>
          </motion.div>

          {/* Core Hardware Metrics row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 1.0 }}
            className="grid grid-cols-3 gap-6 pt-10 border-t border-white/[0.04]"
          >
            <div>
              <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">NÚCLEOS COGNITIVOS</p>
              <p className="font-sans font-bold text-lg text-white mt-1">1,024 TFLOPS</p>
            </div>
            <div>
              <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">LATENCIA NATIVA</p>
              <p className="font-sans font-bold text-lg text-[#00f2ff] mt-1">&lt;0.82 ms</p>
            </div>
            <div>
              <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">FPS RENDIMIENTO</p>
              <p className="font-sans font-bold text-lg text-white mt-1">60 Hz CONST.</p>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Floating Telemetry panel layered beautifully on the background */}
        <div className="lg:col-span-5 flex flex-col justify-center items-end relative pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            className="hidden lg:flex flex-col space-y-4 bg-black/45 backdrop-blur-lg p-6 rounded-sm border border-white/[0.06] shadow-[0_30px_60px_rgba(0,0,0,0.8)] mr-12 text-left"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-ping" />
              <span className="font-mono text-[9px] tracking-widest text-[#00f2ff] uppercase font-bold">CORE v3.5 ONLINE</span>
            </div>
            <p className="font-mono text-[8px] text-gray-400 uppercase tracking-wider leading-relaxed max-w-[200px]">
              Sincronización de silicio activa. Red neuronal interactiva de baja latencia.
            </p>
            <div className="h-[1px] bg-white/5 w-full" />
            <div className="flex items-center justify-between text-[8px] font-mono text-gray-400">
              <span>ESTADO DE TRANSMISIÓN:</span>
              <span className="text-emerald-400 font-bold">ESTABLE</span>
            </div>
            <div className="flex items-center justify-between text-[8px] font-mono text-gray-400">
              <span>MÉTODO:</span>
              <span className="text-[#00f2ff] font-bold">gRPC PERSISTENTE</span>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Cinematic scroll down hint */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center space-y-1 select-none pointer-events-none">
        <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-gray-500">SCROLL DOWN</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>

    </section>
  );
}
