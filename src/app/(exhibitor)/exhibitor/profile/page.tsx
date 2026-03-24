"use client";

import { useState } from "react";
import {
  Building2, Mail, Phone, Globe, MapPin, Camera,
  Save, Eye, EyeOff, CheckCircle2, AlertTriangle, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function ExhibitorProfilePage() {
  const [saved, setSaved] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [notifs, setNotifs] = useState({ newVisitor: true, dailySummary: true, leadAlert: true });
  const [form, setForm] = useState({
    firstName: "Tan", lastName: "Wei Ming",
    company: "TechGear Co.",
    title: "Sales Director",
    email: "weiming@techgear.example.com",
    phone: "+60 12-888 9999",
    website: "https://techgear.example.com",
    country: "Malaysia",
    city: "Kuala Lumpur",
  });

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Profile</h1>
        <p className="text-neutral-500 mt-0.5">Your exhibitor account and personal settings.</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold">
              TW
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm hover:bg-neutral-50">
              <Camera className="w-3 h-3 text-neutral-600" />
            </button>
          </div>
          <div>
            <p className="font-bold text-neutral-900 text-lg">{form.firstName} {form.lastName}</p>
            <p className="text-sm text-neutral-500">{form.title} · {form.company}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>First Name</Label>
            <Input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Last Name</Label>
            <Input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Job Title</Label>
            <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Company</Label>
            <Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</Label>
            <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</Label>
            <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Website</Label>
            <Input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
          </div>
        </div>

        <Button className="gradient-primary text-white gap-2 mt-5" onClick={save}>
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
        </Button>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-neutral-900">Notifications</h2>
        <Separator />
        {[
          { key: "newVisitor", label: "New Booth Visitor", desc: "When a new visitor scans your QR code" },
          { key: "leadAlert", label: "Hot Lead Detected", desc: "When a lead is scored as 'Hot'" },
          { key: "dailySummary", label: "Daily Summary Email", desc: "End-of-day recap of leads and visitors" },
        ].map((n) => (
          <div key={n.key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900 text-sm">{n.label}</p>
              <p className="text-xs text-neutral-400">{n.desc}</p>
            </div>
            <Switch
              checked={notifs[n.key as keyof typeof notifs]}
              onCheckedChange={v => setNotifs(p => ({ ...p, [n.key]: v }))}
            />
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h2 className="font-semibold text-neutral-900 mb-5">Change Password</h2>
        <div className="space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <div className="relative">
              <Input type={showOldPw ? "text" : "password"} placeholder="••••••••" />
              <button onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <div className="relative">
              <Input type={showNewPw ? "text" : "password"} placeholder="••••••••" />
              <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button className="gradient-primary text-white gap-2"><Save className="w-4 h-4" /> Update Password</Button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-danger-50 border border-danger-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger-600 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-danger-800">Danger Zone</h2>
            <p className="text-sm text-danger-600 mt-1">Delete your exhibitor account. All booth data and leads will be permanently removed.</p>
            <Button variant="outline" size="sm" className="mt-3 border-danger-300 text-danger-700 hover:bg-danger-100 gap-2">
              <Trash2 className="w-4 h-4" /> Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
