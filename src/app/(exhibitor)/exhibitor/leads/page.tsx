"use client";

import { useState } from "react";
import {
  Search, Download, Star, StarOff, Mail, Phone,
  MoreHorizontal, Flame, MessageSquare, Tag, SlidersHorizontal,
  Users, TrendingUp, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type LeadScore = "hot" | "warm" | "cold";

const initLeads = [
  { id: 1, name: "Ahmad Razif", company: "Nexus Solutions", title: "CTO", email: "ahmad@nexus.io", phone: "+60 12-111 2222", score: "hot" as LeadScore, tags: ["Decision Maker", "Enterprise"], notes: "Very interested in SmartHub. Follow up by Monday.", time: "10:24 AM", starred: true },
  { id: 2, name: "Lisa Tan", company: "Byte Digital", title: "Head of IT", email: "lisa@byte.io", phone: "+60 16-333 4444", score: "hot" as LeadScore, tags: ["IT Manager"], notes: "Wants a product demo next week.", time: "10:55 AM", starred: true },
  { id: 3, name: "Raj Kumar", company: "Startup Labs", title: "Founder", email: "raj@startuplabs.io", phone: "+60 11-555 6666", score: "warm" as LeadScore, tags: ["SME", "Startup"], notes: "Budget constrained but interested.", time: "11:30 AM", starred: false },
  { id: 4, name: "Farah Diyana", company: "Creative Hub", title: "Operations Manager", email: "farah@creative.io", phone: "+60 13-777 8888", score: "warm" as LeadScore, tags: ["SME"], notes: "", time: "12:10 PM", starred: false },
  { id: 5, name: "Kevin Lim", company: "RetailCo", title: "Procurement", email: "kevin@retailco.io", phone: "+60 17-999 0000", score: "cold" as LeadScore, tags: ["Retail"], notes: "Just browsing.", time: "2:00 PM", starred: false },
  { id: 6, name: "Nurul Aina", company: "Gov Agency X", title: "IT Director", email: "nurul@govx.my", phone: "+60 3-1234 5678", score: "hot" as LeadScore, tags: ["Government", "Decision Maker"], notes: "Interested in volume licensing.", time: "3:15 PM", starred: false },
];

const scoreConfig = {
  hot: { label: "Hot", icon: Flame, color: "text-danger-600", bg: "bg-danger-50", border: "border-danger-200" },
  warm: { label: "Warm", icon: TrendingUp, color: "text-warning-600", bg: "bg-warning-50", border: "border-warning-200" },
  cold: { label: "Cold", icon: Users, color: "text-neutral-500", bg: "bg-neutral-100", border: "border-neutral-200" },
} as const;

export default function LeadsPage() {
  const [leads, setLeads] = useState(initLeads);
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchScore = scoreFilter === "all" || l.score === scoreFilter;
    return matchSearch && matchScore;
  });

  function toggleStar(id: number) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, starred: !l.starred } : l));
  }

  const hot = leads.filter(l => l.score === "hot").length;
  const warm = leads.filter(l => l.score === "warm").length;
  const cold = leads.filter(l => l.score === "cold").length;

  const detail = selected != null ? leads.find(l => l.id === selected) : null;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Leads</h1>
          <p className="text-neutral-500 mt-0.5">{leads.length} contacts captured at your booth today.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Score summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { title: "Hot Leads", count: hot, ...scoreConfig.hot },
          { title: "Warm Leads", count: warm, ...scoreConfig.warm },
          { title: "Cold Leads", count: cold, ...scoreConfig.cold },
        ].map(s => (
          <button
            key={s.title}
            onClick={() => setScoreFilter(scoreFilter === s.title.split(" ")[0].toLowerCase() ? "all" : s.title.split(" ")[0].toLowerCase())}
            className={cn("bg-white rounded-2xl border shadow-sm p-4 text-left hover:shadow-md transition-all", s.border)}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
              <p className="text-xs font-medium text-neutral-500">{s.title}</p>
            </div>
            <p className={cn("text-2xl font-extrabold", s.color)}>{s.count}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.map((l) => {
            const sc = scoreConfig[l.score];
            const isSelected = selected === l.id;
            return (
              <div
                key={l.id}
                onClick={() => setSelected(isSelected ? null : l.id)}
                className={cn(
                  "bg-white rounded-2xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all",
                  isSelected ? "border-primary-300 ring-1 ring-primary-200" : "border-neutral-100"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary-100 text-primary-700 font-bold">
                        {l.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-neutral-900 truncate">{l.name}</p>
                        <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", sc.color, sc.bg, sc.border)}>
                          <sc.icon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{l.title} · {l.company}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {l.tags.map(tag => (
                          <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); toggleStar(l.id); }} className="text-neutral-300 hover:text-warning-400 transition-colors">
                      {l.starred ? <Star className="w-4 h-4 text-warning-400" /> : <Star className="w-4 h-4" />}
                    </button>
                    <span className="text-xs text-neutral-400 ml-1">{l.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {detail && (
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sticky top-24 space-y-4">
              <div className="text-center">
                <Avatar className="w-14 h-14 mx-auto mb-2">
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-lg font-bold">
                    {detail.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-bold text-neutral-900">{detail.name}</p>
                <p className="text-sm text-neutral-500">{detail.title}</p>
                <p className="text-sm font-medium text-primary-600">{detail.company}</p>
              </div>

              <div className="space-y-2 text-sm">
                <a href={`mailto:${detail.email}`} className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  {detail.email}
                </a>
                <a href={`tel:${detail.phone}`} className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  {detail.phone}
                </a>
              </div>

              {detail.notes && (
                <div className="bg-warning-50 border border-warning-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-warning-700 mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Notes
                  </p>
                  <p className="text-xs text-warning-700">{detail.notes}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button className="gradient-primary text-white gap-2 w-full" size="sm">
                  <Mail className="w-4 h-4" /> Send Follow-Up
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Tag className="w-4 h-4" /> Add Note
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
