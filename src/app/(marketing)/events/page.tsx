import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal, CalendarDays, MapPin, Ticket, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Discover Events",
  description: "Find concerts, conferences, workshops, and more on Eventix.",
};

const CATEGORIES = ["All", "Conference", "Music", "Education", "Business", "Food", "Sports", "Arts", "Virtual"];

export default async function EventsDiscoveryPage() {
  const supabase = await createClient();

  const { data: dbEvents } = await supabase
    .from("events")
    .select("slug, title, banner_url, start_date, category, is_online, venue_name, venue_city, ticket_types(price, price_type, quantity, quantity_sold)")
    .eq("status", "published")
    .eq("visibility", "public")
    .order("start_date", { ascending: true })
    .limit(24);

  const events = (dbEvents || []).map((e: any) => {
    const tickets = e.ticket_types || [];
    const minPrice = tickets.length > 0
      ? Math.min(...tickets.map((t: any) => t.price_type === "free" ? 0 : t.price))
      : 0;
    const hasAvailability = tickets.some((t: any) => !t.quantity || t.quantity_sold < t.quantity);
    return {
      slug: e.slug,
      title: e.title,
      bannerUrl: e.banner_url || null,
      date: new Date(e.start_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
      venue: e.is_online ? "Online" : [e.venue_name, e.venue_city].filter(Boolean).join(", ") || "TBA",
      category: e.category,
      price: minPrice === 0 ? "Free" : `From $${(minPrice / 100).toFixed(0)}`,
      tag: !hasAvailability ? "Sold Out" : "",
    };
  });

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

              <Button variant="ghost" size="sm" className="w-full text-xs text-neutral-400 h-8">
                Clear all filters
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <p className="text-sm text-neutral-500"><strong className="text-neutral-900">{events.length} events</strong> found</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 border-neutral-200 text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />Filters
                </Button>
                <Button variant="outline" size="sm" className="h-8 border-neutral-200 text-xs">
                  Sort: Date <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center">
                <CalendarDays className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                <h3 className="font-semibold text-neutral-700 mb-1">No events yet</h3>
                <p className="text-sm text-neutral-400">Check back soon for upcoming events.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {events.map((event) => (
                  <Link key={event.slug} href={`/e/${event.slug}`} className="group bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all overflow-hidden block">
                    <div className="h-40 bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center relative overflow-hidden">
                      {event.bannerUrl ? (
                        <img src={event.bannerUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <CalendarDays className="w-12 h-12 text-primary-200" />
                      )}
                      {event.tag && (
                        <div className="absolute top-3 left-3">
                          <Badge className="text-[10px] px-2 h-5 border bg-danger-50 text-danger-600 border-danger-100">{event.tag}</Badge>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="text-[10px] px-2 h-5 bg-white/90 border-neutral-200 text-neutral-600">{event.category}</Badge>
                      </div>
                    </div>

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
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
