"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { WinGoResult, DashboardStats, FilterState } from "@/types";
import { fetchHistory } from "@/lib/api";

const REFRESH_INTERVAL = 5000; // 5 seconds

export function useWinGoData() {
  const [allResults,  setAllResults]  = useState<WinGoResult[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [isRefreshing,setIsRefreshing]= useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentPeriod,setCurrentPeriod] = useState("—");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else         setIsRefreshing(true);
    setError(null);

    try {
      const page = await fetchHistory(1, 100);
      setAllResults(page.list);
      setLastUpdated(new Date());

      // Estimate current period (next issue after latest)
      if (page.list.length > 0) {
        const latest = page.list[0].issueNumber;
        const nextNum = Number(latest) + 1;
        setCurrentPeriod(isNaN(nextNum) ? latest : String(nextNum));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Auto-refresh
  useEffect(() => {
    intervalRef.current = setInterval(() => loadData(true), REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadData]);

  // Compute stats
  const stats: DashboardStats = (() => {
    const total = allResults.length;
    const big   = allResults.filter((r) => r.bigSmall === "Big").length;
    const small = total - big;
    return {
      totalResults: total,
      bigCount:     big,
      smallCount:   small,
      lastResult:   allResults[0] ?? null,
      currentPeriod,
      bigPercent:   total ? Math.round((big   / total) * 100) : 0,
      smallPercent: total ? Math.round((small / total) * 100) : 0,
    };
  })();

  // Filter helper
  const getFiltered = useCallback(
    (filters: FilterState) => {
      return allResults.filter((r) => {
        if (filters.search && !r.issueNumber.includes(filters.search)) return false;
        if (filters.bigSmall !== "All" && r.bigSmall !== filters.bigSmall) return false;
        if (filters.color    !== "All" && !r.color.includes(filters.color)) return false;
        return true;
      });
    },
    [allResults]
  );

  return {
    allResults,
    stats,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    currentPeriod,
    getFiltered,
    refresh: () => loadData(false),
  };
}
