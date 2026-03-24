"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, Package, Users, BarChart2,
  Tag, DollarSign, UserPlus, Settings, Zap, ChevronLeft,
  ChevronRight, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { label: "Dashboard",   href: "/dashboard",             icon: LayoutDashboard },
  { label: "Events",      href: "/dashboard/events",      icon: CalendarDays },
  { label: "Orders",      href: "/dashboard/orders",      icon: Package },
  { label: "Attendees",   href: "/dashboard/attendees",   icon: Users },
  { label: "Analytics",   href: "/dashboard/analytics",   icon: BarChart2 },
  { label: "Promo Codes", href: "/dashboard/promo-codes", icon: Tag },
  { label: "Payouts",     href: "/dashboard/payouts",     icon: DollarSign },
  { label: "Team",        href: "/dashboard/team",        icon: UserPlus },
  { label: "Settings",    href: "/dashboard/settings",    icon: Settings },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-white border-r border-neutral-100 transition-all duration-300 ease-in-out flex-shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 border-b border-neutral-100 px-4 flex-shrink-0",
        collapsed ? "justify-center" : "gap-2.5"
      )}>
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-neutral-900 text-lg tracking-tight truncate">Eventix</span>
        )}
      </div>

      {/* Org info */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-neutral-50">
            <Avatar className="w-7 h-7 flex-shrink-0">
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-bold">BN</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-800 truncate">Bass Nation Events</p>
              <Badge className="text-[10px] px-1.5 py-0 h-4 bg-primary-50 text-primary-700 border-primary-100 font-medium">
                Pro Plan
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          const item = (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                collapsed ? "justify-center" : "",
                active
                  ? "gradient-primary text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-white" : "")} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={href}>
                <TooltipTrigger asChild>{item}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">{label}</TooltipContent>
              </Tooltip>
            );
          }
          return item;
        })}
      </nav>

      {/* Upgrade banner */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-primary-50 border border-primary-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-primary-600" />
            <p className="text-xs font-semibold text-primary-700">Upgrade to Enterprise</p>
          </div>
          <p className="text-xs text-primary-600/80 mb-2">White-label, custom domain & more.</p>
          <Link
            href="/dashboard/settings/billing"
            className="block text-center text-xs font-semibold text-primary-700 bg-white border border-primary-200 rounded-lg py-1.5 hover:bg-primary-50 transition-colors"
          >
            View Plans
          </Link>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-700 shadow-sm hover:shadow transition-all z-10"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
