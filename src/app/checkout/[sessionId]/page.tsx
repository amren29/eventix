"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Check, Shield, CreditCard, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const STEPS = ["Your Details", "Payment", "Confirmation"];

interface TicketSelection {
  id: string;
  name: string;
  qty: number;
  price: number; // cents
}

interface EventInfo {
  id: string;
  title: string;
  start_date: string;
  venue_name: string | null;
  venue_city: string | null;
  is_online: boolean;
  slug: string;
}

interface OrderResult {
  reference: string;
  buyerEmail: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
}

function useCheckoutData() {
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [tickets, setTickets] = useState<TicketSelection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const eventSlug = searchParams.get("event");
      const ticketsParam = searchParams.get("tickets");

      if (!eventSlug || !ticketsParam) {
        setLoading(false);
        return;
      }

      try {
        const parsed: TicketSelection[] = JSON.parse(ticketsParam);
        setTickets(parsed);
      } catch {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("events")
        .select("id, title, start_date, venue_name, venue_city, is_online, slug")
        .eq("slug", eventSlug)
        .single();

      if (data) setEvent(data);
      setLoading(false);
    }
    load();
  }, [searchParams]);

  return { event, tickets, loading };
}

function OrderSummary({ event, tickets }: { event: EventInfo; tickets: TicketSelection[] }) {
  const startDate = new Date(event.start_date);
  const dateStr = startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const timeStr = startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const venue = event.is_online ? "Online Event" : [event.venue_name, event.venue_city].filter(Boolean).join(", ");

  const subtotal = tickets.reduce((s, t) => s + t.price * t.qty, 0);
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sticky top-24">
      <h3 className="font-semibold text-neutral-900 text-sm mb-4">Order Summary</h3>
      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 mb-4">
        <p className="font-semibold text-neutral-800 text-sm">{event.title}</p>
        <p className="text-xs text-neutral-500 mt-1">{dateStr} · {timeStr}</p>
        <p className="text-xs text-neutral-500">{venue}</p>
      </div>
      <div className="space-y-2 mb-3">
        {tickets.filter((i) => i.qty > 0).map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-neutral-600">{item.name} × {item.qty}</span>
            <span className="font-medium text-neutral-900">${((item.price * item.qty) / 100).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm text-neutral-500">
          <span>Service fee</span><span>${(serviceFee / 100).toFixed(2)}</span>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="flex justify-between font-bold text-neutral-900">
        <span>Total</span><span>${(total / 100).toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-4">
        <Shield className="w-3.5 h-3.5 text-success-500" />
        <p className="text-[11px] text-neutral-400">Secured by 256-bit SSL encryption</p>
      </div>
    </div>
  );
}

function StepDetails({ onNext, buyerName, setBuyerName, buyerEmail, setBuyerEmail, tickets }: {
  onNext: () => void;
  buyerName: string;
  setBuyerName: (v: string) => void;
  buyerEmail: string;
  setBuyerEmail: (v: string) => void;
  tickets: TicketSelection[];
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setBuyerName(`${firstName} ${lastName}`.trim());
  }, [firstName, lastName, setBuyerName]);

  return (
    <div className="space-y-5">
      <h2 className="font-bold text-neutral-900 text-lg">Your Information</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">First Name *</Label>
          <Input placeholder="Ahmad" className="h-11 border-neutral-200" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">Last Name *</Label>
          <Input placeholder="Razali" className="h-11 border-neutral-200" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-neutral-700">Email Address *</Label>
        <Input type="email" placeholder="ahmad@example.com" className="h-11 border-neutral-200" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} />
        <p className="text-xs text-neutral-400">Tickets will be sent to this email.</p>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-neutral-700">Phone Number</Label>
        <Input type="tel" placeholder="+60 12-345 6789" className="h-11 border-neutral-200" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      {tickets.map((ticket, idx) => (
        Array.from({ length: ticket.qty }).map((_, i) => {
          const attendeeNum = tickets.slice(0, idx).reduce((s, t) => s + t.qty, 0) + i + 1;
          return (
            <div key={`${ticket.id}-${i}`}>
              <Separator />
              <h3 className="font-semibold text-neutral-800 mt-4">Attendee #{attendeeNum} — {ticket.name}</h3>
              <div className="space-y-1.5 mt-3">
                <Label className="text-sm font-medium text-neutral-700">Full Name *</Label>
                <Input placeholder="Attendee full name" className="h-11 border-neutral-200" />
              </div>
              {attendeeNum === 1 && (
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="same-as-buyer" className="w-4 h-4 accent-primary-600 rounded" />
                  <Label htmlFor="same-as-buyer" className="text-sm text-neutral-600 cursor-pointer">Same as buyer info</Label>
                </div>
              )}
            </div>
          );
        })
      ))}

      <Button onClick={onNext} disabled={!firstName || !lastName || !buyerEmail} className="w-full h-11 gradient-primary text-white border-0 font-semibold">
        Continue to Payment →
      </Button>
    </div>
  );
}

