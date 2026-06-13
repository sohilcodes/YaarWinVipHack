"use client";

import { useState, useRef } from "react";
import { Lock, Send, Eye, EyeOff, Crown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
  error: string;
  onClearError: () => void;
}

export function LoginScreen({ onLogin, error, onClearError }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [shaking,  setShaking]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(password);
    if (!ok) {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setPassword("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="login-bg min-h-screen flex flex-col items-center justify-center px-4">
      {/* Background decorative rings */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-yellow-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-yellow-500/8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-yellow-500/10" />
      </div>

      <div
        className={cn(
          "glass-card w-full max-w-md p-8 animate-slide-up relative",
          shaking && "animate-[shake_0.5s_ease-in-out]"
        )}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center shadow-gold-lg">
              <Crown className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-wider gold-text mb-1">
            YAARWIN VIP
          </h1>
          <p className="text-yellow-500/60 text-sm font-medium tracking-widest uppercase">
            Private Analytics Access
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-red-400 font-semibold text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
            <input
              ref={inputRef}
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); onClearError(); }}
              placeholder="Enter VIP Password"
              className={cn(
                "w-full bg-black/50 border rounded-lg pl-10 pr-10 py-3",
                "text-white placeholder-gray-600 text-sm font-medium",
                "focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all",
                error ? "border-red-500/50" : "border-yellow-500/20 focus:border-yellow-500/50"
              )}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500/40 hover:text-yellow-500 transition-colors"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!password}
            className="btn-gold w-full py-3 text-sm font-bold tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              ENTER DASHBOARD
            </span>
          </button>
        </form>

        {/* Contact */}
        <div className="mt-8 pt-6 border-t border-yellow-500/10 text-center">
          <p className="text-gray-500 text-xs mb-3">Need Access?</p>
          <a
            href="https://t.me/sohilcodes"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
              "bg-blue-500/10 border border-blue-500/30 text-blue-400",
              "hover:bg-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            )}
          >
            <Send className="w-4 h-4" />
            Contact @sohilcodes on Telegram
          </a>
        </div>
      </div>

      <p className="mt-6 text-gray-700 text-xs">
        Developed by Sohil Khan
      </p>
    </div>
  );
}
