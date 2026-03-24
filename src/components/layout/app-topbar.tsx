"use client";

import { useState } from "react";
import { Search, Bell, HelpCircle, ChevronDown, Plus, LogOut, User, Settings, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const notifications = [
  { id: 1, text: "New order — John D. purchased 2× VIP", time: "2 min ago", unread: true },
  { id: 2, text: "Payout of $5,100 scheduled for Mar 20", time: "1 hr ago", unread: true },
  { id: 3, text: "Tech Summit is 80% sold out!", time: "3 hr ago", unread: false },
  { id: 4, text: "2 new team member invites accepted", time: "Yesterday", unread: false },
];

export function AppTopbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 border-b border-neutral-100 bg-white flex items-center px-4 sm:px-6 gap-3 flex-shrink-0 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-sm hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search events, orders..."
            className="pl-9 h-9 bg-neutral-50 border-neutral-200 text-sm focus-visible:ring-primary-500"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded font-mono hidden md:block">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex-1 sm:flex-none" />

      {/* Quick create */}
      <Button
        size="sm"
        className="hidden sm:flex gradient-primary text-white border-0 shadow-sm hover:opacity-90 text-xs font-semibold"
        asChild
      >
        <Link href="/dashboard/events/new">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create Event
        </Link>
      </Button>

      {/* Notifications */}
      <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
        <DropdownMenuTrigger asChild>
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
            <p className="font-semibold text-sm text-neutral-900">Notifications</p>
            {unreadCount > 0 && (
              <Badge className="bg-primary-50 text-primary-700 border-primary-100 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="divide-y divide-neutral-50">
            {notifications.map((n) => (
              <div key={n.id} className={`px-4 py-3 hover:bg-neutral-50 cursor-pointer transition-colors ${n.unread ? "bg-primary-50/30" : ""}`}>
                <p className={`text-sm leading-snug ${n.unread ? "font-medium text-neutral-800" : "text-neutral-600"}`}>
                  {n.text}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">{n.time}</p>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-neutral-100">
            <button className="text-xs font-medium text-primary-600 hover:underline w-full text-center">
              View all notifications
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Help */}
      <button className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors hidden sm:flex">
        <HelpCircle className="w-4 h-4" />
      </button>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-neutral-100 transition-colors">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-bold">AR</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-neutral-700 hidden md:block">Amir R.</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden md:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <div>
              <p className="font-semibold text-sm text-neutral-900">Amir Rashid</p>
              <p className="text-xs text-neutral-500">amir@bassnation.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings/profile" className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings/billing" className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5" /> Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-danger-600 focus:text-danger-600 focus:bg-danger-50">
            <LogOut className="w-3.5 h-3.5 mr-2" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
