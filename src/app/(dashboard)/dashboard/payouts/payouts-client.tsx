"use client";

import { useState } from "react";
import {
  DollarSign, Clock, CheckCircle2, AlertCircle, Download,
  Building2, ArrowUpRight, ArrowDownLeft, ChevronDown,
  CreditCard, Wallet, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PayoutRow {
  id: string;
  event: string;
  amount: number; // in cents, paid total
  serviceFee: number;
  pendingAmount: number;
  status: string;
  date: string;
  orderCount: number;
}

interface PayoutsClientProps {
  payoutRows: PayoutRow[];
  totalPaid: number;
  totalPending: number;
  platformFee: number;
  netEarnings: number;
}

const statusConfig = {
  paid: { label: "Paid", icon: CheckCircle2, color: "text-success-600", bg: "bg-success-50", border: "border-success-200" },
  processing: { label: "Processing", icon: Clock, color: "text-primary-600", bg: "bg-primary-50", border: "border-primary-200" },
  "on-hold": { label: "On Hold", icon: AlertCircle, color: "text-warning-600", bg: "bg-warning-50", border: "border-warning-200" },
} as const;

type PayoutStatus = keyof typeof statusConfig;

function formatCents(cents: number): string {
  return `RM ${(cents / 100).toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;
}

export function PayoutsClient({
  payoutRows,
  totalPaid,
  totalPending,
  platformFee,
  netEarnings,
}: PayoutsClientProps) {
  const [selected, setSelected] = useState<string | null>(null);

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
          { label: "Total Earnings", value: formatCents(totalPaid), icon: DollarSign, color: "text-success-600", bg: "bg-success-50", sub: "from paid orders" },
          { label: "Pending Payout", value: formatCents(totalPending), icon: Clock, color: "text-warning-600", bg: "bg-warning-50", sub: "in process" },
          { label: "Platform Fee (3%)", value: formatCents(platformFee), icon: Building2, color: "text-neutral-600", bg: "bg-neutral-100", sub: "deducted" },
          { label: "Net Received", value: formatCents(netEarnings), icon: Wallet, color: "text-primary-600", bg: "bg-primary-50", sub: "in your account" },
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
          <p className="text-primary-600 mt-0.5">Payouts are processed within 3-5 business days after event ends. Configure your bank account in organization settings.</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto flex-shrink-0 border-primary-200 text-primary-700 hover:bg-primary-100">
          Change Bank
        </Button>
      </div>

      {/* Payout history (per-event summaries) */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Revenue by Event</h3>
          <span className="text-xs text-neutral-400">{payoutRows.length} events</span>
        </div>

        <div className="divide-y divide-neutral-50">
          {payoutRows.map((p) => {
            const sc = statusConfig[p.status as PayoutStatus] ?? statusConfig.processing;
            const StatusIcon = sc.icon;
            const isExpanded = selected === p.id;
            const displayAmount = p.amount > 0 ? p.amount : p.pendingAmount;
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
                        <p className="text-xs text-neutral-400">Last order: {p.date} · {p.orderCount} orders</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border", sc.color, sc.bg, sc.border)}>
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                      <p className={cn("font-bold text-sm", p.status === "paid" ? "text-success-700" : "text-neutral-600")}>
                        {formatCents(displayAmount)}
                      </p>
                      <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", isExpanded && "rotate-180")} />
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 bg-neutral-50/50">
                    <div className="grid grid-cols-3 gap-4 text-sm pt-2">
                      <div>
                        <p className="text-xs text-neutral-400 mb-0.5">Gross Revenue</p>
                        <p className="font-semibold text-neutral-700">{formatCents(p.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 mb-0.5">Platform Fee</p>
                        <p className="font-semibold text-neutral-700">{formatCents(p.serviceFee || Math.round(p.amount * 0.03))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 mb-0.5">Net Earnings</p>
                        <p className="font-semibold text-neutral-700">{formatCents(p.amount - (p.serviceFee || Math.round(p.amount * 0.03)))}</p>
                      </div>
                    </div>
                    {p.pendingAmount > 0 && (
                      <div className="mt-2 pt-2 border-t border-neutral-100">
                        <p className="text-xs text-warning-600 font-medium">Pending orders: {formatCents(p.pendingAmount)}</p>
                      </div>
                    )}
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
          {payoutRows.length === 0 && (
            <div className="text-center py-12 text-neutral-400 text-sm">
              No payout data yet. Revenue will appear here once you have paid orders.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
