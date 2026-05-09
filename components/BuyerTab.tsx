import { BriefcaseBusiness, ExternalLink, GraduationCap, Landmark, Radio, Signal } from "lucide-react";
import type { Buyer } from "@/lib/types";

const iconByType = {
  education: GraduationCap,
  career: BriefcaseBusiness,
  public_post: Signal,
  investment: Landmark,
  publication: Signal,
  podcast: Radio,
  github: Signal,
  x_post: Signal
};

export function BuyerTab({ buyer }: { buyer: Buyer }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-line bg-white/[0.04] p-5">
        <h2 className="text-2xl font-bold">{buyer.name}</h2>
        <p className="mt-2 text-muted">{buyer.title} · {buyer.employer}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-line bg-black/20 p-3">
            <div className="text-xs uppercase text-zinc-500">Comp band</div>
            <div className="mt-1 font-semibold">{buyer.inferredCompBand}</div>
          </div>
          <div className="rounded-md border border-line bg-black/20 p-3">
            <div className="text-xs uppercase text-zinc-500">Liquidity</div>
            <div className="mt-1 font-semibold">{buyer.estimatedLiquidity}</div>
          </div>
        </div>
      </div>
      <div className="grid gap-3">
        {buyer.signals.map((signal) => {
          const Icon = iconByType[signal.type];
          return (
            <div className="rounded-md border border-line bg-white/[0.04] p-4" key={`${signal.type}-${signal.content}`}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold capitalize">
                  <Icon className="h-4 w-4 text-brass" />
                  {signal.type.replace("_", " ")}
                </div>
                {signal.sourceUrl ? (
                  <a aria-label="Open source" className="text-zinc-500 hover:text-brass" href={signal.sourceUrl} rel="noreferrer" target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
              <p className="text-sm leading-relaxed text-zinc-300">{signal.content}</p>
              <div className="mt-3 h-2 rounded bg-white/10">
                <div className="h-2 rounded bg-brass" style={{ width: `${signal.weight * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
