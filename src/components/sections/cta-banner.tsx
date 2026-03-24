import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-primary px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent-600/20 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-white/15 items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Ready to sell your first ticket?
            </h2>
            <p className="text-lg text-primary-100 max-w-xl mx-auto mb-8">
              Create your event in minutes — no credit card needed.
              Join 5,000+ organizers already using Eventix.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary-700 hover:bg-primary-50 border-0 shadow-md font-semibold text-base px-8"
                asChild
              >
                <Link href="/register">
                  Create Your Event
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 hover:text-white text-base px-8"
                asChild
              >
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-primary-200">
              Free forever for free events · No setup fees · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
