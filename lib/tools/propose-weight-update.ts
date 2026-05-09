import fs from "fs/promises";
import path from "path";
import { learningInsights, proposedWeights } from "@/lib/demo-output";
import type { SpatialTool } from ".";

export const proposeWeightUpdate: SpatialTool<{
  newWeights?: typeof proposedWeights;
  insights?: string[];
  reasoning?: string;
}> = {
  name: "propose_weight_update",
  description: "Propose and save new scoring weights.",
  async execute(input) {
    const weightsPath = path.join(process.cwd(), "data/scoring-weights.json");
    const historyPath = path.join(process.cwd(), "data/scoring-history.json");
    const current = JSON.parse(await fs.readFile(weightsPath, "utf-8"));
    const history = JSON.parse(await fs.readFile(historyPath, "utf-8").catch(() => "[]"));
    history.push(current);

    const newVersion = {
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
      updateReasoning:
        input.reasoning ||
        "Outcome analysis favors AI-employer boost, public-signal richness, and property-specific hooks.",
      weights: input.newWeights || proposedWeights
    };

    await fs.writeFile(weightsPath, JSON.stringify(newVersion, null, 2));
    await fs.writeFile(historyPath, JSON.stringify(history, null, 2));

    return {
      success: true,
      newVersion: newVersion.version,
      insights: input.insights || learningInsights,
      weights: newVersion.weights
    };
  }
};
