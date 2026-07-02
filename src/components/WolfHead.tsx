import React, { useState, useEffect, useRef } from "react";

// Definitions of the 3D vertices of the low-poly Wolf Head
// (X: horizontal, Y: vertical, Z: depth pointing forward)
interface Vertex3D {
  x: number;
  y: number;
  z: number;
}

const BASE_VERTICES: Record<string, [number, number, number]> = {
  noseTip: [0, 50, 60],       // Punta del hocico (punto más adelante, alta respuesta a rotación)
  noseBridge: [0, 10, 35],     // Puente del hocico
  snoutLeft: [-16, 28, 35],    // Lado izquierdo de la nariz
  snoutRight: [16, 28, 35],   // Lado derecho de la nariz
  forehead: [0, -25, 25],      // Entre los ojos / Frente
  headTop: [0, -68, 5],        // Corona de la cabeza

  eyeLeft: [-20, -12, 18],     // Ojo izquierdo
  eyeRight: [20, -12, 18],    // Ojo derecho
  browLeft: [-15, -28, 24],    // Ceja izquierda
  browRight: [15, -28, 24],   // Ceja derecha

  templeLeft: [-46, -35, 5],   // Sien izquierda
  templeRight: [46, -35, 5],  // Sien derecha

  cheekLeftInner: [-35, 12, 15],  // Pómulo interno izquierdo
  cheekRightInner: [35, 12, 15], // Pómulo interno derecho
  cheekLeftOuter: [-62, -5, -8],  // Límite lateral izquierdo
  cheekRightOuter: [62, -5, -8], // Límite lateral derecho

  earLeftBaseInner: [-25, -68, 2],  // Base interna oreja izquierda
  earLeftBaseOuter: [-50, -65, -10], // Base externa oreja izquierda
  earLeftTip: [-65, -120, -18],      // Punta oreja izquierda

  earRightBaseInner: [25, -68, 2],  // Base interna oreja derecha
  earRightBaseOuter: [50, -65, -10], // Base externa oreja derecha
  earRightTip: [65, -120, -18],      // Punta oreja derecha

  jawLeft: [-30, 55, 15],      // Mandíbula izquierda
  jawRight: [30, 55, 15],     // Mandíbula derecha
  chinBottom: [0, 85, 28],     // Mentón inferior
};

// Define the connections of vertices to form geometric polygons (facets)
// We assign a base shading coefficient to each panel for rich color variations
interface Panel {
  keys: string[];
  baseShade: number; // 0 (oscuro) a 1 (claro)
  type?: "eye" | "accent" | "normal";
}

