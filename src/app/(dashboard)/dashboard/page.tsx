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
import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  paid:     "bg-success-50 text-success-700 border-success-100",
  refunded: "bg-neutral-100 text-neutral-500 border-neutral-200",
  pending:  "bg-warning-50 text-warning-700 border-warning-100",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, organization_id")
    .eq("id", user!.id)
    .single();

  const orgId = profile?.organization_id;
  const firstName = profile?.full_name?.split(" ")[0] || "there";

  // Fetch upcoming events with ticket types
  const { data: events } = orgId
    ? await supabase
        .from("events")
        .select("id, title, slug, start_date, status, ticket_types(quantity, quantity_sold, price)")
        .eq("organization_id", orgId)
        .in("status", ["draft", "published"])
        .order("start_date", { ascending: true })
        .limit(5)
    : { data: [] };

  // Fetch recent orders for this org's events
  const eventIds = (events || []).map((e: any) => e.id);
  const { data: recentOrders } = eventIds.length > 0
    ? await supabase
        .from("orders")
        .select("id, reference, buyer_name, buyer_email, total, currency, status, created_at, event_id")
        .in("event_id", eventIds)
        .order("created_at", { ascending: false })
        .limit(5)
    : { data: [] };

  // Calculate stats
  const { data: paidOrders } = eventIds.length > 0
    ? await supabase
        .from("orders")
        .select("total")
        .in("event_id", eventIds)
        .eq("status", "paid")
    : { data: [] };

  const totalRevenue = (paidOrders || []).reduce((sum: number, o: any) => sum + o.total, 0);
  const totalTicketsSold = (events || []).reduce((sum: number, e: any) => {
    const tickets = e.ticket_types || [];
    return sum + tickets.reduce((s: number, t: any) => s + (t.quantity_sold || 0), 0);
  }, 0);
  const upcomingCount = (events || []).length;

  // Build event name map for orders
  const eventMap = Object.fromEntries((events || []).map((e: any) => [e.id, e.title]));

  // Format events for display
  const upcomingEvents = (events || []).map((e: any) => {
    const tickets = e.ticket_types || [];
    const sold = tickets.reduce((s: number, t: any) => s + (t.quantity_sold || 0), 0);
    const total = tickets.reduce((s: number, t: any) => s + (t.quantity || 0), 0);
    const revenue = tickets.reduce((s: number, t: any) => s + (t.quantity_sold || 0) * (t.price || 0), 0);
    return {
      id: e.id,
      name: e.title,
      date: new Date(e.start_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      sold,
      total: total || 1,
      revenue: `$${(revenue / 100).toLocaleString()}`,
      status: e.status,
    };
  });

  // Format orders for display
  const formattedOrders = (recentOrders || []).map((o: any) => {
    const timeDiff = Date.now() - new Date(o.created_at).getTime();
    const mins = Math.floor(timeDiff / 60000);
    const time = mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.floor(mins / 60)}h ago` : `${Math.floor(mins / 1440)}d ago`;
    return {
      id: o.reference,
      buyer: o.buyer_name,
      email: o.buyer_email,
      event: eventMap[o.event_id] || "",
      ticket: "Ticket",
      amount: `$${(o.total / 100).toFixed(2)}`,
      status: o.status,
      time,
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Good morning, {firstName} 👋</h1>
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
          value={`$${(totalRevenue / 100).toLocaleString()}`}
          icon={DollarSign}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
        />
        <StatCard
          label="Tickets Sold"
          value={totalTicketsSold.toLocaleString()}
          icon={Ticket}
          iconBg="bg-accent-50"
          iconColor="text-accent-600"
        />
        <StatCard
          label="Upcoming Events"
          value={String(upcomingCount)}
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

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-neutral-900 text-sm">Overview</h3>
          {[
            { label: "Total Events", value: String(upcomingCount), sub: "active events" },
            { label: "Total Revenue", value: `$${(totalRevenue / 100).toLocaleString()}`, sub: "all time" },
            { label: "Total Tickets", value: String(totalTicketsSold), sub: "sold across events" },
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
        <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-50">
            <h3 className="font-semibold text-neutral-900 text-sm">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {formattedOrders.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-neutral-400">No orders yet</div>
            ) : formattedOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                  {order.buyer.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
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
                  <Badge className={`text-[10px] px-1.5 py-0 h-4 border ${statusStyles[order.status] || ""}`}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-50">
            <h3 className="font-semibold text-neutral-900 text-sm">Upcoming Events</h3>
            <Link href="/dashboard/events" className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {upcomingEvents.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-neutral-400 mb-3">No events yet</p>
                <Button size="sm" className="gradient-primary text-white border-0" asChild>
                  <Link href="/dashboard/events/new">
                    <Plus className="w-3.5 h-3.5 mr-1.5" />Create your first event
                  </Link>
                </Button>
              </div>
            ) : upcomingEvents.map((event) => (
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
