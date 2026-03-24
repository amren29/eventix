"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";

const data = [
  { date: "Feb 1",  revenue: 420,  tickets: 18 },
  { date: "Feb 4",  revenue: 680,  tickets: 27 },
  { date: "Feb 7",  revenue: 540,  tickets: 22 },
  { date: "Feb 10", revenue: 920,  tickets: 36 },
  { date: "Feb 13", revenue: 780,  tickets: 31 },
  { date: "Feb 16", revenue: 1240, tickets: 48 },
  { date: "Feb 19", revenue: 1080, tickets: 43 },
  { date: "Feb 22", revenue: 1560, tickets: 61 },
  { date: "Feb 25", revenue: 1340, tickets: 53 },
  { date: "Feb 27", revenue: 1890, tickets: 74 },
];

type View = "revenue" | "tickets";

function CustomTooltip({ active, payload, label, view }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-neutral-100 shadow-lg rounded-xl px-4 py-3">
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-neutral-900">
        {view === "revenue"
          ? `$${payload[0].value.toLocaleString()}`
          : `${payload[0].value} tickets`}
      </p>
    </div>
  );
}

export function RevenueChart() {
  const [view, setView] = useState<View>("revenue");

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-neutral-900 text-sm">Sales Overview</h3>
          <p className="text-xs text-neutral-400">Last 30 days</p>
        </div>
        <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
          {(["revenue", "tickets"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-md transition-all capitalize",
                view === v ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => view === "revenue" ? `$${v}` : `${v}`}
          />
          <Tooltip content={<CustomTooltip view={view} />} />
          <Area
            type="monotone"
            dataKey={view}
            stroke="#4f46e5"
            strokeWidth={2.5}
            fill="url(#colorGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
