"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";

export interface UserData {
  email: string;
  name: string;
  avatarUrl: string;
  orgName: string;
  orgSlug: string;
  orgPlan: string;
}

export function AppShellClient({ children, userData }: { children: React.ReactNode; userData: UserData }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} userData={userData} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppTopbar userData={userData} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
