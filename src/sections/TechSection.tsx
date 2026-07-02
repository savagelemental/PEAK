import React, { useState, useEffect, useRef } from "react";
import { Sliders, RefreshCw, Layers, ShieldCheck, Zap } from "lucide-react";
import TechThreeCanvas from "../components/TechThreeCanvas";

export default function TechSection() {
  const [entropy, setEntropy] = useState(0.45);
  const [synapticSpeed, setSynapticSpeed] = useState(0.65);
  const [feedbackLoops, setFeedbackLoops] = useState(4);
  const [activeLayer, setActiveLayer] = useState<"attention" | "projection" | "weights">("attention");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live Canvas Rendering simulating quantum synaptic waves based on the interactive sliders!
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background cybernetic nodes
      ctx.strokeStyle = "rgba(0, 242, 255, 0.04)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw neural signal waves
      ctx.lineWidth = 1.5;
      const centerY = canvas.height / 2;

      for (let waveIdx = 0; waveIdx < feedbackLoops; waveIdx++) {
        ctx.beginPath();
        const waveColorOpacity = 0.15 + (waveIdx / feedbackLoops) * 0.45;
        ctx.strokeStyle = `rgba(0, 242, 255, ${waveColorOpacity})`;

        for (let x = 0; x < canvas.width; x++) {
          const frequency = 0.005 + (waveIdx * 0.002) + (entropy * 0.01);
          const amplitude = 40 + (waveIdx * 15) * synapticSpeed;
          
          // Math wave modeling
          const y = centerY + Math.sin(x * frequency + phase + waveIdx * 1.5) * amplitude * Math.cos(x * 0.002);
          
          if (x === 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw active floating pulses representing synaptic calculations
      ctx.fillStyle = "#ffffff";
      for (let pulse = 0; pulse < 5; pulse++) {
        const pulseX = ((phase * 80 + pulse * 140) % canvas.width);
        const frequency = 0.005 + (entropy * 0.01);
        const amplitude = 40 + synapticSpeed * 30;
        const pulseY = centerY + Math.sin(pulseX * frequency + phase) * amplitude * Math.cos(pulseX * 0.002);
        
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.shadowColor = "#00f2ff";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      }

      phase += 0.02 * synapticSpeed;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Responsive setup
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 300;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [entropy, synapticSpeed, feedbackLoops]);

  return (
    <section
      id="tech"
      className="bg-[#0c0c0e] text-white py-24 md:py-32 px-6 relative overflow-hidden"
    >
      {/* Immersive 3D Scene covering 100% of the Tech section background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <TechThreeCanvas entropy={entropy} synapticSpeed={synapticSpeed} feedbackLoops={feedbackLoops} />
        {/* Dark overlays to maintain content readability and contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0e] via-transparent to-[#0c0c0e] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0c0c0e_95%)] opacity-85" />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 relative pointer-events-none">
        
        {/* Section Heading */}
        <div className="mb-16 md:mb-24 pointer-events-auto">
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
            02 / MOTOR DE COGNICIÓN
          </p>
          <div className="h-[1px] w-12 bg-[#00f2ff] mb-8" />
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[-0.04em] leading-none">
            Tecnología Sináptica Avanzada<span className="text-[#00f2ff]">.</span>
          </h2>
          <p className="font-sans font-light text-gray-400 text-base md:text-lg max-w-2xl mt-6 leading-relaxed">
            Manipula los parámetros neuronales del motor cuántico en tiempo real. Observa cómo responde la modulación de ondas del Núcleo Cognitivo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch pointer-events-none">
          
          {/* Interactive Control Console (Apple Inspired Minimalist Sliders) */}
          <div className="lg:col-span-4 bg-black/45 backdrop-blur-xl border border-white/[0.04] p-8 rounded-sm flex flex-col justify-between space-y-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
            
            <div>
              <div className="flex items-center space-x-2 text-white mb-6">
                <Sliders size={16} className="text-[#00f2ff]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Consola de Afinación</span>
              </div>

              {/* Entropy Control */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-[11px] font-bold uppercase tracking-widest text-gray-400">Entropía Cognitiva</label>
                  <span className="font-mono text-xs text-[#00f2ff] font-bold">{entropy.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={entropy}
                  onChange={(e) => setEntropy(parseFloat(e.target.value))}
                  className="w-full accent-[#00f2ff] bg-white/10 rounded-sm h-[3px] appearance-none cursor-pointer"
                />
                <p className="font-sans text-[9px] text-gray-500 font-light">Controla el grado de originalidad y dispersión analítica del modelo.</p>
              </div>

              {/* Synaptic Speed Control */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-[11px] font-bold uppercase tracking-widest text-gray-400">Velocidad de Sinapsis</label>
                  <span className="font-mono text-xs text-[#00f2ff] font-bold">{(synapticSpeed * 100).toFixed(0)} MHz</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.8"
                  step="0.05"
                  value={synapticSpeed}
                  onChange={(e) => setSynapticSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#00f2ff] bg-white/10 rounded-sm h-[3px] appearance-none cursor-pointer"
                />
                <p className="font-sans text-[9px] text-gray-500 font-light">Determina la frecuencia de reloj del procesamiento de inferencias.</p>
              </div>

              {/* Feedback Loops Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-[11px] font-bold uppercase tracking-widest text-gray-400">Bucles de Retroalimentación</label>
                  <span className="font-mono text-xs text-[#00f2ff] font-bold">{feedbackLoops} Capas</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={feedbackLoops}
                  onChange={(e) => setFeedbackLoops(parseInt(e.target.value))}
                  className="w-full accent-[#00f2ff] bg-white/10 rounded-sm h-[3px] appearance-none cursor-pointer"
                />
                <p className="font-sans text-[9px] text-gray-500 font-light">Número de interconexiones recurrentes de auto-corrección analítica.</p>
              </div>
            </div>

            {/* Diagnostics Telemetry bar */}
            <div className="pt-6 border-t border-white/[0.04] space-y-3">
              <div className="flex items-center justify-between font-mono text-[9px] text-gray-500 tracking-wider">
                <span>ESTADO EN TIEMPO REAL:</span>
                <span className="text-[#00f2ff] font-bold">OPTIMAL COMPILATION</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-[#00f2ff] h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (entropy + synapticSpeed + feedbackLoops / 8) * 45)}%` }}
                />
              </div>
            </div>

          </div>

          {/* Interactive Live Mathematical Canvas representation of Synaptic Wave */}
          <div className="lg:col-span-8 bg-black/45 backdrop-blur-xl border border-white/[0.04] p-4 md:p-8 rounded-sm relative flex flex-col justify-between overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)] pointer-events-auto">
            
            {/* Visual Header */}
            <div className="flex items-center justify-between z-10 relative mb-4">
              <div className="flex items-center space-x-3">
                <Layers size={14} className="text-gray-400" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">Ondas Sinápticas Quantum</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-ping" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#00f2ff]">TELEMETRÍA 60 FPS</span>
              </div>
            </div>

            {/* Pure Live Canvas container */}
            <div className="flex-grow min-h-[250px] relative">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            </div>

            {/* Quick action buttons for different active telemetry layers */}
            <div className="grid grid-cols-3 gap-3 mt-4 z-10 relative">
              <button
                type="button"
                onClick={() => {
                  setActiveLayer("attention");
                  setEntropy(0.35);
                  setSynapticSpeed(0.9);
                  setFeedbackLoops(6);
                }}
                className={`py-3 px-4 rounded-sm border transition-all text-center ${
                  activeLayer === "attention"
                    ? "border-[#00f2ff] bg-[#00f2ff]/[0.05] text-white"
                    : "border-white/5 hover:border-white/10 text-gray-500 hover:text-gray-300"
                }`}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] font-bold">Atención Selectiva</p>
                <p className="text-[10px] font-sans mt-0.5">Preset Filtro</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveLayer("projection");
                  setEntropy(0.85);
                  setSynapticSpeed(0.4);
                  setFeedbackLoops(2);
                }}
                className={`py-3 px-4 rounded-sm border transition-all text-center ${
                  activeLayer === "projection"
                    ? "border-[#00f2ff] bg-[#00f2ff]/[0.05] text-white"
                    : "border-white/5 hover:border-white/10 text-gray-500 hover:text-gray-300"
                }`}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] font-bold">Proyección Cuántica</p>
                <p className="text-[10px] font-sans mt-0.5">Preset Entrópico</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveLayer("weights");
                  setEntropy(0.5);
                  setSynapticSpeed(1.4);
                  setFeedbackLoops(8);
                }}
                className={`py-3 px-4 rounded-sm border transition-all text-center ${
                  activeLayer === "weights"
                    ? "border-[#00f2ff] bg-[#00f2ff]/[0.05] text-white"
                    : "border-white/5 hover:border-white/10 text-gray-500 hover:text-gray-300"
                }`}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] font-bold">Matriz de Pesos</p>
                <p className="text-[10px] font-sans mt-0.5">Inferencia Rápida</p>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
