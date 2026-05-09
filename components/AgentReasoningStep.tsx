export function AgentReasoningStep({ content }: { content: { text?: string } | string }) {
  const text = typeof content === "string" ? content : content.text;

  return (
    <div className="rounded-md border border-steel/25 bg-steel/10 p-3">
      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-steel">Reasoning</div>
      <div className="text-sm leading-relaxed text-zinc-100">{text}</div>
    </div>
  );
}
