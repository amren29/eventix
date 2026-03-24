const stats = [
  { value: "2M+", label: "Tickets Sold" },
  { value: "120", label: "Countries" },
  { value: "5,000+", label: "Organizers" },
  { value: "4.9★", label: "Average Rating" },
];

// Placeholder brand logos (text-based for now)
const logos = [
  "TechConf", "Bass Nation", "DevSummit", "FoodFest",
  "SportsPro", "ArtWeek", "EduCon", "StartupKL",
  "TechConf", "Bass Nation", "DevSummit", "FoodFest",
];

export function SocialProof() {
  return (
    <section className="py-12 border-y border-neutral-100 bg-neutral-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-neutral-500 mb-8">
          Trusted by organizers worldwide
        </p>

        {/* Scrolling logos */}
        <div className="relative overflow-hidden mb-10">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-50/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-50/50 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-10 animate-marquee whitespace-nowrap">
            {logos.map((logo, i) => (
              <div
                key={`${logo}-${i}`}
                className="inline-flex items-center justify-center h-8 px-4 rounded-md bg-neutral-200/60 text-neutral-500 text-sm font-semibold tracking-wide flex-shrink-0 min-w-[100px]"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold gradient-primary-text mb-1">{value}</p>
              <p className="text-sm text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
