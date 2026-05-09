"use client";

import { useState } from "react";
import { Box, Layers } from "lucide-react";
import { Button } from "./ui/Button";

export function ThreeDViewer({
  existing,
  proposed
}: {
  existing: string;
  proposed: string;
}) {
  const [mode, setMode] = useState<"existing" | "proposed">("proposed");
  const src = mode === "existing" ? existing : proposed;

  return (
    <div className="rounded-lg border border-line bg-black/20">
      <div className="flex items-center justify-between gap-3 border-b border-line p-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Box className="h-4 w-4 text-brass" />
          Massing / Scope Model
        </div>
        <div className="flex gap-2">
          <Button className="h-8 px-3" onClick={() => setMode("existing")} variant={mode === "existing" ? "primary" : "secondary"}>
            <Layers className="h-3.5 w-3.5" />
            Existing Massing
          </Button>
          <Button className="h-8 px-3" onClick={() => setMode("proposed")} variant={mode === "proposed" ? "primary" : "secondary"}>
            <Layers className="h-3.5 w-3.5" />
            Proposed Scope
          </Button>
        </div>
      </div>
      <img alt={`${mode} massing`} className="aspect-[10/7] w-full rounded-b-lg bg-white object-contain" src={src} />
    </div>
  );
}
