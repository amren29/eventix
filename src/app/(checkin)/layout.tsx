import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Check-In | Eventix", template: "%s | Eventix Check-In" },
  description: "Eventix staff check-in application",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Eventix Check-In" },
};

export default function CheckInLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {children}
    </div>
  );
}
