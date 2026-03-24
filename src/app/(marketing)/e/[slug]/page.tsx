import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays, MapPin, Share2, Heart,
  ChevronLeft, Users, Shield, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { TicketWidget } from "./ticket-widget";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select(`
      id, slug, title, description, banner_url, category, tags, status, visibility,
      start_date, end_date, timezone, is_online,
      venue_name, venue_address, venue_city, venue_country,
      organizer_id,
      ticket_types(id, name, description, price_type, price, currency, quantity, quantity_sold, is_hidden),
      organizations(name)
    `)
    .eq("slug", slug)
    .single();

  if (!event || (event.status !== "published" && event.visibility !== "public")) {
    notFound();
  }

  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const dateStr = startDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const timeStr = `${startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} – ${endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  const duration = Math.round((endDate.getTime() - startDate.getTime()) / 3600000);
  const orgName = (event as any).organizations?.name || "Event Organizer";
  const venue = event.is_online ? "Online Event" : [event.venue_name, event.venue_address, event.venue_city].filter(Boolean).join(", ");

  const visibleTickets = ((event as any).ticket_types || []).filter((t: any) => !t.is_hidden);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Banner */}
      <div className="h-64 sm:h-80 bg-gradient-to-br from-primary-600 via-accent-600 to-primary-800 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <CalendarDays className="w-24 h-24 text-white/20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <Link href="/events" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 transition-colors">
              <ChevronLeft className="w-4 h-4" />Back to Events
            </Link>
            <Badge className="bg-success-500 text-white border-0 mb-2">● Live</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — event details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <CalendarDays className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span><strong>{dateStr}</strong> · {timeStr}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>{venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Users className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span>Organized by <strong>{orgName}</strong></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-neutral-200 h-9">
                    <Heart className="w-3.5 h-3.5 mr-1.5" />Save
                  </Button>
                  <Button variant="outline" size="sm" className="border-neutral-200 h-9">
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />Share
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Clock, label: `${duration}-hour event` },
                  { icon: Shield, label: "Refunds available" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-100 rounded-full px-3 py-1.5 text-xs text-neutral-600">
                    <Icon className="w-3.5 h-3.5 text-primary-500" />{label}
                  </div>
                ))}
                {event.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs border-neutral-200 text-neutral-500">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">About this event</h3>
              <div className="prose prose-sm max-w-none text-neutral-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>
          </div>

          {/* Right — ticket widget */}
          <div className="lg:col-span-1">
            <TicketWidget tickets={visibleTickets} eventSlug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
