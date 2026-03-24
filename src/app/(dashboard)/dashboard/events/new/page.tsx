"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, Info,
  Upload, Plus, Trash2, Globe, Lock, EyeOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Date & Venue" },
  { id: 3, label: "Tickets" },
  { id: 4, label: "Customize" },
  { id: 5, label: "Publish" },
];

const CATEGORIES = [
  "Conference", "Music", "Festival", "Workshop", "Sports",
  "Arts & Culture", "Food & Drink", "Virtual", "Education", "Business",
];

// ─── Step components ────────────────────────────────────────────────────────

function StepBasicInfo() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-sm font-medium text-neutral-700">
          Event Name <span className="text-danger-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Tech Summit KL 2026"
          className="h-11 border-neutral-200 focus-visible:ring-primary-500"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">
            Category <span className="text-danger-500">*</span>
          </Label>
          <Select>
            <SelectTrigger className="h-11 border-neutral-200">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tags" className="text-sm font-medium text-neutral-700">Tags</Label>
          <Input
            id="tags"
            placeholder="tech, networking, 2026 (comma separated)"
            className="h-11 border-neutral-200"
          />
        </div>
      </div>

      {/* Banner upload */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-neutral-700">
          Event Banner <span className="text-danger-500">*</span>
        </Label>
        <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-10 text-center hover:border-primary-300 hover:bg-primary-50/20 transition-colors cursor-pointer group">
          <Upload className="w-8 h-8 text-neutral-300 mx-auto mb-3 group-hover:text-primary-400 transition-colors" />
          <p className="text-sm font-medium text-neutral-500">Drag & drop your banner here</p>
          <p className="text-xs text-neutral-400 mt-1">or <span className="text-primary-600 font-medium">click to browse</span></p>
          <p className="text-xs text-neutral-300 mt-2">Recommended: 1920×1080px · Max 5MB · JPG, PNG, WEBP</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-sm font-medium text-neutral-700">
            Description <span className="text-danger-500">*</span>
          </Label>
          <button className="text-xs font-medium text-primary-600 hover:underline flex items-center gap-1">
            ✨ Generate with AI
          </button>
        </div>
        <Textarea
          id="description"
          placeholder="Write a compelling event description that gets people excited to attend..."
          className="min-h-40 border-neutral-200 focus-visible:ring-primary-500 resize-none"
        />
        <p className="text-xs text-neutral-400">Supports Markdown formatting.</p>
      </div>
    </div>
  );
}

