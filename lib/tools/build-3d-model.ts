import { traceBus } from "@/lib/agent/trace-bus";
import { heroRenders } from "@/lib/demo-output";
import type { SpatialTool } from ".";

export const build3DModel: SpatialTool<{ propertyId: string; floorPlan: any; scope: any; runId: string }> = {
  name: "build_3d_model",
  description: "Build existing and proposed 3D massing model images.",
  execute({ runId }) {
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_call",
      content: { tool: "build_3d_model" }
    });
    const urls = {
      existing: heroRenders.massingExisting,
      proposed: heroRenders.massingProposed,
      sourceModel: heroRenders.sourceModel
    };
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_result",
      content: { tool: "build_3d_model", urls }
    });
    return urls;
  }
};
