"use client";

import { useState } from "react";
import {
  Search, CheckCircle2, XCircle, Clock, MoreHorizontal,
  Building2, CalendarDays, DollarSign, Users, Eye, Ban,
  Download, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const orgs = [
  { id: "ORG-001", name: "Bass Nation Events", owner: "Ahmad Razif", email: "ahmad@bassnation.io", plan: "Enterprise", events: 24, revenue: 182400, users: 8, status: "active", joined: "Jan 2026" },
  { id: "ORG-002", name: "Tech Malaysia Hub", owner: "Siti Nurfazira", email: "siti@techmyhub.io", plan: "Professional", events: 18, revenue: 143200, users: 5, status: "active", joined: "Jan 2026" },
  { id: "ORG-003", name: "Startup Ecosystem Co.", owner: "Raj Kumar", email: "raj@startupeco.io", plan: "Professional", events: 12, revenue: 98500, users: 4, status: "active", joined: "Feb 2026" },
  { id: "ORG-004", name: "Creative Arts Festival", owner: "Lisa Tan", email: "lisa@creativearts.io", plan: "Starter", events: 8, revenue: 64200, users: 3, status: "active", joined: "Feb 2026" },
  { id: "ORG-005", name: "FinTech Malaysia Conf", owner: "Kevin Lim", email: "kevin@fintechconf.io", plan: "Professional", events: 2, revenue: 12000, users: 2, status: "pending", joined: "Feb 2026" },
  { id: "ORG-006", name: "Startup KL Network", owner: "Maya Putri", email: "maya@startupkl.io", plan: "Starter", events: 0, revenue: 0, users: 1, status: "pending", joined: "Feb 2026" },
  { id: "ORG-007", name: "XYZ Entertainment", owner: "Zaid Ariff", email: "zaid@xyzent.io", plan: "Starter", events: 3, revenue: 8200, users: 2, status: "suspended", joined: "Jan 2026" },
];

const planColors = {
  Enterprise: "text-warning-400 bg-warning-950 border-warning-800",
  Professional: "text-primary-400 bg-primary-950 border-primary-800",
  Starter: "text-neutral-400 bg-neutral-800 border-neutral-700",
} as const;

const statusConfig = {
  active: { label: "Active", color: "text-success-400", bg: "bg-success-950", border: "border-success-800" },
  pending: { label: "Pending", color: "text-warning-400", bg: "bg-warning-950", border: "border-warning-800" },
  suspended: { label: "Suspended", color: "text-danger-400", bg: "bg-danger-950", border: "border-danger-800" },
} as const;

type OrgStatus = keyof typeof statusConfig;

export default function AdminOrgsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orgsState, setOrgsState] = useState(orgs);

  const filtered = orgsState.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function approve(id: string) {
    setOrgsState(prev => prev.map(o => o.id === id ? { ...o, status: "active" } : o));
  }

  function suspend(id: string) {
    setOrgsState(prev => prev.map(o => o.id === id ? { ...o, status: "suspended" } : o));
  }

  const pendingCount = orgsState.filter(o => o.status === "pending").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Organizations</h1>
          <p className="text-neutral-500 mt-0.5">Manage all organizer accounts on the platform.</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-warning-950 border border-warning-800 rounded-xl px-3 py-2">
            <Clock className="w-4 h-4 text-warning-400" />
            <p className="text-sm font-semibold text-warning-300">{pendingCount} awaiting approval</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: orgsState.length, color: "text-white" },
          { label: "Active", value: orgsState.filter(o => o.status === "active").length, color: "text-success-400" },
          { label: "Pending", value: orgsState.filter(o => o.status === "pending").length, color: "text-warning-400" },
          { label: "Suspended", value: orgsState.filter(o => o.status === "suspended").length, color: "text-danger-400" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4 text-center">
            <p className={cn("text-2xl font-extrabold", s.color)}>{s.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            placeholder="Search organizations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-primary-600"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-neutral-900 border-neutral-700 text-neutral-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              {["Organization", "Plan", "Events", "Revenue", "Status", "Joined", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filtered.map((org) => {
              const sc = statusConfig[org.status as OrgStatus];
              const pc = planColors[org.plan as keyof typeof planColors];
              return (
                <tr key={org.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {org.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-100">{org.name}</p>
                        <p className="text-xs text-neutral-500">{org.owner} · {org.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", pc)}>{org.plan}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{org.events}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-200">
                    RM {(org.revenue / 100).toLocaleString("en-MY", { minimumFractionDigits: 0 })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border", sc.color, sc.bg, sc.border)}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{org.joined}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-400 hover:text-white hover:bg-neutral-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-neutral-800 border-neutral-700 text-neutral-200">
                        <DropdownMenuItem className="gap-2 focus:bg-neutral-700"><Eye className="w-4 h-4" /> View Details</DropdownMenuItem>
                        {org.status === "pending" && (
                          <DropdownMenuItem className="gap-2 text-success-400 focus:bg-neutral-700 focus:text-success-400" onClick={() => approve(org.id)}>
                            <CheckCircle2 className="w-4 h-4" /> Approve
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-neutral-700" />
                        {org.status !== "suspended" && (
                          <DropdownMenuItem className="gap-2 text-danger-400 focus:bg-neutral-700 focus:text-danger-400" onClick={() => suspend(org.id)}>
                            <Ban className="w-4 h-4" /> Suspend
                          </DropdownMenuItem>
                        )}
                        {org.status === "suspended" && (
                          <DropdownMenuItem className="gap-2 text-success-400 focus:bg-neutral-700 focus:text-success-400" onClick={() => approve(org.id)}>
                            <CheckCircle2 className="w-4 h-4" /> Reactivate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
