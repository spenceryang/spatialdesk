import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { runSpatialDeskDemo } from "@/lib/agent/demo-runner";
import { runSpatialDeskLive } from "@/lib/agent/live-runner";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { leadId, mode } = await req.json();
  const runId = nanoid();

  const runner = mode === "live" ? runSpatialDeskLive : runSpatialDeskDemo;
  runner(runId, leadId).catch((err) => {
    console.error(err);
  });

  return NextResponse.json({ runId, mode: mode === "live" ? "live" : "demo" });
}
