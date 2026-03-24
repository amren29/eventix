"use client";

import { useState } from "react";
import {
  DollarSign, Clock, CheckCircle2, AlertCircle, Download,
  Building2, ArrowUpRight, ArrowDownLeft, ChevronDown,
  CreditCard, Wallet, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const payouts = [
  { id: "PAY-0041", amount: 182400, event: "Tech Summit 2026", status: "paid", method: "Bank Transfer", bank: "Maybank ****4821", date: "Feb 20, 2026", ref: "MBB20260220-7821" },
  { id: "PAY-0040", amount: 98500, event: "Music Fest KL", status: "processing", method: "Bank Transfer", bank: "CIMB ****2234", date: "Feb 18, 2026", ref: "—" },
  { id: "PAY-0039", amount: 65200, event: "Startup Weekend", status: "paid", method: "Bank Transfer", bank: "Maybank ****4821", date: "Feb 10, 2026", ref: "MBB20260210-7720" },
  { id: "PAY-0038", amount: 44800, event: "Design Week KL", status: "paid", method: "Bank Transfer", bank: "Maybank ****4821", date: "Jan 28, 2026", ref: "MBB20260128-7640" },
  { id: "PAY-0037", amount: 12300, event: "Growth Hacker Conf", status: "on-hold", method: "Bank Transfer", bank: "RHB ****8801", date: "Jan 15, 2026", ref: "—" },
];

const statusConfig = {
  paid: { label: "Paid", icon: CheckCircle2, color: "text-success-600", bg: "bg-success-50", border: "border-success-200" },
  processing: { label: "Processing", icon: Clock, color: "text-primary-600", bg: "bg-primary-50", border: "border-primary-200" },
  "on-hold": { label: "On Hold", icon: AlertCircle, color: "text-warning-600", bg: "bg-warning-50", border: "border-warning-200" },
} as const;

type PayoutStatus = keyof typeof statusConfig;

export default function PayoutsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const totalPaid = payouts.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = payouts.filter(p => p.status !== "paid").reduce((s, p) => s + p.amount, 0);
  const platformFee = Math.round(totalPaid * 0.03);
  const netEarnings = totalPaid - platformFee;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Payouts</h1>
          <p className="text-neutral-500 mt-0.5">Track your earnings and withdrawal history.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export Statement
        </Button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Earnings", value: `RM ${(totalPaid / 100).toLocaleString("en-MY", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-success-600", bg: "bg-success-50", sub: "after platform fees" },
          { label: "Pending Payout", value: `RM ${(totalPending / 100).toLocaleString("en-MY", { minimumFractionDigits: 2 })}`, icon: Clock, color: "text-warning-600", bg: "bg-warning-50", sub: "in process" },
          { label: "Platform Fee (3%)", value: `RM ${(platformFee / 100).toLocaleString("en-MY", { minimumFractionDigits: 2 })}`, icon: Building2, color: "text-neutral-600", bg: "bg-neutral-100", sub: "deducted" },
          { label: "Net Received", value: `RM ${(netEarnings / 100).toLocaleString("en-MY", { minimumFractionDigits: 2 })}`, icon: Wallet, color: "text-primary-600", bg: "bg-primary-50", sub: "in your account" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-neutral-500">{s.label}</p>
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
            </div>
            <p className={cn("text-lg font-extrabold", s.color)}>{s.value}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Bank account info */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-primary-800">Your payout bank account</p>
          <p className="text-primary-600 mt-0.5">Maybank — Ahmad Razif · ****4821 · Payouts processed within 3–5 business days after event ends.</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto flex-shrink-0 border-primary-200 text-primary-700 hover:bg-primary-100">
          Change Bank
        </Button>
      </div>

      {/* Payout history */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Payout History</h3>
          <span className="text-xs text-neutral-400">{payouts.length} transactions</span>
        </div>

        <div className="divide-y divide-neutral-50">
          {payouts.map((p) => {
            const sc = statusConfig[p.status as PayoutStatus];
            const StatusIcon = sc.icon;
            const isExpanded = selected === p.id;
            return (
              <div key={p.id}>
                <button
                  onClick={() => setSelected(isExpanded ? null : p.id)}
                  className="w-full text-left px-5 py-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                        p.status === "paid" ? "bg-success-50" : "bg-neutral-100"
                      )}>
                        {p.status === "paid"
                          ? <ArrowDownLeft className="w-4 h-4 text-success-600" />
                          : <Clock className="w-4 h-4 text-neutral-500" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 text-sm">{p.event}</p>
                        <p className="text-xs text-neutral-400">{p.date} · {p.bank}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border", sc.color, sc.bg, sc.border)}>
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                      <p className={cn("font-bold text-sm", p.status === "paid" ? "text-success-700" : "text-neutral-600")}>
                        RM {(p.amount / 100).toLocaleString("en-MY", { minimumFractionDigits: 2 })}
                      </p>
                      <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", isExpanded && "rotate-180")} />
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 bg-neutral-50/50">
                    <div className="grid grid-cols-3 gap-4 text-sm pt-2">
                      <div>
                        <p className="text-xs text-neutral-400 mb-0.5">Payout ID</p>
                        <p className="font-mono font-semibold text-neutral-700">{p.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 mb-0.5">Method</p>
                        <p className="font-semibold text-neutral-700">{p.method}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 mb-0.5">Reference</p>
                        <p className="font-mono font-semibold text-neutral-700">{p.ref}</p>
                      </div>
                    </div>
                    {p.status === "paid" && (
                      <Button variant="outline" size="sm" className="mt-3 gap-2">
                        <Download className="w-3.5 h-3.5" /> Download Receipt
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
