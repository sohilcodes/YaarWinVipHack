import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        black: {
          DEFAULT: "#000000",
          50:  "#0a0a0a",
          100: "#111111",
          200: "#1a1a1a",
          300: "#222222",
          400: "#2a2a2a",
          500: "#333333",
        },
      },
      backgroundImage: {
        "gold-gradient":  "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
        "dark-gradient":  "linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #1a1a1a 100%)",
        "card-gradient":  "linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(0,0,0,0) 100%)",
        "glow-gradient":  "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.15) 0%, transparent 70%)",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "Menlo", "monospace"],
      },
      animation: {
        "fade-in":       "fadeIn 0.5s ease-in-out",
        "slide-up":      "slideUp 0.4s ease-out",
        "pulse-gold":    "pulseGold 2s ease-in-out infinite",
        "spin-slow":     "spin 3s linear infinite",
        "shimmer":       "shimmer 1.5s ease-in-out infinite",
        "glow":          "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulseGold: { "0%,100%": { boxShadow: "0 0 0 0 rgba(245,158,11,0.3)" }, "50%": { boxShadow: "0 0 20px 4px rgba(245,158,11,0.15)" } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        glow:      { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
      },
      boxShadow: {
        "gold":      "0 0 20px rgba(245,158,11,0.2)",
        "gold-lg":   "0 0 40px rgba(245,158,11,0.3)",
        "glass":     "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card":      "0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.1)",
      },
      borderColor: {
        "gold-dim":  "rgba(245,158,11,0.2)",
        "gold-mid":  "rgba(245,158,11,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
        
