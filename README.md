# SpatialDesk

Autonomous demo agent for finding newly purchased SF homes by AI-company employees, generating remodel proposals, drafting outreach, and learning from outcomes.

## Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Demo Path

1. Open the lead list.
2. Click **Run Agent** on the 170 St Germain hero lead.
3. Watch the live trace on the right side of the lead detail page.
4. Review the Proposal, Outreach, and Learning tabs.
5. Run the Learning Agent from the Learning tab.

Demo mode is deterministic and does not require live OpenAI, Tavily, SketchUp, Formas, TracePaper, or Resend calls. API keys belong in `.env.local`, which is ignored by git.

## Architecture

- Next.js App Router and TypeScript
- JSON files in `/data`
- Server-Sent Events for live trace streaming
- Server-side tool layer under `/lib/tools`
- Agent instructions and definitions under `/lib/agent`
- Pre-baked property media and render assets under `/public`
