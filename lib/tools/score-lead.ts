import fs from "fs/promises";
import path from "path";
import { traceBus } from "@/lib/agent/trace-bus";
import { scoreLeadDeterministic } from "@/lib/scoring";
import type { Lead, ScoringWeights } from "@/lib/types";
import type { SpatialTool } from ".";

export const scoreLead: SpatialTool<{ lead: Lead; runId: string }> = {
  name: "score_lead",
  description: "Score a lead 0-100 using current weights.",
  async execute({ lead, runId }) {
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_call",
      content: { tool: "score_lead" }
    });

    const raw = await fs.readFile(path.join(process.cwd(), "data/scoring-weights.json"), "utf-8");
    const scoring = JSON.parse(raw) as ScoringWeights;
    const result = scoreLeadDeterministic(lead, scoring);
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_result",
      content: { tool: "score_lead", ...result }
    });
    return result;
  }
};
