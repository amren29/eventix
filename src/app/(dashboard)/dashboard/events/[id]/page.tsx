"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Edit, Share2, ScanLine,
  DollarSign, Ticket, Users, CheckSquare, TrendingUp,
  MoreHorizontal, Download, Send, Search, Filter,
  RefreshCw, Copy, Globe, BarChart2, Tag, Settings,
  Megaphone, Eye, Trash2, AlertTriangle,
  Clock, MapPin, CalendarDays, Package,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatCard } from "@/components/shared/stat-card";
import { cn } from "@/lib/utils";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EVENT = {
  id: "1",
  name: "Tech Summit KL 2026",
  date: "Saturday, March 15, 2026",
  time: "2:00 PM – 10:00 PM (GMT+8)",
  venue: "Axiata Arena, Kuala Lumpur",
  status: "published",
  slug: "tech-summit-kl-2026",
  sold: 842, total: 1000,
  revenue: 12450,
  checkedIn: 0,
};

const TICKET_TYPES = [
  { name: "General Admission", price: "$25.00", sold: 620, total: 700, revenue: 15500, color: "#4f46e5" },
  { name: "VIP Package",       price: "$89.00", sold: 122, total: 200, revenue: 10858, color: "#7c3aed" },
  { name: "Early Bird",        price: "$18.00", sold: 100, total: 100, revenue: 1800,  color: "#10b981" },
];

const ORDERS = [
  { id: "EVT-00842", buyer: "John Doe",    email: "john@example.com",  ticket: "VIP Package",    qty: 1, amount: "$89.00",  status: "paid",     date: "Mar 1, 2026" },
  { id: "EVT-00841", buyer: "Sara Kwan",   email: "sara@example.com",  ticket: "General × 2",   qty: 2, amount: "$50.00",  status: "paid",     date: "Mar 1, 2026" },
  { id: "EVT-00840", buyer: "Amir Zul",    email: "amir@example.com",  ticket: "Early Bird",     qty: 1, amount: "$18.00",  status: "paid",     date: "Feb 28, 2026" },
  { id: "EVT-00839", buyer: "Priya N.",    email: "priya@example.com", ticket: "General",        qty: 1, amount: "$25.00",  status: "refunded", date: "Feb 27, 2026" },
  { id: "EVT-00838", buyer: "Daniel M.",   email: "dan@example.com",   ticket: "VIP × 2",       qty: 2, amount: "$178.00", status: "paid",     date: "Feb 27, 2026" },
  { id: "EVT-00837", buyer: "Lisa Tan",    email: "lisa@example.com",  ticket: "General",        qty: 1, amount: "$25.00",  status: "paid",     date: "Feb 26, 2026" },
  { id: "EVT-00836", buyer: "Hafiz A.",    email: "hafiz@example.com", ticket: "Early Bird",     qty: 1, amount: "$18.00",  status: "paid",     date: "Feb 26, 2026" },
];

const ATTENDEES = [
  { name: "John Doe",    email: "john@example.com",  ticket: "VIP Package",   checkedIn: false, order: "EVT-00842" },
  { name: "Sara Kwan",   email: "sara@example.com",  ticket: "General",       checkedIn: true,  order: "EVT-00841" },
  { name: "Sara Kwan",   email: "sara@example.com",  ticket: "General",       checkedIn: false, order: "EVT-00841" },
  { name: "Amir Zul",    email: "amir@example.com",  ticket: "Early Bird",    checkedIn: true,  order: "EVT-00840" },
  { name: "Daniel M.",   email: "dan@example.com",   ticket: "VIP Package",   checkedIn: false, order: "EVT-00838" },
  { name: "Daniel M.",   email: "dan@example.com",   ticket: "VIP Package",   checkedIn: false, order: "EVT-00838" },
  { name: "Lisa Tan",    email: "lisa@example.com",  ticket: "General",       checkedIn: false, order: "EVT-00837" },
  { name: "Hafiz A.",    email: "hafiz@example.com", ticket: "Early Bird",    checkedIn: false, order: "EVT-00836" },
];

