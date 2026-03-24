"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { OAuthButtons } from "@/components/shared/oauth-buttons";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Welcome back</h1>
        <p className="text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary-600 font-medium hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>

      {/* OAuth */}
      <OAuthButtons action="login" />

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <Separator className="flex-1" />
        <span className="text-xs text-neutral-400 font-medium">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="h-11 border-neutral-200 focus-visible:ring-primary-500"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary-600 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="h-11 pr-10 border-neutral-200 focus-visible:ring-primary-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <Checkbox id="remember" className="border-neutral-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600" />
          <Label htmlFor="remember" className="text-sm text-neutral-600 cursor-pointer">
            Remember me for 30 days
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 gradient-primary text-white border-0 font-semibold text-sm shadow-sm hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Footer note */}
      <p className="text-center text-xs text-neutral-400 mt-8">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-neutral-600">Terms of Service</Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline hover:text-neutral-600">Privacy Policy</Link>.
      </p>
    </div>
  );
}