function StepPayment({ onNext, tickets, event, buyerName, buyerEmail }: {
  onNext: (order: OrderResult) => void;
  tickets: TicketSelection[];
  event: EventInfo;
  buyerName: string;
  buyerEmail: string;
}) {
  const [method, setMethod] = useState("card");
  const [showCVV, setShowCVV] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = tickets.reduce((s, t) => s + t.price * t.qty, 0);
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  async function pay() {
    setLoading(true);
    try {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to complete your purchase.");
        setLoading(false);
        return;
      }

      // Generate unique reference
      const year = new Date().getFullYear();
      const random5 = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
      const reference = `EVT-${year}-${random5}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          reference,
          event_id: event.id,
          buyer_id: user.id,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          subtotal,
          service_fee: serviceFee,
          total,
          currency: "USD",
          status: "paid",
          promo_code: null,
          discount: 0,
        })
        .select("id")
        .single();

      if (orderError || !order) {
        console.error("Order creation failed:", orderError);
        alert("Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      // Create order_tickets
      const orderTickets: { order_id: string; ticket_type_id: string; attendee_name: string; attendee_email: string; qr_code: string }[] = [];
      let ticketIndex = 0;
      for (const ticket of tickets) {
        for (let i = 0; i < ticket.qty; i++) {
          orderTickets.push({
            order_id: order.id,
            ticket_type_id: ticket.id,
            attendee_name: buyerName,
            attendee_email: buyerEmail,
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
        alert("Failed to create tickets. Please try again.");
        setLoading(false);
        return;
      }

      // Send confirmation emails (fire and forget - don't block checkout)
      fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      }).catch(() => {});

      const startDate = new Date(event.start_date);
      const dateStr = startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
      const timeStr = startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const venue = event.is_online ? "Online Event" : [event.venue_name, event.venue_city].filter(Boolean).join(", ");

      onNext({
        reference,
        buyerEmail,
        eventTitle: event.title,
        eventDate: `${dateStr} · ${timeStr}`,
        eventVenue: venue,
      });
    } catch (err) {
      console.error("Payment error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-5">
      <h2 className="font-bold text-neutral-900 text-lg">Payment Method</h2>

      {/* Method selector */}
      <div className="flex gap-3">
        {[
          { id: "card",   label: "Card" },
          { id: "paypal", label: "PayPal" },
          { id: "fpx",    label: "FPX" },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setMethod(id)}
            className={cn(
              "flex-1 py-3 rounded-xl border text-sm font-medium transition-all",
              method === id ? "border-primary-500 bg-primary-50 text-primary-700" : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
            )}>{label}</button>
        ))}
      </div>

      {method === "card" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-neutral-700">Card Number</Label>
            <div className="relative">
              <Input placeholder="1234 5678 9012 3456" className="h-11 border-neutral-200 pr-10" />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-neutral-700">Expiry Date</Label>
              <Input placeholder="MM / YY" className="h-11 border-neutral-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-neutral-700">CVV</Label>
              <div className="relative">
                <Input type={showCVV ? "text" : "password"} placeholder="..." className="h-11 border-neutral-200 pr-10" />
                <button type="button" onClick={() => setShowCVV(!showCVV)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  {showCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-neutral-700">Cardholder Name</Label>
            <Input placeholder="Name as on card" className="h-11 border-neutral-200" />
          </div>
        </div>
      )}

      {method === "paypal" && (
        <div className="p-6 bg-[#f5f5f5] rounded-2xl text-center border border-neutral-200">
          <p className="text-sm text-neutral-600 mb-4">You&apos;ll be redirected to PayPal to complete your payment securely.</p>
          <div className="text-3xl font-bold text-[#003087]">Pay<span className="text-[#009cde]">Pal</span></div>
        </div>
      )}

      {method === "fpx" && (
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
          <p className="text-sm font-medium text-neutral-700 mb-3">Select your bank</p>
          <div className="grid grid-cols-3 gap-2">
            {["Maybank", "CIMB", "Public Bank", "RHB", "Hong Leong", "AmBank"].map((bank) => (
              <button key={bank} className="py-2 px-3 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-600 hover:border-primary-400 hover:text-primary-700 transition-all">{bank}</button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-neutral-400">
        By completing this purchase you agree to our{" "}
        <Link href="/terms" className="underline hover:text-neutral-600">Terms</Link>.
      </p>

      <Button onClick={pay} disabled={loading} className="w-full h-12 gradient-primary text-white border-0 font-semibold text-base shadow-sm hover:opacity-90">
        {loading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
        ) : (
          <><Lock className="w-4 h-4 mr-2" />Pay ${(total / 100).toFixed(2)}</>
        )}
      </Button>
    </div>
  );
}

function StepConfirmation({ order }: { order: OrderResult }) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(order.reference).then((url) => {
        setQrDataUrl(url);
      });
    });
  }, [order.reference]);

  return (
    <div className="text-center py-4">
      <div className="inline-flex w-20 h-20 rounded-full bg-success-50 items-center justify-center mb-5">
        <Check className="w-10 h-10 text-success-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">You&apos;re going!</h2>
      <p className="text-neutral-500 mb-1">Order <strong className="font-mono text-neutral-700">{order.reference}</strong> confirmed</p>
      <p className="text-sm text-neutral-400 mb-8">Tickets sent to {order.buyerEmail}</p>

      {/* Ticket preview */}
      <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 mb-6 text-left">
        <p className="font-bold text-neutral-900">{order.eventTitle}</p>
        <p className="text-sm text-neutral-500 mt-0.5">{order.eventDate} · {order.eventVenue}</p>
        <div className="mt-4 flex items-center justify-center">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-32 h-32" />
          ) : (
            <div className="w-32 h-32 bg-neutral-100 rounded animate-pulse" />
          )}
        </div>
        <p className="text-center text-xs text-neutral-400 mt-2 font-mono">{order.reference}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1 border-neutral-200">Download PDF Ticket</Button>
        <Button className="flex-1 gradient-primary text-white border-0" asChild>
          <Link href="/my/tickets">View My Tickets →</Link>
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const { event, tickets, loading } = useCheckoutData();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!event || tickets.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16 flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">No checkout session found.</p>
        <Button asChild variant="outline">
          <Link href="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link href={`/e/${event.slug}`} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-6">
          <ChevronLeft className="w-4 h-4" />Back to event
        </Link>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((s, i) => {
            const done = step > i;
            const active = step === i;
            return (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
                  active ? "gradient-primary text-white" : done ? "text-primary-600" : "text-neutral-400"
                )}>
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                    active ? "bg-white/30 text-white" : done ? "bg-primary-600 text-white" : "bg-neutral-200 text-neutral-400"
                  )}>
                    {done ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className="hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={cn("w-8 h-px", done ? "bg-primary-300" : "bg-neutral-200")} />}
              </div>
            );
          })}
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8">
            {step === 0 && <StepDetails onNext={() => setStep(1)} buyerName={buyerName} setBuyerName={setBuyerName} buyerEmail={buyerEmail} setBuyerEmail={setBuyerEmail} tickets={tickets} />}
            {step === 1 && <StepPayment onNext={(order) => { setOrderResult(order); setStep(2); }} tickets={tickets} event={event} buyerName={buyerName} buyerEmail={buyerEmail} />}
            {step === 2 && orderResult && <StepConfirmation order={orderResult} />}
          </div>
          {step < 2 && (
            <div className="lg:col-span-1">
              <OrderSummary event={event} tickets={tickets} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
