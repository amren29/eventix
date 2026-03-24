import { createClient } from "@/lib/supabase/server";
import AttendeesClient, { type Attendee } from "./attendees-client";

export default async function AttendeesPage() {
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
  const eventNames = [...new Set((orgEvents || []).map((e: any) => e.title))];
  const eventMap = Object.fromEntries((orgEvents || []).map((e: any) => [e.id, e.title]));

  // Fetch order_tickets joined with orders and ticket_types
  const { data: dbTickets } = eventIds.length > 0
    ? await supabase
        .from("order_tickets")
        .select("id, attendee_name, attendee_email, checked_in_at, order_id, ticket_type_id, created_at, orders!inner(id, reference, event_id, created_at), ticket_types!inner(name)")
        .in("orders.event_id", eventIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const attendees: Attendee[] = (dbTickets || []).map((t: any) => {
    const order = t.orders;
    const ticketType = t.ticket_types;
    const checkedIn = !!t.checked_in_at;
    return {
      id: t.id.slice(0, 8).toUpperCase(),
      name: t.attendee_name,
      email: t.attendee_email,
      event: eventMap[order?.event_id] || "Unknown Event",
      ticket: ticketType?.name || "General",
      orderId: order?.reference || order?.id?.slice(0, 8).toUpperCase() || "",
      checkedIn,
      checkedInTime: checkedIn
        ? new Date(t.checked_in_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
        : null,
      date: new Date(order?.created_at || t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  });

  return <AttendeesClient attendees={attendees} events={eventNames} />;
}
