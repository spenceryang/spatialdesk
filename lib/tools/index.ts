import { tavilySearch } from "./tavily-search";
import { parseFloorPlan } from "./parse-floorplan";
import { inferRemodelScope } from "./infer-remodel-scope";
import { inferDesignTheme } from "./infer-design-theme";
import { build3DModel } from "./build-3d-model";
import { renderFacade } from "./render-facade";
import { generateOutreach } from "./generate-outreach";
import { scoreLead } from "./score-lead";
import { logOutcome } from "./log-outcome";
import { proposeWeightUpdate } from "./propose-weight-update";

export type SpatialTool<I = any, O = any> = {
  name: string;
  description: string;
  execute: (input: I) => Promise<O> | O;
};

export const tools = {
  tavilySearch,
  parseFloorPlan,
  inferRemodelScope,
  inferDesignTheme,
  build3DModel,
  renderFacade,
  generateOutreach,
  scoreLead,
  logOutcome,
  proposeWeightUpdate
};
