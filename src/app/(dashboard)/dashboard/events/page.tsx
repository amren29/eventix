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

const events = [
  {
    id: "1",
    name: "Tech Summit KL 2026",
    banner: null,
    date: "Sat, Mar 15, 2026 · 2:00 PM",
    venue: "Axiata Arena, Kuala Lumpur",
    status: "published",
    sold: 842, total: 1000,
    revenue: "$12,450",
    category: "Conference",
  },
  {
    id: "2",
    name: "Bass Nation Festival",
    banner: null,
    date: "Fri, Apr 5, 2026 · 8:00 PM",
    venue: "Stadium Merdeka, KL",
    status: "published",
    sold: 234, total: 500,
    revenue: "$8,190",
    category: "Music",
  },
  {
    id: "3",
    name: "Design Thinking Workshop #4",
    banner: null,
    date: "Sun, Mar 22, 2026 · 10:00 AM",
    venue: "Online (Zoom)",
    status: "draft",
    sold: 0, total: 40,
    revenue: "$0",
    category: "Education",
  },
  {
    id: "4",
    name: "Startup Weekend KL",
    banner: null,
    date: "Fri, May 2, 2026 · 6:00 PM",
    venue: "Common Ground, KL",
    status: "published",
    sold: 58, total: 120,
    revenue: "$2,900",
    category: "Business",
  },
  {
    id: "5",
    name: "DevSummit Malaysia 2025",
    banner: null,
    date: "Sat, Dec 7, 2025 · 9:00 AM",
    venue: "Connexion, Bangsar South",
    status: "past",
    sold: 380, total: 380,
    revenue: "$9,500",
    category: "Conference",
  },
];

const statusStyle: Record<string, string> = {
  published: "bg-success-50 text-success-700 border-success-100",
  draft:     "bg-neutral-100 text-neutral-500 border-neutral-200",
  past:      "bg-neutral-100 text-neutral-400 border-neutral-200",
  cancelled: "bg-danger-50 text-danger-600 border-danger-100",
};

export default function EventsPage() {
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
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 p-5">
              {/* Thumbnail */}
              <div className="w-20 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex-shrink-0 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-primary-400" />
              </div>

              {/* Info */}
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

                {/* Progress bar */}
                <div className="flex items-center gap-3 max-w-xs">
                  <Progress
                    value={(event.sold / event.total) * 100}
                    className="h-1.5 flex-1 bg-neutral-100 [&>div]:gradient-primary"
                  />
                  <span className="text-[11px] text-neutral-400 flex-shrink-0 w-8 text-right">
                    {Math.round((event.sold / event.total) * 100)}%
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" className="h-8 text-xs border-neutral-200" asChild>
                  <Link href={`/dashboard/events/${event.id}`}>
                    <Edit className="w-3.5 h-3.5 mr-1.5" />Manage
                  </Link>
                </Button>
                {event.status === "published" && (
                  <Button size="sm" className="h-8 text-xs bg-success-500 hover:bg-success-600 text-white border-0" asChild>
                    <Link href={`/dashboard/events/${event.id}/check-in`}>
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
                      <Link href={`/e/${event.id}`} className="flex items-center gap-2">
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
