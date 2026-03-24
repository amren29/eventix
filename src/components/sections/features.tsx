"use client";

import { useState } from "react";
import {
  Ticket, CreditCard, BarChart2, ScanLine, Megaphone,
  CheckCircle2, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "ticketing",
    tab: "Ticketing",
    icon: Ticket,
    headline: "Flexible Ticket Types",
    description:
      "Create unlimited ticket tiers — General, VIP, Early Bird, hidden invite-only, and bundles. Set quantity limits, sale windows, and waitlists.",
    bullets: [
      "Multiple ticket types per event",
      "Quantity caps & automated waitlists",
      "Custom attendee registration fields",
      "Ticket transfers between attendees",
      "Apple Wallet & Google Wallet delivery",
    ],
    preview: {
      label: "Ticket Setup",
      items: [
        { name: "General Admission", price: "$25.00", sold: 720, total: 1000, pct: 72 },
        { name: "VIP Package", price: "$89.00", sold: 122, total: 300, pct: 41 },
        { name: "Early Bird 🔥", price: "$18.00", sold: 200, total: 200, pct: 100, full: true },
      ],
    },
  },
  {
    id: "payments",
    tab: "Payments",
    icon: CreditCard,
    headline: "Payments Made Simple",
    description:
      "Accept payments globally with Stripe and PayPal. Platform fees are deducted automatically — you receive payouts on a set schedule.",
    bullets: [
      "Stripe & PayPal integration",
      "Multi-currency support",
      "Automated organizer payouts",
      "Full & partial refund workflow",
      "Invoice & receipt generation",
    ],
    preview: {
      label: "Payout Summary",
      items: [
        { name: "Available Balance", price: "$8,240.00", sold: 0, total: 0, pct: 0 },
        { name: "Next Payout: Mar 20", price: "Estimated", sold: 0, total: 0, pct: 0 },
        { name: "Platform Fee (2.5%)", price: "-$231.20", sold: 0, total: 0, pct: 0 },
      ],
    },
  },
  {
    id: "analytics",
    tab: "Analytics",
    icon: BarChart2,
    headline: "Real-Time Insights",
    description:
      "Track revenue, attendee sources, and ticket performance as it happens. Export detailed reports in CSV or PDF format.",
    bullets: [
      "Live sales & revenue dashboard",
      "Traffic source breakdown (UTM)",
      "Geographic attendee heatmap",
      "Ticket type performance charts",
      "CSV & PDF report export",
    ],
    preview: {
      label: "Sales by Ticket Type",
      items: [
        { name: "General Admission", price: "$18,000", sold: 720, total: 1000, pct: 72 },
        { name: "VIP Package", price: "$10,858", sold: 122, total: 300, pct: 41 },
        { name: "Early Bird", price: "$3,600", sold: 200, total: 200, pct: 100 },
      ],
    },
  },
  {
    id: "checkin",
    tab: "Check-In",
    icon: ScanLine,
    headline: "Effortless On-Site Check-In",
    description:
      "Staff scan QR codes instantly on any phone. Works offline, syncs when reconnected. Multiple gates supported simultaneously.",
    bullets: [
      "QR code scanning on any device",
      "Offline mode with background sync",
      "Multi-gate & multi-staff support",
      "Duplicate entry detection",
      "Real-time check-in dashboard",
    ],
    preview: {
      label: "Check-In Progress",
      items: [
        { name: "Main Entry", price: "98 in", sold: 98, total: 150, pct: 65 },
        { name: "VIP Entrance", price: "44 in", sold: 44, total: 122, pct: 36 },
        { name: "Side Gate A", price: "0 in", sold: 0, total: 100, pct: 0 },
      ],
    },
  },
  {
    id: "marketing",
    tab: "Marketing",
    icon: Megaphone,
    headline: "Grow Your Audience",
    description:
      "Promo codes, embeddable widgets, referral links, and social sharing tools — everything you need to sell out faster.",
    bullets: [
      "Percentage & fixed discount codes",
      "Embeddable ticket widget for your site",
      "Referral link tracking",
      "Social sharing with pre-filled copy",
      "UTM tracking & traffic analytics",
    ],
    preview: {
      label: "Active Promo Codes",
      items: [
        { name: "EARLYBIRD20", price: "20% off", sold: 88, total: 100, pct: 88 },
        { name: "VIPFRIEND", price: "Fixed $15", sold: 12, total: 50, pct: 24 },
        { name: "PRESS100", price: "100% off", sold: 5, total: 10, pct: 50 },
      ],
    },
  },
];

export function Features() {
  const [active, setActive] = useState("ticketing");
  const feature = features.find((f) => f.id === active)!;
  const Icon = feature.icon;

  return (
    <section id="features" className="section-padding bg-neutral-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Everything you need
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4">
            Built for serious organizers
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Every tool you need to run a world-class event — in one platform.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {features.map(({ id, tab, icon: TabIcon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                active === id
                  ? "gradient-primary text-white shadow-md"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700"
              )}
            >
              <TabIcon className="w-4 h-4" />
              {tab}
            </button>
          ))}
        </div>

        {/* Feature content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl border border-neutral-100 shadow-sm p-8 lg:p-12">
          {/* Left — text */}
          <div>
            <div className="inline-flex w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center mb-5">
              <Icon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">{feature.headline}</h3>
            <p className="text-neutral-500 leading-relaxed mb-6">{feature.description}</p>
            <ul className="space-y-3 mb-8">
              {feature.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
            <a
              href="/register"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Learn more <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right — preview card */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-6">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">
              {feature.preview.label}
            </p>
            <div className="space-y-4">
              {feature.preview.items.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-neutral-800">{item.name}</span>
                    <span className={cn(
                      "text-sm font-semibold",
                      item.full ? "text-danger-500" : "text-neutral-700"
                    )}>
                      {item.full ? "SOLD OUT" : item.price}
                    </span>
                  </div>
                  {item.total > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            item.full ? "bg-danger-400" : "gradient-primary"
                          )}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-neutral-400 w-20 text-right">
                        {item.sold}/{item.total}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
