import { redirect } from "next/navigation";
import Link from "next/link";
import { Download, Send, ArrowRight, CalendarDays, MapPin, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";

export default async function MyTicketsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tickets } = await supabase
    .from("order_tickets")
    .select(`
      id,
      attendee_name,
      attendee_email,
      qr_code,
      checked_in_at,
      order:orders!inner(
        id,
        reference,
        status,
        event:events!inner(
          id,
          title,
          slug,
          start_date,
          end_date,
          venue_name,
          venue_city,
          is_online
        )
      ),
      ticket_type:ticket_types(
        id,
        name
      )
    `)
    .eq("orders.buyer_id", user.id)
    .order("created_at", { ascending: false });

  const allTickets = (tickets || []).map((t: any) => {
    const event = t.order?.event;
    const startDate = event ? new Date(event.start_date) : null;
    const now = new Date();
    const isUpcoming = startDate ? startDate > now : false;
    const isCancelled = t.order?.status === "refunded" || t.order?.status === "cancelled";

    let status: "upcoming" | "past" | "cancelled" = "past";
    if (isCancelled) status = "cancelled";
    else if (isUpcoming) status = "upcoming";

    const dateStr = startDate
      ? `${startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })} · ${startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
      : "";
    const venue = event?.is_online
      ? "Online Event"
      : [event?.venue_name, event?.venue_city].filter(Boolean).join(", ");

    return {
      id: t.order?.reference || t.id,
      event: event?.title || "Unknown Event",
      slug: event?.slug || "",
      date: dateStr,
      venue,
      ticket: t.ticket_type?.name || "Ticket",
      status,
    };
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">My Tickets</h1>
        <p className="text-sm text-neutral-500 mt-0.5">All your purchased tickets in one place.</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="bg-neutral-100 h-9">
          {["upcoming", "past", "cancelled"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {allTickets.length === 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 text-center">
            <p className="text-neutral-500 text-sm">No tickets found. Browse events to get started!</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        )}
        {allTickets.map((ticket, idx) => (
          <div key={`${ticket.id}-${idx}`} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center text-3xl flex-shrink-0">
                <CalendarDays className="w-7 h-7 text-primary-500" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-neutral-900">{ticket.event}</h3>
                    <p className="text-xs text-primary-600 font-medium mt-0.5">{ticket.ticket}</p>
                  </div>
                  <Badge className={ticket.status === "upcoming"
                    ? "bg-success-50 text-success-700 border-success-100 text-[10px]"
                    : ticket.status === "cancelled"
                    ? "bg-danger-50 text-danger-700 border-danger-100 text-[10px]"
                    : "bg-neutral-100 text-neutral-500 border-neutral-200 text-[10px]"
                  }>
                    {ticket.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-xs text-neutral-400">
                  <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{ticket.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ticket.venue}</span>
                </div>
                <p className="text-[10px] text-neutral-300 font-mono mt-1">{ticket.id}</p>
              </div>
            </div>

            {/* Actions bar */}
            <div className="flex items-center gap-2 px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex-wrap">
              <Button size="sm" variant="outline" className="h-8 text-xs border-neutral-200 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />View Ticket
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-neutral-200 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />Download PDF
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-neutral-200 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />Transfer
              </Button>
              {ticket.status === "upcoming" && ticket.slug && (
                <Link href={`/e/${ticket.slug}`} className="ml-auto text-xs text-primary-600 hover:underline flex items-center gap-1">
                  Event details <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
