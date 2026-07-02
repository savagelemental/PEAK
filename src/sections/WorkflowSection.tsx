import React, { useState } from "react";
import { ChevronRight, Cpu, Network, Shield, Eye, ArrowRight } from "lucide-react";

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Nivel 1: Agente Reactivo (Básico)",
      subtitle: "Observación de Eventos Web",
      description: "El nivel fundamental de autonomía. Monitorea feeds de datos, páginas web y APIs en tiempo real para reaccionar a cambios de estado instantáneos y activar webhooks básicos sin intervención humana.",
      tech: "Suscripción a Webhooks / Polling de Redux / WebSockets",
      icon: <Eye size={20} className="text-[#00f2ff]" />
    },
    {
      title: "Nivel 2: Agente Contextual (Intermedio)",
      subtitle: "Síntesis y Memoria Semántica",
      description: "Agentes capaces de unificar y destilar información de múltiples fuentes concurrentes. Emplean memoria de contexto persistente y bases de datos vectoriales (RAG) para ofrecer respuestas coherentes con fundamento histórico.",
      tech: "Bases Vectoriales RAG / Embeddings Dinámicos / Context Caching",
      icon: <Network size={20} className="text-[#00f2ff]" />
    },
    {
      title: "Nivel 3: Agente Heurístico (Avanzado)",
      subtitle: "Planificación Multi-Paso",
      description: "Sistemas dotados de bucles de razonamiento (Chain-of-Thought) y ejecución en cascada. Evalúan múltiples caminos de acción, ponderan riesgos con severidad militar (Stop Loss heurístico) y coordinan sub-agentes subordinados de forma autónoma.",
      tech: "Planificación ReAct / Heurísticas de Mitigación de Ruido",
      icon: <Shield size={20} className="text-[#00f2ff]" />
    },
    {
      title: "Nivel 4: Núcleo Soberano (Élite)",
      subtitle: "Autonomía Cuántica Determinista",
      description: "La cúspide del desarrollo agentico. Agentes dotados de soberanía operacional de baja latencia compilados para actuar a nivel de microsegundos, autogestionando sus recursos neuronales y adaptando su entropía de forma dinámica.",
      tech: "Inferencia gRPC / Compilador de Silicio Virtual / WebGL Core",
      icon: <Cpu size={20} className="text-[#00f2ff]" />
    }
  ];

  return (
    <section
      id="workflow"
      className="bg-[#0a0a0b] text-white py-24 md:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Section Heading */}
        <div className="mb-20 md:mb-32">
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
            03 / ESCALA DE AUTONOMA AGÉNTICA
          </p>
          <div className="h-[1px] w-12 bg-[#00f2ff] mb-8" />
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[-0.04em] leading-tight max-w-4xl">
            La evolución de los agentes autónomos online, desde lo básico a la soberanía cognitiva.
          </h2>
        </div>

        {/* Workflow Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Vertical Step Navigator (Apple/Stripe Inspired Minimalist tabs) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {steps.map((step, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`text-left p-6 rounded-sm border transition-all duration-300 flex items-center justify-between group ${
                  activeStep === idx
                    ? "bg-[#0f0f12] border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
                    : "bg-transparent border-transparent hover:border-white/[0.04] opacity-50 hover:opacity-80"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className={`font-mono text-xs font-bold ${activeStep === idx ? "text-[#00f2ff]" : "text-gray-500"}`}>
                    0{idx + 1}
                  </span>
                  <div>
                    <p className={`font-sans font-bold text-sm tracking-tight ${activeStep === idx ? "text-white" : "text-gray-400"}`}>
                      {step.title}
                    </p>
                    <p className="font-sans text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className={`transform transition-transform duration-300 ${
                    activeStep === idx ? "text-[#00f2ff] translate-x-1" : "text-gray-600 group-hover:translate-x-0.5"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Step Detail Panel (high negative space, massive aesthetic typography) */}
          <div className="lg:col-span-7 bg-[#0f0f12] border border-white/[0.04] p-8 md:p-16 rounded-sm min-h-[400px] flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
            
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-[#00f2ff]/[0.06] rounded-sm border border-[#00f2ff]/10">
                  {steps[activeStep].icon}
                </div>
                <div>
                  <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-widest font-bold">Fase Operativa Activa</p>
                  <p className="font-sans text-[11px] text-gray-400 font-light uppercase tracking-wider">{steps[activeStep].subtitle}</p>
                </div>
              </div>

              <h3 className="font-sans font-black text-2xl sm:text-3xl tracking-tight text-white leading-tight">
                {steps[activeStep].title}
              </h3>

              <p className="font-sans font-light text-gray-300 text-base leading-relaxed">
                {steps[activeStep].description}
              </p>
            </div>

            {/* Diagnostic/Hardware stamp on bottom of detail card */}
            <div className="pt-10 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">TECNOLOGÍA REQUERIDA</p>
                <p className="font-sans text-xs text-[#00f2ff] font-bold uppercase mt-1">{steps[activeStep].tech}</p>
              </div>
              <div className="font-mono text-[9px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <span>ESTADO</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-white font-bold">VERIFICADO</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
