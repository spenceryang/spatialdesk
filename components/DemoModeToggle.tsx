"use client";

import { useEffect, useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import { useModeStore } from "@/lib/store/mode";

export function DemoModeToggle() {
  const { mode, setMode } = useModeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const live = mounted && mode === "live";

  return (
    <button
      type="button"
      onClick={() => setMode(live ? "demo" : "live")}
      title={live ? "Live mode: real Tavily + OpenAI calls" : "Demo mode: deterministic, no API calls"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
        live
          ? "border-brass/50 bg-brass/15 text-brass"
          : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
      }`}
    >
      {live ? <Zap className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
      {live ? "Live Mode" : "Demo Mode"}
    </button>
  );
}
