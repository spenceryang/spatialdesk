import { CheckCircle2, Send } from "lucide-react";
import type { OutreachVariant } from "@/lib/types";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

const banned = ["hope this finds you well", "circling back", "per our conversation", "looking forward to hearing", "warm regards", "best regards", "kind regards"];

export function OutreachTab({ variants }: { variants?: OutreachVariant[] }) {
  if (!variants?.length) {
    return <div className="rounded-md border border-dashed border-line p-6 text-sm text-zinc-500">Outreach variants will populate after the agent drafts copy.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-emerald-200">
        <CheckCircle2 className="h-4 w-4" />
        Banned-phrase audit passed
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        {variants.map((variant) => {
          const auditFailed = banned.some((phrase) => variant.body.toLowerCase().includes(phrase));
          return (
            <article className="rounded-lg border border-line bg-white/[0.04] p-4" key={variant.id}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <Badge>{variant.voiceLabel}</Badge>
                <Badge className={auditFailed ? "bg-red-400/15 text-red-200" : "bg-emerald-400/10 text-emerald-200"}>
                  {auditFailed ? "Check" : "Clean"}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold">{variant.subject}</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{variant.body}</p>
              <p className="mt-4 text-xs leading-relaxed text-zinc-500">{variant.rationale}</p>
              <Button className="mt-4 w-full" variant="secondary">
                <Send className="h-4 w-4" />
                Dry Run Send
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
