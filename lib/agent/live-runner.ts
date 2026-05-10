import fs from "fs/promises";
import path from "path";
import { traceBus } from "@/lib/agent/trace-bus";
import { tools } from "@/lib/tools";
import { tavilySearchLive } from "@/lib/tools/tavily-search";
import { inferDesignThemeLive } from "@/lib/tools/infer-design-theme";
import { inferRemodelScopeLive } from "@/lib/tools/infer-remodel-scope";
import { generateOutreachLive } from "@/lib/tools/generate-outreach";
import type { Buyer, Lead } from "@/lib/types";

function emit(runId: string, type: string, content: any) {
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: type as any,
    content
  });
}

function reasoning(runId: string, text: string) {
  emit(runId, "reasoning", { text });
}

async function loadLead(leadId: string) {
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

function buildSearchQuery(buyer: Buyer): string {
  const parts: string[] = [];
  if (buyer.name) parts.push(buyer.name);
  if (buyer.employer) parts.push(buyer.employer);
  if (buyer.title) parts.push(buyer.title);
  const educationSignal = buyer.signals?.find((s) => s.type === "education");
  if (educationSignal) parts.push(educationSignal.content);
  parts.push("podcast OR linkedin OR github");
  return parts.join(" ");
}

export async function runSpatialDeskLive(runId: string, leadId: string) {
  const lead = await loadLead(leadId);

  emit(runId, "agent_start", { agent: "SpatialDesk", mode: "live", leadId });

  try {
    reasoning(runId, "Live mode. Enriching the buyer first; everything downstream depends on what we find.");
    const search = await tavilySearchLive({ query: buildSearchQuery(lead.buyer), runId });

    reasoning(runId, `Tavily returned ${search.results.length} results. Parsing the floor plan next so we can ground the scope in actual rooms.`);
    const floorPlan = await tools.parseFloorPlan.execute({
      imageUrl: lead.property.floorPlanUrl || "",
      runId
    });

    reasoning(runId, "Scoring the lead now; if the score is below threshold we stop before burning tokens on design work.");
    const score = await tools.scoreLead.execute({ lead, runId });

    if (score.score < 60) {
      emit(runId, "agent_complete", {
        result: `Score ${score.score} below threshold; stopped before proposal.`,
        leadUpdate: { score: score.score, scoreReasoning: score.reasoning, status: "scored" }
      });
      return;
    }

    reasoning(runId, `Score ${score.score}/100 clears the bar. Inferring a design theme grounded in the search signals.`);
    const theme = await inferDesignThemeLive({
      buyer: lead.buyer,
      property: lead.property,
      searchResults: search.results,
      runId
    });

    reasoning(runId, "Theme set. Generating the remodel scope now — favoring layered moves over down-to-studs given the recent renovation.");
    const scope = await inferRemodelScopeLive({
      property: lead.property,
      buyer: lead.buyer,
      floorPlan,
      theme,
      runId
    });

    reasoning(runId, "Scope locked. Pulling the pre-baked massing and facade renders for the visual layer.");
    await tools.build3DModel.execute({
      propertyId: lead.property.id,
      floorPlan,
      scope,
      runId
    });
    await tools.renderFacade.execute({
      propertyId: lead.property.id,
      theme: theme.name,
      runId
    });

    reasoning(runId, "Drafting three outreach voices — each opens with this specific home and one buyer-specific signal.");
    const outreach = await generateOutreachLive({
      buyer: lead.buyer,
      property: lead.property,
      scope,
      theme,
      runId
    });

    emit(runId, "agent_complete", {
      result: "Live run complete: enriched, scored, themed, scoped, rendered, drafted.",
      mode: "live",
      leadUpdate: {
        score: score.score,
        scoreReasoning: score.reasoning,
        scoreBreakdown: score.breakdown,
        designTheme: theme,
        remodelScope: scope.moves,
        outreachVariants: outreach.variants,
        status: "outreach_drafted"
      }
    });

    await fs.mkdir(path.join(process.cwd(), "data/traces"), { recursive: true });
    await fs.writeFile(
      path.join(process.cwd(), `data/traces/${runId}.json`),
      JSON.stringify(traceBus.getBuffer(runId), null, 2)
    );
  } catch (err: any) {
    emit(runId, "error", { message: err?.message || String(err), mode: "live" });
    emit(runId, "agent_complete", { result: "Live run failed.", error: err?.message || String(err) });
  }
}

export async function runLearningLive(runId: string) {
  emit(runId, "agent_start", { agent: "SpatialDeskLearning", mode: "live" });

  try {
    reasoning(runId, "Loading outcomes log to score reply-rate drivers.");
    emit(runId, "tool_call", { tool: "log_outcome" });
    const outcomes = await tools.logOutcome.execute({});
    emit(runId, "tool_result", { tool: "log_outcome", rows: outcomes.length });

    reasoning(runId, "Computing the next weight version from outcome distribution.");
    emit(runId, "tool_call", { tool: "propose_weight_update" });
    const update = await tools.proposeWeightUpdate.execute({});
    emit(runId, "tool_result", { tool: "propose_weight_update", ...update });

    emit(runId, "agent_complete", {
      result: "Weights updated from outcome analysis.",
      mode: "live",
      learning: update
    });
  } catch (err: any) {
    emit(runId, "error", { message: err?.message || String(err), mode: "live" });
    emit(runId, "agent_complete", { result: "Learning run failed.", error: err?.message || String(err) });
  }
}
