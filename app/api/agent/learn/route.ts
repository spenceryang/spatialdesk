import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { runLearningDemo } from "@/lib/agent/demo-runner";

export const runtime = "nodejs";

export async function POST() {
  const runId = nanoid();

  runLearningDemo(runId).catch((err) => {
    console.error(err);
  });

  return NextResponse.json({ runId });
}
