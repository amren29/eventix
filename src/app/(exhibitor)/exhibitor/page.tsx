"use client";

import Link from "next/link";
import {
  Store, Users, Eye, MapPin, Calendar, ArrowUpRight,
  QrCode, Download, Star, TrendingUp, Clock, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Booth Visitors", value: "284", trend: "+12%", icon: Eye, color: "text-primary-600", bg: "bg-primary-50" },
  { label: "Leads Collected", value: "47", trend: "+8%", icon: Users, color: "text-success-600", bg: "bg-success-50" },
  { label: "Profile Views", value: "631", trend: "+24%", icon: Store, color: "text-accent-600", bg: "bg-accent-50" },
  { label: "Avg. Dwell Time", value: "4m 12s", trend: "+18%", icon: Clock, color: "text-warning-600", bg: "bg-warning-50" },
];

const recentLeads = [
  { name: "Ahmad Razif", company: "Nexus Solutions", email: "ahmad@nexus.io", time: "10 min ago", hot: true },
  { name: "Lisa Tan", company: "Byte Digital", email: "lisa@byte.io", time: "32 min ago", hot: true },
  { name: "Raj Kumar", company: "Startup Labs", email: "raj@startuplabs.io", time: "1h ago", hot: false },
  { name: "Farah Diyana", company: "Creative Hub", email: "farah@creative.io", time: "2h ago", hot: false },
];

const schedule = [
  { title: "Booth Setup", time: "8:00 AM – 9:00 AM", status: "done" },
  { title: "Event Opens – Meet Visitors", time: "9:00 AM – 12:00 PM", status: "active" },
  { title: "Lunch Break", time: "12:00 PM – 1:00 PM", status: "upcoming" },
  { title: "Afternoon Session", time: "1:00 PM – 5:00 PM", status: "upcoming" },
  { title: "Networking Cocktails", time: "5:00 PM – 7:00 PM", status: "upcoming" },
];

export default function ExhibitorOverviewPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Welcome back, TechGear Co. 👋</h1>
          <p className="text-neutral-500 mt-0.5">You're exhibiting at <span className="font-semibold text-primary-600">Tech Summit 2026</span> · Feb 28, 2026 · Hall B, Booth #14</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <QrCode className="w-4 h-4" /> My Booth QR
          </Button>
          <Button className="gradient-primary text-white gap-2">
            <Store className="w-4 h-4" /> Edit Booth
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-neutral-500">{s.label}</p>
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
            </div>
            <p className="text-xl font-extrabold text-neutral-900">{s.value}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3 text-success-500" />
              <span className="text-xs font-semibold text-success-600">{s.trend}</span>
              <span className="text-xs text-neutral-400">today</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900">Recent Leads</h3>
            <Link href="/exhibitor/leads" className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {recentLeads.map((lead) => (
              <div key={lead.email} className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-bold">
                    {lead.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 text-sm">{lead.name}</p>
                      {lead.hot && (
                        <span className="text-xs bg-danger-50 text-danger-600 border border-danger-200 px-1.5 py-0.5 rounded-full font-medium">🔥 Hot</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400">{lead.company} · {lead.email}</p>
                  </div>
                </div>
                <span className="text-xs text-neutral-400">{lead.time}</span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-neutral-50">
            <Button variant="outline" size="sm" className="gap-2 w-full">
              <Download className="w-4 h-4" /> Export All Leads
            </Button>
          </div>
        </div>

        {/* Today's schedule */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" /> Today's Schedule
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {schedule.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn("mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                  s.status === "done" ? "bg-success-100" :
                  s.status === "active" ? "bg-primary-600" : "bg-neutral-100"
                )}>
                  {s.status === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-success-600" />}
                  {s.status === "active" && <div className="w-2 h-2 bg-white rounded-full" />}
                  {s.status === "upcoming" && <div className="w-2 h-2 bg-neutral-400 rounded-full" />}
                </div>
                <div>
                  <p className={cn("text-sm font-medium",
                    s.status === "done" ? "text-neutral-400 line-through" :
                    s.status === "active" ? "text-primary-700" : "text-neutral-700"
                  )}>{s.title}</p>
                  <p className="text-xs text-neutral-400">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booth info card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">Booth Setup Status</h3>
            <p className="text-sm text-neutral-500">Your booth profile is 80% complete. Add a video and more products to attract more visitors.</p>
          </div>
          <Link href="/exhibitor/booth">
            <Button variant="outline" className="gap-2">
              <Store className="w-4 h-4" /> Complete Booth
            </Button>
          </Link>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
            <span>Profile completeness</span>
            <span className="font-semibold text-neutral-700">80%</span>
          </div>
          <Progress value={80} className="h-2" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
          {[
            { label: "Company Info", done: true },
            { label: "Logo & Banner", done: true },
            { label: "Products Listed", done: true },
            { label: "Intro Video", done: false },
          ].map(item => (
            <div key={item.label} className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border",
              item.done ? "bg-success-50 border-success-200 text-success-700" : "bg-neutral-50 border-neutral-200 text-neutral-500"
            )}>
              <CheckCircle2 className={cn("w-3.5 h-3.5 flex-shrink-0", item.done ? "text-success-500" : "text-neutral-300")} />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
