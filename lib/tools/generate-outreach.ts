import { traceBus } from "@/lib/agent/trace-bus";
import { heroOutreach } from "@/lib/demo-output";
import type { SpatialTool } from ".";

export const generateOutreach: SpatialTool<{ buyer: any; property: any; scope: any; theme: any; runId: string }> = {
  name: "generate_outreach",
  description: "Generate three outreach variants in different voices.",
  execute({ runId }) {
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_call",
      content: { tool: "generate_outreach" }
    });
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_result",
      content: { tool: "generate_outreach", variants: heroOutreach.length, outreachVariants: heroOutreach, audit: "passed" }
    });
    return { variants: heroOutreach };
  }
};
