"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, ArrowRight, Check, Info,
  Upload, Plus, Trash2, Globe, Lock, EyeOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  { id: 4, label: "Publish" },
];

const CATEGORIES = [
  "Conference", "Music", "Festival", "Workshop", "Sports",
  "Arts & Culture", "Food & Drink", "Virtual", "Education", "Business",
];

interface TicketDraft {
  id: string;
  name: string;
  priceType: "paid" | "free";
  price: string;
  quantity: string;
  unlimited: boolean;
}

interface EventDraft {
  title: string;
  category: string;
  tags: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone: string;
  isOnline: boolean;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueCountry: string;
  tickets: TicketDraft[];
  visibility: "public" | "unlisted" | "private";
}

function StepBasicInfo({ draft, setDraft }: { draft: EventDraft; setDraft: (d: EventDraft) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-sm font-medium text-neutral-700">
          Event Name <span className="text-danger-500">*</span>
        </Label>
        <Input
          id="title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="e.g. Tech Summit KL 2026"
          className="h-11 border-neutral-200 focus-visible:ring-primary-500"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">
            Category <span className="text-danger-500">*</span>
          </Label>
          <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
            <SelectTrigger className="h-11 border-neutral-200">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tags" className="text-sm font-medium text-neutral-700">Tags</Label>
          <Input
            id="tags"
            value={draft.tags}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
            placeholder="tech, networking (comma separated)"
            className="h-11 border-neutral-200"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-neutral-700">Event Banner</Label>
        <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-10 text-center hover:border-primary-300 hover:bg-primary-50/20 transition-colors cursor-pointer group">
          <Upload className="w-8 h-8 text-neutral-300 mx-auto mb-3 group-hover:text-primary-400 transition-colors" />
          <p className="text-sm font-medium text-neutral-500">Drag & drop your banner here</p>
          <p className="text-xs text-neutral-400 mt-1">or <span className="text-primary-600 font-medium">click to browse</span></p>
          <p className="text-xs text-neutral-300 mt-2">Recommended: 1920×1080px · Max 5MB</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm font-medium text-neutral-700">
          Description <span className="text-danger-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Write a compelling event description..."
          className="min-h-40 border-neutral-200 focus-visible:ring-primary-500 resize-none"
        />
      </div>
    </div>
  );
}

