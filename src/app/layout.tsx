import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eventix — Sell Tickets. Manage Events. Grow Your Audience.",
    template: "%s | Eventix",
  },
  description:
    "The all-in-one SaaS platform for event ticketing, registration, and on-site check-in. Create your event in minutes.",
  keywords: ["event ticketing", "event management", "sell tickets online", "event platform"],
  openGraph: {
    title: "Eventix — Event Ticketing & Management Platform",
    description: "Sell tickets, manage events, and grow your audience with Eventix.",
    type: "website",
    locale: "en_US",
    siteName: "Eventix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventix — Event Ticketing & Management Platform",
    description: "Sell tickets, manage events, and grow your audience with Eventix.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
