import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation, sendTicketEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

    // Fetch order with tickets and event
    const { data: order } = await supabase
      .from("orders")
      .select("*, events(title, start_date, end_date, venue_name, venue_city, is_online), order_tickets(attendee_name, attendee_email, qr_code, ticket_type_id, ticket_types(name))")
      .eq("id", orderId)
      .single();

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const event = (order as any).events;
    const eventDate = new Date(event.start_date).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit",
    });
    const eventVenue = event.is_online ? "Online Event" : [event.venue_name, event.venue_city].filter(Boolean).join(", ");

    // Group tickets by type for the summary
    const ticketSummary: Record<string, { name: string; qty: number; price: number }> = {};
    for (const t of (order as any).order_tickets) {
      const name = t.ticket_types?.name || "Ticket";
      if (!ticketSummary[name]) ticketSummary[name] = { name, qty: 0, price: 0 };
      ticketSummary[name].qty++;
    }

    // Send order confirmation to buyer
    await sendOrderConfirmation({
      to: order.buyer_email,
      buyerName: order.buyer_name,
      orderReference: order.reference,
      eventTitle: event.title,
      eventDate,
      eventVenue,
      tickets: Object.values(ticketSummary),
      total: order.total,
    });

    // Send individual ticket emails to each attendee
    for (const ticket of (order as any).order_tickets) {
      await sendTicketEmail({
        to: ticket.attendee_email,
        attendeeName: ticket.attendee_name,
        eventTitle: event.title,
        eventDate,
        eventVenue,
        ticketType: ticket.ticket_types?.name || "Ticket",
        qrCode: ticket.qr_code,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
}
