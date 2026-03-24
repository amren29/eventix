import { Hero } from "@/components/sections/hero";
import { SocialProof } from "@/components/sections/social-proof";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Features } from "@/components/sections/features";
import { EventCategories } from "@/components/sections/event-categories";
import { AnalyticsPreview } from "@/components/sections/analytics-preview";
import { Pricing } from "@/components/sections/pricing";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { CTABanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <EventCategories />
      <AnalyticsPreview />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  );
}