const PANELS: Panel[] = [
  // Hocico (Snout)
  { keys: ["noseBridge", "snoutRight", "noseTip"], baseShade: 0.8 },
  { keys: ["noseBridge", "noseTip", "snoutLeft"], baseShade: 0.8 },
  { keys: ["snoutLeft", "noseTip", "jawLeft"], baseShade: 0.65 },
  { keys: ["snoutRight", "jawRight", "noseTip"], baseShade: 0.65 },

  // Puente nasal a frente (Nose to forehead)
  { keys: ["forehead", "noseBridge", "cheekLeftInner"], baseShade: 0.75 },
  { keys: ["forehead", "cheekRightInner", "noseBridge"], baseShade: 0.75 },
  { keys: ["noseBridge", "snoutLeft", "cheekLeftInner"], baseShade: 0.7 },
  { keys: ["noseBridge", "cheekRightInner", "snoutRight"], baseShade: 0.7 },

  // Ojos y Cejas (Eyes and Brows)
  { keys: ["forehead", "browLeft", "eyeLeft"], baseShade: 0.55 },
  { keys: ["forehead", "eyeRight", "browRight"], baseShade: 0.55 },
  { keys: ["forehead", "eyeLeft", "cheekLeftInner"], baseShade: 0.6 },
  { keys: ["forehead", "cheekRightInner", "eyeRight"], baseShade: 0.6 },

  // Sien y laterales superiores
  { keys: ["browLeft", "templeLeft", "eyeLeft"], baseShade: 0.45 },
  { keys: ["browRight", "eyeRight", "templeRight"], baseShade: 0.45 },
  { keys: ["eyeLeft", "templeLeft", "cheekLeftOuter"], baseShade: 0.4 },
  { keys: ["eyeRight", "cheekRightOuter", "templeRight"], baseShade: 0.4 },

  // Mejillas (Cheeks)
  { keys: ["eyeLeft", "cheekLeftOuter", "cheekLeftInner"], baseShade: 0.5 },
  { keys: ["eyeRight", "cheekRightInner", "cheekRightOuter"], baseShade: 0.5 },
  { keys: ["cheekLeftInner", "cheekLeftOuter", "jawLeft"], baseShade: 0.4 },
  { keys: ["cheekRightInner", "jawRight", "cheekRightOuter"], baseShade: 0.4 },

  // Frente / Corona
  { keys: ["headTop", "browLeft", "forehead"], baseShade: 0.7 },
  { keys: ["headTop", "forehead", "browRight"], baseShade: 0.7 },

  // Oreja Izquierda
  { keys: ["earLeftBaseInner", "earLeftTip", "earLeftBaseOuter"], baseShade: 0.9, type: "accent" }, // Oreja brillante interna
  { keys: ["headTop", "earLeftBaseInner", "earLeftBaseOuter"], baseShade: 0.5 },
  { keys: ["templeLeft", "earLeftBaseOuter", "cheekLeftOuter"], baseShade: 0.35 },
  { keys: ["headTop", "earLeftBaseInner", "browLeft"], baseShade: 0.55 },

  // Oreja Derecha
  { keys: ["earRightBaseInner", "earRightBaseOuter", "earRightTip"], baseShade: 0.9, type: "accent" }, // Oreja brillante interna
  { keys: ["headTop", "earRightBaseOuter", "earRightBaseInner"], baseShade: 0.5 },
  { keys: ["templeRight", "cheekRightOuter", "earRightBaseOuter"], baseShade: 0.35 },
  { keys: ["headTop", "browRight", "earRightBaseInner"], baseShade: 0.55 },

  // Mandíbula e inferior
  { keys: ["jawLeft", "chinBottom", "snoutLeft"], baseShade: 0.5 },
  { keys: ["jawRight", "snoutRight", "chinBottom"], baseShade: 0.5 },
  { keys: ["jawLeft", "noseTip", "chinBottom"], baseShade: 0.45 },
  { keys: ["jawRight", "chinBottom", "noseTip"], baseShade: 0.45 },

  // Glowing eyes panels (Ojos brillantes de lobo)
  { keys: ["eyeLeft", "cheekLeftInner", "browLeft"], baseShade: 1.0, type: "eye" },
  { keys: ["eyeRight", "browRight", "cheekRightInner"], baseShade: 1.0, type: "eye" },
];

