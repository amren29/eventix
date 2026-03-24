import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const faqs = [
  {
    q: "Is Eventix free to use?",
    a: "Yes — the Free plan is completely free for free events and lets you run one paid event at a time with a 5% platform fee. You only pay when you earn.",
  },
  {
    q: "What payment methods does Eventix support?",
    a: "Eventix supports credit/debit cards via Stripe, PayPal, and regional payment gateways. We process payments in 100+ currencies and pay out to your bank account on a set schedule.",
  },
  {
    q: "When do I receive my payouts?",
    a: "Pro and Enterprise organizers receive payouts on a rolling 7-day schedule after ticket sales. Free plan payouts are processed within 14 days after event completion.",
  },
  {
    q: "Can I offer refunds to attendees?",
    a: "Yes. You can configure your refund policy per event and process full or partial refunds directly from your dashboard. Refunds are handled through the original payment method.",
  },
  {
    q: "Does the check-in app work without internet?",
    a: "Yes. The check-in app downloads a local copy of your attendee list before the event. It works completely offline and syncs any entries back to the server when internet is restored.",
  },
  {
    q: "Can I use my own domain name for my event page?",
    a: "Custom domains are available on the Enterprise plan. Pro plan organizers get a custom subdomain (e.g., yourname.eventix.io). All plans include a unique event URL slug.",
  },
  {
    q: "How do promo codes work?",
    a: "You can create percentage, fixed-amount, or 100%-off discount codes. Each code can have a usage limit, per-user limit, and expiry date. Codes are applied by attendees at checkout.",
  },
  {
    q: "Is my attendees' payment data secure?",
    a: "Absolutely. We never store raw card data. All payments are processed by Stripe, which is PCI DSS Level 1 certified — the highest level of payment security.",
  },
  {
    q: "Can I have multiple team members on my account?",
    a: "Pro plans include up to 5 team members. Enterprise plans have unlimited seats. Team members can be assigned roles: Organizer, Staff (check-in only), or Analytics Viewer.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data is yours. You can export all attendee data, orders, and reports at any time. If you cancel, your data is retained for 90 days before deletion — or you can request immediate deletion.",
  },
];

export function FAQ() {
  return (
    <section className="section-padding bg-neutral-50/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Got questions?
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-500">
            Can&apos;t find the answer?{" "}
            <Link href="/contact" className="text-primary-600 hover:underline">
              Contact our support team
            </Link>
            .
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-white border border-neutral-100 rounded-xl px-5 shadow-sm data-[state=open]:border-primary-200 data-[state=open]:shadow-md transition-all"
            >
              <AccordionTrigger className="text-left font-semibold text-neutral-800 hover:no-underline py-5 text-sm">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-500 text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
