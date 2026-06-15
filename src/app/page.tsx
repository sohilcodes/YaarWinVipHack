"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Crown, Send, Lock, Eye, EyeOff, AlertTriangle, RefreshCw, LogOut, TrendingUp, TrendingDown, Clock, Zap, CheckCircle, XCircle } from "lucide-react";

interface WinGoResult {
  issueNumber: string;
  number: number;
  bigSmall: "Big" | "Small";
  color: "Red" | "Green" | "Violet" | "Red+Violet" | "Green+Violet";
  time: string;
}

function getColor(num: number): WinGoResult["color"] {
  if (num === 0) return "Red+Violet";
  if (num === 5) return "Green+Violet";
  if ([1, 3, 7, 9].includes(num)) return "Green";
  return "Red";
}

function getBigSmall(num: number): "Big" | "Small" {
  return num >= 5 ? "Big" : "Small";
}

function predict(history: WinGoResult[]): { outcome: "Big" | "Small"; confidence: number; reason: string } {
  const last10 = history.slice(0, 10);
  if (last10.length === 0) return { outcome: "Big", confidence: 50, reason: "Waiting for data..." };
  const bigCount = last10.filter(r => r.bigSmall === "Big").length;
  const smallCount = last10.length - bigCount;
  const outcome: "Big" | "Small" = bigCount > smallCount ? "Small" : "Big";
  const confidence = Math.max(bigCount, smallCount) * 10;
  const reason = bigCount > smallCount
    ? `Big heavy (${bigCount}/10) -> Small predicted`
    : `Small heavy (${smallCount}/10) -> Big predicted`;
  return { outcome, confidence, reason };
}

function numBg(color: WinGoResult["color"]): string {
  if (color === "Red+Violet" || color === "Green+Violet") return "bg-purple-600";
  if (color.includes("Red")) return "bg-red-600";
  if (color.includes("Green")) return "bg-green-600";
  return "bg-purple-600";
}

function dotColor(color: WinGoResult["color"]): string {
  if (color === "Red+Violet" || color === "Green+Violet") return "bg-purple-500";
  if (color.includes("Red")) return "bg-red-500";
  if (color.includes("Green")) return "bg-green-500";
  return "bg-purple-500";
}

const PASSWORD    = "SohilKhan21";
const STORAGE_KEY = "yw_auth";
const SESSION_TTL = 24 * 60 * 60 * 1000;

