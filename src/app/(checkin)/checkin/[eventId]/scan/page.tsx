"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Search, MoreVertical,
  CheckCircle2, XCircle, AlertTriangle, Scan,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type ScanState = "idle" | "scanning" | "success" | "duplicate" | "invalid";

interface ScanResult {
  state: ScanState;
  name: string;
  ticket: string;
  order: string;
  time?: string;
}

export default function ScanPage({ params }: { params: { eventId: string } }) {
  const searchParams = useSearchParams();
  const gateName = searchParams.get("gateName") ?? "Main Entry";

  const [scanState, setScanState] = useState<ScanState>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [checkedIn, setCheckedIn] = useState(0);
  const [total, setTotal] = useState(0);
  const [scanIndex, setScanIndex] = useState(0);
  const [allTickets, setAllTickets] = useState<any[]>([]);

  // Load all order_tickets for this event on mount
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("order_tickets")
        .select(`
          id,
          qr_code,
          attendee_name,
          checked_in_at,
          order:orders!inner(
            reference,
            event_id
          ),
          ticket_type:ticket_types(name)
        `)
        .eq("orders.event_id", params.eventId);

      const tickets = data || [];
      setAllTickets(tickets);
      setTotal(tickets.length);
      setCheckedIn(tickets.filter((t: any) => !!t.checked_in_at).length);
    }
    load();
  }, [params.eventId]);

  // Reset idle after showing result
  useEffect(() => {
    if (scanState === "success" || scanState === "duplicate" || scanState === "invalid") {
      const t = setTimeout(() => { setScanState("idle"); setResult(null); }, 2800);
      return () => clearTimeout(t);
    }
  }, [scanState]);

  async function simulateScan() {
    setScanState("scanning");

    setTimeout(async () => {
      // Cycle through tickets to simulate scanning; if no tickets, show invalid
      if (allTickets.length === 0) {
        setResult({ state: "invalid", name: "", ticket: "", order: "" });
        setScanState("invalid");
        return;
      }

      const ticket = allTickets[scanIndex % allTickets.length];
      setScanIndex((i) => i + 1);

      const qrCode = ticket.qr_code;

      // Look up the ticket by qr_code and validate it belongs to this event
      const supabase = createClient();
      const { data: found } = await supabase
        .from("order_tickets")
        .select(`
          id,
          qr_code,
          attendee_name,
          checked_in_at,
          order:orders!inner(
            reference,
            event_id
          ),
          ticket_type:ticket_types(name)
        `)
        .eq("qr_code", qrCode)
        .eq("orders.event_id", params.eventId)
        .single();

      if (!found) {
        setResult({ state: "invalid", name: "", ticket: "", order: "" });
        setScanState("invalid");
        return;
      }

      // Already checked in?
      if (found.checked_in_at) {
        const checkedTime = new Date(found.checked_in_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        setResult({
          state: "duplicate",
          name: found.attendee_name || "Unknown",
          ticket: (found as any).ticket_type?.name || "Ticket",
          order: (found as any).order?.reference || "",
          time: checkedTime,
        });
        setScanState("duplicate");
        return;
      }

      // Mark as checked in
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("order_tickets")
        .update({ checked_in_at: now, checked_in_gate: gateName })
        .eq("id", found.id);

      if (error) {
        console.error("Check-in failed:", error);
        setResult({ state: "invalid", name: "", ticket: "", order: "" });
        setScanState("invalid");
        return;
      }

      // Update local state
      setAllTickets((prev) => prev.map((t: any) => t.id === found.id ? { ...t, checked_in_at: now } : t));
      setCheckedIn((n) => n + 1);

      setResult({
        state: "success",
        name: found.attendee_name || "Unknown",
        ticket: (found as any).ticket_type?.name || "Ticket",
        order: (found as any).order?.reference || "",
      });
      setScanState("success");
    }, 600);
  }

  const pct = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col select-none">
      {/* Topbar */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 flex-shrink-0">
        <Link href={`/checkin/${params.eventId}/gate`} className="flex items-center gap-2 text-neutral-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="text-center">
          <p className="text-white text-sm font-semibold">SCAN TICKET</p>
          <p className="text-neutral-500 text-xs">{gateName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/checkin/${params.eventId}/search`} className="text-neutral-400 hover:text-white">
            <Search className="w-4 h-4" />
          </Link>
          <button className="text-neutral-400 hover:text-white">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scanner */}
      <div className="flex-1 flex flex-col items-center justify-between py-6 px-4">
        {/* Viewfinder */}
        <div className="relative w-full max-w-xs aspect-square">
          {/* Overlay frame */}
          <div
            onClick={simulateScan}
            className={cn(
              "w-full h-full rounded-3xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden",
              scanState === "idle" || scanState === "scanning"
                ? "border-white/20 bg-black"
                : scanState === "success"
                ? "border-success-500 bg-success-500/10"
                : scanState === "duplicate"
                ? "border-warning-500 bg-warning-500/10"
                : "border-danger-500 bg-danger-500/10"
            )}
          >
            {/* Camera simulation */}
            {(scanState === "idle" || scanState === "scanning") && (
              <>
                {/* Dark camera bg */}
                <div className="absolute inset-0 bg-neutral-900" />
                {/* Scanning line animation */}
                {scanState === "scanning" && (
                  <div className="absolute left-4 right-4 h-0.5 bg-primary-500 shadow-lg shadow-primary-500/50 animate-[scanline_0.6s_ease-in-out]" />
                )}
                {/* Corner markers */}
                {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
                  <div key={i} className={cn("absolute w-8 h-8 border-white/60", pos,
                    i === 0 ? "border-t-2 border-l-2 rounded-tl-xl" :
                    i === 1 ? "border-t-2 border-r-2 rounded-tr-xl" :
                    i === 2 ? "border-b-2 border-l-2 rounded-bl-xl" :
                              "border-b-2 border-r-2 rounded-br-xl"
                  )} />
                ))}
                {/* Center QR placeholder */}
                <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                  <Scan className={cn("w-12 h-12 transition-colors", scanState === "scanning" ? "text-primary-400 animate-pulse" : "text-neutral-600")} />
                  <p className="text-neutral-500 text-xs">
                    {scanState === "scanning" ? "Scanning..." : "Tap to simulate scan"}
                  </p>
                </div>
              </>
            )}

            {/* Result states */}
            {scanState === "success" && result && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                <CheckCircle2 className="w-16 h-16 text-success-400 animate-[bounce_0.4s_ease-out]" />
                <p className="text-2xl font-extrabold text-success-400">ADMITTED</p>
                <p className="text-white font-semibold mt-1">{result.name}</p>
                <p className="text-neutral-400 text-sm">{result.ticket}</p>
                <p className="text-neutral-600 text-xs font-mono mt-1">{result.order}</p>
              </div>
            )}

            {scanState === "duplicate" && result && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                <AlertTriangle className="w-14 h-14 text-warning-400" />
                <p className="text-xl font-extrabold text-warning-400">ALREADY CHECKED IN</p>
                <p className="text-white font-semibold mt-1">{result.name}</p>
                <p className="text-neutral-400 text-sm">{result.ticket}</p>
                <p className="text-warning-500/70 text-xs mt-1">Entered at {result.time}</p>
              </div>
            )}

            {scanState === "invalid" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                <XCircle className="w-14 h-14 text-danger-400" />
                <p className="text-xl font-extrabold text-danger-400">INVALID TICKET</p>
                <p className="text-neutral-400 text-sm mt-1">This QR code is not valid for this event.</p>
              </div>
            )}
          </div>
        </div>

        {/* Hint */}
        <p className="text-neutral-600 text-xs text-center mt-2">
          {scanState === "idle" ? "Point camera at attendee's QR code" : ""}
        </p>

        {/* Progress card */}
        <div className="w-full max-w-xs bg-white/5 border border-white/10 rounded-2xl p-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-400 text-sm">Today: <span className="text-white font-bold">{checkedIn} checked in</span></span>
            <span className="text-neutral-500 text-xs">{pct}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: "linear-gradient(to right, #4f46e5, #7c3aed)" }}
            />
          </div>
          <p className="text-neutral-600 text-xs mt-1.5">{total} registered · {total - checkedIn} remaining</p>
        </div>

        {/* Manual search shortcut */}
        <Link
          href={`/checkin/${params.eventId}/search`}
          className="mt-4 w-full max-w-xs flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl text-neutral-400 text-sm hover:border-primary-500/40 hover:text-primary-300 transition-all"
        >
          <Search className="w-4 h-4" />
          Search by name or order ID
        </Link>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0%   { top: 1rem; }
          50%  { top: calc(100% - 1rem); }
          100% { top: 1rem; }
        }
      `}</style>
    </div>
  );
}
