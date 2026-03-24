"use client";

import { useState } from "react";
import {
  Flag, AlertTriangle, CheckCircle2, XCircle, Eye,
  MessageSquare, Clock, MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const flags = [
  { id: "FLG-001", type: "policy_violation", target: "XYZ Party Night", targetType: "event", reporter: "system", summary: "Event description contains potentially prohibited content (alcohol promotion under 21).", severity: "high", status: "open", created: "Feb 20, 2026" },
  { id: "FLG-002", type: "refund_dispute", target: "ORD-7712", targetType: "order", reporter: "Attendee: Lisa Tan", summary: "Attendee claims event was cancelled but refund was not issued by organizer within promised timeframe.", severity: "medium", status: "open", created: "Feb 19, 2026" },
  { id: "FLG-003", type: "fraud_suspicion", target: "XYZ Entertainment", targetType: "org", reporter: "system", summary: "Unusual spike in orders from same IP range. Possible fraudulent bulk ticket purchase.", severity: "high", status: "open", created: "Feb 18, 2026" },
  { id: "FLG-004", type: "spam_content", target: "Design Week KL", targetType: "event", reporter: "User: Raj Kumar", summary: "Event listing contains promotional links to external e-commerce store unrelated to the event.", severity: "low", status: "resolved", created: "Feb 15, 2026" },
  { id: "FLG-005", type: "policy_violation", target: "Bass Nation Events", targetType: "org", reporter: "User: Kevin Lim", summary: "Organizer issued no-refund policy in violation of platform refund guarantee terms.", severity: "medium", status: "open", created: "Feb 14, 2026" },
];

const typeConfig = {
  policy_violation: { label: "Policy Violation", color: "text-danger-400", bg: "bg-danger-950", border: "border-danger-800" },
  refund_dispute: { label: "Refund Dispute", color: "text-warning-400", bg: "bg-warning-950", border: "border-warning-800" },
  fraud_suspicion: { label: "Fraud Suspicion", color: "text-danger-400", bg: "bg-danger-950", border: "border-danger-800" },
  spam_content: { label: "Spam / Misleading", color: "text-neutral-400", bg: "bg-neutral-800", border: "border-neutral-700" },
} as const;

const severityConfig = {
  high: { label: "High", color: "text-danger-400" },
  medium: { label: "Medium", color: "text-warning-400" },
  low: { label: "Low", color: "text-neutral-400" },
} as const;

type FlagType = keyof typeof typeConfig;
type Severity = keyof typeof severityConfig;

export default function AdminFlagsPage() {
  const [flagsState, setFlagsState] = useState(flags);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");

  const filtered = flagsState.filter(f => filter === "all" || f.status === filter);

  function resolve(id: string) {
    setFlagsState(prev => prev.map(f => f.id === id ? { ...f, status: "resolved" } : f));
  }

  function dismiss(id: string) {
    setFlagsState(prev => prev.map(f => f.id === id ? { ...f, status: "dismissed" } : f));
  }

  const openCount = flagsState.filter(f => f.status === "open").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Flags & Reports</h1>
          <p className="text-neutral-500 mt-0.5">Review reported content, disputes, and policy violations.</p>
        </div>
        {openCount > 0 && (
          <div className="flex items-center gap-2 bg-danger-950 border border-danger-800 rounded-xl px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-danger-400" />
            <p className="text-sm font-semibold text-danger-300">{openCount} open flags</p>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl w-fit">
        {(["all", "open", "resolved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "text-sm font-medium px-4 py-1.5 rounded-lg capitalize transition-all",
              filter === t ? "bg-neutral-700 text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Flag cards */}
      <div className="space-y-4">
        {filtered.map((f) => {
          const tc = typeConfig[f.type as FlagType];
          const sc = severityConfig[f.severity as Severity];
          const isOpen = f.status === "open";
          return (
            <div key={f.id} className={cn(
              "bg-neutral-900 rounded-2xl border p-5",
              isOpen ? "border-neutral-700" : "border-neutral-800 opacity-60"
            )}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", tc.color, tc.bg, tc.border)}>
                      <Flag className="w-3 h-3" />
                      {tc.label}
                    </span>
                    <span className={cn("text-xs font-semibold", sc.color)}>
                      ● {sc.label} severity
                    </span>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
                      isOpen ? "text-warning-400 bg-warning-950 border border-warning-800" : "text-success-400 bg-success-950 border border-success-800"
                    )}>
                      {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                    </span>
                    <span className="font-mono text-xs text-neutral-500">{f.id}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-neutral-100">{f.target}</p>
                    <span className="text-xs text-neutral-500 capitalize bg-neutral-800 px-2 py-0.5 rounded">{f.targetType}</span>
                  </div>

                  <p className="text-sm text-neutral-400">{f.summary}</p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-neutral-600">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Reported by: {f.reporter}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {f.created}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" className="h-8 gradient-primary text-white gap-1.5 text-xs" onClick={() => resolve(f.id)}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 border-neutral-700 text-neutral-400 hover:bg-neutral-800 gap-1.5 text-xs" onClick={() => dismiss(f.id)}>
                      <XCircle className="w-3.5 h-3.5" /> Dismiss
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-400 hover:text-white hover:bg-neutral-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-neutral-800 border-neutral-700 text-neutral-200">
                        <DropdownMenuItem className="gap-2 focus:bg-neutral-700"><Eye className="w-4 h-4" /> View {f.targetType}</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-danger-400 focus:bg-neutral-700 focus:text-danger-400">
                          <Flag className="w-4 h-4" /> Escalate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-neutral-600">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-medium">No flags to review</p>
            <p className="text-sm">All reports have been resolved.</p>
          </div>
        )}
      </div>
    </div>
  );
}
