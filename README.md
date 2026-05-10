# SpatialDesk

**Live demo:** [spatialdesk.vercel.app](https://spatialdesk.vercel.app) · **Code:** [github.com/spenceryang/spatialdesk](https://github.com/spenceryang/spatialdesk)

Autonomous demo agent that finds newly purchased SF homes by AI-company employees, generates remodel proposals (3D massing, facade renders, scoped moves with cost/ROI), drafts buyer-specific outreach, and learns from response outcomes.

Built on Next.js App Router + the OpenAI Agents SDK, with a live Server-Sent Events trace so you can watch the agent reason and call tools in real time.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

API keys (OpenAI, Tavily, Resend, etc.) belong in `.env.local` — see `.env.example`.

There are two run modes, toggled by the pill in the header:

- **Demo** (default) — deterministic, no API calls, pre-baked fixtures. Repeatable on stage.
- **Live** — real Tavily search + OpenAI calls for the buyer enrichment, design theme, remodel scope, and outreach drafting. Requires `OPENAI_API_KEY` and `TAVILY_API_KEY`. Asset-bound steps (3D massing, facade renders) still serve the pre-rendered images.

## Demo flow

1. Lead list (`/`): pick the **170 St Germaine Ave** hero lead.
2. Lead detail (`/leads/[id]`) opens with five tabs: Property, Proposal, Outreach, Buyer, Learning.
3. Click **Run Agent**. The right-side trace pane streams reasoning, tool calls, and results live.
4. Watch the agent enrich the buyer, parse the floor plan, score the lead, infer a design theme and remodel scope, generate 3D massing + facade renders, and draft three outreach variants.
5. Open **Learning** and click **Run Learning Agent** to analyze `outcomes.json` and propose updated scoring weights.

`DEMO_SCRIPT.md` has the full ~3:30 narrated walkthrough.

## Architecture

**Stack**

- Next.js 15 App Router + TypeScript
- OpenAI Agents SDK (`@openai/agents`)
- Tailwind + Three.js / react-three-fiber for the 3D viewer
- Zustand for client state, Zod for tool schemas
- JSON-on-disk for all persistence (`/data`)
- Server-Sent Events for live agent traces

**Routes**

- `app/page.tsx` — lead list
- `app/leads/[id]/page.tsx` — lead detail with tabs
- `app/api/agent/run` — POST, runs the SpatialDesk agent
- `app/api/agent/learn` — POST, runs the Learning agent
- `app/api/trace/[runId]` — GET, SSE stream of trace events

**Agents** (`/lib/agent`)

- **SpatialDesk** — enrich buyer, parse floor plan, score lead, infer design theme + remodel scope, build 3D model, render facade, draft outreach.
  Tools: `tavilySearch`, `parseFloorPlan`, `scoreLead`, `inferDesignTheme`, `inferRemodelScope`, `build3DModel`, `renderFacade`, `generateOutreach`.
- **SpatialDeskLearning** — analyze outcomes, surface reply drivers, propose scoring-weight updates.
  Tools: `logOutcome`, `proposeWeightUpdate`.
- `trace-bus.ts` — in-memory pub/sub that fans tool events out to SSE subscribers per `runId`.

**Data** (`/data`)

- `leads.json`, `buyers.json` — pipeline + buyer profiles
- `outcomes.json` — outreach response log
- `scoring-weights.json` + `scoring-history.json` — current weights and version archive
- `floorplans/` — structured room data per lead
- `traces/` — persisted run event buffers

**Components** (`/components`)

- `AgentTracePane` — SSE listener, renders reasoning + tool calls live
- `ProposalTab`, `OutreachTab`, `LearningTab`, `BuyerTab`, `PropertyTab`
- `ThreeDViewer`, `FloorPlanViewer`, `ScoringEvolution`, `PipelineAnimation`

**Demo assets**

- `170 St Germaine Ave/` — hero property photos (webp)
- `FloorPlan/` — pre-rendered floor plan image
- `public/` — pre-baked massing + facade renders

## Scripts

One-off utilities under `/scripts`:

- `seed-leads.ts` — seed `leads.json` with demo data
- `parse-hero-floorplan.ts` — parse the 170 St Germaine floor plan
- `pre-render-sketchup.ts` — pre-render SketchUp models to images

## Demo mode vs live integrations

The OpenAI client is real; the planning loop runs against `gpt-5` if a key is configured. Tavily, SketchUp, Formas, TracePaper, and Resend tool calls return canned data from `/lib/tools/demo-output.ts` so the flow stays deterministic for demos. Wire them up by replacing the relevant tool implementation under `/lib/tools`.
