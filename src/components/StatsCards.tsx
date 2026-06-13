"use client";

import { TrendingUp, TrendingDown, Hash, Target, Clock } from "lucide-react";
import type { DashboardStats } from "@/types";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: DashboardStats;
  isLoading: boolean;
}

function SkeletonCard() {
  return (
    <div className="glass-card p-5">
      <div className="skeleton h-3 w-20 rounded mb-3" />
      <div className="skeleton h-7 w-16 rounded mb-2" />
      <div className="skeleton h-2 w-28 rounded" />
    </div>
  );
}

function getColorBadgeClass(color: string): string {
  if (color.includes("Red") && color.includes("Violet")) return "badge-purple";
  if (color.includes("Green") && color.includes("Violet")) return "badge-purple";
  if (color.includes("Red"))   return "badge-red";
  if (color.includes("Green")) return "badge-green";
  return "badge-purple";
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Results",
      value: stats.totalResults.toLocaleString(),
      sub:   "Records loaded",
      icon:  Hash,
      color: "text-yellow-400",
      bg:    "bg-yellow-500/10",
    },
    {
      title: "Big Results",
      value: stats.bigCount.toString(),
      sub:   `${stats.bigPercent}% of total`,
      icon:  TrendingUp,
      color: "text-blue-400",
      bg:    "bg-blue-500/10",
    },
    {
      title: "Small Results",
      value: stats.smallCount.toString(),
      sub:   `${stats.smallPercent}% of total`,
      icon:  TrendingDown,
      color: "text-orange-400",
      bg:    "bg-orange-500/10",
    },
    {
      title: "Last Result",
      value: stats.lastResult ? String(stats.lastResult.number) : "—",
      sub:   stats.lastResult ? `${stats.lastResult.bigSmall} • ${stats.lastResult.color}` : "Loading...",
      icon:  Target,
      color: "text-green-400",
      bg:    "bg-green-500/10",
      badge: stats.lastResult?.number,
      badgeColor: stats.lastResult ? getColorBadgeClass(stats.lastResult.color) : "",
    },
    {
      title: "Current Period",
      value: stats.currentPeriod ? stats.currentPeriod.slice(-6) : "—",
      sub:   "Next issue",
      icon:  Clock,
      color: "text-purple-400",
      bg:    "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map(({ title, value, sub, icon: Icon, color, bg, badge, badgeColor }) => (
        <div key={title} className="glass-card p-4 lg:p-5 animate-fade-in hover:scale-[1.01] transition-transform">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">{title}</p>
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", bg)}>
              <Icon className={cn("w-3.5 h-3.5", color)} />
            </div>
          </div>

          {badge !== undefined ? (
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("number-badge text-base", badgeColor)}>{badge}</span>
            </div>
          ) : (
            <p className={cn("text-2xl font-black mb-1", color)}>{value}</p>
          )}

          <p className="text-[10px] text-gray-600 truncate">{sub}</p>
        </div>
      ))}
    </div>
  );
        }
              
