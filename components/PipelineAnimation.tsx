"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Building2, Mail, Search, WandSparkles } from "lucide-react";

const nodes = [
  { label: "Transfer", icon: Building2 },
  { label: "Enrich", icon: Search },
  { label: "Reason", icon: BrainCircuit },
  { label: "Propose", icon: WandSparkles },
  { label: "Outreach", icon: Mail }
];

export function PipelineAnimation() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white/[0.04] p-4">
      <div className="grid grid-cols-5 gap-3">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <motion.div
              animate={{ opacity: [0.55, 1, 0.55] }}
              className="relative rounded-md border border-line bg-black/20 p-3"
              key={node.label}
              transition={{ duration: 2.4, delay: index * 0.22, repeat: Infinity }}
            >
              <Icon className="mb-3 h-5 w-5 text-brass" />
              <div className="text-sm font-semibold">{node.label}</div>
              {index < nodes.length - 1 ? (
                <div className="absolute right-[-12px] top-1/2 z-10 h-px w-6 bg-brass/70" />
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
