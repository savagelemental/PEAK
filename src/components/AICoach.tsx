import React, { useState, useRef, useEffect } from "react";
import { Send, Shield, Compass, Sparkles, User, Brain, AlertTriangle } from "lucide-react";
import { ChatMessage } from "../types";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "🐺 Saludos. Soy tu Mentor de Precisión, el **Lobo Alquimista**. Bienvenido a **PEAK**. \n\nMi propósito es guiar tu camino en el trading cuantitativo y la acción del precio para conquistar la consistencia absoluta en el mercado. ¿Qué conceptos, sesgos o estrategias de liquidez institucional deseas analizar hoy? Recuerda que la maestría se alcanza con paciencia de cazador y disciplina de acero.",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
];

const PRESETS = [
  "¿Cómo gestiono mi riesgo si opero con una cuenta de $1,000?",
  "Explícame cómo identificar un cambio de tendencia usando velas japonesas",
  "¿Qué reglas estrictas de Stop Loss recomiendas para no perder mi capital?",
  "Dame un plan diario para operar la sesión de Nueva York",
];

export default function AICoach() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [riskProfile, setRiskProfile] = useState<string>("Equilibrado");
  const [loadingText, setLoadingText] = useState("Lobo Alquimista está husmeando las gráficas...");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Mensajes de carga rotativos
  useEffect(() => {
    if (!loading) return;
    const texts = [
      "El Lobo Alquimista está analizando el flujo de órdenes...",
      "Calculando confluencias algorítmicas en la cumbre...",
      "Sincronizando la gestión de riesgo con PEAK Master Core...",
      "Rastreando vacíos de liquidez y bloques de órdenes...",
      "Afilando los colmillos del análisis cuantitativo...",
    ];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setLoadingText(texts[idx]);
    }, 2500);
    return () => clearInterval(timer);
  }, [loading]);

  // Desplazar chat hacia abajo al recibir mensajes
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          riskProfile: riskProfile,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: "⚠️ **Error de conexión:** Hubo un percance al intentar establecer comunicación con el procesador central de PEAK. Asegúrate de configurar la clave API en la plataforma o inténtalo en unos momentos.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-coach-section" className="bg-[#0b0b0c] border border-white/5 rounded-2xl p-6 backdrop-blur-md flex flex-col h-[580px] justify-between shadow-xl">
      {/* Cabecera del AI Coach */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 shadow-md">
            <Brain size={24} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-base text-white flex items-center gap-2 uppercase tracking-wide">
              Mentor AI: Lobo Alquimista
              <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[9px] px-2 py-0.5 rounded border border-cyan-500/20">
                Online
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">Inteligencia artificial entrenada en acción del precio y psicología cuántica</p>
          </div>
        </div>

        {/* Perfil de Riesgo Selector */}
        <div className="flex items-center gap-2 bg-[#0e0e0f] p-1 rounded-lg border border-white/5">
          <span className="font-mono text-[9px] text-gray-500 uppercase px-2">Riesgo:</span>
          {["Conservador", "Equilibrado", "Agresivo"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setRiskProfile(p)}
              className={`px-2.5 py-1 rounded text-[10px] font-sans font-bold transition-all ${
                riskProfile === p
                  ? "bg-white/10 text-white border border-white/15 shadow"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Cuerpo del Chat */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-[220px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
                m.role === "user"
                  ? "bg-[#18181b] border-white/10 text-gray-200"
                  : "bg-cyan-950/40 border-cyan-500/20 text-cyan-400"
              }`}
            >
              {m.role === "user" ? <User size={14} /> : <span>🐺</span>}
            </div>

            {/* Burbuja */}
            <div
              className={`p-3.5 rounded-xl text-xs leading-relaxed font-sans ${
                m.role === "user"
                  ? "bg-[#18181b] text-gray-200 rounded-tr-none"
                  : "bg-white/[0.02] border border-white/5 text-gray-300 rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-line prose prose-invert max-w-none text-gray-300">
                {m.text}
              </div>
              <span className="block text-[9px] text-gray-500 font-mono mt-1.5 text-right">
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Burbuja de Carga */}
        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center animate-pulse">
            <div className="w-8 h-8 rounded bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <span>🐺</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 rounded-tl-none flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
              </span>
              <span className="font-sans text-xs text-gray-400">{loadingText}</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Sugerencias Rápidas (Presets) */}
      {messages.length === 1 && (
        <div className="my-4">
          <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest block mb-2">
            Preguntas Frecuentes
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={`preset-${i}`}
                type="button"
                onClick={() => handleSend(p)}
                className="text-left py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-[11px] text-gray-300 hover:text-cyan-400 transition-all font-sans leading-snug flex items-center gap-1.5"
              >
                <Compass size={12} className="shrink-0 text-cyan-400" />
                <span className="truncate">{p}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formulario de Entrada */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex gap-2 border-t border-white/5 pt-4 mt-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregúntale al Lobo Mentor sobre soportes, trading institucional o gestión..."
          disabled={loading}
          className="flex-1 bg-[#0a0a0b] rounded-lg border border-white/5 py-2.5 px-4 font-sans text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 transition-all shadow-md shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
