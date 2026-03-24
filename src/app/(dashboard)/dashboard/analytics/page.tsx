"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Ticket, Users, MousePointerClick, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const revenueData = [
  { month: "Sep", revenue: 4200, tickets: 168 },
  { month: "Oct", revenue: 6800, tickets: 272 },
  { month: "Nov", revenue: 5400, tickets: 216 },
  { month: "Dec", revenue: 9200, tickets: 368 },
  { month: "Jan", revenue: 7800, tickets: 312 },
  { month: "Feb", revenue: 12400, tickets: 496 },
];

const eventRevenueData = [
  { name: "Tech Summit", revenue: 5820, tickets: 186 },
  { name: "Music Fest KL", revenue: 4250, tickets: 170 },
  { name: "Startup Weekend", revenue: 2330, tickets: 140 },
];

const trafficData = [
  { name: "Direct", value: 38, color: "#4f46e5" },
  { name: "Social Media", value: 27, color: "#7c3aed" },
  { name: "Email", value: 20, color: "#10b981" },
  { name: "Search", value: 15, color: "#f59e0b" },
];

const ticketTypeData = [
  { name: "VIP", sold: 48, total: 60, revenue: 5760 },
  { name: "Early Bird", sold: 120, total: 120, revenue: 3600 },
  { name: "General", sold: 200, total: 300, revenue: 4000 },
  { name: "Student", sold: 64, total: 100, revenue: 960 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-neutral-100 shadow-lg rounded-xl px-4 py-3">
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name === "revenue" ? `RM ${p.value.toLocaleString()}` : `${p.value} tickets`}
        </p>
      ))}
    </div>
  );
}

type Period = "7d" | "30d" | "90d" | "12m";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");

  const stats = [
    { label: "Total Revenue", value: "RM 12,400", trend: "+18.2%", up: true, icon: DollarSign, color: "text-primary-600", bg: "bg-primary-50" },
    { label: "Tickets Sold", value: "496", trend: "+12.5%", up: true, icon: Ticket, color: "text-accent-600", bg: "bg-accent-50" },
    { label: "Unique Buyers", value: "384", trend: "+9.1%", up: true, icon: Users, color: "text-success-600", bg: "bg-success-50" },
    { label: "Conversion Rate", value: "3.8%", trend: "-0.4%", up: false, icon: MousePointerClick, color: "text-warning-600", bg: "bg-warning-50" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Analytics</h1>
          <p className="text-neutral-500 mt-0.5">Track performance across all your events.</p>
        </div>
        <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl">
          {(["7d", "30d", "90d", "12m"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "text-sm font-medium px-3 py-1.5 rounded-lg transition-all",
                period === p ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-neutral-500">{s.label}</p>
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
            </div>
            <p className="text-xl font-extrabold text-neutral-900 mb-1">{s.value}</p>
            <div className="flex items-center gap-1">
              {s.up
                ? <TrendingUp className="w-3.5 h-3.5 text-success-500" />
                : <TrendingDown className="w-3.5 h-3.5 text-danger-500" />
              }
              <span className={cn("text-xs font-semibold", s.up ? "text-success-600" : "text-danger-600")}>{s.trend}</span>
              <span className="text-xs text-neutral-400">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-neutral-900">Revenue & Tickets Trend</h3>
            <p className="text-xs text-neutral-400">Monthly overview</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tickGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
            <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="tickets" stroke="#7c3aed" strokeWidth={2} fill="url(#tickGrad)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue by event */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <h3 className="font-semibold text-neutral-900 mb-1">Revenue by Event</h3>
          <p className="text-xs text-neutral-400 mb-5">This month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={eventRevenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `RM${v}`} />
              <Tooltip formatter={(val) => [`RM ${Number(val ?? 0).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic sources */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <h3 className="font-semibold text-neutral-900 mb-1">Traffic Sources</h3>
          <p className="text-xs text-neutral-400 mb-4">Where buyers come from</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={trafficData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {trafficData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => [`${val ?? 0}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {trafficData.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                  <span className="text-neutral-600">{t.name}</span>
                </div>
                <span className="font-semibold text-neutral-900">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket type breakdown */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <h3 className="font-semibold text-neutral-900 mb-1">Ticket Type Breakdown</h3>
        <p className="text-xs text-neutral-400 mb-5">Sales performance per ticket category</p>
        <div className="space-y-4">
          {ticketTypeData.map((t) => {
            const pct = Math.round((t.sold / t.total) * 100);
            return (
              <div key={t.name}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="font-medium text-neutral-700">{t.name}</span>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>{t.sold}/{t.total} sold</span>
                    <span className="font-semibold text-neutral-900">RM {t.revenue.toLocaleString()}</span>
                    <span className={cn("font-semibold", pct >= 90 ? "text-danger-600" : pct >= 60 ? "text-warning-600" : "text-success-600")}>{pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", pct >= 90 ? "bg-danger-500" : pct >= 60 ? "bg-warning-500" : "bg-success-500")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
