"use client";

import { useState } from "react";
import {
  Globe, DollarSign, Mail, Shield, Bell, Save,
  CheckCircle2, ChevronRight, Percent, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Section = "general" | "billing" | "email" | "security";

const sections: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: Globe },
  { id: "billing", label: "Billing & Fees", icon: DollarSign },
  { id: "email", label: "Email & Comms", icon: Mail },
  { id: "security", label: "Security", icon: Shield },
];

export default function AdminSettingsPage() {
  const [active, setActive] = useState<Section>("general");
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    platformName: "Eventix",
    supportEmail: "support@eventix.io",
    timezone: "Asia/Kuala_Lumpur",
    maintenanceMode: false,
    allowPublicRegistration: true,
    requireOrgApproval: true,
  });

  const [billing, setBilling] = useState({
    platformFee: "3",
    minPayout: "50",
    payoutCycle: "weekly",
    stripeLive: false,
    fpxEnabled: true,
    paypalEnabled: true,
  });

  const [email, setEmail] = useState({
    fromName: "Eventix",
    fromEmail: "no-reply@eventix.io",
    welcomeEmail: true,
    ticketConfirm: true,
    payoutNotify: true,
    weeklyDigest: false,
  });

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Platform Settings</h1>
        <p className="text-neutral-500 mt-0.5">Global configuration for the Eventix platform.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-medium",
                active === s.id ? "bg-primary-950 text-primary-300 border border-primary-800" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
              {active === s.id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* General */}
          {active === "general" && (
            <>
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
                <h2 className="font-semibold text-white">Platform Identity</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-neutral-400">Platform Name</Label>
                    <Input value={general.platformName} onChange={e => setGeneral(p => ({ ...p, platformName: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-neutral-400">Support Email</Label>
                    <Input value={general.supportEmail} onChange={e => setGeneral(p => ({ ...p, supportEmail: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-neutral-400">Default Timezone</Label>
                    <Input value={general.timezone} onChange={e => setGeneral(p => ({ ...p, timezone: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
                <h2 className="font-semibold text-white">Access Control</h2>
                <Separator className="bg-neutral-800" />
                {[
                  { key: "allowPublicRegistration", label: "Allow Public Registration", desc: "Anyone can sign up as an organizer without an invitation" },
                  { key: "requireOrgApproval", label: "Require Organizer Approval", desc: "New organizations must be manually approved by a super admin" },
                  { key: "maintenanceMode", label: "Maintenance Mode", desc: "Show maintenance page to all non-admin users" },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-200 text-sm">{s.label}</p>
                      <p className="text-xs text-neutral-500">{s.desc}</p>
                    </div>
                    <Switch
                      checked={general[s.key as keyof typeof general] as boolean}
                      onCheckedChange={v => setGeneral(p => ({ ...p, [s.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Billing */}
          {active === "billing" && (
            <>
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Percent className="w-4 h-4" /> Fee Structure
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-neutral-400">Platform Fee (%)</Label>
                    <div className="relative">
                      <Input value={billing.platformFee} onChange={e => setBilling(p => ({ ...p, platformFee: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white pr-8" type="number" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-neutral-400">Minimum Payout (RM)</Label>
                    <Input value={billing.minPayout} onChange={e => setBilling(p => ({ ...p, minPayout: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" type="number" />
                  </div>
                </div>
              </div>
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
                <h2 className="font-semibold text-white">Payment Methods</h2>
                <Separator className="bg-neutral-800" />
                {[
                  { key: "stripeLive", label: "Stripe (Live Mode)", desc: "Enable live Stripe payments (vs test mode)" },
                  { key: "fpxEnabled", label: "FPX (Malaysia)", desc: "Online banking payment via FPX gateway" },
                  { key: "paypalEnabled", label: "PayPal", desc: "Accept PayPal payments" },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-200 text-sm">{s.label}</p>
                      <p className="text-xs text-neutral-500">{s.desc}</p>
                    </div>
                    <Switch
                      checked={billing[s.key as keyof typeof billing] as boolean}
                      onCheckedChange={v => setBilling(p => ({ ...p, [s.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Email */}
          {active === "email" && (
            <>
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
                <h2 className="font-semibold text-white">Sender Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-neutral-400">From Name</Label>
                    <Input value={email.fromName} onChange={e => setEmail(p => ({ ...p, fromName: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-neutral-400">From Email</Label>
                    <Input value={email.fromEmail} onChange={e => setEmail(p => ({ ...p, fromEmail: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
                <h2 className="font-semibold text-white">Transactional Emails</h2>
                <Separator className="bg-neutral-800" />
                {[
                  { key: "welcomeEmail", label: "Welcome Email", desc: "Sent when a new user registers" },
                  { key: "ticketConfirm", label: "Ticket Confirmation", desc: "Sent after successful ticket purchase" },
                  { key: "payoutNotify", label: "Payout Notification", desc: "Notify organizers when payouts are processed" },
                  { key: "weeklyDigest", label: "Weekly Admin Digest", desc: "Summary of platform activity sent every Monday" },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-200 text-sm">{s.label}</p>
                      <p className="text-xs text-neutral-500">{s.desc}</p>
                    </div>
                    <Switch
                      checked={email[s.key as keyof typeof email] as boolean}
                      onCheckedChange={v => setEmail(p => ({ ...p, [s.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Security */}
          {active === "security" && (
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-4">
              <h2 className="font-semibold text-white">Security Configuration</h2>
              <Separator className="bg-neutral-800" />
              {[
                { label: "Require 2FA for Admins", desc: "All admin accounts must use two-factor authentication" },
                { label: "Force HTTPS", desc: "Redirect all HTTP traffic to HTTPS" },
                { label: "Rate Limiting", desc: "Enforce API rate limiting on all endpoints" },
                { label: "Audit Log", desc: "Log all admin actions with timestamps and IP addresses" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-200 text-sm">{s.label}</p>
                    <p className="text-xs text-neutral-500">{s.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          )}

          <Button className="gradient-primary text-white gap-2" onClick={save}>
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