export default function App() {
  const [authed,    setAuthed]    = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [pw,        setPw]        = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [authErr,   setAuthErr]   = useState("");
  const [shake,     setShake]     = useState(false);

  const [results,    setResults]    = useState<WinGoResult[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [syncing,    setSyncing]    = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const latestIssueRef = useRef<string>("");
  const syncTimeRef    = useRef<number>(0);

  const [displayPeriod, setDisplayPeriod] = useState("——");
  const [timerSec,      setTimerSec]      = useState(0);

  const [prevPrediction, setPrevPrediction] = useState<"Big" | "Small" | null>(null);
  const [winLoss,        setWinLoss]        = useState<"Win" | "Loss" | null>(null);
  const [lastResultBS,   setLastResultBS]   = useState<"Big" | "Small" | null>(null);
  const [winCount,       setWinCount]       = useState(0);
  const [totalPred,      setTotalPred]      = useState(0);
  const prevIssueRef = useRef<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Date.now() - s.t < SESSION_TTL) setAuthed(true);
        else localStorage.removeItem(STORAGE_KEY);
      }
    } catch { localStorage.removeItem(STORAGE_KEY); }
    setAuthReady(true);
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ t: Date.now() }));
      setAuthed(true); setAuthErr("");
    } else {
      setAuthErr("Access Denied");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPw("");
    }
  };

  const logout = () => { localStorage.removeItem(STORAGE_KEY); setAuthed(false); };

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setSyncing(true);
    try {
      const res = await fetch(
        `https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?ts=${Date.now()}`,
        { signal: AbortSignal.timeout(8000) }
      );
      const json = await res.json();
      const raw: Array<Record<string, unknown>> = json?.data?.list ?? [];
      if (!raw.length) throw new Error("empty");

      const list: WinGoResult[] = raw.map(item => {
        const num = Number(item.number ?? 0);
        return {
          issueNumber: String(item.issueNumber ?? ""),
          number: num,
          bigSmall: getBigSmall(num),
          color: getColor(num),
          time: String(item.openTime ?? ""),
        };
      });

      const latest = list[0];
      if (prevIssueRef.current && prevIssueRef.current !== latest.issueNumber) {
        if (prevPrediction) {
          const won = prevPrediction === latest.bigSmall;
          setWinLoss(won ? "Win" : "Loss");
          setLastResultBS(latest.bigSmall);
          if (won) setWinCount(c => c + 1);
          setTotalPred(c => c + 1);
        }
      }
      prevIssueRef.current   = latest.issueNumber;
      latestIssueRef.current = latest.issueNumber;
      syncTimeRef.current    = Date.now();

      setResults(list);
      setLastUpdate(new Date());
    } catch {
      // keep existing on error
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [prevPrediction]);

  useEffect(() => {
    if (!authed) return;
    fetchData(false);
    const id = setInterval(() => fetchData(true), 10000);
    return () => clearInterval(id);
  }, [authed, fetchData]);

  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => {
      const sec = 60 - new Date().getSeconds();
      setTimerSec(sec === 60 ? 0 : sec);
      if (!latestIssueRef.current) return;
      const elapsed = Math.floor((Date.now() - syncTimeRef.current) / 60000);
      const current = (BigInt(latestIssueRef.current) + BigInt(elapsed) + BigInt(1)).toString();
      setDisplayPeriod(current);
    }, 1000);
    return () => clearInterval(id);
  }, [authed]);

  const pred = useMemo(() => predict(results), [results]);

  useEffect(() => {
    if (pred.outcome) setPrevPrediction(pred.outcome);
  }, [pred.outcome]);

  if (!authReady) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
    </div>
  );

  if (!authed) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4"
      style={{ background: "radial-gradient(circle at 50% 30%, rgba(245,158,11,0.07) 0%, #000 60%)" }}>

      <div className="fixed inset-0 pointer-events-none">
        {[500, 350, 200].map((s, i) => (
          <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-500/5"
            style={{ width: s, height: s }} />
        ))}
      </div>

      <div className={`w-full max-w-sm rounded-2xl border border-yellow-500/20 bg-[#111]/80 backdrop-blur-xl p-8 shadow-2xl ${shake ? "animate-bounce" : ""}`}
        style={{ boxShadow: "0 0 60px rgba(245,158,11,0.08), 0 20px 60px rgba(0,0,0,0.8)" }}>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #f59e0b, #b45309)", boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}>
            <Crown className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-xl font-black tracking-widest"
            style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            YAARWIN VIP
          </h1>
          <p className="text-yellow-500/40 text-xs tracking-widest mt-1">PRIVATE ACCESS</p>
        </div>

        {authErr && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-red-400 font-bold text-sm">{authErr}</span>
          </div>
        )}

        <form onSubmit={login} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/40" />
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={e => { setPw(e.target.value); setAuthErr(""); }}
              placeholder="Enter VIP Password"
              className="w-full bg-black/60 border border-yellow-500/20 rounded-xl pl-10 pr-10 py-3.5 text-white text-sm placeholder-gray-700 outline-none focus:border-yellow-500/50 transition-all"
              autoFocus
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-yellow-500/30 hover:text-yellow-500 transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="submit" disabled={!pw}
            className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest text-black disabled:opacity-30 transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 4px 20px rgba(245,158,11,0.3)" }}>
            ENTER DASHBOARD
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-yellow-500/10 text-center">
          <p className="text-gray-600 text-xs mb-3">Need Access?</p>
          <a href="https://t.me/sohilcodes" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/20 transition-all">
            <Send className="w-3.5 h-3.5" />
            @sohilcodes on Telegram
          </a>
        </div>
      </div>
      <p className="mt-5 text-gray-800 text-xs">Developed for Sohil Khan</p>
    </div>
  );

  const last10 = results.slice(0, 10);
  const isBig  = pred.outcome === "Big";
  const circ   = 2 * Math.PI * 28;
  const dash   = circ - ((timerSec / 60) * circ);

  return (
    <div className="min-h-screen bg-black text-white"
      style={{ background: "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.05) 0%, #000 50%)" }}>

      <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f59e0b, #b45309)" }}>
            <Crown className="w-4 h-4 text-black" />
          </div>
          <div>
            <p className="text-xs font-black tracking-widest"
              style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              YAARWIN VIP
            </p>
            <p className="text-[9px] text-yellow-500/30 tracking-widest">WinGo 1 Min</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full bg-green-400 ${syncing ? "animate-ping" : "animate-pulse"}`} />
            <span className="text-[10px] text-green-400 font-semibold">{syncing ? "SYNC" : "LIVE"}</span>
          </div>
          <button onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 text-xs hover:text-red-400 hover:border-red-500/40 transition-all">
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-5 space-y-4">

        <div className="rounded-2xl border border-yellow-500/15 bg-[#0d0d0d] p-5"
          style={{ boxShadow: "0 0 40px rgba(245,158,11,0.05)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-600 font-semibold tracking-widest uppercase mb-1">Current Period</p>
              <p className="text-3xl font-black text-white tracking-tight font-mono">
                {loading ? "——————" : displayPeriod.slice(-8)}
              </p>
              <p className="text-[10px] text-gray-700 mt-0.5 font-mono">{displayPeriod}</p>
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" width="64" height="64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(245,158,11,0.1)" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="#f59e0b" strokeWidth="4"
                  strokeDasharray={circ} strokeDashoffset={dash}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
              </svg>
              <div className="text-center z-10">
                <p className="text-lg font-black text-yellow-400 leading-none font-mono">
                  {String(timerSec).padStart(2, "0")}
                </p>
                <p className="text-[8px] text-yellow-500/50">sec</p>
              </div>
            </div>
          </div>
          {lastUpdate && (
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
              <Clock className="w-3 h-3 text-gray-700" />
              <span className="text-[9px] text-gray-700">
                Synced {lastUpdate.toLocaleTimeString("en-IN", { hour12: false })}
              </span>
              {syncing && <RefreshCw className="w-3 h-3 text-yellow-500/40 animate-spin ml-auto" />}
            </div>
          )}
        </div>

        <div className={`rounded-2xl border p-5 ${isBig ? "border-blue-500/25 bg-blue-950/20" : "border-orange-500/25 bg-orange-950/20"}`}
          style={{ boxShadow: isBig ? "0 0 40px rgba(59,130,246,0.08)" : "0 0 40px rgba(249,115,22,0.08)" }}>

          <div className="flex items-center gap-2 mb-4">
            <Zap className={`w-4 h-4 ${isBig ? "text-blue-400" : "text-orange-400"}`} />
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Next Prediction</p>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0
              ${isBig ? "bg-blue-500/15 border border-blue-500/30" : "bg-orange-500/15 border border-orange-500/30"}`}>
              {isBig
                ? <TrendingUp className="w-8 h-8 text-blue-400 mb-1" />
                : <TrendingDown className="w-8 h-8 text-orange-400 mb-1" />}
              <span className={`text-xs font-black ${isBig ? "text-blue-400" : "text-orange-400"}`}>
                {pred.outcome}
              </span>
            </div>
            <div className="flex-1">
              <p className={`text-4xl font-black ${isBig ? "text-blue-400" : "text-orange-400"}`}>
                {pred.confidence}%
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">Confidence</p>
              <div className="h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${isBig ? "bg-blue-500" : "bg-orange-500"}`}
                  style={{ width: `${pred.confidence}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/5 mb-3">
            <p className="text-[10px] text-gray-500 mb-0.5 font-semibold uppercase tracking-wider">Analysis</p>
            <p className="text-xs text-gray-300">{pred.reason}</p>
          </div>

          {winLoss && totalPred > 0 && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border
              ${winLoss === "Win" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
              {winLoss === "Win"
                ? <CheckCircle className="w-4 h-4 text-green-400" />
                : <XCircle className="w-4 h-4 text-red-400" />}
              <div className="flex-1">
                <span className={`text-xs font-bold ${winLoss === "Win" ? "text-green-400" : "text-red-400"}`}>
                  Last Round: {winLoss}
                </span>
                {lastResultBS && (
                  <span className="text-[10px] text-gray-500 ml-2">(Result: {lastResultBS})</span>
                )}
              </div>
              <span className="text-[10px] text-gray-500 font-mono">{winCount}/{totalPred}</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-yellow-500/10 bg-[#0d0d0d] p-4">
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-4">Last 10 Results</p>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-white/[0.03] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {last10.map((r, i) => (
                <div key={r.issueNumber + i}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                    ${i === 0 ? "bg-yellow-500/5 border border-yellow-500/15" : "bg-white/[0.02] border border-white/[0.04]"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0 ${numBg(r.color)}`}>
                    {r.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-600 font-mono truncate">
                      {i === 0 && <span className="text-yellow-500/70 mr-1">▶</span>}
                      {r.issueNumber}
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor(r.color)}`} />
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0
                    ${r.bigSmall === "Big"
                      ? "bg-blue-500/15 text-blue-400 border border-blue-500/25"
                      : "bg-orange-500/15 text-orange-400 border border-orange-500/25"}`}>
                    {r.bigSmall}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-[9px] text-gray-700 px-2 leading-relaxed">
          Predictions are based on statistical patterns only. No guaranteed accuracy.
        </p>
        <p className="text-center text-[9px] text-gray-800 pb-4">
          Developed for Sohil Khan · YAARWIN VIP
        </p>
      </div>
    </div>
  );
}
