import { createClient } from "@/lib/supabase/server";
import { PayoutsClient } from "./payouts-client";

export default async function PayoutsPage() {
  const supabase = await createClient();

  // Get the current user's organization
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's profile to get org
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user?.id ?? "")
    .single();

  const orgId = profile?.organization_id;

  // Fetch all events for the organization
  const { data: events } = await supabase
    .from("events")
    .select("id, name, slug")
    .eq("organization_id", orgId ?? "");

  const eventList = events ?? [];
  const eventIds = eventList.map((e: any) => e.id);

  // Fetch all orders for those events
  let allOrders: any[] = [];
  if (eventIds.length > 0) {
    const { data: orders } = await supabase
      .from("orders")
      .select("id, event_id, total_amount, status, created_at, service_fee")
      .in("event_id", eventIds)
      .order("created_at", { ascending: false });
    allOrders = orders ?? [];
  }

  // Build per-event payout summaries
  const eventMap = new Map(eventList.map((e: any) => [e.id, e]));

  const eventSummaries: Record<
    string,
    { eventId: string; eventName: string; paidTotal: number; pendingTotal: number; serviceFees: number; lastOrderDate: string | null; orderCount: number }
  > = {};

  for (const order of allOrders) {
    const evt = eventMap.get(order.event_id);
    if (!evt) continue;

    if (!eventSummaries[order.event_id]) {
      eventSummaries[order.event_id] = {
        eventId: order.event_id,
        eventName: evt.name ?? "Untitled Event",
        paidTotal: 0,
        pendingTotal: 0,
        serviceFees: 0,
        lastOrderDate: null,
        orderCount: 0,
      };
    }

    const summary = eventSummaries[order.event_id];
    const amount = order.total_amount ?? 0;
    const fee = order.service_fee ?? 0;

    if (order.status === "paid") {
      summary.paidTotal += amount;
      summary.serviceFees += fee;
      summary.orderCount += 1;
    } else if (order.status === "pending") {
      summary.pendingTotal += amount;
    }

    if (
      !summary.lastOrderDate ||
      new Date(order.created_at) > new Date(summary.lastOrderDate)
    ) {
      summary.lastOrderDate = order.created_at;
    }
  }

  const payoutRows = Object.values(eventSummaries)
    .filter((s) => s.paidTotal > 0 || s.pendingTotal > 0)
    .sort((a, b) => {
      const da = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
      const db = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
      return db - da;
    })
    .map((s) => ({
      id: s.eventId,
      event: s.eventName,
      amount: s.paidTotal,
      serviceFee: s.serviceFees,
      pendingAmount: s.pendingTotal,
      status: s.pendingTotal > 0 && s.paidTotal === 0 ? "processing" : s.paidTotal > 0 ? "paid" : "processing",
      date: s.lastOrderDate
        ? new Date(s.lastOrderDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      orderCount: s.orderCount,
    }));

  // Calculate totals
  const totalPaid = payoutRows.reduce((s, p) => s + p.amount, 0);
  const totalPending = payoutRows.reduce((s, p) => s + p.pendingAmount, 0);
  const totalServiceFees = payoutRows.reduce((s, p) => s + p.serviceFee, 0);
  // If no service_fee column, estimate at 3%
  const platformFee =
    totalServiceFees > 0 ? totalServiceFees : Math.round(totalPaid * 0.03);
  const netEarnings = totalPaid - platformFee;

  return (
    <PayoutsClient
      payoutRows={payoutRows}
      totalPaid={totalPaid}
      totalPending={totalPending}
      platformFee={platformFee}
      netEarnings={netEarnings}
    />
  );
}
