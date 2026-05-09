"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ScoringEvolution({
  current,
  proposed
}: {
  current: Record<string, number>;
  proposed: Record<string, number>;
}) {
  const data = Object.keys(current).map((key) => ({
    factor: key.replace(/([A-Z])/g, " $1"),
    v1: current[key],
    v2: proposed[key] ?? current[key]
  }));

  return (
    <div className="h-80 rounded-lg border border-line bg-white/[0.04] p-4">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
          <XAxis dataKey="factor" stroke="#a7a29a" tick={{ fontSize: 11 }} />
          <YAxis stroke="#a7a29a" tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,.12)", color: "#fff" }} />
          <Bar dataKey="v1" fill="#7c95a6" name="v1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="v2" fill="#c7a86b" name="v2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
