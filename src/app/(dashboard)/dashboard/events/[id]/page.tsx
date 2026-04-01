import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EventDetailClient } from "./event-detail-client";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = await params;
  const supabase = await createClient();

  // Fetch event details
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    notFound();
  }

  // Fetch ticket types, orders with tickets, and promo codes in parallel
  const [ticketTypesRes, ordersRes, promoCodesRes] = await Promise.all([
    supabase
      .from("ticket_types")
      .select("*")
      .eq("event_id", eventId),
    supabase
      .from("orders")
      .select("*, order_tickets(*, ticket_types(name))")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false }),
    supabase
      .from("promo_codes")
      .select("*")
      .eq("event_id", eventId),
  ]);

  const ticketTypes = ticketTypesRes.data ?? [];
  const orders = ordersRes.data ?? [];
  const promoCodes = promoCodesRes.data ?? [];

  // Calculate stats from real data
  const totalTicketsSold = orders
    .filter((o: any) => o.status === "paid")
    .reduce((sum: number, o: any) => {
      const tickets = o.order_tickets ?? [];
      return sum + tickets.length;
    }, 0);

  const totalCapacity = ticketTypes.reduce(
    (sum: number, t: any) => sum + (t.quantity ?? 0),
    0
  );

  const grossRevenue = orders
    .filter((o: any) => o.status === "paid")
    .reduce((sum: number, o: any) => sum + (o.total_amount ?? 0), 0);

  const checkedInCount = orders
    .filter((o: any) => o.status === "paid")
    .reduce((sum: number, o: any) => {
      const tickets = o.order_tickets ?? [];
      return sum + tickets.filter((t: any) => t.checked_in).length;
    }, 0);

  // Build attendees list from order_tickets
  const attendees = orders
    .filter((o: any) => o.status === "paid")
    .flatMap((o: any) =>
      (o.order_tickets ?? []).map((t: any) => ({
        name: o.buyer_name ?? o.buyer_email ?? "Unknown",
        email: o.buyer_email ?? "",
        ticket: t.ticket_types?.name ?? "Unknown",
        checkedIn: t.checked_in ?? false,
        order: o.id,
      }))
    );

  // Build ticket type stats
  const ticketTypeStats = ticketTypes.map((tt: any) => {
    const sold = orders
      .filter((o: any) => o.status === "paid")
      .reduce((sum: number, o: any) => {
        const tickets = o.order_tickets ?? [];
        return sum + tickets.filter((t: any) => t.ticket_type_id === tt.id).length;
      }, 0);
    const revenue = orders
      .filter((o: any) => o.status === "paid")
      .reduce((sum: number, o: any) => {
        const tickets = o.order_tickets ?? [];
        return (
          sum +
          tickets
            .filter((t: any) => t.ticket_type_id === tt.id)
            .reduce((s: number, t: any) => s + (t.price ?? tt.price ?? 0), 0)
        );
      }, 0);
    return {
      id: tt.id,
      name: tt.name,
      price: tt.price ?? 0,
      sold,
      total: tt.quantity ?? 0,
      revenue,
    };
  });

  // Aggregate sales trend by date from orders
  const salesByDate: Record<string, number> = {};
  orders
    .filter((o: any) => o.status === "paid")
    .forEach((o: any) => {
      const date = new Date(o.created_at);
      const key = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const ticketCount = (o.order_tickets ?? []).length;
      salesByDate[key] = (salesByDate[key] ?? 0) + ticketCount;
    });

  const salesTrend = Object.entries(salesByDate)
    .map(([date, sales]) => ({ date, sales }))
    .slice(-14); // Last 14 data points

  // Build orders list for the table
  const orderRows = orders.map((o: any) => {
    const tickets = o.order_tickets ?? [];
    const ticketNames = tickets
      .map((t: any) => t.ticket_types?.name ?? "Unknown")
      .reduce((acc: Record<string, number>, name: string) => {
        acc[name] = (acc[name] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    const ticketLabel = Object.entries(ticketNames)
      .map(([name, count]) => ((count as number) > 1 ? `${name} x ${count}` : name))
      .join(", ");

    return {
      id: o.id,
      buyer: o.buyer_name ?? o.buyer_email ?? "Unknown",
      email: o.buyer_email ?? "",
      ticket: ticketLabel || "N/A",
      qty: tickets.length,
      amount: o.total_amount ?? 0,
      status: o.status ?? "pending",
      date: new Date(o.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  });

  // Build promo code rows
  const promoCodeRows = promoCodes.map((pc: any) => ({
    id: pc.id,
    code: pc.code,
    type: pc.discount_type === "percentage"
      ? `${pc.discount_value}% off`
      : `$${(pc.discount_value / 100).toFixed(2)} off`,
    used: pc.times_used ?? 0,
    limit: pc.max_uses ?? null,
    active: pc.is_active ?? true,
  }));

  // Format event for client
  const eventData = {
    id: event.id,
    name: event.name ?? event.title ?? "Untitled Event",
    date: event.start_date
      ? new Date(event.start_date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Date TBD",
    time: event.start_date && event.end_date
      ? `${new Date(event.start_date).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })} – ${new Date(event.end_date).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}`
      : "Time TBD",
    venue: event.venue ?? event.location ?? "Venue TBD",
    status: event.status ?? "draft",
    slug: event.slug ?? event.id,
    sold: totalTicketsSold,
    total: totalCapacity,
    revenue: grossRevenue,
    checkedIn: checkedInCount,
  };

  return (
    <EventDetailClient
      event={eventData}
      ticketTypes={ticketTypeStats}
      orders={orderRows}
      attendees={attendees}
      salesTrend={salesTrend}
      promoCodes={promoCodeRows}
    />
  );
}
