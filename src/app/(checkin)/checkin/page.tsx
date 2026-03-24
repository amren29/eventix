"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CheckInLoginPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const VALID_CODE = "KL-2026";

  function handleDigit(d: string) {
    if (code.length < 7) setCode((c) => c + d);
    setError("");
  }
  function handleDelete() { setCode((c) => c.slice(0, -1)); setError(""); }

  async function handleSubmit() {
    if (code.length < 4) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    if (code.toUpperCase() === VALID_CODE) {
      window.location.href = "/checkin/1/gate";
    } else {
      setError("Invalid access code. Please check with your event organizer.");
      setCode("");
    }
  }

  const KEYPAD = ["1","2","3","4","5","6","7","8","9","-","0","⌫"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-950">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold text-xl">Eventix</span>
      </div>

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-primary-600/20 items-center justify-center mb-4">
            <KeyRound className="w-7 h-7 text-primary-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-2">Staff Check-In</h1>
          <p className="text-neutral-400 text-sm">Enter the access code provided by your event organizer.</p>
        </div>

        {/* Code display */}
        <div className={cn(
          "h-16 bg-neutral-900 border-2 rounded-2xl flex items-center justify-center mb-6 transition-colors",
          error ? "border-danger-500" : code.length > 0 ? "border-primary-500" : "border-neutral-700"
        )}>
          {code ? (
            <span className="text-3xl font-mono font-bold tracking-[0.3em] text-white">{code}</span>
          ) : (
            <span className="text-neutral-600 text-sm">Enter access code</span>
          )}
        </div>

        {error && (
          <p className="text-center text-danger-400 text-sm mb-4">{error}</p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {KEYPAD.map((k) => (
            <button
              key={k}
              onClick={() => k === "⌫" ? handleDelete() : handleDigit(k)}
              className={cn(
                "h-14 rounded-2xl text-lg font-bold transition-all active:scale-95",
                k === "⌫"
                  ? "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  : "bg-neutral-800 text-white hover:bg-neutral-700 active:bg-neutral-600"
              )}
            >
              {k}
            </button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={code.length < 4 || loading}
          className="w-full h-13 py-3.5 gradient-primary text-white border-0 font-semibold text-base shadow-lg hover:opacity-90 disabled:opacity-40"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying...</>
          ) : (
            <>Continue <ArrowRight className="w-5 h-5 ml-2" /></>
          )}
        </Button>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
            Sign in with your account instead →
          </Link>
        </div>
      </div>
    </div>
  );
}
