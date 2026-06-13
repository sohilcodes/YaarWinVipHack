// ──────────────────────────────────────────
// WinGo API Types
// ──────────────────────────────────────────

export interface WinGoResult {
  issueNumber: string;
  number: number;
  bigSmall: "Big" | "Small";
  color: "Red" | "Green" | "Violet" | "Red+Violet" | "Green+Violet";
  time: string;
  openPrice?: string;
}

export interface GameInfo {
  gameId: string;
  gameName: string;
  status: string;
  period?: string;
}

export interface HistoryPage {
  list: WinGoResult[];
  total: number;
  pageNo: number;
  pageSize: number;
}

// ──────────────────────────────────────────
// Dashboard State Types
// ──────────────────────────────────────────

export interface DashboardStats {
  totalResults: number;
  bigCount: number;
  smallCount: number;
  lastResult: WinGoResult | null;
  currentPeriod: string;
  bigPercent: number;
  smallPercent: number;
}

// ──────────────────────────────────────────
// Prediction Types
// ──────────────────────────────────────────

export type PredictionOutcome = "Big" | "Small";

export interface PredictionData {
  predicted: PredictionOutcome;
  confidence: number;
  reasoning: string;
  last10: WinGoResult[];
  bigStreak: number;
  smallStreak: number;
  lastWinLoss: "Win" | "Loss" | "Pending";
  winRate: number;
}

// ──────────────────────────────────────────
// Filter Types
// ──────────────────────────────────────────

export type ColorFilter = "All" | "Red" | "Green" | "Violet";
export type BigSmallFilter = "All" | "Big" | "Small";

export interface FilterState {
  search: string;
  bigSmall: BigSmallFilter;
  color: ColorFilter;
}

// ──────────────────────────────────────────
// Auth Types
// ──────────────────────────────────────────

export interface AuthState {
  isAuthenticated: boolean;
  loginTime?: number;
}
