"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for getting started with free events.",
    fee: "5% platform fee",
    cta: "Start for Free",
    href: "/register",
    highlighted: false,
    features: [
      "1 active event at a time",
      "Unlimited free ticket events",
      "Basic attendee management",
      "Email ticket delivery",
      "Standard check-in app",
      "Community support",
    ],
    missing: [
      "Analytics dashboard",
      "Promo codes",
      "Team members",
      "Custom branding",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 23,
    description: "Everything you need to run professional events.",
    fee: "2.5% platform fee",
    cta: "Start 14-Day Trial",
    href: "/register?plan=pro",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Unlimited active events",
      "Advanced analytics dashboard",
      "Promo codes & discount tools",
      "Up to 5 team members",
      "Embeddable ticket widget",
      "Custom event URL slug",
      "Priority email support",
      "Organizer broadcast emails",
      "CSV & PDF exports",
    ],
    missing: [],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "Custom pricing for large organisations.",
    fee: "Custom fee structure",
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
    features: [
      "Everything in Pro",
      "White-label & custom domain",
      "Unlimited team members",
      "Dedicated account manager",
      "SLA uptime guarantee",
      "Custom payment gateway",
      "Full API access & webhooks",
      "SSO / SAML authentication",
      "Invoice billing",
    ],
    missing: [],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="section-padding bg-neutral-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Transparent pricing
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-8">
            No hidden fees. No lock-in contracts. Upgrade or downgrade anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white border border-neutral-200 rounded-full px-4 py-2 shadow-sm">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                "text-sm font-medium px-3 py-1 rounded-full transition-colors",
                !yearly ? "bg-primary-600 text-white" : "text-neutral-500"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                "flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full transition-colors",
                yearly ? "bg-primary-600 text-white" : "text-neutral-500"
              )}
            >
              Yearly
              {!yearly && (
                <span className="text-xs bg-success-100 text-success-700 px-1.5 py-0.5 rounded-full font-semibold">
                  Save 20%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-7 transition-all duration-200",
                plan.highlighted
                  ? "gradient-primary text-white shadow-2xl scale-[1.02] ring-2 ring-primary-500/20"
                  : "bg-white border border-neutral-100 shadow-sm hover:shadow-md"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-white text-primary-700 border border-primary-200 shadow-sm px-3 py-0.5 text-xs font-semibold">
                    <Zap className="w-3 h-3 mr-1" />
                    {plan.badge}
                  </Badge>
                </div>
              )}

              {/* Plan name + price */}
              <div className="mb-5">
                <h3 className={cn("text-lg font-bold mb-1", plan.highlighted ? "text-white" : "text-neutral-900")}>
                  {plan.name}
                </h3>
                <p className={cn("text-sm mb-4", plan.highlighted ? "text-primary-100" : "text-neutral-500")}>
                  {plan.description}
                </p>

                {plan.monthlyPrice === null ? (
                  <p className={cn("text-3xl font-extrabold", plan.highlighted ? "text-white" : "text-neutral-900")}>
                    Custom
                  </p>
                ) : (
                  <div className="flex items-end gap-1">
                    <span className={cn("text-4xl font-extrabold", plan.highlighted ? "text-white" : "text-neutral-900")}>
                      ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className={cn("text-sm mb-1.5", plan.highlighted ? "text-primary-100" : "text-neutral-400")}>
                      /mo
                    </span>
                  </div>
                )}

                <p className={cn("text-xs font-medium mt-1", plan.highlighted ? "text-primary-200" : "text-neutral-400")}>
                  {plan.fee}
                </p>
              </div>

              {/* CTA */}
              <Button
                className={cn(
                  "w-full mb-6",
                  plan.highlighted
                    ? "bg-white text-primary-700 hover:bg-primary-50 border-0 font-semibold"
                    : plan.id === "free"
                    ? "border-neutral-200 text-neutral-700"
                    : "gradient-primary text-white border-0"
                )}
                variant={plan.highlighted ? "secondary" : plan.id === "free" ? "outline" : "default"}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              {/* Feature list */}
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2
                      className={cn(
                        "w-4 h-4 mt-0.5 flex-shrink-0",
                        plan.highlighted ? "text-primary-200" : "text-success-500"
                      )}
                    />
                    <span className={plan.highlighted ? "text-primary-50" : "text-neutral-600"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-neutral-400 mt-8">
          All plans include SSL, 99.9% uptime, and GDPR-compliant data handling.
          No credit card required for Free plan.
        </p>
      </div>
    </section>
  );
}
