import { traceBus } from "@/lib/agent/trace-bus";
import { heroMoves } from "@/lib/demo-output";
import type { SpatialTool } from ".";

export const inferRemodelScope: SpatialTool<{ property: any; buyer: any; floorPlan: any; runId: string }> = {
  name: "infer_remodel_scope",
  description: "Infer high-confidence remodel moves.",
  execute({ runId }) {
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_call",
      content: { tool: "infer_remodel_scope" }
    });
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_result",
      content: { tool: "infer_remodel_scope", moves: heroMoves.length, remodelScope: heroMoves }
    });
    return { moves: heroMoves };
  }
};
