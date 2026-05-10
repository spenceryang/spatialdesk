import { traceBus } from "@/lib/agent/trace-bus";
import type { SpatialTool } from ".";

type TavilyResult = { title: string; url: string; snippet: string };

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

    const results: TavilyResult[] = [
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

export async function tavilySearchLive({ query, runId }: { query: string; runId: string }): Promise<{ results: TavilyResult[] }> {
  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_call",
    content: { tool: "tavily_search", mode: "live", input: { query } }
  });

  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not set");
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: 6,
      include_answer: false,
      search_depth: "basic"
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Tavily API error ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as {
    results: Array<{ title: string; url: string; content: string }>;
  };

  const results: TavilyResult[] = (data.results || []).slice(0, 6).map((r) => ({
    title: r.title,
    url: r.url,
    snippet: (r.content || "").slice(0, 280)
  }));

  traceBus.emit({
    runId,
    timestamp: new Date().toISOString(),
    type: "tool_result",
    content: { tool: "tavily_search", mode: "live", resultCount: results.length, results }
  });

  return { results };
}
