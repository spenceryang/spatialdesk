# SpatialDesk — Hackathon Video Script (10 min)

**Tone:** Direct, founder-mode, no fluff. Read at ~150 wpm.
**Setup before recording:** dev server on `localhost:3000`, lead list open, terminal in a second window with the repo, VS Code in a third.

---

## Part 1 — The Problem (~2:00)

**On screen:** You on camera, or a screen with three SF property listings + Zillow buyer photos.

> "San Francisco housing has lost its mind. In the last 18 months, OpenAI, Anthropic, and a dozen smaller labs minted thousands of newly liquid technical buyers. They're closing on $3M to $8M homes in Noe Valley, Pacific Heights, Twin Peaks — and almost all of them want to remodel.
>
> Here's the asymmetry. The buyer side moves at AI speed: tender offer hits, escrow closes in 21 days. The supply side — boutique architects, design-build firms — still prospects the way they did in 2005. They wait for referrals. They cold-email a generic 'hope this finds you well.' By the time they reach the buyer, the buyer has already hired someone they met at a dinner party.
>
> *[Cut to a real outreach example — bad cold email on screen.]*
>
> The result: $200K-$500K remodel projects routed by social proximity, not fit. The firms with the best taste don't win. The firms with the best Rolodex do.
>
> SpatialDesk fixes the supply side. Given one input — a public property transfer record — it autonomously identifies whether the buyer is an AI-company employee, infers an aesthetic from their public footprint, generates a remodel proposal with 3D massing and facade renders, drafts buyer-specific outreach in three voices, and learns from which messages actually get replies.
>
> Why this matters: this is the first wave of buyers whose taste, income, and information diet were shaped by being inside AI labs. The firm that figures out how to talk to them now owns the next decade of high-end SF residential. We think that firm should be powered by an agent."

**Beats to hit:**
- Real number ($4.25M, 170 St Germaine, AGI House)
- Asymmetry framing (AI-speed buyers vs. analog supply)
- Why "now" (first wave of AI homeowners)

---

## Part 2 — The Tech Stack (~3:00)

**On screen:** `package.json` open, then split-screen with a diagram of the agent loop.

> "Three pieces of the stack made this possible — and one of them is what turned this from a script into an agent.
>
> **First: the OpenAI Agents SDK.** *[Show `lib/agent/spatialdesk-agent.ts`.]* This is the backbone. We don't write a pipeline. We give the agent eight tools and an objective. The model decides when to enrich, when to score, when to skip a low-quality lead, when to render, when to stop. If the lead scores under 70 on AI-employer fit, it never burns tokens on the design path. That branching logic isn't in our code — it's in the agent's reasoning trace. *[Show the trace pane mid-run.]* This would have been a 600-line if-statement without it.
>
> **Second: Tavily.** *[Show `lib/tools/tavily-search.ts`.]* The single hardest part of this problem is the buyer-enrichment step. Property records give you a name and an address. To target an AI-company employee specifically, you need to traverse podcast appearances, GitHub bios, conference talks, university affiliations. Google Search API is too noisy and rate-limited for an agent loop. Tavily returns clean, ranked, agent-ready results in under a second. The 'Belgian, Louvain-educated, Codex lead' signal you'll see in the demo — that came from one Tavily call.
>
> **Third: Server-Sent Events for the trace.** *[Show `app/api/trace/[runId]/route.ts`.]* This isn't a sponsor tech, but it's what makes the demo land. Every tool call, every reasoning step, every result streams to the browser in real time. Judges and customers don't have to trust that the agent is doing something — they watch it think. Without SSE, this is a black box that returns a PDF. With SSE, it's a workspace.
>
> **The supporting cast:** Next.js 15 App Router for the full-stack glue, Three.js / react-three-fiber for the 3D massing viewer, SketchUp for the underlying model generation, Zod for tool schemas, Zustand for client state, Vercel for the deploy.
>
> **What was impossible without this stack:** the branching agent loop (Agents SDK), real buyer enrichment that an agent can actually call mid-loop (Tavily), and a demo that proves to a non-technical buyer — a design-build firm owner — that the thing is real and not a slideshow (SSE trace + 3D viewer)."

**Beats to hit:**
- Agents SDK = decision logic, not pipeline
- Tavily = the enrichment unlock
- SSE = the credibility layer
- Name what would have been impossible without each

---

## Part 3 — Live Demo + Code (~5:00)

### 3a. Live demo (~3:00)

**On screen:** Browser at `localhost:3000` or `spatialdesk.vercel.app`.

