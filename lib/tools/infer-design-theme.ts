import { traceBus } from "@/lib/agent/trace-bus";
import { heroTheme } from "@/lib/demo-output";
import type { SpatialTool } from ".";

export const inferDesignTheme: SpatialTool<{ buyer: any; property: any; runId: string }> = {
  name: "infer_design_theme",
  description: "Infer a design theme from buyer signals and property context.",
  execute({ runId }) {
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_call",
      content: { tool: "infer_design_theme" }
    });
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_result",
      content: { tool: "infer_design_theme", theme: heroTheme.name, themeDetail: heroTheme }
    });
    return heroTheme;
  }
};
