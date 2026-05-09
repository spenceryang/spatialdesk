import { Bath, BedDouble, Calendar, Hammer, Home, Ruler } from "lucide-react";
import type { FloorPlan, Lead } from "@/lib/types";
import { formatDate, money } from "@/lib/utils";
import { FloorPlanViewer } from "./FloorPlanViewer";

export function PropertyTab({ lead, floorPlan }: { lead: Lead; floorPlan: FloorPlan }) {
  const facts = [
    { label: "Sold", value: formatDate(lead.property.soldDate), icon: Calendar },
    { label: "Price", value: money(lead.property.soldPrice), icon: Home },
    { label: "Size", value: `${lead.property.sqft.toLocaleString()} sqft`, icon: Ruler },
    { label: "Beds", value: `${lead.property.beds}`, icon: BedDouble },
    { label: "Baths", value: `${lead.property.baths}`, icon: Bath },
    { label: "Built", value: `${lead.property.yearBuilt}`, icon: Hammer }
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        {lead.property.photos.map((photo) => (
          <img alt={lead.property.address} className="aspect-[4/3] rounded-md border border-line object-cover" key={photo} src={photo} />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {facts.map((fact) => {
          const Icon = fact.icon;
          return (
            <div className="rounded-md border border-line bg-white/[0.04] p-3" key={fact.label}>
              <Icon className="mb-2 h-4 w-4 text-brass" />
              <div className="text-xs uppercase text-zinc-500">{fact.label}</div>
              <div className="mt-1 font-semibold">{fact.value}</div>
            </div>
          );
        })}
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Permit Timeline</h2>
        <div className="space-y-2">
          {lead.property.permitHistory.map((permit) => (
            <div className="flex gap-3 rounded-md border border-line bg-white/[0.04] p-3" key={`${permit.date}-${permit.description}`}>
              <div className="w-24 shrink-0 text-sm text-brass">{formatDate(permit.date)}</div>
              <div className="text-sm text-zinc-300">{permit.description}{permit.cost ? ` · ${money(permit.cost)}` : ""}</div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Floor Plan Parse</h2>
        <FloorPlanViewer floorPlan={floorPlan} imageUrl={lead.property.floorPlanUrl} />
      </section>
    </div>
  );
}
