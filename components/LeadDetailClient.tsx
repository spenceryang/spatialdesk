"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrainCircuit, Home, Mail, PenTool, UserRound } from "lucide-react";
import { heroMoves, heroOutreach, heroRenders, heroTheme } from "@/lib/demo-output";
import type { Buyer, DesignTheme, FloorPlan, Lead, OutreachVariant, RemodelMove, TraceEvent } from "@/lib/types";
import { AgentTracePane } from "./AgentTracePane";
import { BuyerTab } from "./BuyerTab";
import { LearningTab } from "./LearningTab";
import { OutreachTab } from "./OutreachTab";
import { ProposalTab } from "./ProposalTab";
import { PropertyTab } from "./PropertyTab";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

type TabKey = "property" | "buyer" | "proposal" | "outreach" | "learning";

const tabs: Array<{ key: TabKey; label: string; icon: any }> = [
  { key: "property", label: "Property", icon: Home },
  { key: "buyer", label: "Buyer", icon: UserRound },
  { key: "proposal", label: "Proposal", icon: PenTool },
  { key: "outreach", label: "Outreach", icon: Mail },
  { key: "learning", label: "Learning", icon: BrainCircuit }
];

export function LeadDetailClient({
  lead,
  buyer,
  floorPlan,
  currentWeights
}: {
  lead: Lead;
  buyer: Buyer;
  floorPlan: FloorPlan;
  currentWeights: Record<string, number>;
}) {
  const params = useSearchParams();
  const runId = params.get("runId");
  const [active, setActive] = useState<TabKey>("property");
  const [score, setScore] = useState(lead.score || 0);
  const [theme, setTheme] = useState<DesignTheme | undefined>(lead.designTheme);
  const [moves, setMoves] = useState<RemodelMove[] | undefined>(lead.remodelScope);
  const [outreach, setOutreach] = useState<OutreachVariant[] | undefined>(lead.outreachVariants);
  const [completed, setCompleted] = useState(false);

  const effectiveTheme = theme || (completed ? heroTheme : undefined);
  const effectiveMoves = moves || (completed ? heroMoves : undefined);
  const effectiveOutreach = outreach || (completed ? heroOutreach : undefined);

  const onEvent = useCallback((event: TraceEvent) => {
    if (event.type !== "tool_result" && event.type !== "agent_complete") return;

    if (event.type === "tool_result") {
      if (event.content.tool === "score_lead" && event.content.score) setScore(event.content.score);
      if (event.content.themeDetail) {
        setTheme(event.content.themeDetail);
        setActive("proposal");
      }
      if (event.content.remodelScope) {
        setMoves(event.content.remodelScope);
        setActive("proposal");
      }
      if (event.content.outreachVariants) {
        setOutreach(event.content.outreachVariants);
        setActive("outreach");
      }
    }

    if (event.type === "agent_complete") setCompleted(true);
  }, []);

  const tabContent = useMemo(() => {
    switch (active) {
      case "property":
        return <PropertyTab lead={lead} floorPlan={floorPlan} />;
      case "buyer":
        return <BuyerTab buyer={buyer} />;
      case "proposal":
        return <ProposalTab theme={effectiveTheme} moves={effectiveMoves} renders={heroRenders} />;
      case "outreach":
        return <OutreachTab variants={effectiveOutreach} />;
      case "learning":
        return <LearningTab currentWeights={currentWeights} />;
    }
  }, [active, buyer, currentWeights, effectiveMoves, effectiveOutreach, effectiveTheme, floorPlan, lead]);

  return (
    <main className="mx-auto max-w-[1500px] px-5 py-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <a className="text-sm text-zinc-500 hover:text-brass" href="/">SpatialDesk</a>
          <h1 className="mt-2 text-3xl font-bold">{lead.property.address}</h1>
          <p className="mt-1 text-muted">{lead.property.neighborhood} · {buyer.name}, {buyer.employer}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-brass text-ink">{score ? `${score}/100` : "new"}</Badge>
          <Badge>{completed ? "outreach drafted" : runId ? "running" : "ready"}</Badge>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,.8fr)]">
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap gap-2 rounded-lg border border-line bg-white/[0.04] p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  className="h-9 px-3"
                  key={tab.key}
                  onClick={() => setActive(tab.key)}
                  variant={active === tab.key ? "primary" : "ghost"}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
          {tabContent}
        </section>
        <AgentTracePane runId={runId} onEvent={onEvent} />
      </div>
    </main>
  );
}
