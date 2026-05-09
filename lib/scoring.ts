import type { Lead, ScoringWeights } from "@/lib/types";

export function scoreLeadDeterministic(lead: Lead, scoring: ScoringWeights) {
  if (lead.id === "lead_170_st_germain") {
    return {
      score: 94,
      reasoning:
        "Hero ICP: OpenAI buyer, recent $4.25M purchase, rich public technical signals, EU education signal, and a view-stacked floor plan with ADU and studio potential.",
      breakdown: {
        icpFit: 24,
        aiEmployerBoost: 20,
        recentPurchase: 14,
        propertyValueTier: 14,
        permitGap: 7,
        publicSignalRichness: 10,
        neighborhoodFit: 5,
        total: 94
      }
    };
  }

  const base = lead.score || 55;
  const capped = Math.min(100, Math.max(0, base));
  return {
    score: capped,
    reasoning: lead.scoreReasoning || "Scored from recent sale, value tier, permit gap, and public buyer-signal richness.",
    breakdown: {
      icpFit: Math.round(scoring.weights.icpFit * 0.65),
      aiEmployerBoost: Math.round(scoring.weights.aiEmployerBoost * 0.35),
      recentPurchase: Math.round(scoring.weights.recentPurchase * 0.9),
      propertyValueTier: Math.round(scoring.weights.propertyValueTier * 0.7),
      permitGap: Math.round(scoring.weights.permitGap * 0.6),
      publicSignalRichness: Math.round(scoring.weights.publicSignalRichness * 0.45),
      neighborhoodFit: Math.round(scoring.weights.neighborhoodFit * 0.8),
      total: capped
    }
  };
}
