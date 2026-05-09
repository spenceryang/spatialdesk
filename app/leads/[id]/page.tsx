import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { LeadDetailClient } from "@/components/LeadDetailClient";
import type { Buyer, FloorPlan, Lead, ScoringWeights } from "@/lib/types";

async function loadData(id: string) {
  const [leadsRaw, buyersRaw, floorRaw, weightsRaw] = await Promise.all([
    fs.readFile(path.join(process.cwd(), "data/leads.json"), "utf-8"),
    fs.readFile(path.join(process.cwd(), "data/buyers.json"), "utf-8"),
    fs.readFile(path.join(process.cwd(), "data/floorplans/170-st-germain.json"), "utf-8"),
    fs.readFile(path.join(process.cwd(), "data/scoring-weights.json"), "utf-8")
  ]);
  const leads = JSON.parse(leadsRaw) as Lead[];
  const buyers = JSON.parse(buyersRaw) as Buyer[];
  const lead = leads.find((item) => item.id === id);
  if (!lead) return null;
  const buyer = buyers.find((item) => item.id === (lead.buyer as { id: string }).id) || buyers[0];
  return {
    lead,
    buyer,
    floorPlan: JSON.parse(floorRaw) as FloorPlan,
    weights: JSON.parse(weightsRaw) as ScoringWeights
  };
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();

  return (
    <LeadDetailClient
      lead={data.lead}
      buyer={data.buyer}
      floorPlan={data.floorPlan}
      currentWeights={data.weights.weights}
    />
  );
}
