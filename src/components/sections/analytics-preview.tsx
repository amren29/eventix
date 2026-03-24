import { TrendingUp, Download, MapPin, Users2 } from "lucide-react";

const highlights = [
  { icon: TrendingUp, label: "Live sales tracking" },
  { icon: Download, label: "Export CSV & PDF" },
  { icon: MapPin, label: "Geographic insights" },
  { icon: Users2, label: "Demographic analytics" },
];

const chartBars = [
  { h: 40, label: "Jan" }, { h: 55, label: "Feb" }, { h: 48, label: "Mar" },
  { h: 70, label: "Apr" }, { h: 62, label: "May" }, { h: 85, label: "Jun" },
  { h: 78, label: "Jul" }, { h: 92, label: "Aug" }, { h: 68, label: "Sep" },
  { h: 88, label: "Oct" }, { h: 95, label: "Nov" }, { h: 100, label: "Dec" },
];

export function AnalyticsPreview() {
  return (
    <section className="section-padding gradient-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3">
              Data-driven decisions
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Know your audience.
              <br />
              <span className="gradient-primary-text">Grow your revenue.</span>
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed mb-8">
              Real-time insights at your fingertips. Track every ticket sale, understand where your attendees come from, and make smarter decisions for your next event.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-neutral-300">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — dark analytics mockup */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <p className="text-sm font-semibold text-white">Revenue Overview</p>
                <p className="text-xs text-neutral-500">Last 12 months</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-white">$142,840</p>
                <p className="text-xs text-success-400 font-medium">↑ 34% YoY</p>
              </div>
            </div>

            {/* Chart */}
            <div className="px-5 py-6">
              <div className="flex items-end gap-2 h-32 mb-2">
                {chartBars.map(({ h, label }) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, #4f46e5, #7c3aed)`,
                        opacity: label === "Dec" ? 1 : 0.5,
                      }}
                    />
                    <span className="text-[9px] text-neutral-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 border-t border-white/10">
              {[
                { label: "Tickets Sold", value: "18,402" },
                { label: "Conversion", value: "4.8%" },
                { label: "Check-In Rate", value: "91%" },
              ].map(({ label, value }) => (
                <div key={label} className="px-5 py-4 border-r border-white/10 last:border-0">
                  <p className="text-xs text-neutral-500 mb-1">{label}</p>
                  <p className="text-lg font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
