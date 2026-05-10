import { z } from "zod";
import { traceBus } from "@/lib/agent/trace-bus";
import { heroMoves } from "@/lib/demo-output";
import { openai } from "@/lib/openai";
import { RemodelMoveSchema, type RemodelMove } from "@/lib/types";
import type { SpatialTool } from ".";

export const inferRemodelScope: SpatialTool<{ property: any; buyer: any; floorPlan: any; runId: string }> = {
  name: "infer_remodel_scope",
  description: "Infer high-confidence remodel moves.",
  execute({ runId }) {
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_call",
      content: { tool: "infer_remodel_scope" }
    });
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_result",
      content: { tool: "infer_remodel_scope", moves: heroMoves.length, remodelScope: heroMoves }
    });
    return { moves: heroMoves };
  }
};

const ScopeResponseSchema = z.object({ moves: z.array(RemodelMoveSchema) });

export async function inferRemodelScopeLive({
  property,
  buyer,
  floorPlan,
  theme,
  runId
}: {
  property: any;
  buyer: any;
  floorPlan: any;
  theme: any;
  runId: string;
}): Promise<{ moves: RemodelMove[] }> {
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_call",
    content: { tool: "infer_remodel_scope", mode: "live" }
  });

  const model = process.env.OPENAI_MODEL_AGENT || "gpt-4o-mini";

  const prompt = `You are SpatialDesk's remodel scope planner. Propose 3-5 concrete remodel moves for this SF home that fit the buyer and the design theme. Be specific about floors, costs, and reasoning.

PROPERTY:
${JSON.stringify({
  address: property.address,
  neighborhood: property.neighborhood,
  yearBuilt: property.yearBuilt,
  sqft: property.sqft,
  stories: property.stories,
  beds: property.beds,
  baths: property.baths,
  lastMajorRemodel: property.lastMajorRemodel
}, null, 2)}

BUYER:
${JSON.stringify({
  name: buyer?.name,
  employer: buyer?.employer,
  title: buyer?.title,
  signals: buyer?.signals
}, null, 2)}

FLOOR PLAN:
${JSON.stringify(floorPlan || {}, null, 2)}

DESIGN THEME:
${JSON.stringify(theme || {}, null, 2)}

Return JSON: { "moves": [ ... ] }. Each move must match this shape exactly:
{
  "id": "move_<short_slug>",
  "title": "Short title (max 8 words)",
  "floor": <integer floor number>,
  "scope": "1-2 sentences describing the work",
  "reasoning": "1-2 sentences citing buyer signals or property constraints",
  "estimatedCost": { "low": <integer USD>, "high": <integer USD> },
  "estimatedROI": "Short ROI string OR null",
  "confidence": <number between 0 and 1>,
  "phase": <1 or 2>
}

Bias toward: ADU conversions if there's a lower-level or yard, podcast/studio buildouts for public-facing technical buyers, material-layer upgrades when the home was recently renovated. Avoid down-to-studs resets when lastMajorRemodel is within 10 years.`;

  const completion = await openai.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }]
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const parsed = ScopeResponseSchema.parse(JSON.parse(raw));

  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_result",
    content: { tool: "infer_remodel_scope", mode: "live", moves: parsed.moves.length, remodelScope: parsed.moves }
  });

  return parsed;
}
