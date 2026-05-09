import fs from "fs/promises";
import path from "path";
import { traceBus } from "@/lib/agent/trace-bus";
import { tools } from "@/lib/tools";
import { heroOutreach, heroTheme } from "@/lib/demo-output";
import type { Buyer, Lead } from "@/lib/types";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function reasoning(runId: string, text: string) {
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "reasoning",
    content: { text }
  });
}

async function loadHeroLead(leadId: string) {
  const [leadsRaw, buyersRaw] = await Promise.all([
    fs.readFile(path.join(process.cwd(), "data/leads.json"), "utf-8"),
    fs.readFile(path.join(process.cwd(), "data/buyers.json"), "utf-8")
  ]);
  const leads = JSON.parse(leadsRaw) as Lead[];
  const buyers = JSON.parse(buyersRaw) as Buyer[];
  const lead = leads.find((item) => item.id === leadId) || leads[0];
  const buyer = buyers.find((item) => item.id === (lead.buyer as { id: string }).id) || buyers[0];
  return { ...lead, buyer };
}

export async function runSpatialDeskDemo(runId: string, leadId: string) {
  const lead = await loadHeroLead(leadId);

  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "agent_start",
    content: { agent: "SpatialDesk", leadId }
  });

  await wait(500);
  reasoning(runId, "Property transfer received. Buyer identity is the gating risk, so enrichment runs before design work.");
  await wait(650);
  await tools.tavilySearch.execute({
    query: "Thibault Sottiaux OpenAI Codex Louvain podcast",
    runId
  });

  await wait(650);
  reasoning(runId, "Public signals are strong enough: Belgian education, OpenAI Codex role, and repeated podcast appearances.");
  await wait(600);
  await tools.parseFloorPlan.execute({
    imageUrl: lead.property.floorPlanUrl || "",
    runId
  });

  await wait(650);
  reasoning(runId, "The floor plan has four view-stacked levels. Score now, then stop if it falls below the proposal threshold.");
  await wait(550);
  const score = await tools.scoreLead.execute({ lead, runId });

  await wait(600);
  reasoning(runId, `Score is ${score.score}/100, above threshold. Continue into theme, scope, visuals, and outreach.`);
  await wait(550);
  await tools.inferDesignTheme.execute({ buyer: lead.buyer, property: lead.property, runId });

  await wait(600);
  reasoning(runId, "Because the home was renovated in 2016, the remodel should add precise layers instead of reopening the whole house.");
  await wait(550);
  const scope = await tools.inferRemodelScope.execute({
    property: lead.property,
    buyer: lead.buyer,
    floorPlan: {},
    runId
  });

  await wait(600);
  reasoning(runId, "Visual assets should separate existing massing from the proposed ADU, studio, and primary-suite interventions.");
  await wait(550);
  await tools.build3DModel.execute({
    propertyId: lead.property.id,
    floorPlan: {},
    scope,
    runId
  });

  await wait(550);
  await tools.renderFacade.execute({
    propertyId: lead.property.id,
    theme: heroTheme.name,
    runId
  });

  await wait(650);
  reasoning(runId, "Outreach should open with the actual house, then attach one buyer-specific public signal per variant.");
  await wait(550);
  await tools.generateOutreach.execute({
    buyer: lead.buyer,
    property: lead.property,
    scope,
    theme: heroTheme,
    runId
  });

  await wait(500);
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "agent_complete",
    content: {
      result: "Lead enriched, scored, proposed, rendered, and drafted.",
      leadUpdate: {
        score: score.score,
        scoreReasoning: score.reasoning,
        scoreBreakdown: score.breakdown,
        designTheme: heroTheme,
        remodelScope: scope.moves,
        outreachVariants: heroOutreach,
        status: "outreach_drafted"
      }
    }
  });

  await fs.mkdir(path.join(process.cwd(), "data/traces"), { recursive: true });
  await fs.writeFile(
    path.join(process.cwd(), `data/traces/${runId}.json`),
    JSON.stringify(traceBus.getBuffer(runId), null, 2)
  );
}

export async function runLearningDemo(runId: string) {
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "agent_start",
    content: { agent: "SpatialDeskLearning" }
  });

  await wait(500);
  reasoning(runId, "Read the full outcomes log and compare reply rates across employer, hook, theme, and opener type.");
  await wait(500);
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_call",
    content: { tool: "log_outcome" }
  });
  const outcomes = await tools.logOutcome.execute({});
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_result",
    content: { tool: "log_outcome", rows: outcomes.length }
  });

  await wait(650);
  reasoning(runId, "The strongest positive signals are AI employer, public-signal richness, property-specific openers, and ADU revenue for younger buyers.");
  await wait(500);
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_call",
    content: { tool: "propose_weight_update" }
  });
  const update = await tools.proposeWeightUpdate.execute({});
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_result",
    content: { tool: "propose_weight_update", ...update }
  });

  await wait(400);
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "agent_complete",
    content: { result: "Weights updated from outcome analysis.", learning: update }
  });
}
