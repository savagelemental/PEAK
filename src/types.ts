export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ClimbStats {
  pipsClimbed: number;
  winRate: number;
  rank: string;
  activeBalance: number;
  simulatedProfit: number;
  completedLessons: number;
}

export interface Course {
  id: string;
  title: string;
  difficulty: "Iniciación" | "Avanzado" | "Élite" | "Campamento Base" | "Paso de Glaciar" | "Cima de los Andes";
  description: string;
  duration: string;
  modules: string[];
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface Position {
  id: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  currentPrice: number;
  size: number;
  stopLoss?: number;
  takeProfit?: number;
  profit: number;
  timestamp: string;
}
