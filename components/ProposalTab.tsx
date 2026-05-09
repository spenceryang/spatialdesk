import type { DesignTheme, RemodelMove } from "@/lib/types";
import { money } from "@/lib/utils";
import { Badge } from "./ui/Badge";
import { ThreeDViewer } from "./ThreeDViewer";

export function ProposalTab({
  theme,
  moves,
  renders
}: {
  theme?: DesignTheme;
  moves?: RemodelMove[];
  renders: {
    massingExisting: string;
    massingProposed: string;
    scopeOverlay?: string;
    sourceModel?: string;
    facadeVariants: string[];
  };
}) {
  if (!theme || !moves?.length) {
    return <Empty label="Proposal will populate as the agent completes design-theme and remodel-scope tools." />;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-line bg-white/[0.04] p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge className="bg-brass text-ink">Theme</Badge>
          {theme.referenceArchitects.map((name) => <Badge key={name}>{name}</Badge>)}
        </div>
        <h2 className="text-2xl font-bold">{theme.name}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">{theme.rationale}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {theme.keyMaterials.map((material) => <Badge key={material}>{material}</Badge>)}
        </div>
      </section>
      <ThreeDViewer existing={renders.massingExisting} proposed={renders.massingProposed} />
      {renders.sourceModel ? (
        <div className="rounded-md border border-line bg-white/[0.04] p-3 text-sm text-zinc-300">
          SketchUp source model:{" "}
          <a className="font-semibold text-brass hover:text-[#d8bd82]" href={renders.sourceModel}>
            stgermain_exploded_axon.skp
          </a>
        </div>
      ) : null}
      {renders.scopeOverlay ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Remodel Scope Overlay</h2>
          <img
            alt="Remodel scope overlay"
            className="w-full rounded-lg border border-line bg-white object-contain"
            src={renders.scopeOverlay}
          />
        </section>
      ) : null}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Facade Render</h2>
        <div className="grid gap-3">
          {renders.facadeVariants.map((render, index) => (
            <img alt={`Proposal render ${index + 1}`} className="aspect-[16/10] rounded-md border border-line bg-white object-cover" key={render} src={render} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Remodel Moves</h2>
        <div className="grid gap-3">
          {moves.map((move) => (
            <details className="rounded-md border border-line bg-white/[0.04] p-4" key={move.id} open>
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{move.title}</div>
                    <div className="mt-1 text-sm text-muted">Floor {move.floor} · Phase {move.phase} · {Math.round(move.confidence * 100)}% confidence</div>
                  </div>
                  <div className="text-sm text-brass">{money(move.estimatedCost.low)}-{money(move.estimatedCost.high)}</div>
                </div>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{move.scope}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{move.reasoning}</p>
              {move.estimatedROI ? <div className="mt-3 text-sm text-emerald-200">{move.estimatedROI}</div> : null}
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="rounded-md border border-dashed border-line p-6 text-sm text-zinc-500">{label}</div>;
}
