"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, CheckCircle2, Clock, UserCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticket: string;
  order: string;
  checkedIn: boolean;
  checkedAt?: string;
}

export default function SearchPage({ params }: { params: { eventId: string } }) {
  const [query, setQuery] = useState("");
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [justCheckedIn, setJustCheckedIn] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("order_tickets")
        .select(`
          id,
          attendee_name,
          attendee_email,
          checked_in_at,
          order:orders!inner(
            reference,
            event_id
          ),
          ticket_type:ticket_types(name)
        `)
        .eq("orders.event_id", params.eventId);

      const mapped: Attendee[] = (data || []).map((t: any) => ({
        id: t.id,
        name: t.attendee_name || "Unknown",
        email: t.attendee_email || "",
        ticket: t.ticket_type?.name || "Ticket",
        order: t.order?.reference || "",
        checkedIn: !!t.checked_in_at,
        checkedAt: t.checked_in_at
          ? new Date(t.checked_in_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : undefined,
      }));

      setAttendees(mapped);
      setLoading(false);
    }
    load();
  }, [params.eventId]);

  const filtered = query.length >= 2
    ? attendees.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.email.toLowerCase().includes(query.toLowerCase()) ||
        a.order.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  async function checkIn(attendeeId: string) {
    const supabase = createClient();
    const now = new Date().toISOString();

    const { error } = await supabase
      .from("order_tickets")
      .update({ checked_in_at: now })
      .eq("id", attendeeId);

    if (error) {
      console.error("Check-in failed:", error);
      return;
    }

    setAttendees((prev) => prev.map((a) =>
      a.id === attendeeId
        ? { ...a, checkedIn: true, checkedAt: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }
        : a
    ));
    setJustCheckedIn(attendeeId);
    setTimeout(() => setJustCheckedIn(null), 2000);
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 flex-shrink-0">
        <Link href={`/checkin/${params.eventId}/scan`} className="text-neutral-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            autoFocus
            placeholder="Search name, email, or order ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 bg-white/10 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-primary-500 focus-visible:border-primary-500 rounded-xl"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader2 className="w-8 h-8 text-neutral-500 animate-spin" />
            <p className="text-neutral-500 text-sm">Loading attendees...</p>
          </div>
        )}

        {!loading && query.length < 2 && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Search className="w-10 h-10 text-neutral-700" />
            <p className="text-neutral-500 text-sm">Type at least 2 characters to search</p>
          </div>
        )}

        {!loading && query.length >= 2 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <p className="text-neutral-500 text-sm">No attendees found for &quot;{query}&quot;</p>
          </div>
        )}

        {filtered.map((attendee) => (
          <div
            key={attendee.id}
            className={cn(
              "flex items-center gap-3 px-4 py-4 border-b border-white/5 transition-colors",
              justCheckedIn === attendee.id ? "bg-success-500/10" : "hover:bg-white/5"
            )}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary-600/30 flex items-center justify-center text-sm font-bold text-primary-300 flex-shrink-0">
              {attendee.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{attendee.name}</p>
              <p className="text-neutral-500 text-xs truncate">{attendee.email}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-neutral-600">{attendee.ticket}</span>
                <span className="text-neutral-700">·</span>
                <span className="text-xs font-mono text-neutral-600">{attendee.order}</span>
              </div>
            </div>

            {/* Status / Action */}
            {attendee.checkedIn ? (
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success-400" />
                  <span className="text-success-400 text-xs font-semibold">Done</span>
                </div>
                {attendee.checkedAt && (
                  <span className="text-neutral-600 text-[10px] flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />{attendee.checkedAt}
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={() => checkIn(attendee.id)}
                className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all flex-shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Check In
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
