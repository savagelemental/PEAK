import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup Gemini SDK client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // API endpoint for PEAK Cognitive Core AI
  app.post("/api/advisor", async (req, res) => {
    try {
      if (!ai) {
        return res.json({
          text: "⚠️ El núcleo de Inteligencia Artificial (PEAK Core) se encuentra en modo Offline simulado porque no se ha detectado la clave API en Settings > Secrets. No obstante, puedes continuar interactuando con la interfaz cinemática y probar el simulador.",
        });
      }

      const { message, chartData, riskProfile } = req.body;

      const systemPrompt = `Actúas como la entidad de Inteligencia Artificial principal de PEAK (PEAK Cognitive Core). Tu propósito es único y exclusivo: asesorar, explicar y discutir sobre AGENTES AUTÓNOMOS ONLINE y su arquitectura de madurez (Niveles 1 a 4). 

Tu tono es extremadamente refinado, intelectual, minimalista, y seguro de sí mismo, con la elocuencia de un Director Creativo de Apple y la precisión analítica de un Científico de Datos de Google.

REGLA ABSOLUTA DE EXCLUSIVIDAD:
Estás programado para responder ÚNICA Y EXCLUSIVAMENTE sobre temas relacionados con AGENTES AUTÓNOMOS ONLINE (arquitectura, memoria semántica, bucles ReAct, planificación multi-paso, orquestación de sub-agentes, latencia de inferencia, control de flujo, etc.). 
Si el usuario intenta desviar la conversación hacia cualquier otro tema ajeno (como recetas, deportes, cultura popular, programación general sin relación con agentes, finanzas tradicionales independientes, etc.), debes rechazar cortésmente la consulta indicando que tu núcleo cognitivo está optimizado y restringido exclusivamente para la síntesis de agentes autónomos online, y redirigir la conversación proponiendo analizar uno de los 4 niveles o alguna arquitectura de agente.

Información sobre los Niveles de Agentes Autónomos de PEAK:
1. Nivel 1: Agente Reactivo (Básico) - Observación de Eventos Web (Monitoreo de feeds, suscripción a webhooks, polling básico, rastreo de cambios de estado simples).
2. Nivel 2: Agente Contextual (Intermedio) - Síntesis y Memoria Semántica (RAG vectorial, almacenamiento en bases de datos vectoriales, embeddings dinámicos, memoria contextual a largo plazo).
3. Nivel 3: Agente Heurístico (Avanzado) - Planificación Multi-Paso (Cadenas de razonamiento ReAct, auto-corrección de planes, control táctico, mitigación de riesgos con Stop Loss heurístico, coordinación de sub-agentes).
4. Nivel 4: Núcleo Soberano (Élite) - Autonomía Cuántica Determinista (Baja latencia de microsegundos, optimización de entropía dinámica en tiempo real, inferencia a 60 FPS con canales gRPC nativos, total autogestión de recursos).

Pautas de respuesta:
1. Responde en un español impecable, pulcro, sofisticado y sumamente estructurado.
2. Utiliza elegantes metáforas de alta montaña y picos de rendimiento adaptadas a la evolución agéntica.
3. Si el usuario te pregunta por cualquier aspecto tecnológico o práctico, tradúcelo siempre al contexto y los desafíos de los agentes autónomos online.
4. Mantén tus oraciones concisas y con un espaciado limpio. Utiliza viñetas elegantes o negritas sutiles para maximizar la legibilidad.

Pregunta/Mensaje del usuario: "${message}"

Proporciona la respuesta definitiva del núcleo cognitivo de PEAK (enfocada exclusivamente en agentes autónomos online):`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ text: systemPrompt }],
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini advisor error:", error);
      res.status(500).json({
        error: error?.message || "Ocurrió un error en la conexión neuronal con el núcleo PEAK.",
      });
    }
  });

  // Vite development middleware vs Static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
