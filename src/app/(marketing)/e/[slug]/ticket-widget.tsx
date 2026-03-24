"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Tag, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TicketType {
  id: string;
  name: string;
  price_type: string;
  price: number;
  currency: string;
  quantity: number | null;
  quantity_sold: number;
}

export function TicketWidget({ tickets: initialTickets, eventSlug }: { tickets: TicketType[]; eventSlug?: string }) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(initialTickets.map((t) => [t.id, 0]))
  );
  const [promoCode, setPromoCode] = useState("");
  const [showPromo, setShowPromo] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min(10, Math.max(0, (prev[id] || 0) + delta)),
    }));
  };

  const subtotal = initialTickets.reduce((sum, t) => sum + t.price * (quantities[t.id] || 0), 0);
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;
  const hasTickets = Object.values(quantities).some((q) => q > 0);

  function handleGetTickets() {
    const selections = initialTickets
      .filter((t) => (quantities[t.id] || 0) > 0)
      .map((t) => ({ id: t.id, name: t.name, qty: quantities[t.id], price: t.price }));

    const params = new URLSearchParams();
    if (eventSlug) params.set("event", eventSlug);
    params.set("tickets", JSON.stringify(selections));
    if (promoCode) params.set("promo", promoCode);

    router.push(`/checkout/new?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-lg p-5 sticky top-24">
      <h3 className="font-semibold text-neutral-900 mb-4">Select Tickets</h3>

      <div className="space-y-3 mb-4">
        {initialTickets.map((ticket) => {
          const available = ticket.quantity ? ticket.quantity - ticket.quantity_sold : null;
          const soldOut = available !== null && available <= 0;
          const qty = quantities[ticket.id] || 0;

          return (
            <div key={ticket.id} className={cn(
              "p-3 rounded-xl border transition-all",
              soldOut ? "bg-neutral-50 border-neutral-100 opacity-60" : qty > 0 ? "border-primary-200 bg-primary-50/30" : "border-neutral-100 hover:border-neutral-200"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-sm font-semibold", soldOut ? "text-neutral-400" : "text-neutral-800")}>{ticket.name}</p>
                  <p className={cn("text-base font-bold mt-0.5", soldOut ? "text-neutral-400" : "text-primary-600")}>
                    {soldOut ? "Sold Out" : ticket.price_type === "free" ? "Free" : `$${(ticket.price / 100).toFixed(2)}`}
                  </p>
                </div>
                {!soldOut && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(ticket.id, -1)} disabled={qty === 0}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-primary-400 hover:text-primary-600 disabled:opacity-30 transition-all">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center font-bold text-sm text-neutral-900">{qty}</span>
                    <button onClick={() => updateQty(ticket.id, 1)} disabled={qty >= 10}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-primary-400 hover:text-primary-600 disabled:opacity-30 transition-all">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {!soldOut && available !== null && <p className="text-[10px] text-neutral-400 mt-1">{available} remaining</p>}
            </div>
          );
        })}
      </div>

      {/* Promo code */}
      <button onClick={() => setShowPromo(!showPromo)} className="flex items-center gap-1.5 text-xs text-primary-600 hover:underline mb-3">
        <Tag className="w-3 h-3" />
        Have a promo code?
        {showPromo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {showPromo && (
        <div className="flex gap-2 mb-4">
          <Input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="h-9 text-sm border-neutral-200 uppercase"
          />
          <Button size="sm" variant="outline" className="h-9 flex-shrink-0 border-neutral-200 text-xs">
            Apply
          </Button>
        </div>
      )}

      {/* Price breakdown */}
      {hasTickets && (
        <div className="space-y-1.5 mb-4 py-3 border-t border-neutral-100">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Subtotal</span><span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Service fee</span><span>${(serviceFee / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1 border-t border-neutral-100">
            <span>Total</span><span>${(total / 100).toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button
        disabled={!hasTickets}
        onClick={handleGetTickets}
        className="w-full h-11 gradient-primary text-white border-0 font-semibold shadow-sm hover:opacity-90 disabled:opacity-40"
      >
        {hasTickets ? "Get Tickets →" : "Select tickets above"}
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-3">
        <Shield className="w-3.5 h-3.5 text-neutral-400" />
        <p className="text-xs text-neutral-400">Secure checkout · 100% buyer protection</p>
      </div>
    </div>
  );
}
