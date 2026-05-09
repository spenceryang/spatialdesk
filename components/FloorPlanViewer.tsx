import type { FloorPlan } from "@/lib/types";

export function FloorPlanViewer({ floorPlan, imageUrl }: { floorPlan: FloorPlan; imageUrl?: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
      {imageUrl ? (
        <img alt="Original floor plan" className="h-full min-h-80 rounded-md border border-line object-cover" src={imageUrl} />
      ) : null}
      <div className="space-y-3">
        {floorPlan.floors.map((floor) => (
          <div className="rounded-md border border-line bg-white/[0.04] p-3" key={floor.level}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">{floor.label}</h3>
              <span className="text-sm text-muted">{floor.sqftApprox.toLocaleString()} sqft</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {floor.rooms.map((room, index) => (
                <div className="rounded border border-line bg-black/20 p-2 text-sm" key={`${room.name}-${index}`}>
                  <div className="font-medium">{room.name}</div>
                  <div className="mt-1 text-xs text-zinc-500">{room.sqftApprox} sqft {room.features?.length ? `· ${room.features.join(", ")}` : ""}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
