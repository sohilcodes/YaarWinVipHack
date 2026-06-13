"use client";

import { useState } from "react";
import { useAuth }       from "@/hooks/useAuth";
import { useWinGoData }  from "@/hooks/useWinGoData";
import { LoginScreen }   from "@/components/LoginScreen";
import { Header }        from "@/components/Header";
import { Sidebar }       from "@/components/Sidebar";
import { StatsCards }    from "@/components/StatsCards";
import { HistoryTable }  from "@/components/HistoryTable";
import { PredictionPanel } from "@/components/PredictionPanel";
import { TrendChart }    from "@/components/TrendChart";
import { Footer }        from "@/components/Footer";

type Tab = "dashboard" | "history" | "prediction";

export default function Home() {
  const auth      = useAuth();
  const wingo     = useWinGoData();
  const [tab,      setTab]      = useState<Tab>("dashboard");
  const [sideOpen, setSideOpen] = useState(false);

  // ── Auth gate ──────────────────────────────────────
  if (auth.isLoading) {
    return (
      <div className="min-h-screen login-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
          <p className="text-yellow-500/60 text-sm tracking-widest">LOADING…</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <LoginScreen
        onLogin={auth.login}
        error={auth.error}
        onClearError={auth.clearError}
      />
    );
  }

  // ── Dashboard ──────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-yellow-500/[0.02] blur-3xl" />
      </div>

      <Header
        onLogout={auth.logout}
        onMenuToggle={() => setSideOpen((v) => !v)}
        isRefreshing={wingo.isRefreshing}
        lastUpdated={wingo.lastUpdated}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sideOpen}
          onClose={() => setSideOpen(false)}
          activeTab={tab}
          onTabChange={(t) => setTab(t as Tab)}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">

            {/* Error banner */}
            {wingo.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-xs text-red-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {wingo.error} — showing fallback data
              </div>
            )}

            {/* ── DASHBOARD TAB ── */}
            {tab === "dashboard" && (
              <div className="space-y-6 animate-slide-up">
                <StatsCards stats={wingo.stats} isLoading={wingo.isLoading} />

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left: chart + table */}
                  <div className="lg:col-span-2 space-y-6">
                    <TrendChart results={wingo.allResults} />
                    <HistoryTable
                      results={wingo.allResults.slice(0, 50)}
                      isLoading={wingo.isLoading}
                    />
                  </div>

                  {/* Right: prediction */}
                  <div className="lg:col-span-1">
                    <PredictionPanel
                      history={wingo.allResults}
                      isLoading={wingo.isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── HISTORY TAB ── */}
            {tab === "history" && (
              <div className="animate-slide-up">
                <HistoryTable
                  results={wingo.allResults}
                  isLoading={wingo.isLoading}
                />
              </div>
            )}

            {/* ── PREDICTION TAB ── */}
            {tab === "prediction" && (
              <div className="max-w-lg mx-auto animate-slide-up">
                <PredictionPanel
                  history={wingo.allResults}
                  isLoading={wingo.isLoading}
                />
              </div>
            )}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
            }
