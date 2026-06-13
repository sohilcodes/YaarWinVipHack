"use client";

import { BarChart3, TrendingUp, History, Crown, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard",  label: "Dashboard",  icon: BarChart3 },
  { id: "history",    label: "History",    icon: History },
  { id: "prediction", label: "Prediction", icon: TrendingUp },
];

export function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300",
          "bg-[#0d0d0d] border-r border-yellow-500/10",
          "lg:translate-x-0 lg:static lg:z-auto lg:h-auto lg:w-56 lg:shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-yellow-500/10">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-bold gold-text">YAARWIN</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="p-4 space-y-1">
          <p className="text-[10px] text-gray-600 font-semibold tracking-widest uppercase mb-3 px-2">
            Navigation
          </p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onTabChange(id); onClose(); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeTab === id
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-gold"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4", activeTab === id ? "text-yellow-400" : "text-gray-600")} />
              {label}
              {activeTab === id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom VIP badge */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="glass-card p-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-yellow-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold gold-text">VIP ACCESS</p>
              <p className="text-[9px] text-gray-600">Premium Analytics</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
