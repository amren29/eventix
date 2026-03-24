"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  profile: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
}

function getInitials(name: string): string {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export function ProfileClient({ profile }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  async function saveProfile() {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    }
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
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900">Profile</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your account details.</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-5">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary-100 text-primary-700 text-xl font-bold">
              {getInitials(fullName || profile.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-neutral-900">{fullName || profile.full_name || "Unnamed"}</p>
            <p className="text-sm text-neutral-400">{profile.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="border-neutral-200 text-xs">Change Photo</Button>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-neutral-900">Personal Information</h3>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">Full Name</Label>
          <Input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="h-10 border-neutral-200"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">Email Address</Label>
          <Input type="email" value={profile.email} disabled className="h-10 border-neutral-200 bg-neutral-50" />
          <p className="text-xs text-neutral-400">Email cannot be changed here.</p>
        </div>
        {error && <p className="text-sm text-danger-600">{error}</p>}
        <Button className="gradient-primary text-white border-0 font-semibold gap-2" onClick={saveProfile} disabled={saving}>
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}</>}
        </Button>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-neutral-900">Change Password</h3>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-neutral-700">New Password</Label>
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="h-10 border-neutral-200"
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {pwMessage && (
          <p className={cn("text-sm", pwMessage.includes("success") ? "text-success-600" : "text-danger-600")}>
            {pwMessage}
          </p>
        )}
        <Button variant="outline" className="border-neutral-200" onClick={changePassword} disabled={pwSaving}>
          {pwSaving ? "Updating..." : "Update Password"}
        </Button>
      </div>

      {/* Danger zone */}
      <div className="bg-danger-50 border border-danger-100 rounded-2xl p-5">
        <h3 className="font-semibold text-danger-700 mb-1">Delete Account</h3>
        <p className="text-sm text-danger-600/80 mb-3">Permanently delete your account and all associated data. This cannot be undone.</p>
        <Button size="sm" variant="outline" className="border-danger-200 text-danger-600 hover:bg-danger-100 text-xs">
          Delete My Account
        </Button>
      </div>
    </div>
  );
}
