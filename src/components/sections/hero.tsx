"use client";

import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, Zap, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const floatingCards = [
  {
    icon: TrendingUp,
    color: "text-primary-600",
    bg: "bg-primary-50",
    title: "42 tickets sold",
    sub: "in the last hour",
  },
  {
    icon: Users,
    color: "text-success-500",
    bg: "bg-success-50",
    title: "1,204 attendees",
    sub: "registered today",
  },
  {
    icon: Zap,
    color: "text-warning-500",
    bg: "bg-warning-50",
    title: "$8,240 revenue",
    sub: "this week",
  },
];

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-accent-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary-600/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <Badge className="mb-6 bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-50">
              🎉 Trusted by 5,000+ organizers worldwide
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              <span className="text-neutral-900">Sell Tickets.</span>
              <br />
              <span className="gradient-primary-text">Manage Events.</span>
              <br />
              <span className="text-neutral-900">Grow Your</span>
              <br />
              <span className="text-neutral-900">Audience.</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed mb-8 max-w-lg">
              The all-in-one platform for event organizers of any scale — from
              intimate workshops to stadium concerts. Go live in minutes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                size="lg"
                className="gradient-primary text-white border-0 shadow-md hover:opacity-90 text-base px-7"
                asChild
              >
                <Link href="/register">
                  Start for Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-7 border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                asChild
              >
                <Link href="#how-it-works">
                  <Play className="mr-2 w-4 h-4" />
                  See How It Works
                </Link>
              </Button>
            </div>

            {/* Trust microcopy */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {[
                "No setup fees",
                "Free for free events",
                "Go live in 5 min",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-neutral-500">
                  <CheckCircle2 className="w-4 h-4 text-success-500 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Dashboard mockup */}
          <div className="relative hidden lg:block">
            {/* Browser chrome mockup */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/80 bg-white">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-danger-500/60" />
                  <div className="w-3 h-3 rounded-full bg-warning-500/60" />
                  <div className="w-3 h-3 rounded-full bg-success-500/60" />
                </div>
                <div className="flex-1 mx-4 bg-neutral-200 rounded-md h-5 flex items-center px-3">
                  <span className="text-xs text-neutral-400">app.eventix.io/dashboard</span>
                </div>
              </div>

              {/* Dashboard preview */}
              <div className="p-5 bg-neutral-50 min-h-[380px]">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Revenue", value: "$12,450", up: "+18%" },
                    { label: "Tickets Sold", value: "842", up: "+24%" },
                    { label: "Upcoming", value: "3 events", up: "" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-3 border border-neutral-100 shadow-sm">
                      <p className="text-xs text-neutral-500 mb-1">{stat.label}</p>
                      <p className="text-base font-bold text-neutral-900">{stat.value}</p>
                      {stat.up && (
                        <p className="text-xs text-success-600 font-medium">{stat.up} MoM</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-neutral-700">Sales Overview</p>
                    <span className="text-xs text-neutral-400">Last 30 days</span>
                  </div>
                  {/* Fake bar chart */}
                  <div className="flex items-end gap-1 h-20">
                    {[30, 55, 40, 70, 60, 85, 75, 90, 65, 80, 95, 72, 88, 60].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: `linear-gradient(to top, #4f46e5, #7c3aed)`,
                          opacity: i === 13 ? 1 : 0.4 + (i / 14) * 0.5,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4">
                  <p className="text-xs font-semibold text-neutral-700 mb-3">Recent Orders</p>
                  {[
                    { name: "John D.", ticket: "VIP Package", amount: "$89.00" },
                    { name: "Sara K.", ticket: "General · ×2", amount: "$50.00" },
                    { name: "Amir R.", ticket: "Early Bird", amount: "$18.00" },
                  ].map((order) => (
                    <div key={order.name} className="flex items-center justify-between py-1.5 border-b border-neutral-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-semibold text-primary-700">
                          {order.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-800">{order.name}</p>
                          <p className="text-xs text-neutral-400">{order.ticket}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-neutral-700">{order.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            {floatingCards.map((card, i) => {
              const Icon = card.icon;
              const positions = [
                "-top-4 -left-8",
                "-bottom-4 -left-6",
                "-top-4 -right-6",
              ];
              return (
                <div
                  key={card.title}
                  className={`absolute ${positions[i]} glass rounded-xl px-4 py-3 shadow-lg border border-white/60 flex items-center gap-3 min-w-max`}
                >
                  <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{card.title}</p>
                    <p className="text-xs text-neutral-500">{card.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
