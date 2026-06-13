import { Crown, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-yellow-500/10 mt-8">
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Crown className="w-3 h-3 text-yellow-500/40" />
          <span>YAARWIN VIP WINGO HACK</span>
          <span className="text-gray-700">•</span>
          <span>Private Prediction Dashboard</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-700">
          <span>Developed with</span>
          <Heart className="w-3 h-3 text-red-500/50" />
          <span>for</span>
          <span className="text-yellow-500/50 font-semibold">Sohil Khan</span>
        </div>
      </div>
    </footer>
  );
}