function StepDateVenue({ draft, setDraft }: { draft: EventDraft; setDraft: (d: EventDraft) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="start-date" className="text-sm font-medium text-neutral-700">
            Start Date & Time <span className="text-danger-500">*</span>
          </Label>
          <Input
            id="start-date"
            type="datetime-local"
            value={draft.startDate}
            onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
            className="h-11 border-neutral-200"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end-date" className="text-sm font-medium text-neutral-700">
            End Date & Time <span className="text-danger-500">*</span>
          </Label>
          <Input
            id="end-date"
            type="datetime-local"
            value={draft.endDate}
            onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
            className="h-11 border-neutral-200"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-neutral-700">Timezone</Label>
        <Select value={draft.timezone} onValueChange={(v) => setDraft({ ...draft, timezone: v })}>
          <SelectTrigger className="h-11 border-neutral-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (GMT+8)</SelectItem>
            <SelectItem value="Asia/Singapore">Asia/Singapore (GMT+8)</SelectItem>
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
            <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="flex items-center gap-3">
        <Checkbox
          id="online"
          checked={draft.isOnline}
          onCheckedChange={(v) => setDraft({ ...draft, isOnline: !!v })}
          className="border-neutral-300 data-[state=checked]:bg-primary-600"
        />
        <Label htmlFor="online" className="text-sm font-medium text-neutral-700 cursor-pointer">
          This is an online / virtual event
        </Label>
      </div>

      {!draft.isOnline && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="venue-name" className="text-sm font-medium text-neutral-700">Venue Name</Label>
            <Input
              id="venue-name"
              value={draft.venueName}
              onChange={(e) => setDraft({ ...draft, venueName: e.target.value })}
              placeholder="e.g. Axiata Arena"
              className="h-11 border-neutral-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="venue-address" className="text-sm font-medium text-neutral-700">Address</Label>
            <Input
              id="venue-address"
              value={draft.venueAddress}
              onChange={(e) => setDraft({ ...draft, venueAddress: e.target.value })}
              placeholder="Full address"
              className="h-11 border-neutral-200"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-sm font-medium text-neutral-700">City</Label>
              <Input
                id="city"
                value={draft.venueCity}
                onChange={(e) => setDraft({ ...draft, venueCity: e.target.value })}
                placeholder="Kuala Lumpur"
                className="h-11 border-neutral-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-sm font-medium text-neutral-700">Country</Label>
              <Input
                id="country"
                value={draft.venueCountry}
                onChange={(e) => setDraft({ ...draft, venueCountry: e.target.value })}
                placeholder="Malaysia"
                className="h-11 border-neutral-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepTickets({ draft, setDraft }: { draft: EventDraft; setDraft: (d: EventDraft) => void }) {
  const addTicket = () => {
    setDraft({
      ...draft,
      tickets: [...draft.tickets, {
        id: String(Date.now()),
        name: "", priceType: "paid", price: "", quantity: "", unlimited: false,
      }],
    });
  };

  const removeTicket = (id: string) => {
    setDraft({ ...draft, tickets: draft.tickets.filter((t) => t.id !== id) });
  };

  const updateTicket = (id: string, field: keyof TicketDraft, value: any) => {
    setDraft({
      ...draft,
      tickets: draft.tickets.map((t) => t.id === id ? { ...t, [field]: value } : t),
    });
  };

  return (
    <div className="space-y-4">
      {draft.tickets.map((ticket, idx) => (
        <div key={ticket.id} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-neutral-700">Ticket Type #{idx + 1}</p>
            {draft.tickets.length > 1 && (
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
        </div>
      ))}

      <button
        onClick={addTicket}
        className="w-full py-3 border-2 border-dashed border-neutral-200 rounded-2xl text-sm font-medium text-neutral-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/20 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Another Ticket Type
      </button>
    </div>
  );
}

function StepPublish({
  draft,
  setDraft,
  onPublish,
  onSaveDraft,
  publishing,
}: {
  draft: EventDraft;
  setDraft: (d: EventDraft) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  publishing: boolean;
}) {
  const checks = [
    { ok: !!draft.title, text: "Event name set" },
    { ok: !!draft.category, text: "Category selected" },
    { ok: !!draft.startDate && !!draft.endDate, text: "Date and time configured" },
    { ok: draft.tickets.length > 0 && draft.tickets.every((t) => t.name), text: `${draft.tickets.length} ticket type(s) configured` },
  ];

  const allOk = checks.every((c) => c.ok);

  const visibilities = [
    { id: "public" as const,   label: "Public",   sub: "Anyone can find and buy tickets",  icon: Globe },
    { id: "unlisted" as const, label: "Unlisted", sub: "Only people with the direct link",  icon: EyeOff },
    { id: "private" as const,  label: "Private",  sub: "Invite only — you manage access",   icon: Lock },
  ];

  return (
    <div className="space-y-6">
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
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-700">Visibility</p>
        <div className="space-y-2">
          {visibilities.map(({ id, label, sub, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setDraft({ ...draft, visibility: id })}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                draft.visibility === id ? "border-primary-400 bg-primary-50" : "border-neutral-100 bg-white hover:border-neutral-200"
              )}
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", draft.visibility === id ? "bg-primary-100" : "bg-neutral-100")}>
                <Icon className={cn("w-4 h-4", draft.visibility === id ? "text-primary-600" : "text-neutral-500")} />
              </div>
              <div>
                <p className={cn("text-sm font-semibold", draft.visibility === id ? "text-primary-700" : "text-neutral-700")}>{label}</p>
                <p className="text-xs text-neutral-400">{sub}</p>
              </div>
              <div className={cn("ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0", draft.visibility === id ? "border-primary-600 bg-primary-600" : "border-neutral-300")}>
                {draft.visibility === id && <div className="w-full h-full rounded-full bg-white scale-50" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={publishing}
          className="flex-1 h-12 border-neutral-200 font-semibold"
        >
          Save as Draft
        </Button>
        <Button
          onClick={onPublish}
          disabled={publishing || !allOk}
          className="flex-1 h-12 gradient-primary text-white border-0 font-semibold text-base shadow-md hover:opacity-90"
        >
          {publishing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publishing...</>
          ) : (
            "Publish Event"
          )}
        </Button>
      </div>
    </div>
  );
}

export default function NewEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  const [draft, setDraft] = useState<EventDraft>({
    title: "",
    category: "",
    tags: "",
    description: "",
    startDate: "",
    endDate: "",
    timezone: "Asia/Kuala_Lumpur",
    isOnline: false,
    venueName: "",
    venueAddress: "",
    venueCity: "",
    venueCountry: "",
    tickets: [
      { id: "1", name: "General Admission", priceType: "paid", price: "25", quantity: "500", unlimited: false },
    ],
    visibility: "public",
  });

  async function saveEvent(status: "draft" | "published") {
    setPublishing(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get org ID
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (!profile?.organization_id) throw new Error("No organization found. Please set up your organization first.");

      // Generate slug
      const slug = draft.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        + "-" + Date.now().toString(36);

      const tags = draft.tags.split(",").map((t) => t.trim()).filter(Boolean);

      // Insert event
      const { data: event, error: eventError } = await supabase
        .from("events")
        .insert({
          slug,
          title: draft.title,
          description: draft.description,
          category: draft.category,
          tags,
          status,
          visibility: draft.visibility,
          start_date: new Date(draft.startDate).toISOString(),
          end_date: new Date(draft.endDate).toISOString(),
          timezone: draft.timezone,
          is_online: draft.isOnline,
          venue_name: draft.isOnline ? null : draft.venueName || null,
          venue_address: draft.isOnline ? null : draft.venueAddress || null,
          venue_city: draft.isOnline ? null : draft.venueCity || null,
          venue_country: draft.isOnline ? null : draft.venueCountry || null,
          organizer_id: user.id,
          organization_id: profile.organization_id,
        })
        .select("id")
        .single();

      if (eventError) throw eventError;

      // Insert ticket types
      const ticketInserts = draft.tickets.map((t) => ({
        event_id: event!.id,
        name: t.name,
        price_type: t.priceType,
        price: t.priceType === "paid" ? Math.round(parseFloat(t.price || "0") * 100) : 0,
        quantity: t.unlimited ? null : parseInt(t.quantity || "0"),
        currency: "USD",
      }));

      if (ticketInserts.length > 0) {
        const { error: ticketError } = await supabase
          .from("ticket_types")
          .insert(ticketInserts);

        if (ticketError) throw ticketError;
      }

      router.push("/dashboard/events");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create event");
      setPublishing(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/dashboard/events" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Events
      </Link>

      <h1 className="text-2xl font-extrabold text-neutral-900 mb-6">Create New Event</h1>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

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
        {step === 1 && <StepBasicInfo draft={draft} setDraft={setDraft} />}
        {step === 2 && <StepDateVenue draft={draft} setDraft={setDraft} />}
        {step === 3 && <StepTickets draft={draft} setDraft={setDraft} />}
        {step === 4 && (
          <StepPublish
            draft={draft}
            setDraft={setDraft}
            onPublish={() => saveEvent("published")}
            onSaveDraft={() => saveEvent("draft")}
            publishing={publishing}
          />
        )}
      </div>

      {/* Navigation */}
      {step < 4 && (
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
          <Button
            onClick={() => setStep(Math.min(4, step + 1))}
            className="gradient-primary text-white border-0 shadow-sm hover:opacity-90"
          >
            Next: {STEPS[step]?.label}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
