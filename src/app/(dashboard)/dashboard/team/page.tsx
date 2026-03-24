"use client";

import { useState } from "react";
import {
  Plus, Search, Crown, Shield, Scan, MoreHorizontal,
  Mail, Trash2, UserCheck, Users, ChevronDown,
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

const initMembers = [
  { id: 1, name: "Ahmad Razif", email: "ahmad@example.com", role: "owner" as Role, joined: "Jan 1, 2026", lastActive: "Today" },
  { id: 2, name: "Siti Nurfazira", email: "siti@example.com", role: "admin" as Role, joined: "Jan 10, 2026", lastActive: "Today" },
  { id: 3, name: "Raj Kumar", email: "raj@example.com", role: "admin" as Role, joined: "Jan 15, 2026", lastActive: "Yesterday" },
  { id: 4, name: "Lisa Tan", email: "lisa@example.com", role: "staff" as Role, joined: "Feb 1, 2026", lastActive: "3 days ago" },
  { id: 5, name: "Hafiz Azwan", email: "hafiz@example.com", role: "staff" as Role, joined: "Feb 5, 2026", lastActive: "Feb 20, 2026" },
];

const pendingInvites = [
  { id: 10, email: "kevin@example.com", role: "admin" as Role, sentAt: "Feb 21, 2026" },
  { id: 11, email: "maya@example.com", role: "staff" as Role, sentAt: "Feb 22, 2026" },
];

export default function TeamPage() {
  const [members, setMembers] = useState(initMembers);
  const [invites, setInvites] = useState(pendingInvites);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("admin");

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  function removeInvite(id: number) {
    setInvites(prev => prev.filter(i => i.id !== id));
  }

  function removeMember(id: number) {
    setMembers(prev => prev.filter(m => m.id !== id));
  }

  function sendInvite() {
    if (!inviteEmail) return;
    setInvites(prev => [...prev, { id: Date.now(), email: inviteEmail, role: inviteRole, sentAt: "Just now" }]);
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
        {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([key, rc]) => {
          const count = members.filter(m => m.role === key).length;
          return (
            <div key={key} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", rc.bg)}>
                  <rc.icon className={cn("w-4 h-4", rc.color)} />
                </div>
                <p className="font-semibold text-neutral-900 text-sm">{rc.label}</p>
              </div>
              <p className="text-2xl font-extrabold text-neutral-900">{count}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{rc.desc}</p>
            </div>
          );
        })}
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
            const rc = roleConfig[m.role];
            return (
              <div key={m.id} className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-sm font-bold">
                      {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 text-sm">{m.name}</p>
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", rc.color, rc.bg, rc.border)}>
                        <rc.icon className="w-3 h-3" />
                        {rc.label}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{m.email} · Last active {m.lastActive}</p>
                  </div>
                </div>
                {m.role !== "owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2"><Mail className="w-4 h-4" /> Resend Invite</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-danger-600" onClick={() => removeMember(m.id)}>
                        <Trash2 className="w-4 h-4" /> Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending invites */}
      {invites.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-400" /> Pending Invites ({invites.length})
            </h3>
          </div>
          <div className="divide-y divide-neutral-50">
            {invites.map((inv) => {
              const rc = roleConfig[inv.role];
              return (
                <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-700 text-sm">{inv.email}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", rc.color, rc.bg, rc.border)}>
                          <rc.icon className="w-3 h-3" />
                          {rc.label}
                        </span>
                        <span className="text-xs text-neutral-400">Sent {inv.sentAt}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-danger-600 hover:text-danger-700" onClick={() => removeInvite(inv.id)}>
                    Revoke
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              <Select value={inviteRole} onValueChange={v => setInviteRole(v as Role)}>
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
