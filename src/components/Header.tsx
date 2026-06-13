"use client";

import { Crown, LogOut, RefreshCw, Menu, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onLogout: () => void;
  onMenuToggle: () => void;
  isRefreshing: boolean;
  lastUpdated: Date | null;
}

export function Header({ onLogout, onMenuToggle, isRefreshing, lastUpdated }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-yellow-500/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-yellow-500/20 text-yellow-500/60 hover:text-yellow-500 hover:border-yellow-500/40 transition-all"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center shadow-gold">
              <Crown className="w-4 h-4 text-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-black tracking-widest gold-text leading-none">
                YAARWIN VIP PREDICTION
              </h1>
              <p className="text-[10px] text-yellow-500/40 tracking-wider mt-0.5">
                Private Prediction Dashboard
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-black gold-text leading-none">YAARWIN VIP</h1>
            </div>
          </div>
        </div>

        {/* Right: Status + Logout */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full bg-green-400",
                isRefreshing ? "animate-spin-slow" : "pulse-dot"
              )}
            />
            <span className="text-green-400 text-[10px] font-semibold tracking-wider">
              {isRefreshing ? "SYNCING" : "LIVE"}
            </span>
          </div>

          {/* Last updated */}
          {lastUpdated && (
            <div className="hidden md:flex items-center gap-1.5 text-[10px] text-gray-600">
              <Clock className="w-3 h-3" />
              <span>
                {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
              </span>
            </div>
          )}

          {/* Refresh */}
          <button
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg border border-yellow-500/20",
              "text-yellow-500/60 hover:text-yellow-500 hover:border-yellow-500/40 transition-all",
              isRefreshing && "animate-spin-slow"
            )}
            title="Refreshing every 5s"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              "border border-red-500/20 text-red-400/70",
              "hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10"
            )}
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
