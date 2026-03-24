import Link from "next/link";
import { redirect } from "next/navigation";
import { Zap, Ticket, Package, Bookmark, User, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";
import { AttendeeLogoutButton } from "./logout-button";

const navItems = [
  { href: "/my/tickets",  label: "My Tickets",  icon: Ticket },
  { href: "/my/orders",   label: "My Orders",   icon: Package },
  { href: "/my/saved",    label: "Saved Events", icon: Bookmark },
  { href: "/my/profile",  label: "Profile",     icon: User },
];

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default async function AttendeeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || "User";
  const displayEmail = profile?.email || user.email || "";
  const initials = getInitials(profile?.full_name ?? null);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top nav */}
      <header className="h-16 bg-white border-b border-neutral-100 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-neutral-900">Eventix</span>
        </Link>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:bg-neutral-100">
            <Bell className="w-4 h-4" />
          </button>
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="pt-16 max-w-5xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-3 sticky top-24">
            <div className="flex items-center gap-3 p-3 mb-2">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary-100 text-primary-700 font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-neutral-900 text-sm">{displayName}</p>
                <p className="text-xs text-neutral-400">{displayEmail}</p>
              </div>
            </div>
            <nav className="space-y-0.5">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors">
                  <Icon className="w-4 h-4" />{label}
                </Link>
              ))}
            </nav>
            <div className="mt-2 pt-2 border-t border-neutral-100">
              <AttendeeLogoutButton />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