function StepDateVenue() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="start-date" className="text-sm font-medium text-neutral-700">
            Start Date & Time <span className="text-danger-500">*</span>
          </Label>
          <Input id="start-date" type="datetime-local" className="h-11 border-neutral-200" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end-date" className="text-sm font-medium text-neutral-700">
            End Date & Time <span className="text-danger-500">*</span>
          </Label>
          <Input id="end-date" type="datetime-local" className="h-11 border-neutral-200" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-neutral-700">Timezone</Label>
        <Select defaultValue="asia-kl">
          <SelectTrigger className="h-11 border-neutral-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asia-kl">Asia/Kuala_Lumpur (GMT+8)</SelectItem>
            <SelectItem value="asia-sg">Asia/Singapore (GMT+8)</SelectItem>
            <SelectItem value="utc">UTC</SelectItem>
            <SelectItem value="america-ny">America/New_York (GMT-5)</SelectItem>
            <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Online toggle */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="online"
          checked={isOnline}
          onCheckedChange={(v) => setIsOnline(!!v)}
          className="border-neutral-300 data-[state=checked]:bg-primary-600"
        />
        <Label htmlFor="online" className="text-sm font-medium text-neutral-700 cursor-pointer">
          This is an online / virtual event
        </Label>
      </div>

      {isOnline ? (
        <div className="space-y-1.5">
          <Label htmlFor="meeting-link" className="text-sm font-medium text-neutral-700">
            Meeting Link
          </Label>
          <Input
            id="meeting-link"
            placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            className="h-11 border-neutral-200"
          />
          <p className="text-xs text-neutral-400">This link will be sent to attendees after purchase.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="venue-name" className="text-sm font-medium text-neutral-700">
              Venue Name <span className="text-danger-500">*</span>
            </Label>
            <Input id="venue-name" placeholder="e.g. Axiata Arena" className="h-11 border-neutral-200" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="venue-address" className="text-sm font-medium text-neutral-700">Address</Label>
            <Input id="venue-address" placeholder="Full address" className="h-11 border-neutral-200" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-sm font-medium text-neutral-700">City</Label>
              <Input id="city" placeholder="Kuala Lumpur" className="h-11 border-neutral-200" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-sm font-medium text-neutral-700">Country</Label>
              <Input id="country" placeholder="Malaysia" className="h-11 border-neutral-200" />
            </div>
          </div>
          {/* Map placeholder */}
          <div className="h-40 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
            <p className="text-sm text-neutral-400">📍 Map preview will appear after address is entered</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface TicketType {
  id: string;
  name: string;
  priceType: "paid" | "free";
  price: string;
  quantity: string;
  unlimited: boolean;
}

function StepTickets() {
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: "1", name: "General Admission", priceType: "paid", price: "25", quantity: "500", unlimited: false },
  ]);

  const addTicket = () => {
    setTickets([...tickets, {
      id: String(Date.now()),
      name: "", priceType: "paid", price: "", quantity: "", unlimited: false,
    }]);
  };

  const removeTicket = (id: string) => setTickets(tickets.filter((t) => t.id !== id));

  const updateTicket = (id: string, field: keyof TicketType, value: any) => {
    setTickets(tickets.map((t) => t.id === id ? { ...t, [field]: value } : t));
  };

  return (
    <div className="space-y-4">
      {tickets.map((ticket, idx) => (
        <div key={ticket.id} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-neutral-700">Ticket Type #{idx + 1}</p>
            {tickets.length > 1 && (
              <button onClick={() => removeTicket(ticket.id)} className="text-neutral-400 hover:text-danger-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-neutral-600">Ticket Name *</Label>
              <Input
                value={ticket.name}
                onChange={(e) => updateTicket(ticket.id, "name", e.target.value)}
                placeholder="e.g. General Admission"
                className="h-9 text-sm border-neutral-200 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-neutral-600">Type</Label>
              <div className="flex gap-2">
                {(["paid", "free"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateTicket(ticket.id, "priceType", type)}
                    className={cn(
                      "flex-1 h-9 rounded-lg text-xs font-medium border transition-all capitalize",
                      ticket.priceType === type
                        ? "gradient-primary text-white border-0 shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-primary-300"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {ticket.priceType === "paid" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-neutral-600">Price (USD) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                  <Input
                    value={ticket.price}
                    onChange={(e) => updateTicket(ticket.id, "price", e.target.value)}
                    placeholder="0.00"
                    className="h-9 pl-6 text-sm border-neutral-200 bg-white"
                    type="number"
                    min="0"
                  />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-neutral-600">Quantity *</Label>
              <Input
                value={ticket.quantity}
                onChange={(e) => updateTicket(ticket.id, "quantity", e.target.value)}
                placeholder="e.g. 500"
                className="h-9 text-sm border-neutral-200 bg-white disabled:opacity-50"
                type="number"
                min="1"
                disabled={ticket.unlimited}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-neutral-600">&nbsp;</Label>
              <div className="flex items-center gap-2 h-9">
                <Checkbox
                  id={`unlimited-${ticket.id}`}
                  checked={ticket.unlimited}
                  onCheckedChange={(v) => updateTicket(ticket.id, "unlimited", !!v)}
                  className="border-neutral-300 data-[state=checked]:bg-primary-600"
                />
                <Label htmlFor={`unlimited-${ticket.id}`} className="text-xs text-neutral-600 cursor-pointer">
                  Unlimited
                </Label>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-neutral-600">Sale Start</Label>
              <Input type="datetime-local" className="h-9 text-sm border-neutral-200 bg-white" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-neutral-600">Sale End</Label>
              <Input type="datetime-local" className="h-9 text-sm border-neutral-200 bg-white" />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addTicket}
        className="w-full py-3 border-2 border-dashed border-neutral-200 rounded-2xl text-sm font-medium text-neutral-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/20 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Another Ticket Type
      </button>

      <Separator />

      {/* Custom fields */}
      <div>
        <p className="text-sm font-semibold text-neutral-700 mb-3">Registration Form Fields</p>
        <div className="flex flex-wrap gap-2">
          {["First Name ✓", "Last Name ✓", "Email ✓", "Phone", "Company", "T-Shirt Size", "Dietary Requirements"].map((field) => {
            const checked = field.includes("✓");
            const label = field.replace(" ✓", "");
            return (
              <div key={label} className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all",
                checked ? "gradient-primary text-white border-0" : "border-neutral-200 text-neutral-600 hover:border-primary-300"
              )}>
                {checked && <Check className="w-3 h-3" />}
                {label}
              </div>
            );
          })}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-dashed border-neutral-200 text-xs font-medium text-neutral-400 hover:border-primary-300 hover:text-primary-600 transition-all">
            <Plus className="w-3 h-3" />Custom field
          </button>
        </div>
      </div>
    </div>
  );
}

function StepCustomize() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="slug" className="text-sm font-medium text-neutral-700">Custom URL Slug</Label>
        <div className="flex items-center gap-0 rounded-xl overflow-hidden border border-neutral-200 focus-within:ring-2 focus-within:ring-primary-500">
          <span className="px-3 bg-neutral-50 border-r border-neutral-200 h-11 flex items-center text-sm text-neutral-400 flex-shrink-0">
            eventix.io/e/
          </span>
          <Input
            id="slug"
            defaultValue="tech-summit-kl-2026"
            className="border-0 h-11 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-neutral-700">Event Color Theme</Label>
        <div className="flex gap-3">
          {["#4f46e5","#7c3aed","#0ea5e9","#10b981","#f59e0b","#f43f5e","#0f172a"].map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-offset-1 ring-transparent hover:ring-neutral-300 transition-all first:ring-primary-500"
              style={{ background: color }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-neutral-700">Attendee Policies</Label>
        <div className="space-y-3">
          {[
            { id: "refund", label: "Allow refunds", sub: "Attendees can request refunds up to 7 days before the event" },
            { id: "transfer", label: "Allow ticket transfers", sub: "Attendees can transfer tickets to another person" },
            { id: "waitlist", label: "Enable waitlist", sub: "Show a waitlist option when tickets are sold out" },
          ].map(({ id, label, sub }) => (
            <div key={id} className="flex items-start gap-3 p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
              <Checkbox id={id} defaultChecked className="mt-0.5 border-neutral-300 data-[state=checked]:bg-primary-600" />
              <div>
                <Label htmlFor={id} className="text-sm font-medium text-neutral-700 cursor-pointer">{label}</Label>
                <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepPublish() {
  const checks = [
    { ok: true,  text: "Event details complete" },
    { ok: true,  text: "2 ticket types configured" },
    { ok: true,  text: "Date and venue set" },
    { ok: false, text: "No promo codes — add one?" },
  ];

  const visibilities = [
    { id: "public",   label: "Public",   sub: "Anyone can find and buy tickets",  icon: Globe },
    { id: "unlisted", label: "Unlisted", sub: "Only people with the direct link",  icon: EyeOff },
    { id: "private",  label: "Private",  sub: "Invite only — you manage access",   icon: Lock },
  ];

  const [vis, setVis] = useState("public");
  const [publishing, setPublishing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Checklist */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-700 mb-3">Pre-publish checklist</p>
        {checks.map(({ ok, text }) => (
          <div key={text} className={cn(
            "flex items-center gap-3 p-3 rounded-xl border",
            ok ? "bg-success-50 border-success-100" : "bg-warning-50 border-warning-100"
          )}>
            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", ok ? "bg-success-500" : "bg-warning-500")}>
              {ok ? <Check className="w-3 h-3 text-white" /> : <Info className="w-3 h-3 text-white" />}
            </div>
            <p className={cn("text-sm font-medium", ok ? "text-success-700" : "text-warning-700")}>{text}</p>
            {!ok && <button className="ml-auto text-xs text-warning-700 underline">Fix</button>}
          </div>
        ))}
      </div>

      {/* Event URL */}
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-neutral-700">Your event URL</p>
        <div className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
          <code className="flex-1 text-sm text-primary-600 font-mono">eventix.io/e/tech-summit-kl-2026</code>
          <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 px-2 py-1 rounded-md hover:bg-neutral-200 transition-colors">Copy</button>
        </div>
      </div>

      {/* Visibility */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-700">Visibility</p>
        <div className="space-y-2">
          {visibilities.map(({ id, label, sub, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setVis(id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                vis === id ? "border-primary-400 bg-primary-50" : "border-neutral-100 bg-white hover:border-neutral-200"
              )}
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", vis === id ? "bg-primary-100" : "bg-neutral-100")}>
                <Icon className={cn("w-4 h-4", vis === id ? "text-primary-600" : "text-neutral-500")} />
              </div>
              <div>
                <p className={cn("text-sm font-semibold", vis === id ? "text-primary-700" : "text-neutral-700")}>{label}</p>
                <p className="text-xs text-neutral-400">{sub}</p>
              </div>
              <div className={cn("ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0", vis === id ? "border-primary-600 bg-primary-600" : "border-neutral-300")}>
                {vis === id && <div className="w-full h-full rounded-full bg-white scale-50" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <Button
        onClick={() => setPublishing(true)}
        disabled={publishing}
        className="w-full h-12 gradient-primary text-white border-0 font-semibold text-base shadow-md hover:opacity-90"
      >
        {publishing ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publishing...</>
        ) : (
          <>🚀 Publish Event</>
        )}
      </Button>
    </div>
  );
}

const stepComponents = [StepBasicInfo, StepDateVenue, StepTickets, StepCustomize, StepPublish];

// ─── Main wizard ─────────────────────────────────────────────────────────────

export default function NewEventPage() {
  const [step, setStep] = useState(1);
  const Step = stepComponents[step - 1];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back link */}
      <Link href="/dashboard/events" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Events
      </Link>

      <h1 className="text-2xl font-extrabold text-neutral-900 mb-6">Create New Event</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, idx) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex items-center flex-shrink-0">
              <button
                onClick={() => done && setStep(s.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  active ? "gradient-primary text-white shadow-sm" :
                  done ? "text-primary-600 bg-primary-50 hover:bg-primary-100 cursor-pointer" :
                  "text-neutral-400 cursor-default"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                  active ? "bg-white/30 text-white" :
                  done ? "bg-primary-600 text-white" :
                  "bg-neutral-200 text-neutral-400"
                )}>
                  {done ? <Check className="w-3 h-3" /> : s.id}
                </div>
                <span className="hidden sm:block">{s.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={cn("w-6 h-px mx-1", done ? "bg-primary-300" : "bg-neutral-200")} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-bold text-neutral-900 mb-6">
          {STEPS[step - 1].label}
        </h2>
        <Step />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="border-neutral-200 text-neutral-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-neutral-500 text-sm">
            Save Draft
          </Button>
          {step < 5 && (
            <Button
              onClick={() => setStep(Math.min(5, step + 1))}
              className="gradient-primary text-white border-0 shadow-sm hover:opacity-90"
            >
              Next: {STEPS[step]?.label}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
