import Link from "next/link";
import { Download, Send, ArrowRight, CalendarDays, MapPin, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TICKETS = [
  {
    id: "EVT-2026-00842",
    event: "Tech Summit KL 2026",
    date: "Sat, Mar 15, 2026 · 2:00 PM",
    venue: "Axiata Arena, Kuala Lumpur",
    ticket: "General Admission",
    status: "upcoming",
    emoji: "🏢",
  },
  {
    id: "EVT-2026-01103",
    event: "Bass Nation Festival",
    date: "Fri, Apr 5, 2026 · 8:00 PM",
    venue: "Stadium Merdeka, KL",
    ticket: "VIP Package",
    status: "upcoming",
    emoji: "🎵",
  },
  {
    id: "EVT-2025-00512",
    event: "DevSummit Malaysia 2025",
    date: "Sat, Dec 7, 2025 · 9:00 AM",
    venue: "Connexion, Bangsar South",
    ticket: "General Admission",
    status: "past",
    emoji: "💻",
  },
];

export default function MyTicketsPage() {
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
        {TICKETS.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              {/* Emoji banner */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center text-3xl flex-shrink-0">
                {ticket.emoji}
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
              {ticket.status === "upcoming" && (
                <Link href={`/e/tech-summit-kl-2026`} className="ml-auto text-xs text-primary-600 hover:underline flex items-center gap-1">
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