export default function WolfHead() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 }); // Coordenadas del ratón suavizadas (-1 a 1)
  const targetMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calcular el desplazamiento relativo normalizado (-1 a 1)
      // Ajustamos un radio de sensibilidad razonable
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);

      // Limitar a rango [-1.2, 1.2]
      targetMouse.current = {
        x: Math.max(-1.2, Math.min(1.2, dx)),
        y: Math.max(-1.2, Math.min(1.2, dy)),
      };
    };

    // También soporta eventos táctiles
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0 || !containerRef.current) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = (touch.clientX - centerX) / (window.innerWidth / 2);
      const dy = (touch.clientY - centerY) / (window.innerHeight / 2);

      targetMouse.current = {
        x: Math.max(-1.2, Math.min(1.2, dx)),
        y: Math.max(-1.2, Math.min(1.2, dy)),
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Bucle para suavizar la animación (Lerp)
    let animationId: number;
    const updateLoop = () => {
      setMouse((prev) => {
        const ease = 0.08; // Factor de suavizado (más bajo = más fluido/lento)
        return {
          x: prev.x + (targetMouse.current.x - prev.x) * ease,
          y: prev.y + (targetMouse.current.y - prev.y) * ease,
        };
      });
      animationId = requestAnimationFrame(updateLoop);
    };
    animationId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Función matemática de rotación 3D y proyección
  const projectVertices = (): Record<string, { x: number; y: number; z: number }> => {
    const projected: Record<string, { x: number; y: number; z: number }> = {};

    // Ángulo de rotación basado en la posición suavizada del ratón
    const yaw = mouse.x * 0.45;     // Rotación horizontal (en radianes)
    const pitch = -mouse.y * 0.35;   // Rotación vertical (en radianes)

    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    Object.entries(BASE_VERTICES).forEach(([key, [x, y, z]]) => {
      // 1. Rotación alrededor del eje X (Pitch)
      const y1 = y * cosP - z * sinP;
      const z1 = y * sinP + z * cosP;
      const x1 = x;

      // 2. Rotación alrededor del eje Y (Yaw)
      const x2 = x1 * cosY + z1 * sinY;
      const z2 = -x1 * sinY + z1 * cosY;
      const y2 = y1;

      // Proyección con perspectiva sutil (Z afecta la escala)
      const scaleFactor = 1 + z2 * 0.0022;
      const px = x2 * scaleFactor;
      const py = y2 * scaleFactor;

      projected[key] = { x: px, y: py, z: z2 };
    });

    return projected;
  };

  const projectedVertices = projectVertices();

  // Vector de luz estático para calcular el sombreado dinámico en 3D
  // Posición: Arriba, izquierda, adelante.
  const lightSource = { x: -0.4, y: -0.7, z: 0.5 };
  // Normalizar vector de luz
  const magL = Math.sqrt(lightSource.x ** 2 + lightSource.y ** 2 + lightSource.z ** 2);
  const uLight = { x: lightSource.x / magL, y: lightSource.y / magL, z: lightSource.z / magL };

  // Renderiza los polígonos ordenados por profundidad (z-index pintor) para evitar solapamientos incorrectos
  const panelsWithDepth = PANELS.map((panel, idx) => {
    // Calcular el centro de gravedad (Z medio) del panel antes de proyectar para ordenación
    const sumZ = panel.keys.reduce((acc, k) => acc + (projectedVertices[k]?.z || 0), 0);
    const avgZ = sumZ / panel.keys.length;

    // Calcular vector normal en 3D para iluminación dinámica
    const [k0, k1, k2] = panel.keys;
    const p0 = BASE_VERTICES[k0];
    const p1 = BASE_VERTICES[k1];
    const p2 = BASE_VERTICES[k2];

    let dot = 0.7; // Brillo base por defecto

    if (p0 && p1 && p2) {
      // Vectores de superficie
      const ax = p1[0] - p0[0];
      const ay = p1[1] - p0[1];
      const az = p1[2] - p0[2];

      const bx = p2[0] - p0[0];
      const by = p2[1] - p0[1];
      const bz = p2[2] - p0[2];

      // Producto cruzado (normal)
      const nx = ay * bz - az * by;
      const ny = az * bx - ax * bz;
      const nz = ax * by - ay * bx;

      const magN = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (magN > 0) {
        const unx = nx / magN;
        const uny = ny / magN;
        const unz = nz / magN;

        // Producto escalar con la dirección de la luz
        dot = unx * uLight.x + uny * uLight.y + unz * uLight.z;
        // Escalar de [-1, 1] a [0, 1]
        dot = (dot + 1) / 2;
      }
    }

    return { panel, avgZ, dot, idx };
  });

  // Ordenar de atrás hacia adelante (Z menor a Z mayor)
  panelsWithDepth.sort((a, b) => a.avgZ - b.avgZ);

  // Obtener el color del panel según su tipo e iluminación dinámica
  const getPanelColor = (panel: Panel, dot: number) => {
    if (panel.type === "eye") {
      // Ojos de lobo neón cian brillante (al estilo FoxWallet / Elegant Dark)
      return "url(#eyeGradient)";
    }
    if (panel.type === "accent") {
      // Detalles de orejas interiores en plata brillante
      const brightness = Math.floor(160 + dot * 95);
      return `rgb(${brightness}, ${brightness}, ${Math.min(255, brightness + 10)})`;
    }

    // Faceta de lobo estándar (Gama de grises titanio, pizarra y negro para un look sumamente refinado)
    const factor = (panel.baseShade * 0.3) + (dot * 0.7);
    
    // Grises oscuros refinados
    const r = Math.floor(10 + factor * 65);
    const g = Math.floor(10 + factor * 65);
    const b = Math.floor(12 + factor * 72);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div
      id="wolf-mascot-container"
      ref={containerRef}
      className="relative flex items-center justify-center w-full max-w-[320px] aspect-square mx-auto cursor-grab active:cursor-grabbing select-none"
    >
      {/* Glow de fondo elegante */}
      <div className="absolute inset-0 rounded-full bg-white/5 blur-[60px] animate-pulse duration-[4000ms]" />

      <svg
        id="wolf-interactive-svg"
        viewBox="-100 -140 200 240"
        className="w-full h-full overflow-visible drop-shadow-[0_15px_30px_rgba(255,255,255,0.08)]"
      >
        <defs>
          {/* Degradado para los ojos brillantes */}
          <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#00f2ff" />
            <stop offset="100%" stopColor="#003545" />
          </radialGradient>

          {/* Sutiles sombras de bordes */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Polígonos del lobo */}
        <g id="wolf-geometry">
          {panelsWithDepth.map(({ panel, dot, idx }) => {
            // Unir las coordenadas de los vértices del panel para el atributo 'points' de SVG
            const pointsString = panel.keys
              .map((key) => {
                const vert = projectedVertices[key];
                return vert ? `${vert.x.toFixed(2)},${vert.y.toFixed(2)}` : "0,0";
              })
              .join(" ");

            const fillColor = getPanelColor(panel, dot);

            // Ajustar el color y grosor de las líneas entre polígonos para darle un estilo wireframe premium
            const strokeColor = panel.type === "eye" 
              ? "#00f2ff" 
              : "rgba(255, 255, 255, 0.08)"; // Líneas de corte muy sutiles
            
            const strokeWidth = panel.type === "eye" ? "0.4" : "0.3";

            return (
              <polygon
                key={`${idx}-${panel.keys.join("-")}`}
                points={pointsString}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                className="transition-colors duration-150"
              />
            );
          })}
        </g>

        {/* Marcadores decorativos abstractos de trading en la cabeza del lobo */}
        <g id="trading-hud-highlights">
          {/* Línea horizontal del horizonte */}
          <line
            x1="-85"
            y1="85"
            x2="85"
            y2="85"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
          {/* Círculo indicador de objetivo */}
          <circle
            cx={(mouse.x * 25).toFixed(1)}
            cy={(mouse.y * 20 + 85).toFixed(1)}
            r="4"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.6"
            className="opacity-40"
          />
          <line
            x1={(mouse.x * 25 - 8).toFixed(1)}
            y1={(mouse.y * 20 + 85).toFixed(1)}
            x2={(mouse.x * 25 + 8).toFixed(1)}
            y2={(mouse.y * 20 + 85).toFixed(1)}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="opacity-25"
          />
          <line
            x1={(mouse.x * 25).toFixed(1)}
            y1={(mouse.y * 20 + 77).toFixed(1)}
            x2={(mouse.x * 25).toFixed(1)}
            y2={(mouse.y * 20 + 93).toFixed(1)}
            stroke="#ffffff"
            strokeWidth="0.5"
            className="opacity-25"
          />
        </g>
      </svg>

      {/* Brújula/Coordenadas en las esquinas */}
      <div className="absolute bottom-2 left-4 font-mono text-[9px] text-slate-500 flex flex-col pointer-events-none">
        <span>LAT: 16.48° S</span>
        <span>YAW: {(mouse.x * 45).toFixed(1)}°</span>
      </div>
      <div className="absolute bottom-2 right-4 font-mono text-[9px] text-slate-500 flex flex-col items-end pointer-events-none">
        <span>LNG: 68.11° W</span>
        <span>PIT: {(-mouse.y * 35).toFixed(1)}°</span>
      </div>
    </div>
  );
}
