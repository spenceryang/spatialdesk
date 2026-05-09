"use client";

import { useCallback, useState } from "react";
import { BrainCircuit, Play } from "lucide-react";
import { learningInsights, proposedWeights } from "@/lib/demo-output";
import type { TraceEvent } from "@/lib/types";
import { AgentTracePane } from "./AgentTracePane";
import { Button } from "./ui/Button";
import { ScoringEvolution } from "./ScoringEvolution";

export function LearningTab({ currentWeights }: { currentWeights: Record<string, number> }) {
  const [runId, setRunId] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>(learningInsights);
  const [weights, setWeights] = useState<Record<string, number>>(proposedWeights);

  async function runLearning() {
    const res = await fetch("/api/agent/learn", { method: "POST" });
    const data = await res.json();
    setRunId(data.runId);
  }

  const onEvent = useCallback((event: TraceEvent) => {
    if (event.type === "tool_result" && event.content.tool === "propose_weight_update") {
      if (event.content.insights) setInsights(event.content.insights);
      if (event.content.weights) setWeights(event.content.weights);
    }
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white/[0.04] p-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <BrainCircuit className="h-4 w-4 text-brass" />
            Adaptive Learning Agent
          </div>
          <p className="mt-1 text-sm text-muted">Reads outcomes, proposes scoring updates, and explains what won.</p>
        </div>
        <Button onClick={runLearning}>
          <Play className="h-4 w-4" />
          Run Learning Agent
        </Button>
      </div>
      <ScoringEvolution current={currentWeights} proposed={weights} />
      <div className="grid gap-3 md:grid-cols-2">
        {insights.map((insight) => (
          <div className="rounded-md border border-line bg-white/[0.04] p-4 text-sm leading-relaxed text-zinc-200" key={insight}>
            {insight}
          </div>
        ))}
      </div>
      <AgentTracePane runId={runId} onEvent={onEvent} title="Learning Trace" />
    </div>
  );
}
