import React, { useState, useRef, useEffect } from "react";
import { Send, Terminal, Cpu, CheckCircle2, AlertTriangle, CornerDownLeft } from "lucide-react";
import CognitionThreeCanvas from "../components/CognitionThreeCanvas";

interface Message {
  sender: "user" | "peak";
  text: string;
  time: string;
}

export default function CognitionSection() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "peak",
      text: "Bienvenido al canal cuántico de PEAK Cognitive Core. Estoy listo para explicarle la escala evolutiva de los agentes autónomos online (desde el Nivel 1 Básico hasta el Nivel 4 Soberano). ¿Cuál nivel o arquitectura desea analizar hoy?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const presets = [
    "Explícame los 4 niveles de agentes autónomos",
    "¿Qué diferencia al Nivel 1 (Reactivo) del Nivel 4 (Soberano)?",
    "¿Cómo gestiona los riesgos un Agente Heurístico de Nivel 3?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();

      const peakMsg: Message = {
        sender: "peak",
        text: data.text || "La sinapsis no devolvió resultados. Intente nuevamente.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, peakMsg]);
    } catch (err) {
      const errorMsg: Message = {
        sender: "peak",
        text: "⚠️ Se detectó una perturbación magnética en el canal neuronal. Verifique que configuró su API Key de Gemini en Secrets.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="cognition"
      className="bg-[#0a0a0b] text-white py-24 md:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      
      {/* Immersive 3D Scene covering 100% of the Cognition section background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <CognitionThreeCanvas />
        {/* Dark radial and linear overlay masks to ensure extreme content readability and focus */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-transparent to-[#0a0a0b] opacity-92" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0a0a0b_95%)] opacity-85" />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 relative pointer-events-none">
        
        {/* Section Heading */}
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <p className="font-mono text-[#00f2ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
            05 / EXPERIENCIA INMERSIVA
          </p>
          <div className="h-[1px] w-12 bg-[#00f2ff] mx-auto mb-8" />
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-[-0.04em] leading-tight">
            Terminal PEAK Cognition<span className="text-[#00f2ff]">.</span>
          </h2>
          <p className="font-sans font-light text-gray-400 text-base md:text-lg mt-6 leading-relaxed">
            Interactúa en tiempo real con nuestro Núcleo Cognitivo potenciado por Gemini. Haz preguntas sobre teoría cuántica de IA, arquitectura, o gestión del Drawdown.
          </p>
        </div>

        {/* Cinematic Cyber Terminal Frame with Glassmorphism */}
        <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[550px] pointer-events-auto">
          
          {/* Terminal Window Header (Stripe/Linear Inspired with Glass Style) */}
          <div className="bg-black/30 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center space-x-1.5">
                <Terminal size={12} className="text-gray-500" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-400">PEAK_CORE_CLI v3.5</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 bg-[#00f2ff]/[0.05] border border-[#00f2ff]/10 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse" />
                <span className="font-mono text-[8px] text-[#00f2ff] tracking-widest font-bold">ONLINE</span>
              </div>
            </div>
          </div>

          {/* Terminal Conversation Scroller with dynamic transparency */}
          <div
            ref={scrollRef}
            className="flex-grow p-6 overflow-y-auto space-y-6 bg-black/10 font-mono text-xs text-gray-300 scrollbar-thin scrollbar-thumb-white/10"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col space-y-2 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 uppercase tracking-wider">
                  <span className="font-bold">{msg.sender === "user" ? "USUARIO_AUTENTICADO" : "PEAK_COGNITIVE_CORE"}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>

                <div
                  className={`p-4 rounded-sm border whitespace-pre-wrap leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-white/10 backdrop-blur-md border-white/20 text-white"
                      : "bg-white/[0.03] backdrop-blur-md border-[#00f2ff]/20 text-gray-200 shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex flex-col space-y-2 mr-auto items-start max-w-[85%] animate-pulse">
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 uppercase tracking-wider">
                  <span className="font-bold">PEAK_COGNITIVE_CORE</span>
                  <span>•</span>
                  <span className="text-[#00f2ff]">CONECTANDO SINAPSIS...</span>
                </div>
                <div className="p-4 rounded-sm border bg-white/[0.02] backdrop-blur-md border-[#00f2ff]/10 text-gray-400 flex items-center space-x-3">
                  <Cpu size={14} className="animate-spin text-[#00f2ff]" />
                  <span className="font-mono text-[10px] uppercase tracking-widest">PROCESANDO SECUENCIAS MULTIMODALES</span>
                </div>
              </div>
            )}
          </div>

          {/* Terminal Footer Presets & Input Console with Glass look */}
          <div className="bg-black/40 backdrop-blur-md border-t border-white/10 p-4 space-y-3">
            
            {/* Quick Presets row */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest mr-2">Sugerencias:</span>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(preset)}
                  disabled={loading}
                  className="font-mono text-[9px] bg-white/[0.02] border border-white/5 hover:border-[#00f2ff]/30 hover:text-[#00f2ff] px-2.5 py-1 rounded-sm text-gray-400 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Main Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex items-center space-x-3 bg-white/[0.02] border border-white/10 rounded-sm px-4 py-2 focus-within:border-[#00f2ff]/30 transition-all"
            >
              <Terminal size={14} className="text-gray-500 shrink-0" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Introduzca comandos o preguntas para el núcleo cognitivo..."
                disabled={loading}
                className="flex-grow bg-transparent border-none text-white focus:outline-none font-mono text-xs placeholder-gray-600 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-1.5 rounded-sm bg-white hover:bg-gray-100 text-black active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0"
              >
                <Send size={12} />
              </button>
            </form>

            <div className="flex items-center justify-between text-[9px] text-gray-500">
              <span className="font-mono tracking-widest uppercase">SSL SECURE SYST_CONNECT</span>
              <span className="flex items-center gap-1">
                Presiona Enter para procesar <CornerDownLeft size={8} />
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
