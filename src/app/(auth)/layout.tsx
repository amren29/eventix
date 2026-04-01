import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col gradient-dark relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent-600/15 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Eventix</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-10 pb-10">
          <div className="max-w-sm">
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Your next
              <br />
              <span className="gradient-primary-text">sold-out event</span>
              <br />
              starts here.
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              Create, sell, and manage unforgettable events — all in one place.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 px-10 py-6 border-t border-white/10">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Eventix Inc. ·{" "}
            <Link href="/privacy" className="hover:text-neutral-400 transition-colors">Privacy</Link>
            {" · "}
            <Link href="/terms" className="hover:text-neutral-400 transition-colors">Terms</Link>
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col min-h-screen bg-white">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center justify-between p-6 border-b border-neutral-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-neutral-900">Eventix</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
