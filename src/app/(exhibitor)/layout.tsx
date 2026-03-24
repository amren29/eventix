"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap, LayoutDashboard, Store, Users, Calendar, User,
  LogOut, Bell, ChevronDown, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Overview",  href: "/exhibitor",          icon: LayoutDashboard },
  { label: "My Booth",  href: "/exhibitor/booth",     icon: Store },
  { label: "Leads",     href: "/exhibitor/leads",     icon: Users },
  { label: "Schedule",  href: "/exhibitor/schedule",  icon: Calendar },
  { label: "Profile",   href: "/exhibitor/profile",   icon: User },
];

export default function ExhibitorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/exhibitor" ? pathname === "/exhibitor" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top navbar */}
      <header className="h-16 bg-white border-b border-neutral-100 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-40">
        <Link href="/exhibitor" className="flex items-center gap-2.5 mr-6">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-neutral-900 text-base">Eventix</span>
            <span className="ml-1.5 text-xs font-medium text-neutral-400 border border-neutral-200 px-1.5 py-0.5 rounded">Exhibitor</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  active ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Event context */}
          <div className="hidden sm:flex items-center gap-2 bg-neutral-100 rounded-lg px-3 py-1.5 text-sm">
            <div className="w-2 h-2 rounded-full bg-success-500" />
            <span className="font-medium text-neutral-700">Tech Summit 2026</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </div>

          <button className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors relative">
            <Bell className="w-4 h-4 text-neutral-600" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-danger-500 rounded-full" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-neutral-100 rounded-xl px-2 py-1.5 transition-colors">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-bold">TG</AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-neutral-700">TechGear Co.</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild><Link href="/exhibitor/profile" className="gap-2"><User className="w-4 h-4" /> My Profile</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-danger-600"><LogOut className="w-4 h-4" /> Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile hamburger */}
          <button className="lg:hidden w-9 h-9 flex items-center justify-center" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-100 px-4 py-3 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active ? "gradient-primary text-white" : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      )}

      <main className="flex-1">{children}</main>
    </div>
  );
}
