"use client";

import { useState } from "react";
import {
  Search, MoreHorizontal, Eye, Ban, CheckCircle2,
  Users, Crown, Shield, Scan, User as UserIcon,
  Mail, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const users = [
  { id: "USR-001", name: "Ahmad Razif", email: "ahmad@example.com", role: "organizer", org: "Bass Nation Events", status: "active", joined: "Jan 5, 2026", lastLogin: "Today" },
  { id: "USR-002", name: "Siti Nurfazira", email: "siti@example.com", role: "organizer", org: "Tech Malaysia Hub", status: "active", joined: "Jan 10, 2026", lastLogin: "Today" },
  { id: "USR-003", name: "Raj Kumar", email: "raj@example.com", role: "attendee", org: "—", status: "active", joined: "Jan 14, 2026", lastLogin: "Yesterday" },
  { id: "USR-004", name: "Lisa Tan", email: "lisa@example.com", role: "attendee", org: "—", status: "active", joined: "Jan 20, 2026", lastLogin: "Feb 18, 2026" },
  { id: "USR-005", name: "Hafiz Azwan", email: "hafiz@example.com", role: "staff", org: "Bass Nation Events", status: "active", joined: "Feb 1, 2026", lastLogin: "Feb 20, 2026" },
  { id: "USR-006", name: "Nurul Aina", email: "nurul@example.com", role: "attendee", org: "—", status: "suspended", joined: "Feb 3, 2026", lastLogin: "Feb 10, 2026" },
  { id: "USR-007", name: "Kevin Lim", email: "kevin@example.com", role: "organizer", org: "FinTech Malaysia Conf", status: "pending", joined: "Feb 20, 2026", lastLogin: "Never" },
  { id: "USR-008", name: "Maya Putri", email: "maya@example.com", role: "attendee", org: "—", status: "active", joined: "Feb 22, 2026", lastLogin: "Today" },
];

const roleConfig = {
  organizer: { label: "Organizer", icon: Crown, color: "text-warning-400", bg: "bg-warning-950", border: "border-warning-800" },
  attendee: { label: "Attendee", icon: UserIcon, color: "text-neutral-400", bg: "bg-neutral-800", border: "border-neutral-700" },
  staff: { label: "Staff", icon: Scan, color: "text-success-400", bg: "bg-success-950", border: "border-success-800" },
} as const;

type UserRole = keyof typeof roleConfig;

const statusConfig = {
  active: { label: "Active", color: "text-success-400" },
  pending: { label: "Pending", color: "text-warning-400" },
  suspended: { label: "Suspended", color: "text-danger-400" },
} as const;

type UserStatus = keyof typeof statusConfig;

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [usersState, setUsersState] = useState(users);

  const filtered = usersState.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  function suspendUser(id: string) {
    setUsersState(prev => prev.map(u => u.id === id ? { ...u, status: "suspended" } : u));
  }

  function activateUser(id: string) {
    setUsersState(prev => prev.map(u => u.id === id ? { ...u, status: "active" } : u));
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Users</h1>
        <p className="text-neutral-500 mt-0.5">All registered users across the platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: usersState.length, color: "text-white" },
          { label: "Organizers", value: usersState.filter(u => u.role === "organizer").length, color: "text-warning-400" },
          { label: "Attendees", value: usersState.filter(u => u.role === "attendee").length, color: "text-neutral-400" },
          { label: "Suspended", value: usersState.filter(u => u.status === "suspended").length, color: "text-danger-400" },
        ].map(s => (
          <div key={s.label} className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4 text-center">
            <p className={cn("text-2xl font-extrabold", s.color)}>{s.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-primary-600"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36 bg-neutral-900 border-neutral-700 text-neutral-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="organizer">Organizer</SelectItem>
            <SelectItem value="attendee">Attendee</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              {["User", "Role", "Organization", "Status", "Joined", "Last Login", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filtered.map((u) => {
              const rc = roleConfig[u.role as UserRole];
              const sc = statusConfig[u.status as UserStatus];
              return (
                <tr key={u.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary-800 text-white text-xs font-bold">
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-neutral-200">{u.name}</p>
                        <p className="text-xs text-neutral-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", rc.color, rc.bg, rc.border)}>
                      <rc.icon className="w-3 h-3" />
                      {rc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{u.org}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-semibold", sc.color)}>{sc.label}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{u.joined}</td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{u.lastLogin}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-400 hover:text-white hover:bg-neutral-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-neutral-800 border-neutral-700 text-neutral-200">
                        <DropdownMenuItem className="gap-2 focus:bg-neutral-700"><Eye className="w-4 h-4" /> View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 focus:bg-neutral-700"><Mail className="w-4 h-4" /> Send Email</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-neutral-700" />
                        {u.status !== "suspended" ? (
                          <DropdownMenuItem className="gap-2 text-danger-400 focus:bg-neutral-700 focus:text-danger-400" onClick={() => suspendUser(u.id)}>
                            <Ban className="w-4 h-4" /> Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="gap-2 text-success-400 focus:bg-neutral-700 focus:text-success-400" onClick={() => activateUser(u.id)}>
                            <CheckCircle2 className="w-4 h-4" /> Reactivate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
