import { traceBus } from "@/lib/agent/trace-bus";
import { heroTheme } from "@/lib/demo-output";
import { openai } from "@/lib/openai";
import { DesignThemeSchema, type DesignTheme } from "@/lib/types";
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

export async function inferDesignThemeLive({
  buyer,
  property,
  searchResults,
  runId
}: {
  buyer: any;
  property: any;
  searchResults?: Array<{ title: string; url: string; snippet: string }>;
  runId: string;
}): Promise<DesignTheme> {
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_call",
    content: { tool: "infer_design_theme", mode: "live" }
  });

  const model = process.env.OPENAI_MODEL_AGENT || "gpt-4o-mini";

  const prompt = `You are SpatialDesk's design strategist. Given a recently-purchased SF home and the buyer's public signals, infer a single, opinionated design theme that a boutique architect could pitch.

PROPERTY:
${JSON.stringify({
  address: property.address,
  neighborhood: property.neighborhood,
  yearBuilt: property.yearBuilt,
  sqft: property.sqft,
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

PUBLIC SEARCH RESULTS:
${JSON.stringify(searchResults || [], null, 2)}

Return JSON matching this exact shape:
{
  "name": "Short evocative theme name (e.g. 'Belgian Minimalism, Vincent Van Duysen Lineage')",
  "rationale": "2-3 sentences citing specific buyer signals",
  "publicSignalCitations": ["3-5 short citation strings drawn from the buyer signals or search results"],
  "keyMaterials": ["4-6 specific materials"],
  "referenceArchitects": ["2-4 architects whose work matches the theme"]
}`;

  const completion = await openai.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }]
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const parsed = DesignThemeSchema.parse(JSON.parse(raw));

  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_result",
    content: { tool: "infer_design_theme", mode: "live", theme: parsed.name, themeDetail: parsed }
  });

  return parsed;
}
