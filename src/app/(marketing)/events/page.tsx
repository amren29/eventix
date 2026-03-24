import Link from "next/link";
import { Search, SlidersHorizontal, CalendarDays, MapPin, Ticket, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EVENTS = [
  { slug:"tech-summit-kl-2026",  title:"Tech Summit KL 2026",         date:"Sat, Mar 15, 2026",  venue:"Axiata Arena, KL",           category:"Conference", price:"From $25", image:"🏢", tag:"Selling Fast" },
  { slug:"bass-nation-festival",  title:"Bass Nation Festival",         date:"Fri, Apr 5, 2026",   venue:"Stadium Merdeka, KL",         category:"Music",      price:"From $35", image:"🎵", tag:"" },
  { slug:"design-workshop-q1",    title:"Design Thinking Workshop",     date:"Sun, Mar 22, 2026",  venue:"Online (Zoom)",               category:"Education",  price:"$30",      image:"🎨", tag:"" },
  { slug:"startup-weekend-kl",    title:"Startup Weekend KL",           date:"Fri, May 2, 2026",   venue:"Common Ground, KL",           category:"Business",   price:"$49",      image:"🚀", tag:"Limited" },
  { slug:"kl-food-fest-2026",     title:"KL Food Festival 2026",        date:"Sat, Apr 19, 2026",  venue:"KLCC Park, KL",               category:"Food",       price:"Free",     image:"🍽️", tag:"Free" },
  { slug:"dev-meetup-march",      title:"Dev Meetup · March Edition",   date:"Thu, Mar 20, 2026",  venue:"TechSpace, Bangsar",          category:"Conference", price:"Free",     image:"💻", tag:"Free" },
  { slug:"yoga-wellness-day",     title:"Sunrise Yoga & Wellness Day",  date:"Sun, Apr 6, 2026",   venue:"KLCC Park, KL",               category:"Sports",     price:"$15",      image:"🧘", tag:"" },
  { slug:"art-expo-2026",         title:"KL Art Expo 2026",             date:"Fri, May 9, 2026",   venue:"Galeri Petronas, KL",         category:"Arts",       price:"From $20", image:"🖼️", tag:"New" },
];

const CATEGORIES = ["All", "Conference", "Music", "Education", "Business", "Food", "Sports", "Arts", "Virtual"];

const tagStyle: Record<string, string> = {
  "Selling Fast": "bg-danger-50 text-danger-600 border-danger-100",
  "Limited":      "bg-warning-50 text-warning-700 border-warning-100",
  "Free":         "bg-success-50 text-success-700 border-success-100",
  "New":          "bg-primary-50 text-primary-700 border-primary-100",
};

export default function EventsDiscoveryPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero search bar */}
      <div className="gradient-dark py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Discover Events Near You</h1>
          <p className="text-neutral-400 mb-6">Find concerts, conferences, workshops, and more.</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                placeholder="Search events, artists, venues..."
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-neutral-400 rounded-xl focus-visible:ring-primary-500 focus-visible:bg-white/15"
              />
            </div>
            <Button className="h-12 px-5 gradient-primary text-white border-0 rounded-xl">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sticky top-24 space-y-6">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Category</p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                      <input type="checkbox" defaultChecked={cat === "All"} className="w-4 h-4 rounded border-neutral-300 accent-primary-600" />
                      <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Date</p>
                <div className="space-y-1">
                  {["Today", "This Weekend", "This Month", "Custom Range"].map((d) => (
                    <label key={d} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                      <input type="radio" name="date" className="w-4 h-4 accent-primary-600" />
                      <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Price</p>
                <div className="space-y-1">
                  {["Free", "Paid", "Under $25", "$25–$100", "$100+"].map((p) => (
                    <label key={p} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 accent-primary-600" />
                      <span className="text-sm text-neutral-600 group-hover:text-neutral-900">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="ghost" size="sm" className="w-full text-xs text-neutral-400 h-8">
                Clear all filters
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <p className="text-sm text-neutral-500"><strong className="text-neutral-900">{EVENTS.length} events</strong> found</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 border-neutral-200 text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />Filters
                </Button>
                <Button variant="outline" size="sm" className="h-8 border-neutral-200 text-xs">
                  Sort: Date <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* Event grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {EVENTS.map((event) => (
                <Link key={event.slug} href={`/e/${event.slug}`} className="group bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all overflow-hidden block">
                  {/* Banner */}
                  <div className="h-40 bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center relative">
                    <span className="text-6xl">{event.image}</span>
                    {event.tag && (
                      <div className="absolute top-3 left-3">
                        <Badge className={`text-[10px] px-2 h-5 border ${tagStyle[event.tag] ?? ""}`}>{event.tag}</Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="text-[10px] px-2 h-5 bg-white/90 border-neutral-200 text-neutral-600">{event.category}</Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-900 text-sm mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">{event.title}</h3>
                    <div className="space-y-1 mb-3">
                      <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />{event.date}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{event.venue}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm font-bold text-primary-600">
                        <Ticket className="w-3.5 h-3.5" />{event.price}
                      </span>
                      <span className="text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Get Tickets →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
