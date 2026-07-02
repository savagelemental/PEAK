import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, DollarSign, Award, Percent, ChevronRight, Activity, ShieldAlert } from "lucide-react";
import { Candle, ClimbStats, Position } from "../types";

// Generar velas de simulación iniciales
const generateInitialCandles = (count: number): Candle[] => {
  const candles: Candle[] = [];
  let basePrice = 2850.0; // Precio inicial simulado para el par CLIMB/USD

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * 45; // Sutil tendencia alcista por defecto
    const open = basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * 15;
    const low = Math.min(open, close) - Math.random() * 15;
    const volume = Math.floor(100 + Math.random() * 900);

    const date = new Date();
    date.setMinutes(date.getMinutes() - (count - i));
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    candles.push({
      time: timeStr,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    basePrice = close;
  }
  return candles;
};

export default function TradingDashboard() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [stats, setStats] = useState<ClimbStats>({
    pipsClimbed: 45,
    winRate: 68.4,
    rank: "Campamento Base (Amateur)",
    activeBalance: 10000.0,
    simulatedProfit: 350.0,
    completedLessons: 1,
  });

  const [activePositions, setActivePositions] = useState<Position[]>([]);
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [tradeSize, setTradeSize] = useState<number>(1.0); // Lotes
  const [stopLossPercent, setStopLossPercent] = useState<number>(2.0); // SL%
  const [takeProfitPercent, setTakeProfitPercent] = useState<number>(4.0); // TP%
  const [currentPrice, setCurrentPrice] = useState<number>(2850.0);

  // Notificaciones flotantes de trading
  const [alerts, setAlerts] = useState<{ id: string; text: string; type: "success" | "danger" | "info" }[]>([]);

  // Cargar velas iniciales en el cliente
  useEffect(() => {
    const initialCandles = generateInitialCandles(35);
    setCandles(initialCandles);
    if (initialCandles.length > 0) {
      setCurrentPrice(initialCandles[initialCandles.length - 1].close);
    }
  }, []);

  // Simular ticking del mercado en tiempo real (cada 1.2 segundos)
  useEffect(() => {
    if (candles.length === 0) return;

    const interval = setInterval(() => {
      // Modificar el precio de la última vela y actualizarlo
      setCandles((prevCandles) => {
        const next = [...prevCandles];
        const lastIndex = next.length - 1;
        const lastCandle = { ...next[lastIndex] };

        // Cambiar el precio actual
        const priceTick = (Math.random() - 0.49) * 8.0; // Sutil sesgo positivo
        const newClose = parseFloat((lastCandle.close + priceTick).toFixed(2));

        // Actualizar valores de la vela en curso
        lastCandle.close = newClose;
        if (newClose > lastCandle.high) lastCandle.high = newClose;
        if (newClose < lastCandle.low) lastCandle.low = newClose;

        next[lastIndex] = lastCandle;
        setCurrentPrice(newClose);

        // Ocasionalmente (cada 10 ticks), crear una vela nueva
        if (Math.random() > 0.88 && next.length < 50) {
          const newOpen = newClose;
          const date = new Date();
          const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          
          next.push({
            time: timeStr,
            open: newOpen,
            high: newOpen,
            low: newOpen,
            close: newOpen,
            volume: Math.floor(100 + Math.random() * 900),
          });
          // Eliminar la vela más vieja para mantener la vista limpia
          if (next.length > 38) {
            next.shift();
          }
        }

        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [candles]);

  // Actualizar ganancias de las posiciones abiertas en cada tick de precio
  useEffect(() => {
    if (activePositions.length === 0) return;

    setActivePositions((prevPositions) =>
      prevPositions.map((pos) => {
        // Calcular profit/loss flotante
        // 1 lote = $10,000 nocional. Por cada punto de cambio, gano/pierdo tamaño*lote
        const priceDiff = currentPrice - pos.entryPrice;
        const multiplier = pos.type === "BUY" ? 1 : -1;
        const rawProfit = priceDiff * pos.size * 15.0 * multiplier;
        const profit = parseFloat(rawProfit.toFixed(2));

        // Verificar Stop Loss
        if (pos.stopLoss) {
          if (pos.type === "BUY" && currentPrice <= pos.stopLoss) {
            triggerLiquidation(pos.id, "STOP LOSS ALCANZADO", pos.stopLoss, profit);
          } else if (pos.type === "SELL" && currentPrice >= pos.stopLoss) {
            triggerLiquidation(pos.id, "STOP LOSS ALCANZADO", pos.stopLoss, profit);
          }
        }

        // Verificar Take Profit
        if (pos.takeProfit) {
          if (pos.type === "BUY" && currentPrice >= pos.takeProfit) {
            triggerLiquidation(pos.id, "TAKE PROFIT ALCANZADO", pos.takeProfit, profit);
          } else if (pos.type === "SELL" && currentPrice <= pos.takeProfit) {
            triggerLiquidation(pos.id, "TAKE PROFIT ALCANZADO", pos.takeProfit, profit);
          }
        }

        return {
          ...pos,
          currentPrice,
          profit,
        };
      })
    );
  }, [currentPrice]);

  // Manejar el cierre automático por SL / TP
  const triggerLiquidation = (id: string, reason: string, triggerPrice: number, finalProfit: number) => {
    // Filtrar de activas
    setActivePositions((prev) => prev.filter((p) => p.id !== id));

    // Añadir alerta
    addAlert(`${reason} en $${triggerPrice.toFixed(2)}. P&L: $${finalProfit.toFixed(2)}`, finalProfit >= 0 ? "success" : "danger");

    // Actualizar balance
    updateBalanceAndRank(finalProfit);
  };

  const addAlert = (text: string, type: "success" | "danger" | "info") => {
    const id = Math.random().toString();
    setAlerts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  };

  // Función para recalcular balance, pips y rango de la academia
  const updateBalanceAndRank = (profit: number) => {
    setStats((prev) => {
      const newBalance = parseFloat((prev.activeBalance + profit).toFixed(2));
      const pipsAdded = Math.round(profit / 5.5);
      const newPips = Math.max(0, prev.pipsClimbed + pipsAdded);
      const newSimProfit = parseFloat((prev.simulatedProfit + profit).toFixed(2));

      // Asignar rangos según los pips alcanzados (Gamificación "Climb")
      let rank = "Campamento Base (Amateur)";
      let winRate = prev.winRate;

      if (newPips > 180) {
        rank = "Cima de los Andes (Máster)";
        winRate = Math.min(95, prev.winRate + (profit > 0 ? 1.5 : -0.8));
      } else if (newPips > 75) {
        rank = "Paso de Glaciar (Avanzado)";
        winRate = Math.min(85, prev.winRate + (profit > 0 ? 1.1 : -0.5));
      }

      return {
        ...prev,
        activeBalance: newBalance,
        pipsClimbed: newPips,
        simulatedProfit: newSimProfit,
        rank,
        winRate: parseFloat(winRate.toFixed(1)),
      };
    });
  };

  // Abrir una nueva posición simulada
  const handlePlaceOrder = () => {
    if (tradeSize <= 0) return;

    const stopLoss = stopLossPercent > 0 
      ? tradeType === "BUY"
        ? currentPrice * (1 - stopLossPercent / 100)
        : currentPrice * (1 + stopLossPercent / 100)
      : undefined;

    const takeProfit = takeProfitPercent > 0
      ? tradeType === "BUY"
        ? currentPrice * (1 + takeProfitPercent / 100)
        : currentPrice * (1 - takeProfitPercent / 100)
      : undefined;

    const newPosition: Position = {
      id: Math.random().toString(),
      type: tradeType,
      entryPrice: currentPrice,
      currentPrice: currentPrice,
      size: tradeSize,
      stopLoss: stopLoss ? parseFloat(stopLoss.toFixed(2)) : undefined,
      takeProfit: takeProfit ? parseFloat(takeProfit.toFixed(2)) : undefined,
      profit: 0.0,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };

    setActivePositions((prev) => [newPosition, ...prev]);
    addAlert(`Orden ${tradeType} abierta para ${tradeSize} lotes a $${currentPrice.toFixed(2)}`, "info");
  };

  // Cerrar posición manualmente
  const handleClosePosition = (id: string) => {
    const pos = activePositions.find((p) => p.id === id);
    if (!pos) return;

    setActivePositions((prev) => prev.filter((p) => p.id !== id));
    addAlert(`Cerraste posición ${pos.type} manualmente. P&L: $${pos.profit.toFixed(2)}`, pos.profit >= 0 ? "success" : "danger");
    updateBalanceAndRank(pos.profit);
  };

  // Calcular coordenadas para renderizar el gráfico SVG de velas
  const renderHeight = 280;
  const renderWidth = 650;
  const padding = 35;

  const getChartCoordinates = () => {
    if (candles.length === 0) {
      return {
        formattedCandles: [],
        smaPoints: [],
        minPrice: 0,
        maxPrice: 0,
        candleWidth: 0,
      };
    }

    const prices = candles.flatMap((c) => [c.high, c.low]);
    const minPrice = Math.min(...prices) * 0.998;
    const maxPrice = Math.max(...prices) * 1.002;
    const priceRange = maxPrice - minPrice;

    const candleWidth = (renderWidth - padding * 2) / candles.length;

    // Generar velas formateadas para dibujo
    const formattedCandles = candles.map((c, i) => {
      const x = padding + i * candleWidth + candleWidth / 2;
      
      // Mapear precios a coordenadas Y (Y=0 es la parte superior)
      const mapY = (price: number) => {
        return renderHeight - padding - ((price - minPrice) / priceRange) * (renderHeight - padding * 2);
      };

      return {
        x,
        openY: mapY(c.open),
        closeY: mapY(c.close),
        highY: mapY(c.high),
        lowY: mapY(c.low),
        isBullish: c.close >= c.open,
        raw: c,
      };
    });

    // Calcular una media móvil simple (SMA 10) para el gráfico como indicador
    const smaPoints: { x: number; y: number }[] = [];
    for (let i = 9; i < formattedCandles.length; i++) {
      const subset = candles.slice(i - 9, i + 1);
      const sum = subset.reduce((acc, c) => acc + c.close, 0);
      const avg = sum / 10;
      
      const x = formattedCandles[i].x;
      const y = renderHeight - padding - ((avg - minPrice) / priceRange) * (renderHeight - padding * 2);
      smaPoints.push({ x, y });
    }

    return { formattedCandles, smaPoints, minPrice, maxPrice, candleWidth };
  };

  const { formattedCandles, smaPoints, minPrice, maxPrice, candleWidth } = getChartCoordinates();

  // Calcular el progreso del rango del escalador
  const getRankProgress = () => {
    if (stats.pipsClimbed <= 75) {
      return (stats.pipsClimbed / 75) * 100;
    } else if (stats.pipsClimbed <= 180) {
      return ((stats.pipsClimbed - 75) / 105) * 100;
    }
    return 100;
  };

  return (
    <div id="trading-simulator-module" className="bg-slate-950/60 border border-slate-900 rounded-3xl p-6 backdrop-blur-md">
      {/* Alertas Flotantes de Trading */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`flex items-center gap-2 p-4 rounded-xl border text-xs shadow-lg animate-fade-in pointer-events-auto ${
              a.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-400"
                : a.type === "danger"
                ? "bg-rose-950/90 border-rose-500/30 text-rose-400"
                : "bg-slate-900/90 border-slate-700/50 text-slate-300"
            }`}
          >
            <Activity size={16} />
            <span>{a.text}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* PANEL IZQUIERDO: GRÁFICO DE VELAS Y PRECIO EN VIVO */}
        <div className="flex-1 bg-slate-950/90 rounded-2xl border border-slate-900 p-5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-mono font-bold border border-emerald-500/20 shadow-inner">
                $
              </div>
              <div>
                <h3 className="font-sans font-semibold text-sm text-white flex items-center gap-2">
                  Simulador de Trading CLIMB/USD
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h3>
                <span className="font-mono text-xs text-slate-500">Precio simulado por la academia en tiempo real</span>
              </div>
            </div>

            {/* PRECIO ACTUAL EN GRANDE */}
            <div className="text-right">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-widest block">Precio Actual</span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-black text-emerald-400 tracking-tight">
                  ${currentPrice.toFixed(2)}
                </span>
                <span className="font-mono text-xs text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp size={12} /> +1.24%
                </span>
              </div>
            </div>
          </div>

          {/* ÁREA DEL GRÁFICO SVG */}
          <div className="relative w-full overflow-x-auto select-none mt-2">
            <div className="min-w-[650px] h-[280px]">
              <svg className="w-full h-full overflow-visible">
                {/* Cuadrícula de Fondo */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const y = padding + (i * (renderHeight - padding * 2)) / 4;
                  return (
                    <line
                      key={`grid-y-${i}`}
                      x1={padding}
                      y1={y}
                      x2={renderWidth - padding}
                      y2={y}
                      stroke="rgba(30, 41, 59, 0.25)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Línea horizontal del precio actual cruzando el gráfico */}
                {formattedCandles.length > 0 && (
                  <line
                    x1={padding}
                    y1={formattedCandles[formattedCandles.length - 1].closeY}
                    x2={renderWidth - padding}
                    y2={formattedCandles[formattedCandles.length - 1].closeY}
                    stroke="rgba(16, 185, 129, 0.35)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Velas (Wicks y Bodies) */}
                {formattedCandles.map((c, i) => {
                  const bodyHeight = Math.max(2, Math.abs(c.openY - c.closeY));
                  const bodyY = Math.min(c.openY, c.closeY);
                  const color = c.isBullish ? "#10b981" : "#ef4444"; // Emerald (bull) vs Rose (bear)

                  return (
                    <g key={`candle-${i}`} className="hover:opacity-85 cursor-pointer">
                      {/* Sombra / Mecha */}
                      <line
                        x1={c.x}
                        y1={c.lowY}
                        x2={c.x}
                        y2={c.highY}
                        stroke={color}
                        strokeWidth="1.25"
                      />
                      {/* Cuerpo de la vela */}
                      <rect
                        x={c.x - candleWidth * 0.3}
                        y={bodyY}
                        width={candleWidth * 0.6}
                        height={bodyHeight}
                        fill={color}
                        stroke={color}
                        strokeWidth="0.5"
                        rx="1"
                      />
                    </g>
                  );
                })}

                {/* Línea del indicador técnico (SMA 10) */}
                {smaPoints.length > 1 && (
                  <path
                    d={`M ${smaPoints.map((p) => `${p.x},${p.y}`).join(" L ")}`}
                    fill="none"
                    stroke="#f59e0b" // Color ámbar / dorado de Climb
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                )}

                {/* Eje de Precios Derecho */}
                <g className="font-mono text-[9px] fill-slate-500">
                  <text x={renderWidth - padding + 5} y={padding + 3} textAnchor="start">
                    ${maxPrice.toFixed(0)}
                  </text>
                  <text x={renderWidth - padding + 5} y={renderHeight / 2} textAnchor="start">
                    ${((maxPrice + minPrice) / 2).toFixed(0)}
                  </text>
                  <text x={renderWidth - padding + 5} y={renderHeight - padding + 3} textAnchor="start">
                    ${minPrice.toFixed(0)}
                  </text>
                </g>

                {/* Etiquetas de Tiempo Inferiores */}
                <g className="font-mono text-[9px] fill-slate-600">
                  {formattedCandles.filter((_, idx) => idx % 8 === 0).map((c, idx) => (
                    <text key={`time-${idx}`} x={c.x} y={renderHeight - 10} textAnchor="middle">
                      {c.raw.time}
                    </text>
                  ))}
                </g>
              </svg>
            </div>
          </div>

          {/* LEYENDA DEL GRÁFICO */}
          <div className="flex items-center justify-between border-t border-slate-900/60 pt-4 mt-2 font-mono text-[10px] text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 block"></span> Alcista
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 block"></span> Bajista
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-amber-500 block"></span> Promedio Climb (SMA 10)
              </span>
            </div>
            <span>Periodo: 1 Minuto</span>
          </div>
        </div>

        {/* PANEL DERECHO: EJECUCIÓN DE ÓRDENES Y ESTADÍSTICAS DEL ESCALADOR */}
        <div className="w-full xl:w-[380px] flex flex-col gap-5">
          {/* TARJETA DE RANGO "CLIMB" (Estadísticas de la Academia) */}
          <div className="bg-slate-900/30 rounded-2xl border border-slate-900/80 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Rango Climb</span>
                <h4 className="font-sans font-bold text-sm text-amber-400 flex items-center gap-1.5 mt-0.5">
                  <Award size={16} /> {stats.rank}
                </h4>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block">Pips Escalados</span>
                <span className="font-mono text-base font-black text-emerald-400">{stats.pipsClimbed} pips</span>
              </div>
            </div>

            {/* Barra de progreso de montaña */}
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900 mb-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${getRankProgress()}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] text-slate-500">
              <span>Campamento Base</span>
              <span>Paso Glaciar (75)</span>
              <span>Cumbre Andes (180)</span>
            </div>

            {/* Estadísticas de capital simulado */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-900/50">
              <div>
                <span className="font-mono text-[9px] text-slate-500 uppercase block">Balance Simulador</span>
                <span className="font-mono text-sm font-semibold text-slate-200">${stats.activeBalance.toLocaleString()} USD</span>
              </div>
              <div>
                <span className="font-mono text-[9px] text-slate-500 uppercase block">Retorno Neto</span>
                <span className={`font-mono text-sm font-bold flex items-center gap-0.5 ${stats.simulatedProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  ${stats.simulatedProfit >= 0 ? "+" : ""}{stats.simulatedProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* EJECUCIÓN DE ÓRDENES */}
          <div className="bg-slate-950/70 border border-slate-900 rounded-2xl p-5">
            <h4 className="font-sans font-semibold text-xs text-white uppercase tracking-wider mb-3">Abrir Operación</h4>
            
            {/* Selector de Dirección (BUY/SELL) */}
            <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-950 p-1 rounded-xl border border-slate-900">
              <button
                type="button"
                onClick={() => setTradeType("BUY")}
                className={`py-2 px-3 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tradeType === "BUY"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/15"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <TrendingUp size={14} /> Largo (Compra)
              </button>
              <button
                type="button"
                onClick={() => setTradeType("SELL")}
                className={`py-2 px-3 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tradeType === "SELL"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/15"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <TrendingDown size={14} /> Corto (Venta)
              </button>
            </div>

            {/* Tamaño del Lote */}
            <div className="mb-4">
              <div className="flex justify-between font-mono text-[10px] text-slate-400 mb-1.5">
                <span>Tamaño de la Posición</span>
                <span className="text-white">{tradeSize.toFixed(1)} Lote(s)</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={tradeSize}
                onChange={(e) => setTradeSize(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between font-mono text-[9px] text-slate-600 mt-1">
                <span>Min: 0.1 Lot</span>
                <span>Max: 5.0 Lot</span>
              </div>
            </div>

            {/* Gestión de Riesgos (SL/TP) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="font-mono text-[9px] text-slate-400 uppercase block mb-1">Stop Loss (SL %)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={stopLossPercent}
                    onChange={(e) => setStopLossPercent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 rounded-xl border border-slate-900 py-1.5 pl-3 pr-7 font-mono text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-slate-500">%</span>
                </div>
              </div>
              <div>
                <label className="font-mono text-[9px] text-slate-400 uppercase block mb-1">Take Profit (TP %)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="1"
                    value={takeProfitPercent}
                    onChange={(e) => setTakeProfitPercent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 rounded-xl border border-slate-900 py-1.5 pl-3 pr-7 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-slate-500">%</span>
                </div>
              </div>
            </div>

            {/* BOTÓN DE ENTRADA AL MERCADO */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              className={`w-full py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                tradeType === "BUY"
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  : "bg-rose-500 text-white hover:bg-rose-400"
              }`}
            >
              Colocar Orden de Mercado
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: POSICIONES ABIERTAS */}
      <div className="border-t border-slate-900/60 pt-6 mt-6">
        <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity size={14} className="text-slate-400" /> Posiciones Abiertas ({activePositions.length})
        </h4>

        {activePositions.length === 0 ? (
          <div className="bg-slate-950/20 rounded-2xl border border-slate-900/60 border-dashed py-8 px-4 text-center">
            <span className="font-mono text-xs text-slate-500 block">No tienes posiciones activas en este momento</span>
            <span className="font-mono text-[10px] text-slate-600 mt-1 block">Abre una orden de compra o venta arriba para poner a prueba tu estrategia</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs text-slate-300 text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 pb-2">
                  <th className="py-2 px-3 font-normal">Tipo</th>
                  <th className="py-2 px-3 font-normal">Lotes</th>
                  <th className="py-2 px-3 font-normal">Precio de Entrada</th>
                  <th className="py-2 px-3 font-normal">Precio Actual</th>
                  <th className="py-2 px-3 font-normal">Gestión de Riesgo</th>
                  <th className="py-2 px-3 font-normal text-right">P&L Neto (USD)</th>
                  <th className="py-2 px-3 font-normal text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {activePositions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-slate-900/20">
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${pos.type === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                        {pos.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">{pos.size.toFixed(1)}</td>
                    <td className="py-3 px-3">${pos.entryPrice.toFixed(2)}</td>
                    <td className="py-3 px-3 font-semibold text-white">${pos.currentPrice.toFixed(2)}</td>
                    <td className="py-3 px-3 text-slate-400">
                      <span className="block text-[10px]">SL: {pos.stopLoss ? `$${pos.stopLoss}` : "N/A"}</span>
                      <span className="block text-[10px]">TP: {pos.takeProfit ? `$${pos.takeProfit}` : "N/A"}</span>
                    </td>
                    <td className={`py-3 px-3 text-right font-bold text-sm ${pos.profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      ${pos.profit >= 0 ? "+" : ""}{pos.profit.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleClosePosition(pos.id)}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[10px] py-1 px-2.5 rounded-lg text-slate-300 transition-colors"
                      >
                        Cerrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
