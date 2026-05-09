import type { Lead } from "@/lib/types";
import { LeadCard } from "./LeadCard";

export function LeadList({ leads }: { leads: Lead[] }) {
  const [hero, ...others] = leads;

  return (
    <div className="space-y-5">
      <LeadCard lead={hero} hero />
      <div>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-semibold">Other Leads</h2>
          <span className="text-sm text-muted">{others.length} recent SF sales</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {others.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </div>
    </div>
  );
}
