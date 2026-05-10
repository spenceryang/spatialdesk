import { z } from "zod";
import { traceBus } from "@/lib/agent/trace-bus";
import { heroOutreach } from "@/lib/demo-output";
import { openai } from "@/lib/openai";
import { OutreachVariantSchema, type OutreachVariant } from "@/lib/types";
import type { SpatialTool } from ".";

export const generateOutreach: SpatialTool<{ buyer: any; property: any; scope: any; theme: any; runId: string }> = {
  name: "generate_outreach",
  description: "Generate three outreach variants in different voices.",
  execute({ runId }) {
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_call",
      content: { tool: "generate_outreach" }
    });
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_result",
      content: { tool: "generate_outreach", variants: heroOutreach.length, outreachVariants: heroOutreach, audit: "passed" }
    });
    return { variants: heroOutreach };
  }
};

const OutreachResponseSchema = z.object({ variants: z.array(OutreachVariantSchema).length(3) });

const BANNED_PHRASES = [
  "hope this finds you well",
  "i hope this email finds you",
  "just checking in",
  "circling back",
  "touching base",
  "following up"
];

export async function generateOutreachLive({
  buyer,
  property,
  scope,
  theme,
  runId
}: {
  buyer: any;
  property: any;
  scope: any;
  theme: any;
  runId: string;
}): Promise<{ variants: OutreachVariant[]; audit: "passed" | "failed"; bannedHits?: string[] }> {
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_call",
    content: { tool: "generate_outreach", mode: "live" }
  });

  const model = process.env.OPENAI_MODEL_AGENT || "gpt-4o-mini";

  const prompt = `You are SpatialDesk's outreach writer for boutique SF design-build firms. Draft exactly THREE cold outreach variants for the buyer below. Each variant must open with a concrete fact about THIS specific home (address, level, room) — never generic pleasantries. Each must reference one buyer-specific public signal.

PROPERTY:
${JSON.stringify({
  address: property.address,
  neighborhood: property.neighborhood,
  soldPrice: property.soldPrice,
  beds: property.beds,
  baths: property.baths,
  stories: property.stories,
  lastMajorRemodel: property.lastMajorRemodel
}, null, 2)}

BUYER:
${JSON.stringify({
  name: buyer?.name,
  employer: buyer?.employer,
  title: buyer?.title,
  signals: buyer?.signals
}, null, 2)}

REMODEL SCOPE (use these as the substantive hooks):
${JSON.stringify(scope?.moves || [], null, 2)}

DESIGN THEME:
${JSON.stringify(theme || {}, null, 2)}

Return JSON: { "variants": [v1, v2, v3] }. Each variant must match exactly:
{
  "id": "outreach_<slug>",
  "voiceLabel": "Boutique Architect" | "Design-Build Practical" | "Studio Specialist",
  "subject": "Short subject line (max 8 words)",
  "body": "3-5 sentences. First sentence MUST start with the actual address or a specific room/level of this home. Reference one public signal. End with a low-friction ask.",
  "rationale": "1 sentence explaining what this variant optimizes for",
  "leadingHook": "design_thesis" | "adu_revenue" | "studio_buildout" | "view_capture"
}

Use all three voiceLabels (one each). Use three different leadingHooks. Never use phrases like "hope this finds you well", "circling back", "touching base", "following up".`;

  const completion = await openai.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }]
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const parsed = OutreachResponseSchema.parse(JSON.parse(raw));

  const lowered = parsed.variants.map((v) => `${v.subject} ${v.body}`.toLowerCase()).join(" \n ");
  const bannedHits = BANNED_PHRASES.filter((p) => lowered.includes(p));
  const audit = bannedHits.length === 0 ? "passed" : "failed";

  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_result",
    content: {
      tool: "generate_outreach",
      mode: "live",
      variants: parsed.variants.length,
      outreachVariants: parsed.variants,
      audit,
      bannedHits
    }
  });

  return { variants: parsed.variants, audit, bannedHits };
}
