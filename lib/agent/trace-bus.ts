import type { TraceEvent } from "@/lib/types";

type Listener = (event: TraceEvent) => void;

class TraceBus {
  private listeners = new Map<string, Set<Listener>>();
  private buffers = new Map<string, TraceEvent[]>();

  subscribe(runId: string, listener: Listener) {
    if (!this.listeners.has(runId)) this.listeners.set(runId, new Set());
    this.listeners.get(runId)!.add(listener);

    const buffer = this.buffers.get(runId) || [];
    buffer.forEach(listener);

    return () => {
      this.listeners.get(runId)?.delete(listener);
    };
  }

  emit(event: TraceEvent) {
    if (!this.buffers.has(event.runId)) this.buffers.set(event.runId, []);
    this.buffers.get(event.runId)!.push(event);
    this.listeners.get(event.runId)?.forEach((listener) => listener(event));
  }

  getBuffer(runId: string) {
    return this.buffers.get(runId) || [];
  }
}

const globalForTrace = globalThis as typeof globalThis & {
  __spatialdeskTraceBus?: TraceBus;
};

export const traceBus = globalForTrace.__spatialdeskTraceBus || new TraceBus();
globalForTrace.__spatialdeskTraceBus = traceBus;
