import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { runSpatialDeskDemo } from "@/lib/agent/demo-runner";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { leadId } = await req.json();
  const runId = nanoid();

  runSpatialDeskDemo(runId, leadId).catch((err) => {
    console.error(err);
  });

  return NextResponse.json({ runId });
}
