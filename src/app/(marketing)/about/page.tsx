import Link from "next/link";
import { Users, Target, Heart, Zap, Globe, TrendingUp, ArrowRight } from "lucide-react";

const team = [
  { name: "Arif Hakim", role: "CEO & Co-Founder", avatar: "AH", bio: "Former VP at Ticketmaster APAC. 12 years in live events." },
  { name: "Priya Nair", role: "CTO & Co-Founder", avatar: "PN", bio: "Ex-Stripe engineer. Built payments infra serving 50M+ txns." },
  { name: "Jason Lim", role: "Head of Product", avatar: "JL", bio: "Product lead at Eventbrite SEA before joining Eventix." },
  { name: "Aishah Rahman", role: "Head of Design", avatar: "AR", bio: "Crafting beautiful event experiences since 2018." },
  { name: "Wei Zhong", role: "Head of Engineering", avatar: "WZ", bio: "Distributed systems nerd. Loves Rust and coffee." },
  { name: "Kavya Menon", role: "Head of Growth", avatar: "KM", bio: "Grew three startups from 0 to 100k users. Now doing it again." },
];

const values = [
  { icon: Heart, title: "Organizer First", desc: "Everything we build starts with the organizer's needs. If it doesn't make their life easier, we don't ship it." },
  { icon: Target, title: "Relentless Focus", desc: "We say no to a hundred things so we can say yes to the one thing that matters most right now." },
  { icon: Globe, title: "Built for Southeast Asia", desc: "FPX, local currencies, multilingual — we're not a Western product bolted onto the region. We're from here." },
  { icon: TrendingUp, title: "Transparent by Default", desc: "No hidden fees. No surprise charges. Clear pricing, clear payouts, clear data." },
];

const milestones = [
  { year: "2023", event: "Eventix founded in Kuala Lumpur by Arif & Priya" },
  { year: "2023", event: "First 100 organizers onboarded. RM 500K in ticket sales." },
  { year: "2024", event: "Series A — RM 8M raised. Expanded to Singapore & Indonesia." },
  { year: "2024", event: "Launched Check-In PWA & Exhibitor Portal." },
  { year: "2025", event: "10,000 events hosted. RM 120M in GMV processed." },
  { year: "2026", event: "Launched enterprise white-label. 50,000+ organizers." },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="gradient-dark text-white section-padding text-center">
        <div className="mx-auto max-w-3xl px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/10">
            <Zap className="w-3.5 h-3.5" /> Our Story
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            We believe every great event deserves great software
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Eventix was born out of frustration. Our founders spent years watching brilliant event organizers struggle with clunky ticketing platforms, opaque fees, and tools that weren't built for Southeast Asia. So we built the platform we always wished existed.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-neutral-50 border-b border-neutral-200">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "50,000+", label: "Event Organizers" },
            { value: "RM 120M+", label: "Ticket Sales Processed" },
            { value: "8", label: "Countries" },
            { value: "4.9★", label: "Organizer Rating" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold gradient-primary-text">{s.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-extrabold text-neutral-900 mb-4">Our Mission</h2>
          <p className="text-xl text-neutral-600 leading-relaxed">
            To empower every event organizer in Southeast Asia — from weekend markets to stadium concerts — with the tools, data, and confidence to create unforgettable experiences.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-extrabold text-neutral-900 text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg mb-2">{v.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-extrabold text-neutral-900 text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-neutral-200" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 text-right flex-shrink-0">
                    <span className="text-sm font-bold text-primary-600">{m.year}</span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-primary-600 flex-shrink-0 mt-0.5 relative z-10" />
                  <p className="text-neutral-700 text-sm leading-relaxed">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-extrabold text-neutral-900 text-center mb-4">Meet the Team</h2>
          <p className="text-neutral-500 text-center mb-12">A small team with a big mission.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-black mb-4">
                  {member.avatar}
                </div>
                <p className="font-bold text-neutral-900">{member.name}</p>
                <p className="text-sm font-medium text-primary-600 mb-2">{member.role}</p>
                <p className="text-sm text-neutral-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-dark text-white text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-extrabold mb-4">Join us on the mission</h2>
          <p className="text-white/70 mb-8">We're hiring across engineering, design, and growth. Come build the future of events in Southeast Asia.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/careers" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors">
              View Open Roles <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