const SALES_TREND = [
  { date: "Feb 20", sales: 24 }, { date: "Feb 21", sales: 18 }, { date: "Feb 22", sales: 35 },
  { date: "Feb 23", sales: 42 }, { date: "Feb 24", sales: 31 }, { date: "Feb 25", sales: 58 },
  { date: "Feb 26", sales: 49 }, { date: "Feb 27", sales: 71 }, { date: "Feb 28", sales: 63 },
  { date: "Mar 1",  sales: 88 }, { date: "Mar 2",  sales: 74 }, { date: "Mar 3",  sales: 92 },
];

const TRAFFIC_SOURCES = [
  { source: "Direct",        pct: 44, color: "#4f46e5" },
  { source: "Social Media",  pct: 31, color: "#7c3aed" },
  { source: "Email",         pct: 18, color: "#10b981" },
  { source: "Search",        pct: 7,  color: "#f59e0b" },
];

const PROMO_CODES = [
  { code: "EARLYBIRD20", type: "20% off",  used: 88,  limit: 100, active: true },
  { code: "VIPFRIEND",   type: "$15 off",  used: 12,  limit: 50,  active: true },
  { code: "PRESS100",    type: "100% off", used: 5,   limit: 10,  active: true },
];

const statusStyle: Record<string, string> = {
  paid:     "bg-success-50 text-success-700 border-success-100",
  refunded: "bg-neutral-100 text-neutral-500 border-neutral-200",
  pending:  "bg-warning-50 text-warning-700 border-warning-100",
};

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function TabOverview() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tickets Sold"  value={`${EVENT.sold} / ${EVENT.total}`} trend={{ value: "84%", direction: "up", label: "capacity" }} icon={Ticket}      iconBg="bg-primary-50"  iconColor="text-primary-600" />
        <StatCard label="Gross Revenue" value={`$${EVENT.revenue.toLocaleString()}`} trend={{ value: "+$890", direction: "up", label: "this week" }} icon={DollarSign}  iconBg="bg-success-50"  iconColor="text-success-600" />
        <StatCard label="Checked In"    value={`${EVENT.checkedIn} / ${EVENT.sold}`} icon={CheckSquare} iconBg="bg-warning-50"  iconColor="text-warning-600" />
        <StatCard label="Tickets Left"  value={`${EVENT.total - EVENT.sold}`} icon={Users}       iconBg="bg-accent-50"   iconColor="text-accent-600" />
      </div>

      {/* Ticket breakdown + Sales trend */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Ticket breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <h3 className="font-semibold text-neutral-900 text-sm mb-4">Sales by Ticket Type</h3>
          <div className="space-y-4">
            {TICKET_TYPES.map((t) => (
              <div key={t.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{t.name}</p>
                    <p className="text-xs text-neutral-400">{t.price} · {t.sold} sold</p>
                  </div>
                  <p className="text-sm font-bold text-neutral-700">${t.revenue.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(t.sold/t.total)*100}%`, background: t.color }} />
                  </div>
                  <span className="text-xs text-neutral-400 w-8 text-right">{Math.round((t.sold/t.total)*100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales trend */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900 text-sm">Daily Ticket Sales</h3>
            <span className="text-xs text-neutral-400">Last 14 days</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={SALES_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2.5} fill="url(#salesGrad)" dot={false} activeDot={{ r: 4, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <h3 className="font-semibold text-neutral-900 text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button size="sm" className="gradient-primary text-white border-0">
            <ScanLine className="w-3.5 h-3.5 mr-2" />Start Check-In
          </Button>
          <Button size="sm" variant="outline" className="border-neutral-200">
            <Send className="w-3.5 h-3.5 mr-2" />Email Attendees
          </Button>
          <Button size="sm" variant="outline" className="border-neutral-200">
            <Share2 className="w-3.5 h-3.5 mr-2" />Share Event
          </Button>
          <Button size="sm" variant="outline" className="border-neutral-200">
            <Download className="w-3.5 h-3.5 mr-2" />Export CSV
          </Button>
          <Button size="sm" variant="outline" className="border-neutral-200">
            <Edit className="w-3.5 h-3.5 mr-2" />Edit Event
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Orders ──────────────────────────────────────────────────────────────

function TabOrders() {
  const [search, setSearch] = useState("");
  const filtered = ORDERS.filter((o) =>
    o.buyer.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase()) ||
    o.id.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <Input
            placeholder="Search by name, email, order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm border-neutral-200"
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 border-neutral-200 text-xs">
          <Filter className="w-3.5 h-3.5 mr-1.5" />Filter
        </Button>
        <Button variant="outline" size="sm" className="h-9 border-neutral-200 text-xs ml-auto">
          <Download className="w-3.5 h-3.5 mr-1.5" />Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500">Order</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500">Buyer</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 hidden md:table-cell">Ticket</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 hidden lg:table-cell">Date</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-neutral-500">Amount</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-neutral-500">Status</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <code className="text-xs font-mono text-primary-600">{order.id}</code>
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-medium text-neutral-800 text-sm">{order.buyer}</p>
                  <p className="text-xs text-neutral-400">{order.email}</p>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <p className="text-sm text-neutral-600">{order.ticket}</p>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <p className="text-xs text-neutral-400">{order.date}</p>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <p className="font-bold text-neutral-900 text-sm">{order.amount}</p>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <Badge className={`text-[10px] px-2 h-5 border capitalize ${statusStyle[order.status]}`}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-3 py-3.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="text-xs gap-2"><Eye className="w-3.5 h-3.5" />View order</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs gap-2"><Send className="w-3.5 h-3.5" />Resend ticket</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-xs gap-2 text-danger-600 focus:text-danger-600 focus:bg-danger-50">
                        <RefreshCw className="w-3.5 h-3.5" />Issue refund
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-sm">No orders match your search.</div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Attendees ───────────────────────────────────────────────────────────

function TabAttendees() {
  const checkedIn = ATTENDEES.filter((a) => a.checkedIn).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <Input placeholder="Search attendees..." className="pl-8 h-9 text-sm border-neutral-200" />
        </div>
        <Button variant="outline" size="sm" className="h-9 border-neutral-200 text-xs">
          <Filter className="w-3.5 h-3.5 mr-1.5" />Filter
        </Button>
        <Button variant="outline" size="sm" className="h-9 border-neutral-200 text-xs">
          <Send className="w-3.5 h-3.5 mr-1.5" />Email All
        </Button>
        <Button variant="outline" size="sm" className="h-9 border-neutral-200 text-xs ml-auto">
          <Download className="w-3.5 h-3.5 mr-1.5" />Export CSV
        </Button>
      </div>

      {/* Check-in progress bar */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-neutral-700">Check-In Progress</span>
            <span className="font-bold text-neutral-900">{checkedIn} / {ATTENDEES.length}</span>
          </div>
          <Progress value={(checkedIn / ATTENDEES.length) * 100} className="h-2 bg-neutral-100 [&>div]:bg-success-500" />
        </div>
        <div className="text-2xl font-extrabold text-success-600 flex-shrink-0">
          {Math.round((checkedIn / ATTENDEES.length) * 100)}%
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500">Attendee</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 hidden md:table-cell">Ticket</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 hidden lg:table-cell">Order</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-neutral-500">Check-In</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {ATTENDEES.map((attendee, i) => (
              <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                      {attendee.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">{attendee.name}</p>
                      <p className="text-xs text-neutral-400">{attendee.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <p className="text-sm text-neutral-600">{attendee.ticket}</p>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <code className="text-xs font-mono text-primary-600">{attendee.order}</code>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <Badge className={attendee.checkedIn
                    ? "bg-success-50 text-success-700 border-success-100 text-[10px] px-2 h-5"
                    : "bg-neutral-100 text-neutral-500 border-neutral-200 text-[10px] px-2 h-5"
                  }>
                    {attendee.checkedIn ? "✓ Checked in" : "Pending"}
                  </Badge>
                </td>
                <td className="px-3 py-3.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="text-xs gap-2"><CheckSquare className="w-3.5 h-3.5" />Manual check-in</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs gap-2"><Send className="w-3.5 h-3.5" />Resend ticket</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Check-In ────────────────────────────────────────────────────────────

function TabCheckIn() {
  const gates = [
    { name: "Main Entry",   count: 0, capacity: 500, staff: 2, active: true },
    { name: "VIP Entrance", count: 0, capacity: 200, staff: 1, active: true },
    { name: "Side Gate A",  count: 0, capacity: 300, staff: 0, active: false },
  ];

  return (
    <div className="space-y-4">
      {/* Launch checkin CTA */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Ready to check in attendees?</h3>
            <p className="text-primary-100 text-sm">Open the check-in app on any mobile device to start scanning tickets.</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-primary-700 hover:bg-primary-50 border-0 font-semibold" asChild>
              <Link href="/checkin">
                <ScanLine className="w-4 h-4 mr-2" />Open Check-In App
              </Link>
            </Button>
            <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
              <Share2 className="w-4 h-4 mr-2" />Share Access Code
            </Button>
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Checked In", value: "0", sub: `of ${EVENT.sold} attendees`, color: "text-neutral-900" },
          { label: "Check-In Rate",    value: "0%", sub: "event hasn't started",       color: "text-neutral-900" },
          { label: "Active Gates",     value: "2",  sub: "3 gates configured",          color: "text-success-600" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 text-center">
            <p className={`text-3xl font-extrabold mb-1 ${color}`}>{value}</p>
            <p className="text-sm font-medium text-neutral-600">{label}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Gates */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900 text-sm">Check-In Gates</h3>
          <Button size="sm" variant="outline" className="h-8 text-xs border-neutral-200">
            <Plus className="w-3.5 h-3.5 mr-1.5" />Add Gate
          </Button>
        </div>
        <div className="space-y-3">
          {gates.map((gate) => (
            <div key={gate.name} className={cn(
              "flex items-center gap-4 p-4 rounded-xl border",
              gate.active ? "border-neutral-100 bg-neutral-50/50" : "border-dashed border-neutral-200 opacity-60"
            )}>
              <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", gate.active ? "bg-success-500" : "bg-neutral-300")} />
              <div className="flex-1">
                <p className="font-medium text-neutral-800 text-sm">{gate.name}</p>
                <p className="text-xs text-neutral-400">{gate.staff} staff assigned · {gate.count} checked in</p>
              </div>
              <div className="w-32">
                <Progress value={(gate.count / gate.capacity) * 100} className="h-1.5 bg-neutral-100 [&>div]:bg-success-500" />
              </div>
              <span className="text-xs text-neutral-400 w-16 text-right">{gate.count}/{gate.capacity}</span>
              <Badge className={gate.active
                ? "bg-success-50 text-success-700 border-success-100 text-[10px]"
                : "bg-neutral-100 text-neutral-400 border-neutral-200 text-[10px]"
              }>
                {gate.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Access code */}
      <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5">
        <p className="text-sm font-semibold text-neutral-700 mb-1">Staff Access Code</p>
        <p className="text-xs text-neutral-400 mb-3">Share this code with your check-in staff to grant access to the scanner app.</p>
        <div className="flex items-center gap-3">
          <code className="text-2xl font-mono font-bold text-primary-600 tracking-widest bg-white border border-primary-100 px-5 py-2 rounded-xl">
            KL-2026
          </code>
          <Button size="sm" variant="outline" className="border-neutral-200">
            <Copy className="w-3.5 h-3.5 mr-1.5" />Copy
          </Button>
          <Button size="sm" variant="outline" className="border-neutral-200">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />Regenerate
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Analytics ───────────────────────────────────────────────────────────

function TabAnalytics() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross Revenue",   value: "$12,450", sub: "before fees" },
          { label: "Net Revenue",     value: "$11,241", sub: "after 2.5% fee" },
          { label: "Avg Order Value", value: "$32.40",  sub: "per transaction" },
          { label: "Conversion Rate", value: "3.8%",    sub: "page visits → purchase" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
            <p className="text-xs font-medium text-neutral-500 mb-1">{label}</p>
            <p className="text-2xl font-extrabold text-neutral-900">{value}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Revenue by ticket type */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <h3 className="font-semibold text-neutral-900 text-sm mb-4">Revenue by Ticket Type</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TICKET_TYPES} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Revenue"]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {TICKET_TYPES.map((t, i) => <Cell key={i} fill={t.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic sources */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <h3 className="font-semibold text-neutral-900 text-sm mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {TRAFFIC_SOURCES.map(({ source, pct, color }) => (
              <div key={source}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-neutral-700">{source}</span>
                  <span className="font-bold text-neutral-900">{pct}%</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-50">
            <Button size="sm" variant="outline" className="w-full h-8 text-xs border-neutral-200">
              <Download className="w-3.5 h-3.5 mr-1.5" />Export Full Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Marketing ───────────────────────────────────────────────────────────

function TabMarketing() {
  return (
    <div className="space-y-5">
      {/* Promo codes */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900 text-sm">Promo Codes</h3>
          <Button size="sm" className="gradient-primary text-white border-0 h-8 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" />Create Code
          </Button>
        </div>
        <div className="space-y-3">
          {PROMO_CODES.map((code) => (
            <div key={code.code} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <code className="font-mono text-sm font-bold text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1 rounded-lg">
                {code.code}
              </code>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-700">{code.type}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 max-w-32 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full gradient-primary rounded-full" style={{ width: `${(code.used / (code.limit || code.used + 1)) * 100}%` }} />
                  </div>
                  <span className="text-xs text-neutral-400">{code.used} / {code.limit} uses</span>
                </div>
              </div>
              <Badge className="bg-success-50 text-success-700 border-success-100 text-[10px]">Active</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-lg hover:bg-neutral-200 text-neutral-400">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem className="text-xs gap-2"><Edit className="w-3.5 h-3.5" />Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-xs gap-2"><Copy className="w-3.5 h-3.5" />Copy code</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs gap-2 text-danger-600 focus:text-danger-600 focus:bg-danger-50">
                    <Trash2 className="w-3.5 h-3.5" />Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>

      {/* Embeddable widget */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <h3 className="font-semibold text-neutral-900 text-sm mb-1">Embeddable Ticket Widget</h3>
        <p className="text-xs text-neutral-400 mb-4">Paste this snippet into your website to let visitors buy tickets without leaving your site.</p>
        <div className="bg-neutral-900 rounded-xl p-4 font-mono text-xs text-success-400 mb-3 overflow-x-auto">
          {`<script src="https://eventix.io/widget.js" data-event="tech-summit-kl-2026"></script>`}
        </div>
        <Button size="sm" variant="outline" className="border-neutral-200 text-xs h-8">
          <Copy className="w-3.5 h-3.5 mr-1.5" />Copy Snippet
        </Button>
      </div>

      {/* Social sharing */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <h3 className="font-semibold text-neutral-900 text-sm mb-4">Share Your Event</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Copy Link",    icon: Copy,   color: "border-neutral-200 text-neutral-700" },
            { label: "Twitter/X",    icon: Share2,  color: "border-[#1da1f2] text-[#1da1f2] bg-[#1da1f2]/5" },
            { label: "Facebook",     icon: Globe,   color: "border-[#1877f2] text-[#1877f2] bg-[#1877f2]/5" },
            { label: "WhatsApp",     icon: Send,    color: "border-[#25d366] text-[#25d366] bg-[#25d366]/5" },
          ].map(({ label, icon: Icon, color }) => (
            <Button key={label} variant="outline" size="sm" className={`h-9 text-xs border ${color}`}>
              <Icon className="w-3.5 h-3.5 mr-1.5" />{label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Settings ────────────────────────────────────────────────────────────

function TabSettings() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-neutral-900">Event Status</h3>
        <div className="flex flex-wrap gap-3">
          {["Published", "Unpublish", "Cancel Event"].map((action, i) => (
            <Button key={action} variant={i === 0 ? "default" : "outline"}
              className={cn("text-sm", i === 0 ? "gradient-primary text-white border-0" : i === 2 ? "border-danger-200 text-danger-600 hover:bg-danger-50" : "border-neutral-200")}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-3">
        <h3 className="font-semibold text-neutral-900">Attendee Policies</h3>
        {[
          { label: "Allow refunds", sub: "Up to 7 days before event", enabled: true },
          { label: "Allow ticket transfers", sub: "Attendees can transfer to another person", enabled: true },
          { label: "Show remaining ticket count", sub: "Visible on public event page", enabled: false },
        ].map(({ label, sub, enabled }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-neutral-700">{label}</p>
              <p className="text-xs text-neutral-400">{sub}</p>
            </div>
            <div className={cn("w-10 h-6 rounded-full border-2 flex items-center cursor-pointer transition-colors px-0.5",
              enabled ? "border-primary-500 bg-primary-500 justify-end" : "border-neutral-300 bg-neutral-100 justify-start"
            )}>
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-danger-50 border border-danger-100 rounded-2xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-danger-700">Danger Zone</h3>
            <p className="text-sm text-danger-600/80 mt-0.5">These actions are irreversible. Proceed with caution.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="sm" variant="outline" className="border-danger-200 text-danger-600 hover:bg-danger-100 text-xs">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />Delete Event
          </Button>
          <Button size="sm" variant="outline" className="border-danger-200 text-danger-600 hover:bg-danger-100 text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />Cancel & Refund All
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",   label: "Overview",   icon: BarChart2 },
  { id: "orders",     label: "Orders",     icon: Package },
  { id: "attendees",  label: "Attendees",  icon: Users },
  { id: "checkin",    label: "Check-In",   icon: ScanLine },
  { id: "analytics",  label: "Analytics",  icon: TrendingUp },
  { id: "marketing",  label: "Marketing",  icon: Megaphone },
  { id: "settings",   label: "Settings",   icon: Settings },
];

// Need Plus import
function Plus(props: React.ComponentProps<typeof TrendingUp>) {
  return (
    <svg {...(props as any)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function EventDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabContent: Record<string, React.ReactNode> = {
    overview:  <TabOverview />,
    orders:    <TabOrders />,
    attendees: <TabAttendees />,
    checkin:   <TabCheckIn />,
    analytics: <TabAnalytics />,
    marketing: <TabMarketing />,
    settings:  <TabSettings />,
  };

  return (
    <div className="min-h-full">
      {/* Event header */}
      <div className="bg-white border-b border-neutral-100 px-6 pt-6 pb-0 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Link href="/dashboard/events" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />Back to Events
          </Link>

          <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-extrabold text-neutral-900">{EVENT.name}</h1>
                <Badge className="bg-success-50 text-success-700 border-success-100 text-xs capitalize">
                  ● {EVENT.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-neutral-400">
                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{EVENT.date} · {EVENT.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{EVENT.venue}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-9 border-neutral-200 text-xs" asChild>
                <Link href={`/e/${EVENT.slug}`} target="_blank">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />View Public Page
                </Link>
              </Button>
              <Button size="sm" variant="outline" className="h-9 border-neutral-200 text-xs">
                <Edit className="w-3.5 h-3.5 mr-1.5" />Edit Event
              </Button>
              <Button size="sm" className="h-9 gradient-primary text-white border-0 text-xs">
                <ScanLine className="w-3.5 h-3.5 mr-1.5" />Check-In
              </Button>
            </div>
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 overflow-x-auto scrollbar-thin -mb-px">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0",
                  activeTab === id
                    ? "border-primary-600 text-primary-700"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6 max-w-7xl mx-auto">
        {tabContent[activeTab]}
      </div>
    </div>
  );
}
