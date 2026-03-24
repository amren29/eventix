"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState<string | null>(null);

  useEffect(() => {
    // Generate a placeholder QR code from the session ID
    if (sessionId) {
      import("qrcode").then((QRCode) => {
        QRCode.toDataURL(sessionId).then((url) => setQrDataUrl(url));
      });
      // Extract a short ref for display
      setOrderRef(`EVT-${new Date().getFullYear()}-${sessionId.slice(-5).toUpperCase()}`);
    }
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">No checkout session found.</p>
        <Button asChild variant="outline">
          <Link href="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="inline-flex w-20 h-20 rounded-full bg-success-50 items-center justify-center mb-5">
          <Check className="w-10 h-10 text-success-500" />
        </div>

        <h1 className="text-2xl font-extrabold text-neutral-900 mb-2">Payment Successful!</h1>
        <p className="text-neutral-500 mb-1">Your tickets have been confirmed.</p>
        {orderRef && (
          <p className="text-sm text-neutral-400 mb-2">
            Session: <span className="font-mono text-neutral-600">{sessionId.slice(-8)}</span>
          </p>
        )}
        <p className="text-sm text-neutral-400 mb-8">
          A confirmation email with your tickets will arrive shortly.
        </p>

        {/* QR Code */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 mb-8 inline-block shadow-sm">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-40 h-40 mx-auto" />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1 border-neutral-200" asChild>
            <Link href="/events">Browse More Events</Link>
          </Button>
          <Button className="flex-1 gradient-primary text-white border-0" asChild>
            <Link href="/my/tickets">View My Tickets →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
