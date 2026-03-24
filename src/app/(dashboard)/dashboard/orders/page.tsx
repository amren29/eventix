import { createClient } from "@/lib/supabase/server";
import OrdersClient, { type Order } from "./orders-client";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user!.id)
    .single();

  const orgId = profile?.organization_id;

  // Fetch events for this org (for filter dropdown)
  const { data: orgEvents } = orgId
    ? await supabase
        .from("events")
        .select("id, title")
        .eq("organization_id", orgId)
    : { data: [] };

  const eventIds = (orgEvents || []).map((e: any) => e.id);
  const eventNames = (orgEvents || []).map((e: any) => e.title);
  const eventMap = Object.fromEntries((orgEvents || []).map((e: any) => [e.id, e.title]));

  // Fetch orders for those events, with ticket count
  const { data: dbOrders } = eventIds.length > 0
    ? await supabase
        .from("orders")
        .select("id, reference, event_id, buyer_name, buyer_email, total, status, promo_code, created_at, order_tickets(id)")
        .in("event_id", eventIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const statusMap: Record<string, string> = {
    paid: "completed",
    pending: "pending",
    refunded: "refunded",
    cancelled: "cancelled",
  };

  const orders: Order[] = (dbOrders || []).map((o: any) => ({
    id: o.reference || o.id.slice(0, 8).toUpperCase(),
    event: eventMap[o.event_id] || "Unknown Event",
    attendee: o.buyer_name,
    email: o.buyer_email,
    tickets: Array.isArray(o.order_tickets) ? o.order_tickets.length : 0,
    total: o.total || 0,
    status: statusMap[o.status] || o.status,
    payment: "Card",
    date: new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));

  return <OrdersClient orders={orders} events={eventNames} />;
}
