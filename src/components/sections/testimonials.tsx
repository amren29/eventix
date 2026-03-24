"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "We sold out 2,000 seats in under 3 hours. The check-in app is a game-changer — zero queues at the gate.",
    author: "Amir Rashid",
    role: "Founder, Bass Nation Events",
    initials: "AR",
    color: "bg-primary-100 text-primary-700",
    stars: 5,
  },
  {
    quote:
      "Switching from Eventbrite saved us over $4,000 in fees on our last conference. The analytics alone are worth it.",
    author: "Sarah Kwan",
    role: "Head of Events, TechConf Asia",
    initials: "SK",
    color: "bg-accent-100 text-accent-700",
    stars: 5,
  },
  {
    quote:
      "The promo code and referral system doubled our early-bird sales. Setup took 20 minutes for a 500-person event.",
    author: "Daniel Musa",
    role: "Director, DevSummit MY",
    initials: "DM",
    color: "bg-success-100 text-success-700",
    stars: 5,
  },
  {
    quote:
      "We run 40+ events a year across 3 countries. Eventix handles multi-currency payouts flawlessly.",
    author: "Priya Nair",
    role: "Operations Lead, ExpoGroup",
    initials: "PN",
    color: "bg-warning-100 text-warning-700",
    stars: 5,
  },
  {
    quote:
      "As a first-time organizer, I had my ticketing page live in literally 10 minutes. The wizard is that good.",
    author: "Hafiz Azman",
    role: "Co-founder, Startup Weekend KL",
    initials: "HA",
    color: "bg-primary-100 text-primary-700",
    stars: 5,
  },
  {
    quote:
      "The white-label feature means our clients see our brand, not Eventix. Enterprise plan is totally worth it.",
    author: "Lisa Tan",
    role: "CEO, EventPro Agency",
    initials: "LT",
    color: "bg-accent-100 text-accent-700",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-warning-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Loved by organizers
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4">
            Don&apos;t just take our word for it
          </h2>
          <p className="text-lg text-neutral-500">
            Join thousands of organizers who&apos;ve made the switch.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {visible.map((t) => (
            <div
              key={t.author}
              className="relative bg-white rounded-2xl border border-neutral-100 shadow-sm p-7 hover:shadow-md transition-shadow"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-neutral-100" />
              <StarRating count={t.stars} />
              <p className="mt-4 mb-6 text-neutral-700 leading-relaxed text-sm">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0", t.color)}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{t.author}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-primary-400 hover:text-primary-600 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === page ? "w-6 gradient-primary" : "bg-neutral-200"
                )}
              />
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={page === pages - 1}
            className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-primary-400 hover:text-primary-600 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
