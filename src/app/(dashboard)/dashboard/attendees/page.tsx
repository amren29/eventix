"use client";

import { useState } from "react";
import {
  Search, Download, CheckCircle2, XCircle, Clock,
  MoreHorizontal, Mail, Ticket, Users, UserCheck, UserX, QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const attendees = [
  { id: "AT-001", name: "Ahmad Razif", email: "ahmad@example.com", event: "Tech Summit 2026", ticket: "VIP Pass", orderId: "ORD-7821", checkedIn: true, checkedInTime: "09:14 AM", date: "Feb 20, 2026" },
  { id: "AT-002", name: "Siti Nurfazira", email: "siti@example.com", event: "Music Fest KL", ticket: "General Admission", orderId: "ORD-7820", checkedIn: true, checkedInTime: "07:42 PM", date: "Feb 20, 2026" },
  { id: "AT-003", name: "Raj Kumar", email: "raj@example.com", event: "Tech Summit 2026", ticket: "Early Bird", orderId: "ORD-7819", checkedIn: false, checkedInTime: null, date: "Feb 19, 2026" },
  { id: "AT-004", name: "Lisa Tan", email: "lisa@example.com", event: "Startup Weekend", ticket: "Founder Pass", orderId: "ORD-7818", checkedIn: true, checkedInTime: "10:05 AM", date: "Feb 19, 2026" },
  { id: "AT-005", name: "Hafiz Azwan", email: "hafiz@example.com", event: "Music Fest KL", ticket: "VIP", orderId: "ORD-7817", checkedIn: false, checkedInTime: null, date: "Feb 18, 2026" },
  { id: "AT-006", name: "Nurul Aina", email: "nurul@example.com", event: "Tech Summit 2026", ticket: "General", orderId: "ORD-7816", checkedIn: true, checkedInTime: "09:58 AM", date: "Feb 18, 2026" },
  { id: "AT-007", name: "Kevin Lim", email: "kevin@example.com", event: "Startup Weekend", ticket: "Founder Pass", orderId: "ORD-7815", checkedIn: false, checkedInTime: null, date: "Feb 17, 2026" },
  { id: "AT-008", name: "Farah Diyana", email: "farah@example.com", event: "Music Fest KL", ticket: "Premium", orderId: "ORD-7814", checkedIn: true, checkedInTime: "08:20 PM", date: "Feb 17, 2026" },
  { id: "AT-009", name: "Zaid Ariff", email: "zaid@example.com", event: "Tech Summit 2026", ticket: "Early Bird", orderId: "ORD-7813", checkedIn: false, checkedInTime: null, date: "Feb 16, 2026" },
  { id: "AT-010", name: "Maya Putri", email: "maya@example.com", event: "Startup Weekend", ticket: "Founder Pass", orderId: "ORD-7812", checkedIn: true, checkedInTime: "10:30 AM", date: "Feb 16, 2026" },
];

export default function AttendeesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");

  const filtered = attendees.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "checked-in" && a.checkedIn) ||
      (statusFilter === "not-checked-in" && !a.checkedIn);
    const matchEvent = eventFilter === "all" || a.event === eventFilter;
    return matchSearch && matchStatus && matchEvent;
  });

  const checkedInCount = attendees.filter(a => a.checkedIn).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Attendees</h1>
          <p className="text-neutral-500 mt-0.5">View and manage all attendees across your events.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Attendees", value: attendees.length, icon: Users, color: "text-primary-600", bg: "bg-primary-50" },
          { label: "Checked In", value: checkedInCount, icon: UserCheck, color: "text-success-600", bg: "bg-success-50" },
          { label: "Not Checked In", value: attendees.length - checkedInCount, icon: UserX, color: "text-warning-600", bg: "bg-warning-50" },
          { label: "Check-In Rate", value: `${Math.round((checkedInCount / attendees.length) * 100)}%`, icon: QrCode, color: "text-accent-600", bg: "bg-accent-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-neutral-500">{s.label}</p>
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
            </div>
            <p className={cn("text-xl font-extrabold", s.color)}>{s.value}</p>
            {s.label === "Check-In Rate" && (
              <Progress value={(checkedInCount / attendees.length) * 100} className="h-1 mt-2" />
            )}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <div className="p-4 border-b border-neutral-100 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search by name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Check-in status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Attendees</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="not-checked-in">Not Checked In</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="Tech Summit 2026">Tech Summit 2026</SelectItem>
              <SelectItem value="Music Fest KL">Music Fest KL</SelectItem>
              <SelectItem value="Startup Weekend">Startup Weekend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Attendee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Event</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Ticket</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Order</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Check-In</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-bold">
                          {a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-neutral-900">{a.name}</p>
                        <p className="text-xs text-neutral-400">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-neutral-700 truncate max-w-[140px]">{a.event}</p>
                    <p className="text-xs text-neutral-400">{a.date}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                      <Ticket className="w-3 h-3" />
                      {a.ticket}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                      {a.orderId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {a.checkedIn ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-success-50 text-success-700 border border-success-200">
                          <CheckCircle2 className="w-3 h-3" /> Checked In
                        </span>
                        <p className="text-xs text-neutral-400 mt-0.5">{a.checkedInTime}</p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2"><QrCode className="w-4 h-4" /> View Ticket</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><Mail className="w-4 h-4" /> Send Email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {!a.checkedIn && (
                          <DropdownMenuItem className="gap-2 text-success-600">
                            <CheckCircle2 className="w-4 h-4" /> Mark as Checked In
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2 text-danger-600">
                          <XCircle className="w-4 h-4" /> Invalidate Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-neutral-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-medium">No attendees found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-neutral-100 flex items-center justify-between text-sm text-neutral-500">
          <p>Showing {filtered.length} of {attendees.length} attendees</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
