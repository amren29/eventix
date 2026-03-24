"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        {/* Success icon */}
        <div className="inline-flex w-16 h-16 rounded-full bg-success-50 items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-success-500" />
        </div>

        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Check your inbox</h1>
        <p className="text-neutral-500 mb-2">
          We sent a password reset link to
        </p>
        <p className="font-semibold text-neutral-800 mb-8">{email}</p>

        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-5 text-left mb-8 space-y-2">
          <p className="text-sm font-semibold text-neutral-700">Didn&apos;t receive the email?</p>
          <ul className="text-sm text-neutral-500 space-y-1 list-disc list-inside">
            <li>Check your spam or junk folder</li>
            <li>Make sure you entered the correct email</li>
            <li>Allow a few minutes for delivery</li>
          </ul>
        </div>

        <Button
          variant="outline"
          className="w-full h-11 mb-3 border-neutral-200"
          onClick={() => { setSent(false); setEmail(""); }}
        >
          Try a different email
        </Button>
        <Button
          className="w-full h-11 gradient-primary text-white border-0 font-semibold"
          onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200); }}
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resending...</>
          ) : (
            "Resend email"
          )}
        </Button>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mt-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Icon */}
      <div className="inline-flex w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center mb-6">
        <Mail className="w-6 h-6 text-primary-600" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Forgot password?</h1>
        <p className="text-neutral-500">
          No worries — enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 border-neutral-200 focus-visible:ring-primary-500"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 gradient-primary text-white border-0 font-semibold shadow-sm hover:opacity-90"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending link...</>
          ) : (
            <>Send Reset Link <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </form>

      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mt-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}
