import fs from "fs/promises";
import path from "path";
import { traceBus } from "@/lib/agent/trace-bus";
import type { SpatialTool } from ".";

export const parseFloorPlan: SpatialTool<{ imageUrl: string; runId: string }> = {
  name: "parse_floorplan",
  description: "Parse a floor plan image into structured floor and room JSON.",
  async execute({ imageUrl, runId }) {
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_call",
      content: { tool: "parse_floorplan", input: { imageUrl } }
    });

    const raw = await fs.readFile(path.join(process.cwd(), "data/floorplans/170-st-germain.json"), "utf-8");
    const floorPlan = JSON.parse(raw);
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_result",
      content: { tool: "parse_floorplan", floors: floorPlan.floors.length, floorPlan }
    });
    return floorPlan;
  }
};
