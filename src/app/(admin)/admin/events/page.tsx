"use client";

import { useState } from "react";
import {
  Search, Eye, Ban, CheckCircle2, MoreHorizontal,
  CalendarDays, Ticket, DollarSign, Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const events = [
  { id: "EVT-001", name: "Tech Summit 2026", org: "Bass Nation Events", date: "Mar 15, 2026", tickets: 500, sold: 312, revenue: 46500, status: "published" },
  { id: "EVT-002", name: "Music Fest KL", org: "Bass Nation Events", date: "Apr 5, 2026", tickets: 2000, sold: 1480, revenue: 221400, status: "published" },
  { id: "EVT-003", name: "Startup Weekend", org: "Startup Ecosystem Co.", date: "Mar 22, 2026", tickets: 300, sold: 248, revenue: 37200, status: "published" },
  { id: "EVT-004", name: "Design Week KL", org: "Creative Arts Festival", date: "May 10, 2026", tickets: 400, sold: 90, revenue: 18000, status: "draft" },
  { id: "EVT-005", name: "XYZ Party Night", org: "XYZ Entertainment", date: "Mar 1, 2026", tickets: 200, sold: 180, revenue: 27000, status: "flagged" },
  { id: "EVT-006", name: "FinTech Conference 2026", org: "FinTech Malaysia Conf", date: "Apr 18, 2026", tickets: 600, sold: 0, revenue: 0, status: "pending" },
];

const statusConfig = {
  published: { label: "Published", color: "text-success-400", bg: "bg-success-950", border: "border-success-800" },
  draft: { label: "Draft", color: "text-neutral-400", bg: "bg-neutral-800", border: "border-neutral-700" },
  flagged: { label: "Flagged", color: "text-danger-400", bg: "bg-danger-950", border: "border-danger-800" },
  pending: { label: "Pending", color: "text-warning-400", bg: "bg-warning-950", border: "border-warning-800" },
  suspended: { label: "Suspended", color: "text-danger-400", bg: "bg-danger-950", border: "border-danger-800" },
} as const;

type EventStatus = keyof typeof statusConfig;

export default function AdminEventsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventsState, setEventsState] = useState(events);

  const filtered = eventsState.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.org.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function suspendEvent(id: string) {
    setEventsState(prev => prev.map(e => e.id === id ? { ...e, status: "suspended" } : e));
  }

  function approveEvent(id: string) {
    setEventsState(prev => prev.map(e => e.id === id ? { ...e, status: "published" } : e));
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Events</h1>
        <p className="text-neutral-500 mt-0.5">Monitor all events across the platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: eventsState.length, color: "text-white" },
          { label: "Published", value: eventsState.filter(e => e.status === "published").length, color: "text-success-400" },
          { label: "Flagged", value: eventsState.filter(e => e.status === "flagged").length, color: "text-danger-400" },
          { label: "Pending Review", value: eventsState.filter(e => e.status === "pending").length, color: "text-warning-400" },
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
            placeholder="Search events or organizers..."
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
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
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
              {["Event", "Organizer", "Date", "Tickets", "Revenue", "Status", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filtered.map((ev) => {
              const sc = statusConfig[ev.status as EventStatus];
              const soldPct = ev.tickets > 0 ? Math.round((ev.sold / ev.tickets) * 100) : 0;
              return (
                <tr key={ev.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-neutral-100">{ev.name}</p>
                        <span className="font-mono text-xs text-neutral-500">{ev.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">{ev.org}</td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">{ev.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="text-neutral-300">{ev.sold}/{ev.tickets}</span>
                      <span className={cn("text-xs font-semibold", soldPct >= 80 ? "text-danger-400" : "text-neutral-500")}>
                        ({soldPct}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-neutral-200">
                    RM {(ev.revenue / 100).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border", sc.color, sc.bg, sc.border)}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-400 hover:text-white hover:bg-neutral-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-neutral-800 border-neutral-700 text-neutral-200">
                        <DropdownMenuItem className="gap-2 focus:bg-neutral-700"><Eye className="w-4 h-4" /> View Event</DropdownMenuItem>
                        {(ev.status === "pending" || ev.status === "flagged") && (
                          <DropdownMenuItem className="gap-2 text-success-400 focus:bg-neutral-700 focus:text-success-400" onClick={() => approveEvent(ev.id)}>
                            <CheckCircle2 className="w-4 h-4" /> Approve
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-neutral-700" />
                        {ev.status !== "suspended" && (
                          <DropdownMenuItem className="gap-2 text-danger-400 focus:bg-neutral-700 focus:text-danger-400" onClick={() => suspendEvent(ev.id)}>
                            <Ban className="w-4 h-4" /> Suspend Event
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2 text-warning-400 focus:bg-neutral-700 focus:text-warning-400">
                          <Flag className="w-4 h-4" /> Flag for Review
                        </DropdownMenuItem>
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
