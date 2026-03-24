"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle2, Users, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schedule = [
  {
    id: 1, time: "8:00 AM", duration: "1 hour", title: "Booth Setup & Registration",
    location: "Hall B, Booth #14", type: "setup", status: "done",
    desc: "Set up display materials, product demos, and collect exhibitor badge.",
  },
  {
    id: 2, time: "9:00 AM", duration: "3 hours", title: "Morning Exhibition Floor Open",
    location: "Hall B", type: "exhibition", status: "active",
    desc: "Main exhibition floor opens. Peak visitor traffic expected. Ensure all demos are running.",
  },
  {
    id: 3, time: "10:30 AM", duration: "1 hour", title: "Keynote: Future of Smart Workspaces",
    location: "Main Stage – Auditorium A", type: "session", status: "active",
    desc: "Recommended session for your product category. Attendees will be looking for related solutions.",
  },
  {
    id: 4, time: "12:00 PM", duration: "1 hour", title: "Lunch Break",
    location: "Level 2 Cafeteria", type: "break", status: "upcoming",
    desc: "Scheduled lunch break. Booth is expected to remain staffed.",
  },
  {
    id: 5, time: "1:00 PM", duration: "2 hours", title: "Afternoon Exhibition Floor",
    location: "Hall B", type: "exhibition", status: "upcoming",
    desc: "Second peak traffic window. Prepare for afternoon visitors.",
  },
  {
    id: 6, time: "2:30 PM", duration: "45 min", title: "Panel: IoT in Enterprise — Join the Discussion",
    location: "Stage B – Conference Room 3", type: "session", status: "upcoming",
    desc: "You are registered as a panelist. Please arrive 15 minutes early for mic setup.",
    panelist: true,
  },
  {
    id: 7, time: "5:00 PM", duration: "2 hours", title: "Networking Cocktail Reception",
    location: "Rooftop — Level 6", type: "networking", status: "upcoming",
    desc: "Great opportunity to follow up with leads and meet potential partners.",
  },
  {
    id: 8, time: "7:00 PM", duration: "30 min", title: "Booth Pack-Down",
    location: "Hall B, Booth #14", type: "setup", status: "upcoming",
    desc: "Remove display materials. Return borrowed furniture to organizer.",
  },
];

const typeConfig = {
  setup: { color: "text-neutral-600", bg: "bg-neutral-100", label: "Setup" },
  exhibition: { color: "text-primary-600", bg: "bg-primary-50", label: "Exhibition" },
  session: { color: "text-accent-600", bg: "bg-accent-50", label: "Session" },
  break: { color: "text-warning-600", bg: "bg-warning-50", label: "Break" },
  networking: { color: "text-success-600", bg: "bg-success-50", label: "Networking" },
} as const;

type EventType = keyof typeof typeConfig;

export default function SchedulePage() {
  const [filter, setFilter] = useState<"all" | EventType>("all");

  const filtered = filter === "all" ? schedule : schedule.filter(s => s.type === filter);

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Event Schedule</h1>
        <p className="text-neutral-500 mt-0.5">Your full itinerary for <span className="font-semibold text-primary-600">Tech Summit 2026 · Feb 28, 2026</span></p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {(["all", "exhibition", "session", "networking", "break", "setup"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "text-sm font-medium px-3 py-1.5 rounded-full border transition-all capitalize",
              filter === t
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
            )}
          >
            {t === "all" ? "All" : typeConfig[t].label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-neutral-200" />
        <div className="space-y-4">
          {filtered.map((item) => {
            const tc = typeConfig[item.type as EventType];
            return (
              <div key={item.id} className="flex gap-4 relative">
                {/* Timeline dot */}
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2",
                  item.status === "done" ? "bg-success-100 border-success-300" :
                  item.status === "active" ? "bg-primary-600 border-primary-600" : "bg-white border-neutral-200"
                )}>
                  {item.status === "done"
                    ? <CheckCircle2 className="w-5 h-5 text-success-600" />
                    : item.status === "active"
                    ? <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    : <Clock className="w-4 h-4 text-neutral-400" />
                  }
                </div>

                {/* Card */}
                <div className={cn(
                  "flex-1 bg-white rounded-2xl border shadow-sm p-4 mb-1",
                  item.status === "done" ? "opacity-60" : "",
                  item.status === "active" ? "border-primary-200 ring-1 ring-primary-100" : "border-neutral-100"
                )}>
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", tc.color, tc.bg)}>{tc.label}</span>
                        {item.panelist && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning-50 text-warning-700 border border-warning-200 flex items-center gap-1">
                            <Star className="w-3 h-3" /> Panelist
                          </span>
                        )}
                        {item.status === "active" && (
                          <span className="text-xs font-bold text-primary-700 animate-pulse">● LIVE NOW</span>
                        )}
                      </div>
                      <p className="font-semibold text-neutral-900">{item.title}</p>
                      <p className="text-sm text-neutral-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.time} · {item.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {item.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
