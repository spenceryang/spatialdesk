import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { runLearningDemo } from "@/lib/agent/demo-runner";
import { runLearningLive } from "@/lib/agent/live-runner";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const mode = body?.mode === "live" ? "live" : "demo";
  const runId = nanoid();

  const runner = mode === "live" ? runLearningLive : runLearningDemo;
  runner(runId).catch((err) => {
    console.error(err);
  });

  return NextResponse.json({ runId, mode });
}
