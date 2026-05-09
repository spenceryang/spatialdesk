import { traceBus } from "@/lib/agent/trace-bus";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET(req: Request, context: { params: Promise<{ runId: string }> }) {
  const { runId } = await context.params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const unsubscribe = traceBus.subscribe(runId, send);
      if (traceBus.getBuffer(runId).length === 0) {
        fs.readFile(path.join(process.cwd(), `data/traces/${runId}.json`), "utf-8")
          .then((raw) => {
            const saved = JSON.parse(raw) as unknown[];
            saved.forEach(send);
          })
          .catch(() => {});
      }
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(": keepalive\n\n"));
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        unsubscribe();
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
