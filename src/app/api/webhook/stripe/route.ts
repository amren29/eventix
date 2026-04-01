import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmation, sendTicketEmail } from "@/lib/email";

// Use service role to bypass RLS in webhooks
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata!;

    const supabase = getAdminClient();

    try {
      // Generate unique reference
      const year = new Date().getFullYear();
      const random5 = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
      const reference = `EVT-${year}-${random5}`;

      const tickets = JSON.parse(metadata.tickets);
      const subtotal = parseInt(metadata.subtotal);
      const serviceFee = parseInt(metadata.service_fee);
      const total = subtotal + serviceFee;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          reference,
          event_id: metadata.event_id,
          buyer_id: metadata.buyer_id,
          buyer_name: metadata.buyer_name,
          buyer_email: metadata.buyer_email,
          subtotal,
          service_fee: serviceFee,
          total,
          currency: "USD",
          status: "paid",
          discount: 0,
        })
        .select("id")
        .single();

      if (orderError || !order) {
        console.error("Order creation failed:", orderError);
        return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
      }

      // Create order tickets
      const orderTickets: any[] = [];
      let ticketIndex = 0;
      for (const ticket of tickets) {
        for (let i = 0; i < ticket.qty; i++) {
          orderTickets.push({
            order_id: order.id,
            ticket_type_id: ticket.id,
            attendee_name: metadata.buyer_name,
            attendee_email: metadata.buyer_email,
            qr_code: `qr-${order.id}-${ticketIndex}`,
          });
          ticketIndex++;
        }
      }

      const { error: ticketsError } = await supabase
        .from("order_tickets")
        .insert(orderTickets);

      if (ticketsError) {
        console.error("Tickets creation failed:", ticketsError);
      }

      // Update quantity_sold on ticket types
      for (const ticket of tickets) {
        await supabase.rpc("increment_quantity_sold", {
          ticket_type_id_input: ticket.id,
          amount: ticket.qty,
        });
      }

      // Send emails
      const { data: eventData } = await supabase
        .from("events")
        .select("title, start_date, venue_name, venue_city, is_online")
        .eq("id", metadata.event_id)
        .single();

      if (eventData) {
        const eventDate = new Date(eventData.start_date).toLocaleDateString("en-US", {
          weekday: "long", month: "long", day: "numeric", year: "numeric",
          hour: "numeric", minute: "2-digit",
        });
        const eventVenue = eventData.is_online
          ? "Online Event"
          : [eventData.venue_name, eventData.venue_city].filter(Boolean).join(", ");

        await sendOrderConfirmation({
          to: metadata.buyer_email,
          buyerName: metadata.buyer_name,
          orderReference: reference,
          eventTitle: eventData.title,
          eventDate,
          eventVenue,
          tickets: tickets.map((t: any) => ({ name: t.name, qty: t.qty, price: t.price || 0 })),
          total,
        });

        for (const ot of orderTickets) {
          const ticketInfo = tickets.find((t: any) => t.id === ot.ticket_type_id);
          await sendTicketEmail({
            to: ot.attendee_email,
            attendeeName: ot.attendee_name,
            eventTitle: eventData.title,
            eventDate,
            eventVenue,
            ticketType: ticketInfo?.name || "Ticket",
            qrCode: ot.qr_code,
          });
        }
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
