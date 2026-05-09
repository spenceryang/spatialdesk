# SpatialDesk - Live Demo Script

**Target runtime: 3:30**  
**Setting**: AGI House, 170 St Germain Ave, San Francisco. Autonomous Agent Hackathon, sponsored by OpenAI Codex.

## (0:00-0:25) Cold open

> "Quick context. SF housing has lost its mind. AI liquidity. Newly liquid technical buyers are moving faster than remodel firms can prospect.
>
> We're standing in 170 St Germain - AGI House. Sold December 2024 for $4.25M. Imagine the buyer is Thibault Sottiaux, Member of Technical Staff and Codex Engineering Lead at OpenAI. We didn't pick him. The agent did."

## (0:25-0:45) The trigger

> [Open lead list. Hero card pulsing.]
>
> "One input. A property transfer record. That's it. Watch."
>
> [Click Run Agent. Trace pane on the right lights up.]

## (0:45-2:30) The agent works

> [Live trace appears as agent runs. Talk through what it's doing.]
>
> "tavily_search - pulling public buyer signals.
>
> reasoning - Buyer is Belgian, Louvain-educated, Codex lead. Aesthetic should match minimalist thesis.
>
> parse_floorplan - four stories, view-stacked.
>
> score_lead - 94 out of 100. AI employer, recent purchase, rich public signals.
>
> infer_design_theme - Belgian Minimalism, Vincent Van Duysen lineage.
>
> infer_remodel_scope - lower-level ADU, second-floor podcast studio, primary-suite material layer.
>
> build_3d_model - existing versus proposed.
>
> render_facade - limestone, bronze, restrained.
>
> generate_outreach - three voices. Boutique architect, design-build, studio specialist.
>
> Done. No human in the loop."

## (2:30-3:00) The output

> [Click through Proposal tab, then Outreach tab.]
>
> "ADU on the gym floor. Four to five thousand a month in Twin Peaks. Engineering brain likes the math.
>
> Podcast studio on the second floor. He's on Dev Interrupted, SE Daily, OpenAI Podcast. He needs acoustic treatment, not a chill room.
>
> Primary suite in Belgian bluestone. Because he's Belgian. Because he hates ornament.
>
> Three voices. No 'hope this finds you well.' First sentence: a fact about his actual home."

## (3:00-3:25) The learning sub-agent

> [Click Run Learning Agent on Learning tab.]
>
> "Second agent. Reads outcomes. Proposes scoring updates.
>
> AI-employer leads replied 3.2x more. ADU-revenue framing won 2.5x for buyers under 35. Belgian-minimalist hit 4x for EU-educated buyers. Weights updated. Next batch goes out smarter."

## (3:25-3:30) Close

> "SpatialDesk. Two agents. Twenty tools. One ICP. The first wave of AI homeowners is here - we trace them autonomously."

## Backup answers for likely judge questions

**"How is this different from a script with API calls?"**  
> The agent decides when to enrich, score, design, render, draft, and stop. If the lead scores under 70, it skips the proposal path.

**"What if a tool fails?"**  
> The tool layer is isolated. In demo mode, flaky integrations return pre-baked assets; in live mode, the agent can retry, work around, or stop cleanly.

**"Why two agents instead of one?"**  
> Different cadence. The main agent runs per property transfer. The learning agent runs across outcomes and changes the next batch.

**"Is this legal / ethical?"**  
> Public records, public profiles, opt-out ready, no private data required.

**"What's the business model?"**  
> SaaS for SF design-build firms. $500-2,000 per firm per month, then expansion to LA, Seattle, NYC, and Austin.
