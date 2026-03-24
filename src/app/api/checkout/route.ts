import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, tickets, buyerName, buyerEmail } = await req.json();

    // Validate event exists
    const { data: event } = await supabase
      .from("events")
      .select("id, title, slug")
      .eq("id", eventId)
      .single();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Fetch ticket types to validate prices
    const ticketIds = tickets.map((t: any) => t.id);
    const { data: ticketTypes } = await supabase
      .from("ticket_types")
      .select("id, name, price, price_type, currency")
      .in("id", ticketIds);

    if (!ticketTypes || ticketTypes.length === 0) {
      return NextResponse.json({ error: "Invalid tickets" }, { status: 400 });
    }

    // Build Stripe line items
    const lineItems: any[] = [];
    const ticketMap = Object.fromEntries(ticketTypes.map((t) => [t.id, t]));

    for (const selection of tickets) {
      const tt = ticketMap[selection.id];
      if (!tt) continue;

      if (tt.price_type === "free") continue; // Skip free tickets from Stripe

      lineItems.push({
        price_data: {
          currency: (tt.currency || "usd").toLowerCase(),
          product_data: {
            name: `${tt.name} — ${event.title}`,
          },
          unit_amount: tt.price, // already in cents
        },
        quantity: selection.qty,
      });
    }

    // Calculate service fee (10% of subtotal)
    const subtotal = tickets.reduce((sum: number, t: any) => {
      const tt = ticketMap[t.id];
      return sum + (tt ? tt.price * t.qty : 0);
    }, 0);
    const serviceFee = Math.round(subtotal * 0.1);

    if (serviceFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Service Fee" },
          unit_amount: serviceFee,
        },
        quantity: 1,
      });
    }

    // If all tickets are free, skip Stripe
    if (lineItems.length === 0) {
      return NextResponse.json({ free: true });
    }

    // Create Stripe Checkout Session
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: buyerEmail,
      line_items: lineItems,
      metadata: {
        event_id: event.id,
        event_slug: event.slug,
        buyer_id: user.id,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        tickets: JSON.stringify(tickets),
        subtotal: String(subtotal),
        service_fee: String(serviceFee),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/e/${event.slug}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
