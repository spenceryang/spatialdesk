"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleDot, OctagonAlert } from "lucide-react";
import type { TraceEvent } from "@/lib/types";
import { ToolCallCard } from "./ToolCallCard";
import { AgentReasoningStep } from "./AgentReasoningStep";

export function AgentTracePane({
  runId,
  onEvent,
  title = "Agent Trace"
}: {
  runId: string | null;
  onEvent?: (event: TraceEvent) => void;
  title?: string;
}) {
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setEvents([]);
    if (!runId) return;

    const es = new EventSource(`/api/trace/${runId}`);
    es.onmessage = (e) => {
      const event: TraceEvent = JSON.parse(e.data);
      setEvents((prev) => [...prev, event]);
      onEvent?.(event);
    };
    return () => es.close();
  }, [runId, onEvent]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [events]);

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-lg border border-line bg-zinc-950/92 shadow-glow">
      <div className="border-b border-line px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">{title}</div>
            <div className="mt-1 text-sm text-zinc-300">{runId ? `${events.length} live events` : "Waiting for run"}</div>
          </div>
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,.8)]" />
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {!runId ? (
          <div className="rounded-md border border-dashed border-line p-4 text-sm text-zinc-500">
            Run the agent to stream its reasoning and tool calls here.
          </div>
        ) : null}
        {events.map((event, index) => (
          <TraceEventCard event={event} key={`${event.timestamp}-${index}`} />
        ))}
        <div ref={endRef} />
      </div>
    </aside>
  );
}

function TraceEventCard({ event }: { event: TraceEvent }) {
  switch (event.type) {
    case "agent_start":
      return (
        <div className="flex items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">
          <CircleDot className="h-4 w-4" />
          Agent started: {event.content.agent}
        </div>
      );
    case "reasoning":
      return <AgentReasoningStep content={event.content} />;
    case "tool_call":
      return <ToolCallCard event={event} />;
    case "tool_result":
      return (
        <div className="ml-3 flex items-center gap-2 border-l border-line py-2 pl-3 text-xs text-zinc-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
          {event.content.tool} returned
          {event.content.score ? <span className="text-brass">{event.content.score}/100</span> : null}
        </div>
      );
    case "agent_complete":
      return (
        <div className="flex items-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/12 p-3 text-sm text-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          Agent complete
        </div>
      );
    case "error":
      return (
        <div className="flex items-center gap-2 rounded-md border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-200">
          <OctagonAlert className="h-4 w-4" />
          {event.content.message}
        </div>
      );
    default:
      return null;
  }
}
