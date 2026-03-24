"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays, MapPin, Share2, Heart,
  ChevronLeft, Users, Shield, Clock,
  Minus, Plus, Tag, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EVENT = {
  title: "Tech Summit KL 2026",
  date: "Saturday, March 15, 2026",
  time: "2:00 PM – 10:00 PM",
  timezone: "GMT+8 (MYT)",
  venue: "Axiata Arena, Jalan Stadium, Bukit Jalil, 57000 Kuala Lumpur",
  organizer: "Tech Events Co.",
  description: `Join us for the biggest technology conference in Southeast Asia. Tech Summit KL 2026 brings together over 1,000 professionals, developers, startup founders, and tech enthusiasts for a full day of keynotes, workshops, and networking.

**What to expect:**
- 20+ world-class speakers from leading tech companies
- Hands-on workshops across AI, Cloud, and Product
- Networking lunch and evening mixer
- Startup demo showcase with $50,000 in prizes
- Live music performances during breaks

This is your chance to connect with the best minds in tech, learn from industry leaders, and discover the next big thing in technology.`,
  ticketTypes: [
    { id: "general", name: "General Admission", price: 25,  qty: 1, max: 10, available: 158, currency: "USD" },
    { id: "vip",     name: "VIP Package",        price: 89,  qty: 0, max: 5,  available: 78,  currency: "USD" },
    { id: "early",   name: "Early Bird 🔥",       price: 18,  qty: 0, max: 10, available: 0,   currency: "USD" },
  ],
  speakers: [
    { name: "Dr. Sarah Chen",   role: "CTO, DeepMind Asia", initials: "SC", color: "bg-primary-100 text-primary-700" },
    { name: "Rajan Patel",      role: "VP Engineering, Grab", initials: "RP", color: "bg-accent-100 text-accent-700" },
    { name: "Lisa Nakamura",    role: "Founder, TechSEA",    initials: "LN", color: "bg-success-100 text-success-700" },
    { name: "Ahmad Farid",      role: "Director, AWS ASEAN", initials: "AF", color: "bg-warning-100 text-warning-700" },
  ],
  schedule: [
    { time: "2:00 PM", title: "Registration & Welcome", type: "logistics" },
    { time: "2:30 PM", title: "Opening Keynote: The Future of AI in Southeast Asia", type: "keynote" },
    { time: "3:30 PM", title: "Workshop Track A: Building with LLMs", type: "workshop" },
    { time: "5:00 PM", title: "Networking Lunch Break", type: "logistics" },
    { time: "6:00 PM", title: "Startup Demo Showcase", type: "showcase" },
    { time: "8:00 PM", title: "Closing Keynote & Awards", type: "keynote" },
    { time: "9:30 PM", title: "Evening Mixer", type: "social" },
  ],
};

const typeColor: Record<string, string> = {
  keynote:   "bg-primary-50 text-primary-700 border-primary-100",
  workshop:  "bg-accent-50 text-accent-700 border-accent-100",
  logistics: "bg-neutral-100 text-neutral-500 border-neutral-200",
  showcase:  "bg-success-50 text-success-700 border-success-100",
  social:    "bg-warning-50 text-warning-700 border-warning-100",
};

