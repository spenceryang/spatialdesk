import { traceBus } from "@/lib/agent/trace-bus";
import { heroRenders } from "@/lib/demo-output";
import type { SpatialTool } from ".";

export const renderFacade: SpatialTool<{ propertyId: string; theme: string; runId: string }> = {
  name: "render_facade",
  description: "Render exterior facade variations matching a design theme.",
  execute({ theme, runId }) {
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_call",
      content: { tool: "render_facade", input: { theme } }
    });
    const result = {
      primary: heroRenders.facadePrimary,
      variants: heroRenders.facadeVariants
    };
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_result",
      content: { tool: "render_facade", count: result.variants.length, renders: result }
    });
    return result;
  }
};
