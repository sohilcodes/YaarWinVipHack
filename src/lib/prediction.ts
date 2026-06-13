import type { WinGoResult, PredictionData, PredictionOutcome } from "@/types";

// ──────────────────────────────────────────
// Pattern-based prediction engine
// Uses: streak analysis, frequency, alternation patterns
// ⚠️ For entertainment purposes — no guaranteed accuracy.
// ──────────────────────────────────────────

function currentStreak(results: WinGoResult[]): { type: PredictionOutcome; length: number } {
  if (!results.length) return { type: "Big", length: 0 };
  const first = results[0].bigSmall;
  let count = 0;
  for (const r of results) {
    if (r.bigSmall === first) count++;
    else break;
  }
  return { type: first, length: count };
}

function frequencyScore(results: WinGoResult[]): { big: number; small: number } {
  const big   = results.filter((r) => r.bigSmall === "Big").length;
  const small = results.length - big;
  return { big, small };
}

function alternationScore(results: WinGoResult[]): number {
  // Returns how alternating the sequence is (0–1)
  if (results.length < 2) return 0;
  let alternations = 0;
  for (let i = 1; i < results.length; i++) {
    if (results[i].bigSmall !== results[i - 1].bigSmall) alternations++;
  }
  return alternations / (results.length - 1);
}

export function generatePrediction(history: WinGoResult[]): PredictionData {
  const last10  = history.slice(0, 10);
  const last20  = history.slice(0, 20);

  if (last10.length === 0) {
    return {
      predicted: "Big",
      confidence: 50,
      reasoning: "Insufficient data — waiting for history.",
      last10: [],
      bigStreak: 0,
      smallStreak: 0,
      lastWinLoss: "Pending",
      winRate: 50,
    };
  }

  const streak      = currentStreak(last10);
  const freq10      = frequencyScore(last10);
  const freq20      = frequencyScore(last20);
  const altScore    = alternationScore(last10);

  let bigWeight   = 0;
  let smallWeight = 0;
  const reasons: string[] = [];

  // 1. Streak reversal: long streaks tend to break
  if (streak.length >= 3) {
    const opposite: PredictionOutcome = streak.type === "Big" ? "Small" : "Big";
    if (opposite === "Big") bigWeight   += streak.length * 2;
    else                    smallWeight += streak.length * 2;
    reasons.push(`${streak.type} streak of ${streak.length} — reversal expected`);
  } else {
    // Continue trend for short streaks
    if (streak.type === "Big") bigWeight   += 1;
    else                       smallWeight += 1;
    reasons.push(`Short ${streak.type} streak of ${streak.length}`);
  }

  // 2. Frequency imbalance: lean toward the underrepresented side
  if (freq10.big > freq10.small + 2) {
    smallWeight += 3;
    reasons.push(`Big dominant in last 10 (${freq10.big}/10) — Small likely`);
  } else if (freq10.small > freq10.big + 2) {
    bigWeight   += 3;
    reasons.push(`Small dominant in last 10 (${freq10.small}/10) — Big likely`);
  }

  // 3. Alternation pattern
  if (altScore > 0.7) {
    const nextExpected: PredictionOutcome = last10[0].bigSmall === "Big" ? "Small" : "Big";
    if (nextExpected === "Big") bigWeight   += 2;
    else                        smallWeight += 2;
    reasons.push("High alternation pattern detected");
  }

  // 4. 20-result trend
  if (freq20.big > freq20.small + 4) {
    smallWeight += 1;
    reasons.push("Big trend over 20 results — Small correction likely");
  } else if (freq20.small > freq20.big + 4) {
    bigWeight   += 1;
    reasons.push("Small trend over 20 results — Big correction likely");
  }

  const total      = bigWeight + smallWeight || 1;
  const predicted: PredictionOutcome  = bigWeight >= smallWeight ? "Big" : "Small";
  const rawConf    = Math.round((Math.max(bigWeight, smallWeight) / total) * 100);
  const confidence = Math.min(Math.max(rawConf, 51), 89); // cap at 51–89%

  // Win rate (simulated based on frequency balance)
  const balance  = Math.abs(freq20.big - freq20.small) / (last20.length || 1);
  const winRate  = Math.round(50 + balance * 30);

  return {
    predicted,
    confidence,
    reasoning: reasons.slice(0, 2).join(" • "),
    last10,
    bigStreak: streak.type === "Big" ? streak.length : 0,
    smallStreak: streak.type === "Small" ? streak.length : 0,
    lastWinLoss: "Pending",
    winRate: Math.min(winRate, 75),
  };
}
