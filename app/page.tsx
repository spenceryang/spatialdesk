import fs from "fs/promises";
import path from "path";
import { Settings } from "lucide-react";
import { DemoModeToggle } from "@/components/DemoModeToggle";
import { LeadList } from "@/components/LeadList";
import { PipelineAnimation } from "@/components/PipelineAnimation";
import type { Lead } from "@/lib/types";

async function getLeads() {
  const raw = await fs.readFile(path.join(process.cwd(), "data/leads.json"), "utf-8");
  return JSON.parse(raw) as Lead[];
}

export default async function HomePage() {
  const leads = await getLeads();

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-5">
      <header className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <img alt="SpatialDesk" className="h-10 w-auto" src="/logos/spatialdesk.svg" />
        </div>
        <div className="flex items-center gap-2">
          <DemoModeToggle />
          <button aria-label="Settings" className="rounded-md border border-line p-2 text-zinc-400 hover:text-brass">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>
      <div className="mb-5">
        <PipelineAnimation />
      </div>
      <LeadList leads={leads} />
    </main>
  );
}
