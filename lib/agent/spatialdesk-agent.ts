import { Agent } from "@openai/agents";
import { SPATIALDESK_AGENT_INSTRUCTIONS } from "./instructions";
import { tools } from "@/lib/tools";

export const spatialDeskAgent = new Agent({
  name: "SpatialDesk",
  instructions: SPATIALDESK_AGENT_INSTRUCTIONS,
  model: process.env.OPENAI_MODEL_AGENT || "gpt-5",
  tools: [
    tools.tavilySearch,
    tools.parseFloorPlan,
    tools.scoreLead,
    tools.inferDesignTheme,
    tools.inferRemodelScope,
    tools.build3DModel,
    tools.renderFacade,
    tools.generateOutreach
  ] as any
});
