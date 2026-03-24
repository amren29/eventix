import Link from "next/link";
import {
  Plus, Search, Filter, MoreHorizontal,
  Edit, Eye, Copy, Trash2, ScanLine,
  CalendarDays, MapPin, Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/server";

const statusStyle: Record<string, string> = {
  published: "bg-success-50 text-success-700 border-success-100",
  draft:     "bg-neutral-100 text-neutral-500 border-neutral-200",
  past:      "bg-neutral-100 text-neutral-400 border-neutral-200",
  cancelled: "bg-danger-50 text-danger-600 border-danger-100",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user!.id)
    .single();

  const orgId = profile?.organization_id;

  const { data: dbEvents } = orgId
    ? await supabase
        .from("events")
        .select("id, title, slug, start_date, status, category, is_online, venue_name, venue_city, ticket_types(quantity, quantity_sold, price)")
        .eq("organization_id", orgId)
        .order("start_date", { ascending: false })
    : { data: [] };

  const events = (dbEvents || []).map((e: any) => {
    const tickets = e.ticket_types || [];
    const sold = tickets.reduce((s: number, t: any) => s + (t.quantity_sold || 0), 0);
    const total = tickets.reduce((s: number, t: any) => s + (t.quantity || 0), 0);
    const revenue = tickets.reduce((s: number, t: any) => s + (t.quantity_sold || 0) * (t.price || 0), 0);
    return {
      id: e.id,
      name: e.title,
      slug: e.slug,
      date: new Date(e.start_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) +
            " · " + new Date(e.start_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      venue: e.is_online ? "Online" : [e.venue_name, e.venue_city].filter(Boolean).join(", ") || "TBA",
      status: e.status,
      sold,
      total: total || 0,
      revenue: `$${(revenue / 100).toLocaleString()}`,
      category: e.category,
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Events</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Manage all your events in one place.</p>
        </div>
        <Button className="gradient-primary text-white border-0 shadow-sm hover:opacity-90" asChild>
          <Link href="/dashboard/events/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Tabs + filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Tabs defaultValue="all">
          <TabsList className="bg-neutral-100 h-9">
            {["all", "published", "draft", "past", "cancelled"].map((tab) => (
              <TabsTrigger key={tab} value={tab} className="capitalize text-xs px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <Input placeholder="Search events..." className="pl-8 h-9 w-52 text-xs border-neutral-200" />
          </div>
          <Button variant="outline" size="sm" className="h-9 border-neutral-200 text-neutral-600 text-xs">
            <Filter className="w-3.5 h-3.5 mr-1.5" /> Filter
          </Button>
        </div>
      </div>

      {/* Event list */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center">
            <CalendarDays className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
            <h3 className="font-semibold text-neutral-700 mb-1">No events yet</h3>
            <p className="text-sm text-neutral-400 mb-4">Create your first event to start selling tickets.</p>
            <Button className="gradient-primary text-white border-0" asChild>
              <Link href="/dashboard/events/new">
                <Plus className="w-4 h-4 mr-2" />Create Event
              </Link>
            </Button>
          </div>
        ) : events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 p-5">
              <div className="w-20 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex-shrink-0 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-primary-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-neutral-900 text-sm">{event.name}</h3>
                  <Badge className={`text-[10px] px-1.5 h-4 border capitalize ${statusStyle[event.status]}`}>
                    {event.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 h-4 text-neutral-500 border-neutral-200">
                    {event.category}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-neutral-400 mb-3">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />{event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{event.venue}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-neutral-600">
                    <Ticket className="w-3 h-3" />{event.sold} / {event.total} sold · {event.revenue}
                  </span>
                </div>

                {event.total > 0 && (
                  <div className="flex items-center gap-3 max-w-xs">
                    <Progress
                      value={(event.sold / event.total) * 100}
                      className="h-1.5 flex-1 bg-neutral-100 [&>div]:gradient-primary"
                    />
                    <span className="text-[11px] text-neutral-400 flex-shrink-0 w-8 text-right">
                      {Math.round((event.sold / event.total) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" className="h-8 text-xs border-neutral-200" asChild>
                  <Link href={`/dashboard/events/${event.id}`}>
                    <Edit className="w-3.5 h-3.5 mr-1.5" />Manage
                  </Link>
                </Button>
                {event.status === "published" && (
                  <Button size="sm" className="h-8 text-xs bg-success-500 hover:bg-success-600 text-white border-0" asChild>
                    <Link href={`/checkin/${event.id}/scan`}>
                      <ScanLine className="w-3.5 h-3.5 mr-1.5" />Check-In
                    </Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-neutral-200">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem asChild>
                      <Link href={`/e/${event.slug}`} className="flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" />View public page
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Copy className="w-3.5 h-3.5" />Duplicate event
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-danger-600 focus:text-danger-600 focus:bg-danger-50 flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5" />Delete event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
