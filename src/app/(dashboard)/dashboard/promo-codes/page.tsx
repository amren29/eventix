"use client";

import { useState } from "react";
import {
  Plus, Search, Copy, ToggleLeft, ToggleRight, Trash2,
  Tag, Percent, DollarSign, Calendar, MoreHorizontal, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const promoCodes = [
  { id: 1, code: "LAUNCH20", type: "percent", value: 20, event: "All Events", used: 48, limit: 100, active: true, expires: "Mar 31, 2026" },
  { id: 2, code: "VIPEARLY", type: "percent", value: 15, event: "Tech Summit 2026", used: 30, limit: 50, active: true, expires: "Mar 15, 2026" },
  { id: 3, code: "FREESHIP", type: "fixed", value: 500, event: "Music Fest KL", used: 20, limit: 200, active: true, expires: "Mar 20, 2026" },
  { id: 4, code: "STUDENT10", type: "percent", value: 10, event: "All Events", used: 65, limit: 150, active: false, expires: "Feb 28, 2026" },
  { id: 5, code: "PARTNER50", type: "fixed", value: 5000, event: "Startup Weekend", used: 8, limit: 20, active: true, expires: "Apr 01, 2026" },
];

export default function PromoCodesPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [codes, setCodes] = useState(promoCodes);
  const [copied, setCopied] = useState<number | null>(null);
  const [newCode, setNewCode] = useState({ code: "", type: "percent", value: "", limit: "", event: "All Events", expires: "" });

  const filtered = codes.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.event.toLowerCase().includes(search.toLowerCase())
  );

  function copyCode(id: number, code: string) {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function toggleActive(id: number) {
    setCodes(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  }

  function deleteCode(id: number) {
    setCodes(prev => prev.filter(c => c.id !== id));
  }

  function createCode() {
    if (!newCode.code) return;
    setCodes(prev => [...prev, {
      id: Date.now(),
      code: newCode.code.toUpperCase(),
      type: newCode.type as "percent" | "fixed",
      value: Number(newCode.value),
      event: newCode.event,
      used: 0,
      limit: Number(newCode.limit) || 999,
      active: true,
      expires: newCode.expires || "—",
    }]);
    setOpen(false);
    setNewCode({ code: "", type: "percent", value: "", limit: "", event: "All Events", expires: "" });
  }

  const totalUsed = codes.reduce((s, c) => s + c.used, 0);
  const activeCount = codes.filter(c => c.active).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Promo Codes</h1>
          <p className="text-neutral-500 mt-0.5">Create discount codes to boost ticket sales.</p>
        </div>
        <Button className="gradient-primary text-white gap-2" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" /> New Code
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Codes", value: codes.length, color: "text-neutral-900" },
          { label: "Active", value: activeCount, color: "text-success-600" },
          { label: "Total Redemptions", value: totalUsed, color: "text-primary-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 text-center">
            <p className={cn("text-2xl font-extrabold", s.color)}>{s.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input placeholder="Search codes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Code cards */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const usagePct = Math.round((c.used / c.limit) * 100);
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    c.type === "percent" ? "bg-primary-50" : "bg-success-50"
                  )}>
                    {c.type === "percent"
                      ? <Percent className="w-5 h-5 text-primary-600" />
                      : <DollarSign className="w-5 h-5 text-success-600" />
                    }
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-neutral-900 text-base tracking-wide">{c.code}</span>
                      <button
                        onClick={() => copyCode(c.id, c.code)}
                        className="text-neutral-400 hover:text-primary-600 transition-colors"
                        title="Copy code"
                      >
                        {copied === c.id ? <CheckCircle2 className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium border",
                        c.active ? "bg-success-50 text-success-700 border-success-200" : "bg-neutral-100 text-neutral-500 border-neutral-200"
                      )}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      {c.type === "percent" ? `${c.value}% off` : `RM ${(c.value / 100).toFixed(2)} off`}
                      {" · "}{c.event}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(c.id)} className="text-neutral-400 hover:text-primary-600 transition-colors">
                    {c.active ? <ToggleRight className="w-6 h-6 text-primary-600" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => copyCode(c.id, c.code)}>
                        <Copy className="w-4 h-4" /> Copy Code
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-danger-600" onClick={() => deleteCode(c.id)}>
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-neutral-50 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-neutral-400">Usage</p>
                  <p className="font-semibold text-neutral-700 mt-0.5">{c.used} / {c.limit}</p>
                  <div className="h-1 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                    <div className={cn("h-full rounded-full", usagePct >= 80 ? "bg-danger-500" : "bg-primary-500")} style={{ width: `${usagePct}%` }} />
                  </div>
                </div>
                <div>
                  <p className="text-neutral-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Expires</p>
                  <p className="font-semibold text-neutral-700 mt-0.5">{c.expires}</p>
                </div>
                <div>
                  <p className="text-neutral-400">Applied to</p>
                  <p className="font-semibold text-neutral-700 mt-0.5 truncate">{c.event}</p>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-neutral-400">
            <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-medium">No promo codes found</p>
            <p className="text-sm">Create your first discount code above</p>
          </div>
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Promo Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Input
                placeholder="e.g. SAVE20"
                value={newCode.code}
                onChange={e => setNewCode(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                className="font-mono tracking-wide"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={newCode.type} onValueChange={v => setNewCode(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>{newCode.type === "percent" ? "Discount %" : "Amount (RM)"}</Label>
                <Input
                  type="number"
                  placeholder={newCode.type === "percent" ? "20" : "10.00"}
                  value={newCode.value}
                  onChange={e => setNewCode(p => ({ ...p, value: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Usage Limit</Label>
                <Input type="number" placeholder="100" value={newCode.limit} onChange={e => setNewCode(p => ({ ...p, limit: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Expires</Label>
                <Input type="date" value={newCode.expires} onChange={e => setNewCode(p => ({ ...p, expires: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Apply to</Label>
              <Select value={newCode.event} onValueChange={v => setNewCode(p => ({ ...p, event: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Events">All Events</SelectItem>
                  <SelectItem value="Tech Summit 2026">Tech Summit 2026</SelectItem>
                  <SelectItem value="Music Fest KL">Music Fest KL</SelectItem>
                  <SelectItem value="Startup Weekend">Startup Weekend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="gradient-primary text-white" onClick={createCode}>Create Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
