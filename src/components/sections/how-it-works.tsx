import { CalendarPlus, CreditCard, ScanLine } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: CalendarPlus,
    title: "Create Your Event",
    description:
      "Set up your event in minutes with our wizard. Add details, upload a banner, configure venue or virtual link. Free for free events.",
    color: "bg-primary-50 text-primary-600",
    border: "border-primary-100",
  },
  {
    step: "02",
    icon: CreditCard,
    title: "Sell Tickets",
    description:
      "Create multiple ticket types — General, VIP, Early Bird. Payments handled securely via Stripe. Add promo codes to boost sales.",
    color: "bg-accent-50 text-accent-600",
    border: "border-accent-100",
  },
  {
    step: "03",
    icon: ScanLine,
    title: "Go Live & Check In",
    description:
      "Share your event link and watch tickets fly. On event day, use our mobile check-in app to scan QR codes at the gate instantly.",
    color: "bg-success-50 text-success-600",
    border: "border-success-100",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Simple by design
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4">
            How Eventix Works
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Three steps from idea to sold-out event. No technical knowledge needed.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px border-t-2 border-dashed border-neutral-200 z-0" />

          {steps.map(({ step, icon: Icon, title, description, color, border }) => (
            <div key={step} className="relative z-10 text-center group">
              {/* Icon circle */}
              <div className="inline-flex flex-col items-center mb-6">
                <div className={`w-16 h-16 rounded-2xl ${color} border ${border} flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-neutral-400 tracking-widest">{step}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-neutral-900 mb-3">{title}</h3>
              <p className="text-neutral-500 leading-relaxed max-w-xs mx-auto">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
