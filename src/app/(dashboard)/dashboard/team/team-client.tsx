"use client";

import { useState } from "react";
import {
  Plus, Search, Crown, Shield, Scan, MoreHorizontal,
  Mail, Trash2, Users,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const roleConfig = {
  owner: { label: "Owner", icon: Crown, color: "text-warning-600", bg: "bg-warning-50", border: "border-warning-200", desc: "Full access to all settings and billing" },
  admin: { label: "Admin", icon: Shield, color: "text-primary-600", bg: "bg-primary-50", border: "border-primary-200", desc: "Manage events, orders, and team members" },
  staff: { label: "Check-In Staff", icon: Scan, color: "text-success-600", bg: "bg-success-50", border: "border-success-200", desc: "Can only access the check-in scanner app" },
} as const;

type Role = keyof typeof roleConfig;

interface Member {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function getMemberRole(member: Member, ownerId: string | null): Role {
  if (member.id === ownerId) return "owner";
  if (member.role === "admin") return "admin";
  if (member.role === "staff") return "staff";
  // Default non-owner members to admin display
  return "admin";
}

export function TeamClient({
  members: initialMembers,
  currentUserId,
  ownerId,
}: {
  members: Member[];
  currentUserId: string;
  ownerId: string | null;
}) {
  const [members] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "staff">("admin");

  const filtered = members.filter(m =>
    (m.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (m.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Count roles for overview cards
  const roleCounts = {
    owner: members.filter(m => m.id === ownerId).length,
    admin: members.filter(m => m.id !== ownerId && getMemberRole(m, ownerId) === "admin").length,
    staff: members.filter(m => getMemberRole(m, ownerId) === "staff").length,
  };

  function sendInvite() {
    if (!inviteEmail) return;
    // UI-only for now
    setOpen(false);
    setInviteEmail("");
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Team</h1>
          <p className="text-neutral-500 mt-0.5">Manage who has access to your organization.</p>
        </div>
        <Button className="gradient-primary text-white gap-2" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" /> Invite Member
        </Button>
      </div>

      {/* Role overview */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([key, rc]) => (
          <div key={key} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", rc.bg)}>
                <rc.icon className={cn("w-4 h-4", rc.color)} />
              </div>
              <p className="font-semibold text-neutral-900 text-sm">{rc.label}</p>
            </div>
            <p className="text-2xl font-extrabold text-neutral-900">{roleCounts[key]}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{rc.desc}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Members list */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400" /> Members ({filtered.length})
          </h3>
        </div>
        <div className="divide-y divide-neutral-50">
          {filtered.map((m) => {
            const role = getMemberRole(m, ownerId);
            const rc = roleConfig[role];
            const isOwner = m.id === ownerId;
            return (
              <div key={m.id} className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-sm font-bold">
                      {getInitials(m.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 text-sm">{m.full_name || "Unnamed"}</p>
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", rc.color, rc.bg, rc.border)}>
                        <rc.icon className="w-3 h-3" />
                        {rc.label}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{m.email}</p>
                  </div>
                </div>
                {!isOwner && m.id !== currentUserId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2"><Mail className="w-4 h-4" /> Resend Invite</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-danger-600">
                        <Trash2 className="w-4 h-4" /> Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-neutral-400 text-sm">
              No members found.
            </div>
          )}
        </div>
      </div>

      {/* Invite dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="team@example.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={v => setInviteRole(v as "admin" | "staff")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][])
                    .filter(([k]) => k !== "owner")
                    .map(([key, rc]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <rc.icon className={cn("w-4 h-4", rc.color)} />
                          <div>
                            <p className="font-medium">{rc.label}</p>
                            <p className="text-xs text-neutral-400">{rc.desc}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="gradient-primary text-white" onClick={sendInvite}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
