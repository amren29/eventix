"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { OAuthButtons } from "@/components/shared/oauth-buttons";
import { cn } from "@/lib/utils";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "One number", pass: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["bg-danger-400", "bg-warning-500", "bg-success-500"];
  const labels = ["Weak", "Fair", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex gap-1 h-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-full transition-all duration-300",
              i < score ? colors[score - 1] : "bg-neutral-200"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-neutral-400">
        Strength:{" "}
        <span className={cn(
          "font-semibold",
          score === 1 && "text-danger-500",
          score === 2 && "text-warning-600",
          score === 3 && "text-success-600"
        )}>
          {labels[score - 1] ?? "Too short"}
        </span>
      </p>
      {/* Checklist */}
      <ul className="space-y-1">
        {checks.map(({ label, pass }) => (
          <li key={label} className="flex items-center gap-1.5 text-xs text-neutral-400">
            <CheckCircle2 className={cn("w-3.5 h-3.5", pass ? "text-success-500" : "text-neutral-300")} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get("first-name") as string;
    const lastName = formData.get("last-name") as string;
    const email = formData.get("email") as string;
    const orgName = formData.get("org") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`.trim(),
          org_name: orgName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Create your account</h1>
        <p className="text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* OAuth */}
      <OAuthButtons action="register" />

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <Separator className="flex-1" />
        <span className="text-xs text-neutral-400 font-medium">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="first-name" className="text-sm font-medium text-neutral-700">
              First name
            </Label>
            <Input
              id="first-name"
              name="first-name"
              type="text"
              placeholder="Ahmad"
              autoComplete="given-name"
              required
              className="h-11 border-neutral-200 focus-visible:ring-primary-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last-name" className="text-sm font-medium text-neutral-700">
              Last name
            </Label>
            <Input
              id="last-name"
              name="last-name"
              type="text"
              placeholder="Razali"
              autoComplete="family-name"
              required
              className="h-11 border-neutral-200 focus-visible:ring-primary-500"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
            Work email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
            className="h-11 border-neutral-200 focus-visible:ring-primary-500"
          />
        </div>

        {/* Organization */}
        <div className="space-y-1.5">
          <Label htmlFor="org" className="text-sm font-medium text-neutral-700">
            Organization name
          </Label>
          <Input
            id="org"
            name="org"
            type="text"
            placeholder="e.g. Bass Nation Events"
            required
            className="h-11 border-neutral-200 focus-visible:ring-primary-500"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <PasswordStrength password={password} />
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="terms"
            required
            className="mt-0.5 border-neutral-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
          />
          <Label htmlFor="terms" className="text-sm text-neutral-600 cursor-pointer leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
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
              Creating account...
            </>
          ) : (
            <>
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Plan note */}
      <div className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl">
        <p className="text-xs text-primary-700 text-center font-medium">
          🎉 Free plan includes 1 active event · No credit card required
        </p>
      </div>
    </div>
  );
}
