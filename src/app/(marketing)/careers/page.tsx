import Link from "next/link";
import { MapPin, Clock, ArrowRight, Heart, Zap, Globe, TrendingUp } from "lucide-react";

const openRoles = [
  { title: "Senior Full-Stack Engineer", team: "Engineering", location: "KL / Remote", type: "Full-time" },
  { title: "Frontend Engineer (React/Next.js)", team: "Engineering", location: "KL / Remote", type: "Full-time" },
  { title: "Mobile Engineer (React Native)", team: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer (UI/UX)", team: "Design", location: "KL / Remote", type: "Full-time" },
  { title: "Product Manager", team: "Product", location: "Kuala Lumpur", type: "Full-time" },
  { title: "Growth Marketing Manager", team: "Growth", location: "KL / Singapore", type: "Full-time" },
  { title: "Customer Success Manager", team: "Operations", location: "Kuala Lumpur", type: "Full-time" },
  { title: "Sales Development Representative", team: "Sales", location: "KL / Singapore", type: "Full-time" },
];

const perks = [
  { icon: "💰", title: "Competitive Pay", desc: "Market-rate salary + equity. We're transparent about our pay bands." },
  { icon: "🏠", title: "Flexible Work", desc: "Work from our KL or Singapore office, fully remote, or hybrid." },
  { icon: "🏥", title: "Health Coverage", desc: "Full medical, dental, and optical for you and your dependents." },
  { icon: "📚", title: "Learning Budget", desc: "RM 5,000/year for courses, books, conferences, and certifications." },
  { icon: "✈️", title: "Annual Retreat", desc: "Company offsite every year. Previous locations: Bali, Chiang Mai, KL." },
  { icon: "🎟️", title: "Free Event Tickets", desc: "Access to events hosted on Eventix. Culture matters." },
];

export default function CareersPage() {
  const teams = [...new Set(openRoles.map(r => r.team))];

  return (
    <div className="bg-white">
      <section className="gradient-dark text-white py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <div className="inline-flex items-center gap-2 bg-success-500/20 border border-success-500/30 text-success-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" /> We're hiring
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Build the future of events</h1>
          <p className="text-white/70 text-lg">Join a small, ambitious team building Southeast Asia's leading event platform. We move fast, care deeply, and have fun doing it.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-4xl px-4 grid grid-cols-4 gap-6 text-center">
          {[
            { v: "32", l: "Team Members" },
            { v: "3", l: "Countries" },
            { v: "4.8★", l: "Glassdoor Rating" },
            { v: "8", l: "Open Roles" },
          ].map(s => (
            <div key={s.l}>
              <p className="text-2xl font-extrabold gradient-primary-text">{s.v}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="section-padding">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">Why Eventix?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {perks.map(p => (
              <div key={p.title} className="bg-neutral-50 rounded-2xl border border-neutral-100 p-5">
                <div className="text-2xl mb-3">{p.icon}</div>
                <p className="font-bold text-neutral-900 mb-1">{p.title}</p>
                <p className="text-sm text-neutral-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="section-padding bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">Open Roles</h2>
          {teams.map(team => (
            <div key={team} className="mb-8">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-3">{team}</h3>
              <div className="space-y-3">
                {openRoles.filter(r => r.team === team).map(r => (
                  <Link key={r.title} href="/contact"
                    className="flex items-center justify-between bg-white rounded-2xl border border-neutral-100 shadow-sm px-5 py-4 hover:shadow-md hover:border-primary-200 transition-all group">
                    <div>
                      <p className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">{r.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.type}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center mt-8">
            <p className="text-neutral-500 text-sm mb-3">Don't see a role that fits? We're always looking for exceptional people.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Send a speculative application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
