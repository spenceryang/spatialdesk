import { Wrench } from "lucide-react";
import type { TraceEvent } from "@/lib/types";

export function ToolCallCard({ event }: { event: TraceEvent }) {
  return (
    <div className="rounded-md border border-brass/20 bg-brass/10 p-3">
      <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brass">
        <Wrench className="h-3 w-3" />
        Tool Call
      </div>
      <div className="font-mono text-sm text-zinc-50">{event.content.tool}</div>
      {event.content.input ? (
        <pre className="mt-2 max-h-24 overflow-auto rounded bg-black/25 p-2 text-xs leading-relaxed text-zinc-300">
          {JSON.stringify(event.content.input, null, 2).slice(0, 260)}
        </pre>
      ) : null}
    </div>
  );
}
