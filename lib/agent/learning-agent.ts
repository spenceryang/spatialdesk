import { Agent } from "@openai/agents";
import { LEARNING_AGENT_INSTRUCTIONS } from "./instructions";
import { tools } from "@/lib/tools";

export const learningAgent = new Agent({
  name: "SpatialDeskLearning",
  instructions: LEARNING_AGENT_INSTRUCTIONS,
  model: process.env.OPENAI_MODEL_AGENT || "gpt-5",
  tools: [tools.logOutcome, tools.proposeWeightUpdate] as any
});
