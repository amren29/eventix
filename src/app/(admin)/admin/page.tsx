"use client";

import {
  Building2, Users, CalendarDays, DollarSign, TrendingUp,
  TrendingDown, AlertTriangle, ArrowUpRight, Activity,
  Flag, CheckCircle2, Clock,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Organizations", value: "284", trend: "+12", up: true, icon: Building2, color: "text-primary-400", bg: "bg-primary-950", border: "border-primary-900" },
  { label: "Active Events", value: "1,842", trend: "+48", up: true, icon: CalendarDays, color: "text-accent-400", bg: "bg-accent-950", border: "border-accent-900" },
  { label: "Total Users", value: "42,180", trend: "+1,240", up: true, icon: Users, color: "text-success-400", bg: "bg-success-950", border: "border-success-900" },
  { label: "Platform Revenue (MRR)", value: "RM 98,420", trend: "+18.2%", up: true, icon: DollarSign, color: "text-warning-400", bg: "bg-warning-950", border: "border-warning-900" },
];

const revenueData = [
  { month: "Sep", revenue: 54000 },
  { month: "Oct", revenue: 68000 },
  { month: "Nov", revenue: 61000 },
  { month: "Dec", revenue: 92000 },
  { month: "Jan", revenue: 84000 },
  { month: "Feb", revenue: 98420 },
];

const orgGrowth = [
  { month: "Sep", orgs: 210 },
  { month: "Oct", orgs: 228 },
  { month: "Nov", orgs: 241 },
  { month: "Dec", orgs: 252 },
  { month: "Jan", orgs: 268 },
  { month: "Feb", orgs: 284 },
];

const pendingActions = [
  { type: "org_approval", label: "Organization approval pending", detail: "FinTech Malaysia Conf", time: "2h ago", href: "/admin/organizations" },
  { type: "flag", label: "Event flagged for review", detail: "XYZ Party Night — potential policy violation", time: "4h ago", href: "/admin/flags" },
  { type: "payout", label: "Large payout awaiting approval", detail: "RM 24,800 · Bass Nation Events", time: "6h ago", href: "/admin/payouts" },
  { type: "org_approval", label: "New organizer registration", detail: "Startup KL Network", time: "Yesterday", href: "/admin/organizations" },
  { type: "flag", label: "Refund dispute escalated", detail: "ORD-7712 · Attendee vs Organizer", time: "Yesterday", href: "/admin/flags" },
];

const topOrgs = [
  { name: "Bass Nation Events", events: 24, revenue: "RM 182,400", status: "active" },
  { name: "Tech Malaysia Hub", events: 18, revenue: "RM 143,200", status: "active" },
  { name: "Startup Ecosystem Co.", events: 12, revenue: "RM 98,500", status: "active" },
  { name: "Creative Arts Festival", events: 8, revenue: "RM 64,200", status: "active" },
  { name: "FinTech Malaysia Conf", events: 2, revenue: "RM 12,000", status: "pending" },
];

function AdminTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3">
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-white">
        {payload[0].dataKey === "revenue" ? `RM ${payload[0].value.toLocaleString()}` : `${payload[0].value} orgs`}
      </p>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Platform Overview</h1>
        <p className="text-neutral-500 mt-0.5">Super Admin · Live metrics across all organizations and events.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={cn("rounded-2xl border p-4", s.bg, s.border)}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-neutral-500">{s.label}</p>
              <s.icon className={cn("w-4 h-4", s.color)} />
            </div>
            <p className="text-xl font-extrabold text-white">{s.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {s.up
                ? <TrendingUp className="w-3 h-3 text-success-400" />
                : <TrendingDown className="w-3 h-3 text-danger-400" />
              }
              <span className={cn("text-xs font-semibold", s.up ? "text-success-400" : "text-danger-400")}>{s.trend}</span>
              <span className="text-xs text-neutral-600">this month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-5">
          <h3 className="font-semibold text-white mb-1">Platform Revenue (MRR)</h3>
          <p className="text-xs text-neutral-500 mb-5">Monthly platform fee collections</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#525252" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#525252" }} axisLine={false} tickLine={false} tickFormatter={(v) => `RM${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<AdminTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fill="url(#adminRevGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-5">
          <h3 className="font-semibold text-white mb-1">Organization Growth</h3>
          <p className="text-xs text-neutral-500 mb-5">Cumulative registered organizations</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={orgGrowth} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#525252" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#525252" }} axisLine={false} tickLine={false} />
              <Tooltip content={<AdminTooltip />} />
              <Bar dataKey="orgs" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending actions + top orgs */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending actions */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-neutral-500" /> Requires Attention
            </h3>
            <span className="text-xs text-danger-400 bg-danger-950 border border-danger-900 px-2 py-0.5 rounded-full font-semibold">
              {pendingActions.length} pending
            </span>
          </div>
          <div className="divide-y divide-neutral-800">
            {pendingActions.map((a, i) => (
              <Link key={i} href={a.href} className="flex items-start gap-3 px-5 py-3 hover:bg-neutral-800/50 transition-colors">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  a.type === "flag" ? "bg-danger-950" : a.type === "payout" ? "bg-warning-950" : "bg-primary-950"
                )}>
                  {a.type === "flag"
                    ? <Flag className="w-3.5 h-3.5 text-danger-400" />
                    : a.type === "payout"
                    ? <DollarSign className="w-3.5 h-3.5 text-warning-400" />
                    : <Building2 className="w-3.5 h-3.5 text-primary-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200">{a.label}</p>
                  <p className="text-xs text-neutral-500 truncate">{a.detail}</p>
                </div>
                <span className="text-xs text-neutral-600 flex-shrink-0">{a.time}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top orgs */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-neutral-500" /> Top Organizations
            </h3>
            <Link href="/admin/organizations" className="text-xs text-primary-400 font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-800">
            {topOrgs.map((org, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-neutral-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {org.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-200">{org.name}</p>
                    <p className="text-xs text-neutral-500">{org.events} events · {org.revenue}</p>
                  </div>
                </div>
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
                  org.status === "active"
                    ? "bg-success-950 text-success-400 border border-success-900"
                    : "bg-warning-950 text-warning-400 border border-warning-900"
                )}>
                  {org.status === "active" ? "Active" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
