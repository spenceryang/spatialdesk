"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RunMode = "demo" | "live";

type ModeState = {
  mode: RunMode;
  setMode: (mode: RunMode) => void;
};

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: "demo",
      setMode: (mode) => set({ mode })
    }),
    {
      name: "spatialdesk-mode",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
