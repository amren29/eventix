import Link from "next/link";
import { Music, Tent, Briefcase, GraduationCap, UtensilsCrossed, Dumbbell, Globe, Palette, LucideIcon } from "lucide-react";

const categories: { icon: LucideIcon; label: string; count: string; href: string }[] = [
  { icon: Music, label: "Concerts & Shows", count: "2.4k events", href: "/events?category=music" },
  { icon: Tent, label: "Festivals & Expos", count: "890 events", href: "/events?category=festival" },
  { icon: Briefcase, label: "Conferences", count: "1.1k events", href: "/events?category=conference" },
  { icon: GraduationCap, label: "Classes & Courses", count: "560 events", href: "/events?category=education" },
  { icon: UtensilsCrossed, label: "Dining & Tastings", count: "340 events", href: "/events?category=food" },
  { icon: Dumbbell, label: "Sports & Fitness", count: "720 events", href: "/events?category=sports" },
  { icon: Globe, label: "Virtual Events", count: "1.8k events", href: "/events?category=virtual" },
  { icon: Palette, label: "Arts & Culture", count: "430 events", href: "/events?category=arts" },
];

export function EventCategories() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Every occasion covered
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-4">
            Built for every type of event
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            From intimate workshops to stadium concerts — Eventix scales with you.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(({ icon: Icon, label, count, href }) => (
            <Link
              key={label}
              href={href}
              className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-primary-200 hover:shadow-md transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-neutral-800 text-sm">{label}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{count}</p>
              </div>
              {/* Hover arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
