"use client";

import { useState } from "react";
import {
  Search, Download, RefreshCw, Eye, MoreHorizontal,
  CheckCircle2, Clock, XCircle, AlertCircle,
  CreditCard, Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const orders = [
  { id: "ORD-7821", event: "Tech Summit 2026", attendee: "Ahmad Razif", email: "ahmad@example.com", tickets: 2, total: 29800, status: "completed", payment: "Card", date: "Feb 20, 2026" },
  { id: "ORD-7820", event: "Music Fest KL", attendee: "Siti Nurfazira", email: "siti@example.com", tickets: 4, total: 59600, status: "completed", payment: "FPX", date: "Feb 20, 2026" },
  { id: "ORD-7819", event: "Tech Summit 2026", attendee: "Raj Kumar", email: "raj@example.com", tickets: 1, total: 14900, status: "pending", payment: "PayPal", date: "Feb 19, 2026" },
  { id: "ORD-7818", event: "Startup Weekend", attendee: "Lisa Tan", email: "lisa@example.com", tickets: 3, total: 44700, status: "completed", payment: "Card", date: "Feb 19, 2026" },
  { id: "ORD-7817", event: "Music Fest KL", attendee: "Hafiz Azwan", email: "hafiz@example.com", tickets: 2, total: 29800, status: "refunded", payment: "FPX", date: "Feb 18, 2026" },
  { id: "ORD-7816", event: "Tech Summit 2026", attendee: "Nurul Aina", email: "nurul@example.com", tickets: 1, total: 14900, status: "completed", payment: "Card", date: "Feb 18, 2026" },
  { id: "ORD-7815", event: "Startup Weekend", attendee: "Kevin Lim", email: "kevin@example.com", tickets: 2, total: 29800, status: "cancelled", payment: "Card", date: "Feb 17, 2026" },
  { id: "ORD-7814", event: "Music Fest KL", attendee: "Farah Diyana", email: "farah@example.com", tickets: 6, total: 89400, status: "completed", payment: "Card", date: "Feb 17, 2026" },
  { id: "ORD-7813", event: "Tech Summit 2026", attendee: "Zaid Ariff", email: "zaid@example.com", tickets: 1, total: 14900, status: "pending", payment: "FPX", date: "Feb 16, 2026" },
  { id: "ORD-7812", event: "Startup Weekend", attendee: "Maya Putri", email: "maya@example.com", tickets: 2, total: 29800, status: "completed", payment: "PayPal", date: "Feb 16, 2026" },
];

const statusConfig = {
  completed: { label: "Completed", icon: CheckCircle2, color: "text-success-600", bg: "bg-success-50", border: "border-success-200" },
  pending: { label: "Pending", icon: Clock, color: "text-warning-600", bg: "bg-warning-50", border: "border-warning-200" },
  refunded: { label: "Refunded", icon: RefreshCw, color: "text-primary-600", bg: "bg-primary-50", border: "border-primary-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-danger-600", bg: "bg-danger-50", border: "border-danger-200" },
} as const;

type Status = keyof typeof statusConfig;

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.attendee.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchEvent = eventFilter === "all" || o.event === eventFilter;
    return matchSearch && matchStatus && matchEvent;
  });

  const totals = {
    revenue: orders.filter(o => o.status === "completed").reduce((s, o) => s + o.total, 0),
    count: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    refunded: orders.filter(o => o.status === "refunded").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Orders</h1>
          <p className="text-neutral-500 mt-0.5">Manage and track all ticket purchases across your events.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
          <p className="text-xs font-medium text-neutral-500 mb-1">Total Revenue</p>
          <p className="text-xl font-extrabold text-neutral-900">RM {(totals.revenue / 100).toLocaleString("en-MY", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-neutral-400 mt-0.5">from completed orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
          <p className="text-xs font-medium text-neutral-500 mb-1">Total Orders</p>
          <p className="text-xl font-extrabold text-neutral-900">{totals.count}</p>
          <p className="text-xs text-neutral-400 mt-0.5">all time</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
          <p className="text-xs font-medium text-neutral-500 mb-1">Pending</p>
          <p className="text-xl font-extrabold text-warning-600">{totals.pending}</p>
          <p className="text-xs text-neutral-400 mt-0.5">awaiting payment</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
          <p className="text-xs font-medium text-neutral-500 mb-1">Refunded</p>
          <p className="text-xl font-extrabold text-primary-600">{totals.refunded}</p>
          <p className="text-xs text-neutral-400 mt-0.5">this month</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <div className="p-4 border-b border-neutral-100 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search by order ID, name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="Tech Summit 2026">Tech Summit 2026</SelectItem>
              <SelectItem value="Music Fest KL">Music Fest KL</SelectItem>
              <SelectItem value="Startup Weekend">Startup Weekend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Attendee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Event</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Tickets</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Total</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.map((order) => {
                const sc = statusConfig[order.status as Status];
                const StatusIcon = sc.icon;
                return (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-900">{order.attendee}</p>
                      <p className="text-xs text-neutral-400">{order.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-neutral-700 truncate max-w-[160px]">{order.event}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CreditCard className="w-3 h-3 text-neutral-400" />
                        <span className="text-xs text-neutral-400">{order.payment}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-neutral-600">
                        <Ticket className="w-3.5 h-3.5" />
                        {order.tickets}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                      RM {(order.total / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border", sc.color, sc.bg, sc.border)}>
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">{order.date}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2"><Eye className="w-4 h-4" /> View Details</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Download className="w-4 h-4" /> Download Receipt</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-warning-600"><AlertCircle className="w-4 h-4" /> Issue Refund</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-danger-600"><XCircle className="w-4 h-4" /> Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-neutral-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-medium">No orders found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-neutral-100 flex items-center justify-between text-sm text-neutral-500">
          <p>Showing {filtered.length} of {orders.length} orders</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