> "One input: a property transfer record. *[Hover the 170 St Germaine lead card.]* AGI House, sold December 2024, $4.25M. We seeded the buyer as Thibault Sottiaux — Codex Engineering Lead at OpenAI. We didn't pick him. The agent will tell us why he's a 94.
>
> *[Click Run Agent. Trace pane lights up on the right.]*
>
> Watch the trace.
>
> `tavily_search` — pulling public buyer signals. *[Pause on the result.]* Belgian, Louvain-educated, podcasts on Dev Interrupted and OpenAI Podcast.
>
> `parse_floorplan` — four stories, view-stacked, lower-level gym, second-floor flex.
>
> `score_lead` — 94 out of 100. AI employer, recent purchase, rich public footprint.
>
> `infer_design_theme` — Belgian Minimalism, Vincent Van Duysen lineage. The agent inferred this from his nationality plus his stated aesthetic preferences in two podcast transcripts.
>
> `infer_remodel_scope` — lower-level ADU, second-floor podcast studio, primary-suite material upgrade.
>
> `build_3d_model` — *[Click the Proposal tab, toggle existing vs. proposed in the 3D viewer.]* existing massing on the left, proposed on the right.
>
> `render_facade` — *[Show the facade renders.]* limestone, bronze, restrained.
>
> `generate_outreach` — *[Click Outreach tab.]* three variants. Boutique architect, design-build, studio specialist. Different voice each. First sentence of every one is a fact about *his* home, not a 'hope this finds you well.'
>
> *[Read one outreach message out loud — the boutique architect variant.]*
>
> ADU on the gym floor. $4-5K/month in Twin Peaks rental yield — engineering brain likes the math. Podcast studio on the second floor — he's on three podcasts a month, he needs acoustic treatment, not a chill room. Primary suite in Belgian bluestone — because he's Belgian, because he hates ornament.
>
> Now the second agent. *[Click Learning tab → Run Learning Agent.]*
>
> This one reads outcomes from prior outreach. AI-employer leads replied 3.2x more than non-AI. ADU-revenue framing won 2.5x for buyers under 35. Belgian-Minimalist theme hit 4x reply rate for EU-educated buyers. *[Show the proposed scoring weight diff.]* Weights updated. Next batch ships smarter.
>
> Two agents. Eight tools. One ICP. End-to-end, no human in the loop."

### 3b. Code walkthrough (~2:00)

**On screen:** VS Code, three files.

> "Three files, sixty seconds each.
>
> **`lib/agent/spatialdesk-agent.ts`.** *[Open it.]* This is the whole main agent. An instructions string and a tools array. Notice what's not here: no orchestration code, no if-statements deciding whether to score before rendering. The Agents SDK plans the call order from the objective.
>
> **`lib/tools/tavily-search.ts`.** *[Open it.]* This is what a tool looks like. Zod schema for input, async function returning structured output, a `traceBus.emit` call so the UI sees it. Every tool follows this pattern — `parseFloorPlan`, `scoreLead`, `build3DModel`. Adding a ninth tool is a 30-line file plus one line in the agent's tools array.
>
> **`app/api/trace/[runId]/route.ts`.** *[Open it.]* The SSE endpoint. It subscribes to `traceBus` for a given runId and streams every event to the client. This is how the trace pane stays live. Twenty lines.
>
> **The data layer.** *[Open `data/leads.json` and `data/scoring-weights.json`.]* JSON on disk. We didn't ship a database for the hackathon — every state mutation is a file write. The Learning agent literally proposes a new `scoring-weights.json` and the diff is what you saw in the UI.
>
> *[Close VS Code, back to camera.]*
>
> SpatialDesk. Live at spatialdesk.vercel.app. Code at github.com/spenceryang/spatialdesk. The first wave of AI homeowners is here — and they deserve a remodel firm that found them on purpose."

---

## What to capture before recording

Pre-record checklist so the live take is clean:

1. **Run the agent once** in a fresh tab so traces are warm and `data/traces/` has the run cached.
2. **Lead list view** — make sure the 170 St Germaine card is at the top.
3. **3D viewer** — pre-load both massings; first toggle is sometimes laggy.
4. **Browser zoom at 110%** so the trace text is readable on video.
5. **Hide the bookmarks bar** and any Slack/email tabs.
6. **Close all terminals except one** with `npm run dev` running.
7. **Screen-record at 1080p min**, ideally 1440p for the code section.

## Cuts you can make if you're over time

- Drop the data-layer paragraph in 3b (saves 20s).
- Compress part 1 by skipping the "bad cold email" cutaway (saves 15s).
- In part 2, cut the "supporting cast" line (saves 10s).

## Cuts to avoid

- Don't cut the trace pane shot in part 2 — that's the stack's strongest visual.
- Don't cut reading one outreach variant out loud — it's the proof the agent isn't generic.
- Don't cut the Learning agent — two agents is the differentiator.
