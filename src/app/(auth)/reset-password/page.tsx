"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mismatch) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1300));
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-success-50 items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-success-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Password updated!</h1>
        <p className="text-neutral-500 mb-8">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Button
          className="w-full h-11 gradient-primary text-white border-0 font-semibold"
          asChild
        >
          <Link href="/login">
            Continue to Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="inline-flex w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center mb-6">
        <ShieldCheck className="w-6 h-6 text-primary-600" />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Set new password</h1>
        <p className="text-neutral-500">Must be at least 8 characters and include a number.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
            New password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a new password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pr-10 border-neutral-200 focus-visible:ring-primary-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirm" className="text-sm font-medium text-neutral-700">
            Confirm password
          </Label>
          <div className="relative">
            <Input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your new password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={cn(
                "h-11 pr-10 border-neutral-200 focus-visible:ring-primary-500",
                mismatch && "border-danger-400 focus-visible:ring-danger-400"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {mismatch && (
            <p className="text-xs text-danger-500 font-medium">Passwords do not match</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || mismatch || password.length < 8}
          className="w-full h-11 gradient-primary text-white border-0 font-semibold shadow-sm hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating password...</>
          ) : (
            <>Reset Password <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </form>
    </div>
  );
}
