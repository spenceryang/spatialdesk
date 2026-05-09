import fs from "fs/promises";
import path from "path";
import type { SpatialTool } from ".";

export const logOutcome: SpatialTool<Record<string, never>, any[]> = {
  name: "log_outcome",
  description: "Read the outcomes log.",
  async execute() {
    const raw = await fs.readFile(path.join(process.cwd(), "data/outcomes.json"), "utf-8");
    return JSON.parse(raw);
  }
};
