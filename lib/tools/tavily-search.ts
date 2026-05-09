import { traceBus } from "@/lib/agent/trace-bus";
import type { SpatialTool } from ".";

export const tavilySearch: SpatialTool<{ query: string; runId: string }> = {
  name: "tavily_search",
  description: "Search the public web for buyer identity signals.",
  async execute({ query, runId }) {
    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_call",
      content: { tool: "tavily_search", input: { query } }
    });

    const results = [
      { title: "OpenAI Codex interview", url: "https://linearb.io/dev-interrupted/podcast/openai-codex-thibault-sottiaux-agentic-autonomy", snippet: "Thibault Sottiaux discusses Codex and agentic autonomy." },
      { title: "LinkedIn profile", url: "https://www.linkedin.com/in/thibault-sottiaux-27195366/", snippet: "OpenAI, DeepMind, Google; computational mathematics background." },
      { title: "X profile", url: "https://x.com/thsottiaux", snippet: "Posts about gpt-5-codex and autonomous coding workflows." }
    ];

    traceBus.emit({
      runId,
      timestamp: new Date().toISOString(),
      type: "tool_result",
      content: { tool: "tavily_search", resultCount: results.length, results }
    });

    return { results };
  }
};
