import { z } from "zod";

export const PropertySchema = z.object({
  id: z.string(),
  address: z.string(),
  neighborhood: z.string(),
  city: z.string().default("San Francisco"),
  zip: z.string(),
  soldDate: z.string(),
  soldPrice: z.number(),
  yearBuilt: z.number(),
  sqft: z.number(),
  lotSqft: z.number(),
  beds: z.number(),
  baths: z.number(),
  stories: z.number(),
  permitHistory: z.array(z.object({
    date: z.string(),
    description: z.string(),
    cost: z.number().optional()
  })),
  lastMajorRemodel: z.string().nullable(),
  photos: z.array(z.string()),
  floorPlanUrl: z.string().optional()
});

export const BuyerSignalSchema = z.object({
  type: z.enum(["education", "career", "public_post", "investment", "publication", "podcast", "github", "x_post"]),
  content: z.string(),
  sourceUrl: z.string().optional(),
  weight: z.number()
});

export const BuyerSchema = z.object({
  id: z.string(),
  name: z.string(),
  isDemoPersona: z.boolean(),
  employer: z.string().nullable(),
  title: z.string().nullable(),
  signals: z.array(BuyerSignalSchema),
  inferredCompBand: z.enum(["MTS", "Senior", "Staff", "Director", "VP", "Founder"]).nullable(),
  estimatedLiquidity: z.string().nullable(),
  linkedinUrl: z.string().optional()
});

export const RemodelMoveSchema = z.object({
  id: z.string(),
  title: z.string(),
  floor: z.number(),
  scope: z.string(),
  reasoning: z.string(),
  estimatedCost: z.object({ low: z.number(), high: z.number() }),
  estimatedROI: z.string().nullable(),
  confidence: z.number(),
  phase: z.number()
});

export const DesignThemeSchema = z.object({
  name: z.string(),
  rationale: z.string(),
  publicSignalCitations: z.array(z.string()),
  keyMaterials: z.array(z.string()),
  referenceArchitects: z.array(z.string())
});

export const OutreachVariantSchema = z.object({
  id: z.string(),
  voiceLabel: z.string(),
  subject: z.string(),
  body: z.string(),
  rationale: z.string(),
  leadingHook: z.enum(["design_thesis", "adu_revenue", "studio_buildout", "view_capture"])
});

export const LeadSchema = z.object({
  id: z.string(),
  property: PropertySchema,
  buyer: z.union([BuyerSchema, z.object({ id: z.string() })]),
  score: z.number(),
  scoreReasoning: z.string(),
  scoreBreakdown: z.record(z.number()),
  remodelScope: z.array(RemodelMoveSchema).optional(),
  designTheme: DesignThemeSchema.optional(),
  outreachVariants: z.array(OutreachVariantSchema).optional(),
  status: z.enum(["new", "scored", "outreach_drafted", "sent", "replied", "meeting_booked", "signed", "passed"]),
  outcomes: z.array(z.object({
    timestamp: z.string(),
    event: z.string(),
    detail: z.string().optional()
  })),
  agentRunId: z.string().optional()
});

export const TraceEventSchema = z.object({
  runId: z.string(),
  timestamp: z.string(),
  type: z.enum(["agent_start", "reasoning", "tool_call", "tool_result", "agent_handoff", "agent_complete", "error"]),
  content: z.any()
});

export const ScoringWeightsSchema = z.object({
  version: z.number(),
  updatedAt: z.string(),
  updateReasoning: z.string(),
  weights: z.object({
    icpFit: z.number(),
    aiEmployerBoost: z.number(),
    recentPurchase: z.number(),
    propertyValueTier: z.number(),
    permitGap: z.number(),
    publicSignalRichness: z.number(),
    neighborhoodFit: z.number()
  })
});

export type Property = z.infer<typeof PropertySchema>;
export type Buyer = z.infer<typeof BuyerSchema>;
export type BuyerSignal = z.infer<typeof BuyerSignalSchema>;
export type RemodelMove = z.infer<typeof RemodelMoveSchema>;
export type DesignTheme = z.infer<typeof DesignThemeSchema>;
export type OutreachVariant = z.infer<typeof OutreachVariantSchema>;
export type Lead = z.infer<typeof LeadSchema>;
export type TraceEvent = z.infer<typeof TraceEventSchema>;
export type ScoringWeights = z.infer<typeof ScoringWeightsSchema>;

export type FloorPlan = {
  address: string;
  totalSqft: number;
  stories: number;
  floors: Array<{
    level: number;
    label: string;
    sqftApprox: number;
    rooms: Array<{ name: string; sqftApprox: number; features?: string[] }>;
  }>;
};
