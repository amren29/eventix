"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wifi, WifiOff, Users, ChevronRight, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const EVENT = { name: "Tech Summit KL 2026", date: "Sat, Mar 15 · 2:00 PM", sold: 842 };

const GATES = [
  { id: "main",  name: "Main Entry",   icon: "🚪", capacity: 500, staff: 2,  active: true },
  { id: "vip",   name: "VIP Entrance", icon: "⭐", capacity: 200, staff: 1,  active: true },
  { id: "sideA", name: "Side Gate A",  icon: "🚪", capacity: 300, staff: 0,  active: false },
];

export default function GateSelectionPage({ params }: { params: { eventId: string } }) {
  const [online, setOnline] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <Link href="/checkin" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>
        <button onClick={() => setOnline(!online)} className="flex items-center gap-1.5 text-xs">
          {online
            ? <><Wifi className="w-3.5 h-3.5 text-success-400" /><span className="text-success-400 font-medium">Online</span></>
            : <><WifiOff className="w-3.5 h-3.5 text-warning-400" /><span className="text-warning-400 font-medium">Offline</span></>
          }
        </button>
      </div>

      <div className="flex-1 flex flex-col p-5">
        {/* Event info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <p className="font-bold text-white text-lg">{EVENT.name}</p>
          <p className="text-neutral-400 text-sm mt-0.5">{EVENT.date}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Users className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-sm text-primary-300 font-medium">{EVENT.sold} registered attendees</span>
          </div>
        </div>

        {/* Gate heading */}
        <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-3">Select your gate</p>

        {/* Gate list */}
        <div className="space-y-3">
          {GATES.map((gate) => (
            gate.active ? (
              <Link
                key={gate.id}
                href={`/checkin/${params.eventId}/scan?gate=${gate.id}&gateName=${encodeURIComponent(gate.name)}`}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-primary-600/10 rounded-2xl transition-all group"
              >
                <span className="text-3xl">{gate.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{gate.name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{gate.staff} staff · capacity {gate.capacity}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-primary-400 transition-colors" />
              </Link>
            ) : (
              <div key={gate.id} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl opacity-50">
                <span className="text-3xl">{gate.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-neutral-500">{gate.name}</p>
                  <p className="text-xs text-neutral-600 mt-0.5">Inactive · {gate.staff} staff assigned</p>
                </div>
                <span className="text-xs text-neutral-600 bg-white/5 px-2 py-1 rounded-lg">Inactive</span>
              </div>
            )
          ))}
        </div>

        {/* Offline note */}
        {!online && (
          <div className="mt-6 p-4 bg-warning-500/10 border border-warning-500/20 rounded-2xl flex items-start gap-3">
            <WifiOff className="w-4 h-4 text-warning-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-warning-300 text-sm font-medium">Working offline</p>
              <p className="text-warning-400/70 text-xs mt-0.5">Attendee list cached. Check-ins will sync when back online.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
