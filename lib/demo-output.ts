import type { DesignTheme, RemodelMove, OutreachVariant } from "@/lib/types";

export const heroTheme: DesignTheme = {
  name: "Belgian Minimalism, Vincent Van Duysen Lineage",
  rationale:
    "The buyer's Belgian education signal and public thesis around stripping away scaffolding point to a restrained architectural language: limewashed walls, bluestone, bronze, tactile oak, and edited massing rather than decorative gestures.",
  publicSignalCitations: [
    "MS Computational and Applied Mathematics, Universite catholique de Louvain",
    "'Scaffolding is coping not scaling' public design thesis",
    "Public-facing Codex lead with podcast and technical-audience presence"
  ],
  keyMaterials: ["Belgian bluestone", "limewash plaster", "smoked oak", "dark bronze", "warm concrete"],
  referenceArchitects: ["Vincent Van Duysen", "Marie-Jose Van Hee", "Robbrecht en Daem"]
};

export const heroMoves: RemodelMove[] = [
  {
    id: "move_adu_garden",
    title: "Garden-level ADU conversion",
    floor: 1,
    scope:
      "Convert the gym/chill room and adjacent bath into a code-aware guest suite or rental ADU with a discreet kitchenette, better acoustic separation, and direct garden access.",
    reasoning:
      "The lower level already has plumbing, yard access, and separation. For an engineering-minded buyer, the rental yield makes the remodel legible without gutting a recently renovated home.",
    estimatedCost: { low: 175000, high: 260000 },
    estimatedROI: "$4K-$5K/month estimated Clarendon Heights rental offset",
    confidence: 0.87,
    phase: 1
  },
  {
    id: "move_podcast_studio",
    title: "Second-floor podcast studio",
    floor: 2,
    scope:
      "Turn the great room into a dual-use work lounge and recording studio with acoustic plaster, hidden absorption, warm task lighting, and a camera-ready built-in backdrop.",
    reasoning:
      "The buyer is a recurring technical podcast guest. The existing 'work/chill' space already has volume, views, and a second entry, making it a low-regret specialization.",
    estimatedCost: { low: 85000, high: 145000 },
    estimatedROI: "High personal utility; preserves bedroom count",
    confidence: 0.92,
    phase: 1
  },
  {
    id: "move_primary_suite",
    title: "Belgian primary suite layer",
    floor: 4,
    scope:
      "Refinish the primary suite with bluestone bath planes, a smoked-oak dressing wall, integrated fireplace storage, and quiet lighting that preserves the view-first plan.",
    reasoning:
      "Because the 2016 renovation is recent, the right move is layering: material precision and storage discipline, not a down-to-studs reset.",
    estimatedCost: { low: 135000, high: 210000 },
    estimatedROI: "Premium owner-suite lift without opening structural scope",
    confidence: 0.84,
    phase: 2
  },
  {
    id: "move_facade_restraint",
    title: "Facade restraint package",
    floor: 3,
    scope:
      "Replace mixed exterior finishes with a restrained bronze-and-limestone entry expression, slimmer railings, and warmer exterior lighting.",
    reasoning:
      "The home has a strong hill presence. The facade should communicate precision and privacy before a buyer ever opens the door.",
    estimatedCost: { low: 95000, high: 160000 },
    estimatedROI: "Improves curb read and proposal memorability",
    confidence: 0.78,
    phase: 2
  }
];

export const heroOutreach: OutreachVariant[] = [
  {
    id: "outreach_boutique",
    voiceLabel: "Boutique Architect",
    subject: "170 St Germain, edited",
    body:
      "170 St Germain already has the hard part: four stacked levels, views, and a 2016 down-to-studs base that doesn't need another reset. The interesting move is subtraction. Your Louvain and Codex signals point to Belgian restraint - bluestone, limewash, bronze, one studio-level intervention, and a garden ADU that makes the math clean. I sketched the first pass as a design thesis, not a sales deck. I can send the two-page version.",
    rationale: "Leads with design thesis and Belgian signal; avoids overbuilding.",
    leadingHook: "design_thesis"
  },
  {
    id: "outreach_build",
    voiceLabel: "Design-Build Practical",
    subject: "ADU math at St Germain",
    body:
      "The garden level at 170 St Germain has the rare useful combo: existing bath, yard access, and enough separation to become a real ADU without touching the main living floor. In Clarendon Heights, that can offset roughly $4K-$5K a month while preserving the 2016 renovation. Given your Codex work, I figured the cleanest pitch is scope with a measurable payoff. I modeled the low-disruption path and can share it.",
    rationale: "Frames the remodel as an optimization problem with concrete yield.",
    leadingHook: "adu_revenue"
  },
  {
    id: "outreach_studio",
    voiceLabel: "Studio Specialist",
    subject: "A real recording room",
    body:
      "The second-floor great room at 170 St Germain is almost a studio already: volume, views, a secondary entry, and enough wall length for proper acoustic treatment. Since you're showing up on Dev Interrupted, SE Daily, and OpenAI channels, the upgrade isn't another office. It's a camera-ready room that still works as a lounge. I mocked up a restrained Belgian material direction with hidden absorption and no visible gear clutter. Happy to send the render pass.",
    rationale: "Anchors on public podcast signals and a specific room in the home.",
    leadingHook: "studio_buildout"
  }
];

export const heroRenders = {
  massingExisting: "/renders/170-st-germain/massing-existing.svg",
  massingProposed: "/renders/170-st-germain/sketchup-exploded-axon.png",
  scopeOverlay: "/renders/170-st-germain/remodel-scope-overlay.png",
  facadePrimary: "/renders/170-st-germain/facade-belgian-min.png",
  sourceModel: "/models/170-st-germain/stgermain_exploded_axon.skp",
  facadeVariants: ["/renders/170-st-germain/facade-belgian-min.png"]
};

export const learningInsights = [
  "AI-employer leads replied 3.2x more often than non-AI buyers.",
  "ADU-revenue framing won 2.5x with buyers under 35.",
  "Belgian-minimalist themes converted 4.0x better for EU-educated buyers.",
  "Property-specific opens beat generic opens by 3.0x."
];

export const proposedWeights = {
  icpFit: 24,
  aiEmployerBoost: 24,
  recentPurchase: 13,
  propertyValueTier: 13,
  permitGap: 8,
  publicSignalRichness: 13,
  neighborhoodFit: 5
};
