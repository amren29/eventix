"use client";

import { useState } from "react";
import {
  Search, CheckCircle2, XCircle, Clock, MoreHorizontal,
  DollarSign, TrendingUp, ChevronDown, Eye, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const payouts = [
  { id: "PAY-A001", org: "Bass Nation Events", event: "Tech Summit 2026", amount: 182400, fee: 5472, net: 176928, method: "Maybank ****4821", status: "pending", requested: "Feb 20, 2026" },
  { id: "PAY-A002", org: "Tech Malaysia Hub", event: "Design Week KL", amount: 98500, fee: 2955, net: 95545, method: "CIMB ****2234", status: "pending", requested: "Feb 18, 2026" },
  { id: "PAY-A003", org: "Startup Ecosystem Co.", event: "Startup Weekend", amount: 65200, fee: 1956, net: 63244, method: "Maybank ****9012", status: "approved", requested: "Feb 10, 2026" },
  { id: "PAY-A004", org: "Creative Arts Festival", event: "Art Exhibition KL", amount: 44800, fee: 1344, net: 43456, method: "RHB ****5500", status: "approved", requested: "Jan 28, 2026" },
  { id: "PAY-A005", org: "Bass Nation Events", event: "Music Fest KL", amount: 221400, fee: 6642, net: 214758, method: "Maybank ****4821", status: "paid", requested: "Jan 15, 2026" },
];

const statusConfig = {
  pending: { label: "Pending Approval", color: "text-warning-400", bg: "bg-warning-950", border: "border-warning-800" },
  approved: { label: "Approved", color: "text-primary-400", bg: "bg-primary-950", border: "border-primary-800" },
  paid: { label: "Paid", color: "text-success-400", bg: "bg-success-950", border: "border-success-800" },
  rejected: { label: "Rejected", color: "text-danger-400", bg: "bg-danger-950", border: "border-danger-800" },
} as const;

type PayoutStatus = keyof typeof statusConfig;

export default function AdminPayoutsPage() {
  const [payoutsState, setPayoutsState] = useState(payouts);

  function approve(id: string) {
    setPayoutsState(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));
  }

  function reject(id: string) {
    setPayoutsState(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p));
  }

  const totalPending = payoutsState.filter(p => p.status === "pending").reduce((s, p) => s + p.net, 0);
  const totalApproved = payoutsState.filter(p => p.status === "approved").reduce((s, p) => s + p.net, 0);
  const totalFees = payoutsState.reduce((s, p) => s + p.fee, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Payouts</h1>
        <p className="text-neutral-500 mt-0.5">Review and approve payout requests from organizers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Approval", value: `RM ${(totalPending / 100).toLocaleString()}`, color: "text-warning-400", icon: Clock },
          { label: "Approved (Processing)", value: `RM ${(totalApproved / 100).toLocaleString()}`, color: "text-primary-400", icon: CheckCircle2 },
          { label: "Platform Fees Collected", value: `RM ${(totalFees / 100).toLocaleString()}`, color: "text-success-400", icon: DollarSign },
        ].map(s => (
          <div key={s.label} className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={cn("w-4 h-4", s.color)} />
              <p className="text-xs font-medium text-neutral-500">{s.label}</p>
            </div>
            <p className={cn("text-xl font-extrabold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              {["Payout ID", "Organization", "Event", "Amount", "Platform Fee", "Net", "Status", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {payoutsState.map((p) => {
              const sc = statusConfig[p.status as PayoutStatus];
              return (
                <tr key={p.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-primary-400 bg-primary-950 px-2 py-0.5 rounded">{p.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-200">{p.org}</p>
                    <p className="text-xs text-neutral-500">{p.method}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-xs truncate max-w-[140px]">{p.event}</td>
                  <td className="px-4 py-3 text-neutral-300">RM {(p.amount / 100).toLocaleString()}</td>
                  <td className="px-4 py-3 text-danger-400 text-xs">- RM {(p.fee / 100).toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-success-400">RM {(p.net / 100).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border", sc.color, sc.bg, sc.border)}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === "pending" ? (
                      <div className="flex gap-1">
                        <Button size="sm" className="h-7 text-xs gradient-primary text-white px-2" onClick={() => approve(p.id)}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs border-danger-800 text-danger-400 hover:bg-danger-950 px-2" onClick={() => reject(p.id)}>
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-400 hover:text-white hover:bg-neutral-700">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-neutral-800 border-neutral-700 text-neutral-200">
                          <DropdownMenuItem className="gap-2 focus:bg-neutral-700"><Eye className="w-4 h-4" /> View Details</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 focus:bg-neutral-700"><Download className="w-4 h-4" /> Download Receipt</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
