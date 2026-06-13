"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { WinGoResult } from "@/types";

interface TrendChartProps {
  results: WinGoResult[];
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-yellow-500/20 rounded-lg p-2.5 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.name === "Big" ? "#60a5fa" : "#fb923c" }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export function TrendChart({ results }: TrendChartProps) {
  const data = useMemo(() => {
    // Group into chunks of 10, show last 10 chunks
    const chunks: Array<{ label: string; Big: number; Small: number }> = [];
    for (let i = 0; i < Math.min(results.length, 100); i += 10) {
      const slice = results.slice(i, i + 10);
      const big   = slice.filter((r) => r.bigSmall === "Big").length;
      chunks.push({
        label: `T${Math.floor(i / 10) + 1}`,
        Big:   big,
        Small: 10 - big,
      });
    }
    return chunks.reverse();
  }, [results]);

  if (!data.length) return null;

  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-bold gold-text tracking-wider mb-4">BIG / SMALL TREND (per 10)</h2>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={12} barGap={2}>
          <XAxis
            dataKey="label"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={20}
            domain={[0, 10]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="Big" stackId="a" radius={[0, 0, 0, 0]} fill="#3b82f6" fillOpacity={0.7}>
            {data.map((_, i) => <Cell key={i} fill="rgba(59,130,246,0.7)" />)}
          </Bar>
          <Bar dataKey="Small" stackId="a" radius={[4, 4, 0, 0]} fill="#f97316" fillOpacity={0.7}>
            {data.map((_, i) => <Cell key={i} fill="rgba(249,115,22,0.7)" />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/70" />
          <span className="text-[9px] text-gray-500">Big</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-orange-500/70" />
          <span className="text-[9px] text-gray-500">Small</span>
        </div>
      </div>
    </div>
  );
}
