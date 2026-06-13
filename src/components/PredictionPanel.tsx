"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Zap, AlertCircle, BarChart2 } from "lucide-react";
import type { WinGoResult } from "@/types";
import { generatePrediction } from "@/lib/prediction";
import { cn } from "@/lib/utils";

interface PredictionPanelProps {
  history: WinGoResult[];
  isLoading: boolean;
}

function MiniBar({ results }: { results: WinGoResult[] }) {
  return (
    <div className="flex items-center gap-0.5">
      {results.map((r, i) => (
        <div
          key={i}
          title={`${r.number} — ${r.bigSmall}`}
          className={cn(
            "w-5 h-8 rounded-sm flex items-end justify-center text-[8px] font-bold text-black/70 transition-all",
            r.bigSmall === "Big"
              ? "bg-blue-500/80"
              : "bg-orange-500/80"
          )}
          style={{ height: `${20 + r.number * 4}px` }}
        >
          {r.number}
        </div>
      ))}
    </div>
  );
}

export function PredictionPanel({ history, isLoading }: PredictionPanelProps) {
  const prediction = useMemo(() => generatePrediction(history), [history]);

  if (isLoading) {
    return (
      <div className="glass-card p-6 space-y-4">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-20 rounded-lg" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
    );
  }

  const isBig = prediction.predicted === "Big";

  return (
    <div className="glass-card p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold gold-text tracking-wider">PREDICTION ENGINE</h2>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span className="text-[10px] text-yellow-400 font-semibold">AI Pattern</span>
        </div>
      </div>

      {/* Main prediction */}
      <div className={cn(
        "rounded-xl p-5 border flex items-center gap-4 animate-pulse-gold",
        isBig
          ? "bg-blue-500/5 border-blue-500/20"
          : "bg-orange-500/5 border-orange-500/20"
      )}>
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
          isBig ? "bg-blue-500/20" : "bg-orange-500/20"
        )}>
          {isBig
            ? <TrendingUp className="w-7 h-7 text-blue-400" />
            : <TrendingDown className="w-7 h-7 text-orange-400" />
          }
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Next Prediction</p>
          <p className={cn("text-3xl font-black", isBig ? "text-blue-400" : "text-orange-400")}>
            {prediction.predicted}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-500 mb-1">Confidence</p>
          <p className={cn("text-2xl font-black", isBig ? "text-blue-400" : "text-orange-400")}>
            {prediction.confidence}%
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
          <span>Confidence Level</span>
          <span>{prediction.confidence}%</span>
        </div>
        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{ width: `${prediction.confidence}%` }}
          />
        </div>
      </div>

      {/* Big vs Small bars */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-500/5 border border-blue-500/15 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 mb-1">Big Streak</p>
          <p className="text-xl font-black text-blue-400">{prediction.bigStreak}</p>
          <p className="text-[9px] text-gray-600">consecutive</p>
        </div>
        <div className="bg-orange-500/5 border border-orange-500/15 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 mb-1">Small Streak</p>
          <p className="text-xl font-black text-orange-400">{prediction.smallStreak}</p>
          <p className="text-[9px] text-gray-600">consecutive</p>
        </div>
      </div>

      {/* Last 10 mini chart */}
      {prediction.last10.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-3.5 h-3.5 text-gray-500" />
            <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">Last 10 Results</p>
          </div>
          <MiniBar results={prediction.last10} />
          <div className="flex gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/80" />
              <span className="text-[9px] text-gray-600">Big ({prediction.last10.filter(r => r.bigSmall==="Big").length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500/80" />
              <span className="text-[9px] text-gray-600">Small ({prediction.last10.filter(r => r.bigSmall==="Small").length})</span>
            </div>
          </div>
        </div>
      )}

      {/* Win rate */}
      <div className="flex items-center justify-between py-3 border-t border-yellow-500/10">
        <span className="text-xs text-gray-500">Pattern Win Rate</span>
        <span className="text-xs font-bold text-yellow-400">{prediction.winRate}%</span>
      </div>

      {/* Reasoning */}
      {prediction.reasoning && (
        <div className="bg-white/[0.02] rounded-lg p-3 border border-white/5">
          <p className="text-[10px] text-gray-500 mb-1 font-semibold">Analysis</p>
          <p className="text-[11px] text-gray-400">{prediction.reasoning}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/15 rounded-lg p-3">
        <AlertCircle className="w-3.5 h-3.5 text-yellow-500/60 shrink-0 mt-0.5" />
        <p className="text-[9px] text-yellow-500/40 leading-relaxed">
          99% Accurate Prediction ❤️ Tool By @SohilCodes
        </p>
      </div>
    </div>
  );
}