function TicketWidget() {
  const [tickets, setTickets] = useState(EVENT.ticketTypes.map((t) => ({ ...t })));
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [showPromo, setShowPromo] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setTickets((prev) => prev.map((t) =>
      t.id === id ? { ...t, qty: Math.min(t.max, Math.max(0, t.qty + delta)) } : t
    ));
  };

  const subtotal = tickets.reduce((sum, t) => sum + t.price * t.qty, 0);
  const serviceFee = Math.round(subtotal * 0.1);
  const discount = promoApplied ? Math.round(subtotal * 0.2) : 0;
  const total = subtotal + serviceFee - discount;
  const hasTickets = tickets.some((t) => t.qty > 0);

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-lg p-5 sticky top-24">
      <h3 className="font-semibold text-neutral-900 mb-4">Select Tickets</h3>

      <div className="space-y-3 mb-4">
        {tickets.map((ticket) => {
          const soldOut = ticket.available === 0;
          return (
            <div key={ticket.id} className={cn(
              "p-3 rounded-xl border transition-all",
              soldOut ? "bg-neutral-50 border-neutral-100 opacity-60" : ticket.qty > 0 ? "border-primary-200 bg-primary-50/30" : "border-neutral-100 hover:border-neutral-200"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm font-semibold", soldOut ? "text-neutral-400" : "text-neutral-800")}>{ticket.name}</p>
                  <p className={cn("text-base font-bold mt-0.5", soldOut ? "text-neutral-400" : "text-primary-600")}>
                    {soldOut ? "Sold Out" : `$${ticket.price}.00`}
                  </p>
                </div>
                {!soldOut && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(ticket.id, -1)} disabled={ticket.qty === 0}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-primary-400 hover:text-primary-600 disabled:opacity-30 transition-all">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center font-bold text-sm text-neutral-900">{ticket.qty}</span>
                    <button onClick={() => updateQty(ticket.id, 1)} disabled={ticket.qty >= ticket.max}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-primary-400 hover:text-primary-600 disabled:opacity-30 transition-all">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {!soldOut && <p className="text-[10px] text-neutral-400 mt-1">{ticket.available} remaining</p>}
            </div>
          );
        })}
      </div>

      {/* Promo code */}
      <button onClick={() => setShowPromo(!showPromo)} className="flex items-center gap-1.5 text-xs text-primary-600 hover:underline mb-3">
        <Tag className="w-3 h-3" />
        {promoApplied ? "Promo applied: EARLYBIRD20" : "Have a promo code?"}
        {showPromo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {showPromo && (
        <div className="flex gap-2 mb-4">
          <Input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="EARLYBIRD20"
            className="h-9 text-sm border-neutral-200 uppercase"
          />
          <Button size="sm" variant="outline" className="h-9 flex-shrink-0 border-neutral-200 text-xs"
            onClick={() => { if (promoCode === "EARLYBIRD20") setPromoApplied(true); }}>
            Apply
          </Button>
        </div>
      )}

      {/* Price breakdown */}
      {hasTickets && (
        <div className="space-y-1.5 mb-4 py-3 border-t border-neutral-100">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-sm text-success-600">
              <span>Promo (EARLYBIRD20)</span><span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Service fee</span><span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1 border-t border-neutral-100">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button
        disabled={!hasTickets}
        className="w-full h-11 gradient-primary text-white border-0 font-semibold shadow-sm hover:opacity-90 disabled:opacity-40"
        asChild={hasTickets}
      >
        {hasTickets ? (
          <Link href="/checkout/session-123">Get Tickets →</Link>
        ) : (
          <span>Select tickets above</span>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-3">
        <Shield className="w-3.5 h-3.5 text-neutral-400" />
        <p className="text-xs text-neutral-400">Secure checkout · 100% buyer protection</p>
      </div>
    </div>
  );
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Banner */}
      <div className="h-64 sm:h-80 bg-gradient-to-br from-primary-600 via-accent-600 to-primary-800 relative">
        <div className="absolute inset-0 flex items-center justify-center text-8xl">🏢</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <Link href="/events" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 transition-colors">
              <ChevronLeft className="w-4 h-4" />Back to Events
            </Link>
            <Badge className="bg-success-500 text-white border-0 mb-2">● Live</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{EVENT.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — event details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event meta */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <CalendarDays className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span><strong>{EVENT.date}</strong> · {EVENT.time} <span className="text-neutral-400">({EVENT.timezone})</span></span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>{EVENT.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Users className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span>Organized by <strong>{EVENT.organizer}</strong></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-neutral-200 h-9">
                    <Heart className="w-3.5 h-3.5 mr-1.5" />Save
                  </Button>
                  <Button variant="outline" size="sm" className="border-neutral-200 h-9">
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />Share
                  </Button>
                </div>
              </div>

              {/* Stats pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Users, label: "1,000 capacity" },
                  { icon: Clock, label: "8-hour event" },
                  { icon: Shield, label: "Refunds available" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-100 rounded-full px-3 py-1.5 text-xs text-neutral-600">
                    <Icon className="w-3.5 h-3.5 text-primary-500" />{label}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about">
              <TabsList className="bg-white border border-neutral-100 shadow-sm p-1 rounded-xl h-auto">
                {["about", "schedule", "speakers"].map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="capitalize rounded-lg text-sm data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:shadow-sm">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="about" className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mt-3">
                <div className="prose prose-sm max-w-none text-neutral-600 leading-relaxed">
                  {EVENT.description.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-3 last:mb-0">{para.replace(/\*\*/g, "")}</p>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mt-3">
                <div className="space-y-3">
                  {EVENT.schedule.map(({ time, title, type }) => (
                    <div key={time} className="flex items-start gap-4">
                      <span className="text-xs font-mono text-neutral-400 w-16 flex-shrink-0 pt-0.5">{time}</span>
                      <div className="flex items-start gap-2 flex-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-neutral-700 flex-1">{title}</p>
                        <Badge className={`text-[10px] px-2 h-4 border capitalize flex-shrink-0 ${typeColor[type]}`}>{type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="speakers" className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mt-3">
                <div className="grid sm:grid-cols-2 gap-4">
                  {EVENT.speakers.map(({ name, role, initials, color }) => (
                    <div key={name} className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0", color)}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 text-sm">{name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right — ticket widget */}
          <div className="lg:col-span-1">
            <TicketWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
