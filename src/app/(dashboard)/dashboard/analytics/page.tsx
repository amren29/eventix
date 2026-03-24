import { createClient } from "@/lib/supabase/server";
import AnalyticsClient, {
  type AnalyticsData,
  type RevenueDataPoint,
  type EventRevenuePoint,
  type TicketTypePoint,
} from "./analytics-client";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user!.id)
    .single();

  const orgId = profile?.organization_id;

  // Fetch events for this org
  const { data: orgEvents } = orgId
    ? await supabase
        .from("events")
        .select("id, title")
        .eq("organization_id", orgId)
    : { data: [] };

  const eventIds = (orgEvents || []).map((e: any) => e.id);
  const eventMap = Object.fromEntries((orgEvents || []).map((e: any) => [e.id, e.title]));

  // Fetch all orders for these events
  const { data: dbOrders } = eventIds.length > 0
    ? await supabase
        .from("orders")
        .select("id, event_id, total, status, buyer_id, created_at")
        .in("event_id", eventIds)
    : { data: [] };

  const orders = dbOrders || [];

  // Fetch ticket types for these events
  const { data: dbTicketTypes } = eventIds.length > 0
    ? await supabase
        .from("ticket_types")
        .select("id, event_id, name, price, quantity, quantity_sold")
        .in("event_id", eventIds)
    : { data: [] };

  const ticketTypes = dbTicketTypes || [];

  // -- Compute revenue data grouped by month (last 6 months) --
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const revenueByMonth: Record<string, { revenue: number; tickets: number }> = {};

  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    revenueByMonth[key] = { revenue: 0, tickets: 0 };
  }

  // Count order tickets per order for ticket counts
  const { data: dbOrderTickets } = eventIds.length > 0
    ? await supabase
        .from("order_tickets")
        .select("id, order_id")
        .in("order_id", orders.map((o: any) => o.id))
    : { data: [] };

  const ticketCountByOrder: Record<string, number> = {};
  for (const ot of dbOrderTickets || []) {
    ticketCountByOrder[ot.order_id] = (ticketCountByOrder[ot.order_id] || 0) + 1;
  }

  for (const o of orders) {
    if (o.status !== "paid") continue;
    const d = new Date(o.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (revenueByMonth[key]) {
      revenueByMonth[key].revenue += (o.total || 0);
      revenueByMonth[key].tickets += ticketCountByOrder[o.id] || 0;
    }
  }

  const revenueData: RevenueDataPoint[] = Object.entries(revenueByMonth).map(([key, val]) => {
    const [year, month] = key.split("-").map(Number);
    return {
      month: monthNames[month],
      revenue: Math.round(val.revenue / 100), // display in RM
      tickets: val.tickets,
    };
  });

  // -- Revenue by event --
  const revenueByEvent: Record<string, { revenue: number; tickets: number }> = {};
  for (const o of orders) {
    if (o.status !== "paid") continue;
    const eventName = eventMap[o.event_id] || "Unknown";
    if (!revenueByEvent[eventName]) revenueByEvent[eventName] = { revenue: 0, tickets: 0 };
    revenueByEvent[eventName].revenue += (o.total || 0);
    revenueByEvent[eventName].tickets += ticketCountByOrder[o.id] || 0;
  }

  const eventRevenueData: EventRevenuePoint[] = Object.entries(revenueByEvent).map(([name, val]) => ({
    name,
    revenue: Math.round(val.revenue / 100),
    tickets: val.tickets,
  }));

  // -- Ticket type breakdown --
  const ticketTypeData: TicketTypePoint[] = ticketTypes.map((t: any) => ({
    name: t.name,
    sold: t.quantity_sold || 0,
    total: t.quantity || 0,
    revenue: Math.round(((t.quantity_sold || 0) * (t.price || 0)) / 100),
  }));

  // -- Aggregate stats --
  const totalRevenue = orders
    .filter((o: any) => o.status === "paid")
    .reduce((s: number, o: any) => s + (o.total || 0), 0);

  const totalTicketsSold = ticketTypes.reduce((s: number, t: any) => s + (t.quantity_sold || 0), 0);

  const uniqueBuyerIds = new Set(
    orders.filter((o: any) => o.status === "paid").map((o: any) => o.buyer_id)
  );

  const analyticsData: AnalyticsData = {
    revenueData,
    eventRevenueData,
    ticketTypeData,
    totalRevenue,
    totalTicketsSold,
    uniqueBuyers: uniqueBuyerIds.size,
  };

  return <AnalyticsClient data={analyticsData} />;
}
