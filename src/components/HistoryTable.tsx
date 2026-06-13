"use client";

import { useState, useMemo } from "react";
import { Search, Download, Filter, X } from "lucide-react";
import type { WinGoResult, FilterState, BigSmallFilter, ColorFilter } from "@/types";
import { cn, formatTime, shortIssue } from "@/lib/utils";
import { exportToCSV } from "@/lib/api";

// ── Color Badge ──────────────────────────────────────────
function ColorBadge({ color }: { color: WinGoResult["color"] }) {
  const cfg: Record<string, string> = {
    "Red":           "bg-red-500/15 text-red-400 border-red-500/30",
    "Green":         "bg-green-500/15 text-green-400 border-green-500/30",
    "Violet":        "bg-purple-500/15 text-purple-400 border-purple-500/30",
    "Red+Violet":    "bg-gradient-to-r from-red-500/15 to-purple-500/15 text-red-300 border-purple-500/30",
    "Green+Violet":  "bg-gradient-to-r from-green-500/15 to-purple-500/15 text-green-300 border-purple-500/30",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border", cfg[color] ?? "text-gray-400")}>
      {color}
    </span>
  );
}

// ── Number Circle ─────────────────────────────────────────
function NumberCircle({ num, color }: { num: number; color: WinGoResult["color"] }) {
  const cls = color.includes("Red") && color.includes("Violet")
    ? "badge-purple"
    : color.includes("Green") && color.includes("Violet")
    ? "badge-purple"
    : color.includes("Red")
    ? "badge-red"
    : "badge-green";
  return <span className={cn("number-badge", cls)}>{num}</span>;
}

// ── Skeleton Row ──────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

// ── Main Table ────────────────────────────────────────────
interface HistoryTableProps {
  results: WinGoResult[];
  isLoading: boolean;
  initialFilters?: FilterState;
}

export function HistoryTable({ results, isLoading, initialFilters }: HistoryTableProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters ?? { search: "", bigSmall: "All", color: "All" }
  );

  const filtered = useMemo(() => {
    return results.filter((r) => {
      if (filters.search && !r.issueNumber.includes(filters.search)) return false;
      if (filters.bigSmall !== "All" && r.bigSmall !== filters.bigSmall) return false;
      if (filters.color    !== "All" && !r.color.includes(filters.color)) return false;
      return true;
    });
  }, [results, filters]);

  const clearFilters = () => setFilters({ search: "", bigSmall: "All", color: "All" });
  const hasFilters   = filters.search || filters.bigSmall !== "All" || filters.color !== "All";

  return (
    <div className="glass-card flex flex-col">
      {/* Controls */}
      <div className="p-4 border-b border-yellow-500/10 flex flex-wrap gap-3 items-center justify-between">
        <h2 className="text-sm font-bold gold-text tracking-wider">RESULT HISTORY</h2>

        <div className="flex flex-wrap gap-2 items-center flex-1 justify-end">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
            <input
              type="text"
              placeholder="Issue #"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="bg-black/40 border border-yellow-500/20 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/40 w-28"
            />
          </div>

          {/* Big/Small filter */}
          <select
            value={filters.bigSmall}
            onChange={(e) => setFilters((f) => ({ ...f, bigSmall: e.target.value as BigSmallFilter }))}
            className="bg-black/40 border border-yellow-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500/40"
          >
            <option value="All">All</option>
            <option value="Big">Big</option>
            <option value="Small">Small</option>
          </select>

          {/* Color filter */}
          <select
            value={filters.color}
            onChange={(e) => setFilters((f) => ({ ...f, color: e.target.value as ColorFilter }))}
            className="bg-black/40 border border-yellow-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500/40"
          >
            <option value="All">All Colors</option>
            <option value="Red">Red</option>
            <option value="Green">Green</option>
            <option value="Violet">Violet</option>
          </select>

          {/* Clear */}
          {hasFilters && (
            <button onClick={clearFilters} className="text-gray-500 hover:text-yellow-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Export */}
          <button
            onClick={() => exportToCSV(filtered)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/20 transition-all"
          >
            <Download className="w-3 h-3" />
            CSV
          </button>
        </div>
      </div>

      {/* Count badge */}
      {hasFilters && (
        <div className="px-4 py-2 text-[10px] text-gray-500 border-b border-yellow-500/10 flex items-center gap-1.5">
          <Filter className="w-3 h-3" />
          {filtered.length} of {results.length} results
        </div>
      )}

      {/* Table */}
      <div className="table-responsive overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-yellow-500/10">
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 tracking-wider uppercase">Issue</th>
              <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500 tracking-wider uppercase">Number</th>
              <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500 tracking-wider uppercase">Big/Small</th>
              <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500 tracking-wider uppercase">Color</th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-500 tracking-wider uppercase">Time</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
              : filtered.length === 0
              ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-600 text-xs">
                    {hasFilters ? "No results match your filters" : "No data available"}
                  </td>
                </tr>
              )
              : filtered.map((result, idx) => (
                <tr
                  key={`${result.issueNumber}-${idx}`}
                  className="table-row-hover border-b border-white/[0.03] animate-fade-in"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {shortIssue(result.issueNumber)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <NumberCircle num={result.number} color={result.color} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      result.bigSmall === "Big"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    )}>
                      {result.bigSmall}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ColorBadge color={result.color} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[10px] text-gray-600">
                    {formatTime(result.time)}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
