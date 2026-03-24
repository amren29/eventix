"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Building2, Bell, CreditCard, Shield, Trash2,
  Save, Eye, EyeOff, CheckCircle2, AlertTriangle,
  ChevronRight, Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Section = "organization" | "notifications" | "billing" | "security";

const sections: { id: Section; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "organization", label: "Organization", icon: Building2, desc: "Name, logo, and public profile" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Email and in-app alerts" },
  { id: "billing", label: "Billing & Plan", icon: CreditCard, desc: "Subscription and payment methods" },
  { id: "security", label: "Security", icon: Shield, desc: "Password and two-factor auth" },
];

interface Props {
  profile: { id: string; full_name: string; email: string };
  org: { id: string; name: string; slug: string; logo_url: string | null; primary_color: string; plan: string };
}

export function SettingsClient({ profile, org }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<Section>("organization");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Organization form
  const [orgForm, setOrgForm] = useState({
    name: org.name,
    slug: org.slug,
    primary_color: org.primary_color,
    fullName: profile.full_name,
  });

  // Security form
  const [showNewPw, setShowNewPw] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  // Notifications (UI-only)
  const [notifs, setNotifs] = useState({
    newOrder: true,
    orderRefund: true,
    lowInventory: true,
    checkInAlert: false,
    weeklyReport: true,
    marketingTips: false,
  });

  async function saveOrgForm() {
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const { error: orgErr } = await supabase
      .from("organizations")
      .update({
        name: orgForm.name,
        slug: orgForm.slug,
        primary_color: orgForm.primary_color,
      })
      .eq("id", org.id);

    if (orgErr) {
      setError(orgErr.message);
      setSaving(false);
      return;
    }

    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ full_name: orgForm.fullName })
      .eq("id", profile.id);

    if (profileErr) {
      setError(profileErr.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  async function changePassword() {
    if (!newPassword || newPassword.length < 6) {
      setPwMessage("Password must be at least 6 characters.");
      return;
    }
    setPwSaving(true);
    setPwMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);
    if (error) {
      setPwMessage(error.message);
    } else {
      setPwMessage("Password updated successfully.");
      setNewPassword("");
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-0.5">Manage your organization preferences and account settings.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-56 flex-shrink-0 space-y-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                active === s.id
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              <s.icon className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{s.label}</p>
              </div>
              {active === s.id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Organization */}
          {active === "organization" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Organization Profile</h2>

                {/* Logo */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-black">
                    {orgForm.name.charAt(0).toUpperCase() || "O"}
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Camera className="w-4 h-4" /> Change Logo
                    </Button>
                    <p className="text-xs text-neutral-400 mt-1">PNG, JPG up to 2MB. Recommended 512x512.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Organization Name</Label>
                    <Input value={orgForm.name} onChange={e => setOrgForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>URL Slug</Label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 text-sm bg-neutral-100 border border-r-0 rounded-l-lg text-neutral-500 border-neutral-200">eventix.io/</span>
                      <Input value={orgForm.slug} onChange={e => setOrgForm(p => ({ ...p, slug: e.target.value }))} className="rounded-l-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Your Name</Label>
                    <Input value={orgForm.fullName} onChange={e => setOrgForm(p => ({ ...p, fullName: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Primary Color</Label>
                    <Input value={orgForm.primary_color} onChange={e => setOrgForm(p => ({ ...p, primary_color: e.target.value }))} placeholder="#6366f1" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Plan</Label>
                    <Input value={org.plan} disabled className="bg-neutral-50" />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-danger-600 mt-4">{error}</p>
                )}
              </div>

              <Button className="gradient-primary text-white gap-2" onClick={saveOrgForm} disabled={saving}>
                {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}</>}
              </Button>
            </div>
          )}

          {/* Notifications */}
          {active === "notifications" && (
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-neutral-900">Notification Preferences</h2>
              <p className="text-sm text-neutral-500">Choose which emails and alerts you receive.</p>
              <Separator />
              {[
                { key: "newOrder", label: "New Order", desc: "Get notified when a ticket is purchased" },
                { key: "orderRefund", label: "Refund Request", desc: "Alert when an attendee requests a refund" },
                { key: "lowInventory", label: "Low Inventory Warning", desc: "When a ticket type drops below 10% remaining" },
                { key: "checkInAlert", label: "Check-In Milestone", desc: "Notify at 25%, 50%, 75%, 100% check-in progress" },
                { key: "weeklyReport", label: "Weekly Sales Report", desc: "Summary email every Monday morning" },
                { key: "marketingTips", label: "Marketing Tips", desc: "Occasional tips to boost your event sales" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-2">
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
          )}

          {/* Billing */}
          {active === "billing" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Current Plan</h2>
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <div>
                    <p className="font-bold text-primary-900 capitalize">{org.plan} Plan</p>
                    <p className="text-sm text-primary-600 mt-0.5">Manage your subscription below.</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-primary-200 text-primary-700">Manage Plan</Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-neutral-900">Payment Method</h2>
                  <Button variant="outline" size="sm" className="gap-2"><CreditCard className="w-4 h-4" /> Update Card</Button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="w-10 h-7 bg-gradient-to-br from-primary-600 to-accent-600 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 text-sm">No card on file</p>
                    <p className="text-xs text-neutral-400">Add a payment method to upgrade</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {active === "security" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <h2 className="font-semibold text-neutral-900 mb-5">Change Password</h2>
                <div className="space-y-4 max-w-sm">
                  <div className="space-y-1.5">
                    <Label>New Password</Label>
                    <div className="relative">
                      <Input
                        type={showNewPw ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                      <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {pwMessage && (
                    <p className={cn("text-sm", pwMessage.includes("success") ? "text-success-600" : "text-danger-600")}>
                      {pwMessage}
                    </p>
                  )}
                  <Button className="gradient-primary text-white gap-2 w-full" onClick={changePassword} disabled={pwSaving}>
                    <Save className="w-4 h-4" /> {pwSaving ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-neutral-900">Two-Factor Authentication</h2>
                    <p className="text-sm text-neutral-400 mt-0.5">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="bg-danger-50 border border-danger-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-danger-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h2 className="font-semibold text-danger-800">Danger Zone</h2>
                    <p className="text-sm text-danger-600 mt-1">Permanently delete your organization and all associated events, orders, and data. This cannot be undone.</p>
                    <Button variant="outline" size="sm" className="mt-3 border-danger-300 text-danger-700 hover:bg-danger-100 gap-2">
                      <Trash2 className="w-4 h-4" /> Delete Organization
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
