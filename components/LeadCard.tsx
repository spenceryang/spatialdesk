"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Play } from "lucide-react";
import type { Lead } from "@/lib/types";
import { money } from "@/lib/utils";
import { useModeStore } from "@/lib/store/mode";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

export function LeadCard({ lead, hero = false }: { lead: Lead; hero?: boolean }) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const mode = useModeStore((s) => s.mode);

  async function runAgent() {
    setRunning(true);
    await fetch("/api/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead.id })
    });
    const res = await fetch("/api/agent/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead.id, mode })
    });
    const { runId } = await res.json();
    router.push(`/leads/${lead.id}?runId=${runId}`);
  }

  if (hero) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-brass/40 bg-white/[0.06] p-5 shadow-glow">
        <div className="absolute right-5 top-5 h-3 w-3 animate-pulse rounded-full bg-brass" />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge className="bg-brass text-ink">Hero Lead</Badge>
          <Badge>94/100 expected</Badge>
          <Badge>Layer remodel + ADU + studio</Badge>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.4fr_.8fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-normal">{lead.property.address}</h2>
            <p className="mt-2 text-muted">
              {lead.property.neighborhood} · {money(lead.property.soldPrice)} · Buyer: Thibault Sottiaux, OpenAI Codex
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300">
              One property transfer launches buyer enrichment, lead scoring, floor-plan parsing, remodel proposal generation, facade renders, outreach drafting, and adaptive learning.
            </p>
          </div>
          <div className="flex items-end justify-start lg:justify-end">
            <Button disabled={running} onClick={runAgent}>
              <Play className="h-4 w-4" />
              {running ? "Starting Agent" : "Run Agent"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      className="rounded-lg border border-line bg-white/[0.04] p-4 text-left transition hover:border-brass/40 hover:bg-white/[0.07]"
      onClick={() => router.push(`/leads/${lead.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{lead.property.address}</div>
          <div className="mt-1 text-sm text-muted">{lead.property.neighborhood}</div>
        </div>
        <ArrowRight className="h-4 w-4 text-zinc-500" />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span>{money(lead.property.soldPrice)}</span>
        <span className="text-brass">{lead.score || "new"}</span>
      </div>
    </button>
  );
}
