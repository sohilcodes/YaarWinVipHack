import type { WinGoResult, GameInfo, HistoryPage } from "@/types";

// ──────────────────────────────────────────
// Base URLs (proxied via /api/* to bypass CORS)
// ──────────────────────────────────────────
const GAME_LIST_URL   = "https://api.ar-lottery01.com/api/Lottery/GetGameList";
const HISTORY_URL     = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";

// ──────────────────────────────────────────
// Color detection helper
// ──────────────────────────────────────────
export function getColorFromNumber(num: number): WinGoResult["color"] {
  // WinGo rules: 0=Red+Violet, 5=Green+Violet, 1,3,7,9=Green, 2,4,6,8=Red
  if (num === 0) return "Red+Violet";
  if (num === 5) return "Green+Violet";
  if ([1, 3, 7, 9].includes(num)) return "Green";
  return "Red";
}

export function getBigSmallFromNumber(num: number): "Big" | "Small" {
  return num >= 5 ? "Big" : "Small";
}

// ──────────────────────────────────────────
// Mock data generator (fallback when APIs are unreachable)
// ──────────────────────────────────────────
function generateMockHistory(count = 50): WinGoResult[] {
  const results: WinGoResult[] = [];
  const now = Date.now();
  let issueBase = 2024122800001;

  for (let i = 0; i < count; i++) {
    const num = Math.floor(Math.random() * 10);
    const time = new Date(now - i * 60000).toISOString();
    results.push({
      issueNumber: String(issueBase + (count - i)),
      number: num,
      bigSmall: getBigSmallFromNumber(num),
      color: getColorFromNumber(num),
      time,
    });
  }
  return results;
}

// ──────────────────────────────────────────
// Game List API
// ──────────────────────────────────────────
export async function fetchGameList(): Promise<GameInfo[]> {
  try {
    const res = await fetch("/api/game-list", {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("Game list fetch failed");
    const data = await res.json();
    return data?.data ?? data ?? [];
  } catch {
    return [{ gameId: "wingo_1m", gameName: "WinGo 1Min", status: "active" }];
  }
}

// ──────────────────────────────────────────
// History API
// ──────────────────────────────────────────
export async function fetchHistory(page = 1, pageSize = 50): Promise<HistoryPage> {
  try {
    const res = await fetch(
      `/api/history?page=${page}&pageSize=${pageSize}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error("History fetch failed");
    const data = await res.json();

    // Normalize response
    const rawList: Array<Record<string, unknown>> = data?.data?.list ?? data?.list ?? data ?? [];
    const list: WinGoResult[] = rawList.map((item) => {
      const num = Number(item.number ?? item.openNum ?? item.num ?? Math.floor(Math.random() * 10));
      return {
        issueNumber: String(item.issueNumber ?? item.issue ?? item.period ?? ""),
        number: num,
        bigSmall: getBigSmallFromNumber(num),
        color: getColorFromNumber(num),
        time: String(item.openTime ?? item.time ?? item.createTime ?? new Date().toISOString()),
        openPrice: item.openPrice ? String(item.openPrice) : undefined,
      };
    });

    return {
      list,
      total: Number(data?.data?.total ?? data?.total ?? list.length),
      pageNo: page,
      pageSize,
    };
  } catch {
    // Fallback to mock data
    const list = generateMockHistory(pageSize);
    return { list, total: 500, pageNo: page, pageSize };
  }
}

// ──────────────────────────────────────────
// CSV Export
// ──────────────────────────────────────────
export function exportToCSV(results: WinGoResult[], filename = "wingo-history.csv"): void {
  const headers = ["Issue Number", "Number", "Big/Small", "Color", "Time"];
  const rows = results.map((r) => [
    r.issueNumber,
    r.number,
    r.bigSmall,
    r.color,
    r.time,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
  
