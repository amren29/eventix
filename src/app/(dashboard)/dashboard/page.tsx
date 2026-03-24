import Link from "next/link";
import {
  DollarSign, Ticket, CalendarDays, ScanLine,
  Plus, ArrowRight, ExternalLink, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/shared/stat-card";
import { RevenueChart } from "@/components/shared/revenue-chart";

const recentOrders = [
  { id: "EVT-00842", buyer: "John Doe",   email: "john@example.com",  event: "Tech Summit KL",   ticket: "VIP Package",    amount: "$89.00", status: "paid",     time: "2m ago" },
  { id: "EVT-00841", buyer: "Sara Kwan",  email: "sara@example.com",  event: "Tech Summit KL",   ticket: "General × 2",   amount: "$50.00", status: "paid",     time: "18m ago" },
  { id: "EVT-00840", buyer: "Amir Zul",   email: "amir@example.com",  event: "Bass Nation Fest", ticket: "General",        amount: "$35.00", status: "paid",     time: "1h ago" },
  { id: "EVT-00839", buyer: "Priya N.",   email: "priya@example.com", event: "Tech Summit KL",   ticket: "Early Bird",     amount: "$18.00", status: "refunded", time: "2h ago" },
  { id: "EVT-00838", buyer: "Daniel M.",  email: "dan@example.com",   event: "Bass Nation Fest", ticket: "VIP × 2",       amount: "$170.00", status: "paid",    time: "3h ago" },
];

const upcomingEvents = [
  { id: "1", name: "Tech Summit KL 2026",  date: "Sat, Mar 15",  sold: 842,  total: 1000, revenue: "$12,450", status: "published" },
  { id: "2", name: "Bass Nation Festival", date: "Fri, Apr 5",   sold: 234,  total: 500,  revenue: "$8,190",  status: "published" },
  { id: "3", name: "Design Workshop #4",   date: "Sun, Mar 22",  sold: 12,   total: 40,   revenue: "$360",    status: "draft" },
];

const statusStyles: Record<string, string> = {
  paid:     "bg-success-50 text-success-700 border-success-100",
  refunded: "bg-neutral-100 text-neutral-500 border-neutral-200",
  pending:  "bg-warning-50 text-warning-700 border-warning-100",
};

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Good morning, Amir 👋</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Here&apos;s what&apos;s happening with your events today.</p>
        </div>
        <Button className="gradient-primary text-white border-0 shadow-sm hover:opacity-90" asChild>
          <Link href="/dashboard/events/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value="$28,940"
          trend={{ value: "+18%", direction: "up", label: "vs last month" }}
          icon={DollarSign}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
        />
        <StatCard
          label="Tickets Sold"
          value="1,088"
          trend={{ value: "+24%", direction: "up", label: "vs last month" }}
          icon={Ticket}
          iconBg="bg-accent-50"
          iconColor="text-accent-600"
        />
        <StatCard
          label="Upcoming Events"
          value="3"
          icon={CalendarDays}
          iconBg="bg-warning-50"
          iconColor="text-warning-600"
        />
        <StatCard
          label="Check-In Rate"
          value="—"
          trend={{ value: "0%", direction: "up", label: "no event today" }}
          icon={ScanLine}
          iconBg="bg-success-50"
          iconColor="text-success-600"
        />
      </div>

      {/* Chart + Quick stats */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Quick stats panel */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-neutral-900 text-sm">This Month</h3>
          {[
            { label: "Top Event", value: "Tech Summit KL", sub: "$12,450 revenue" },
            { label: "Conversion Rate", value: "4.2%", sub: "visits → purchases" },
            { label: "Avg. Order Value", value: "$34.80", sub: "across all events" },
            { label: "Promo Code Uses", value: "88", sub: "EARLYBIRD20 leading" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-neutral-50 last:border-0">
              <div>
                <p className="text-xs font-medium text-neutral-500">{label}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
              </div>
              <p className="text-sm font-bold text-neutral-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders + Upcoming events */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-50">
            <h3 className="font-semibold text-neutral-900 text-sm">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                  {order.buyer.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-800 truncate">{order.buyer}</p>
                    <span className="text-xs text-neutral-400 flex-shrink-0 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />{order.time}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate">{order.ticket} · {order.event}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-neutral-900">{order.amount}</p>
                  <Badge className={`text-[10px] px-1.5 py-0 h-4 border ${statusStyles[order.status]}`}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-50">
            <h3 className="font-semibold text-neutral-900 text-sm">Upcoming Events</h3>
            <Link href="/dashboard/events" className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="px-5 py-4 hover:bg-neutral-50/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-800 truncate">{event.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{event.date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <Badge className={event.status === "published"
                      ? "bg-success-50 text-success-700 border-success-100 text-[10px] px-1.5 h-4"
                      : "bg-neutral-100 text-neutral-500 border-neutral-200 text-[10px] px-1.5 h-4"
                    }>
                      {event.status}
                    </Badge>
                    <Link href={`/dashboard/events/${event.id}`}>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400 hover:text-primary-600" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>{event.sold} / {event.total} tickets</span>
                    <span className="font-semibold text-neutral-700">{event.revenue}</span>
                  </div>
                  <Progress
                    value={(event.sold / event.total) * 100}
                    className="h-1.5 bg-neutral-100 [&>div]:gradient-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
