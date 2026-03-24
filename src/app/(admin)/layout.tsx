"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap, LayoutDashboard, Building2, CalendarDays, Users,
  DollarSign, Flag, Settings, LogOut, Bell, ChevronDown,
  Shield, ChevronRight, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { label: "Overview",       href: "/admin",                icon: LayoutDashboard },
  { label: "Organizations",  href: "/admin/organizations",  icon: Building2, badge: 3 },
  { label: "Events",         href: "/admin/events",         icon: CalendarDays },
  { label: "Users",          href: "/admin/users",          icon: Users },
  { label: "Payouts",        href: "/admin/payouts",        icon: DollarSign, badge: 2 },
  { label: "Flags",          href: "/admin/flags",          icon: Flag, badge: 5 },
  { label: "Settings",       href: "/admin/settings",       icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen flex bg-neutral-950">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col bg-neutral-900 border-r border-neutral-800">
        {/* Logo */}
        <div className="flex items-center gap-2.5 h-16 border-b border-neutral-800 px-4">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Eventix</span>
          <span className="ml-auto text-xs font-semibold text-primary-400 bg-primary-950 border border-primary-800 px-1.5 py-0.5 rounded flex items-center gap-1">
            <Shield className="w-3 h-3" /> Admin
          </span>
        </div>

        {/* Admin badge */}
        <div className="px-3 py-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-neutral-800">
            <Avatar className="w-7 h-7 flex-shrink-0">
              <AvatarFallback className="bg-primary-700 text-white text-xs font-bold">SA</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-200 truncate">Super Admin</p>
              <p className="text-xs text-neutral-500 truncate">admin@eventix.io</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon, badge }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "gradient-primary text-white shadow-sm"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {badge && !active && (
                  <span className="w-5 h-5 bg-danger-600 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-neutral-800">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center px-6 gap-4">
          <div className="flex-1" />
          <button className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors relative">
            <Bell className="w-4 h-4 text-neutral-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-danger-500 rounded-full" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-neutral-800 rounded-xl px-2 py-1.5 transition-colors">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-primary-700 text-white text-xs font-bold">SA</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-neutral-300">Super Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-neutral-800 border-neutral-700 text-neutral-200">
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem className="gap-2 text-danger-400 focus:bg-neutral-700 focus:text-danger-400">
                <LogOut className="w-4 h-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto bg-neutral-950">
          {children}
        </main>
      </div>
    </div>
  );
}
