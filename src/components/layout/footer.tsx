import Link from "next/link";
import { Zap, Linkedin, Facebook, Instagram, Twitter } from "lucide-react";

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/company/eventix", icon: Linkedin },
  { label: "Facebook", href: "https://facebook.com/eventix", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com/eventix", icon: Instagram },
  { label: "Twitter", href: "https://twitter.com/eventix", icon: Twitter },
];

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 text-neutral-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="py-14 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo only */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-neutral-900 text-lg">Eventix</span>
            </Link>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 mb-4">Features</h3>
            <ul className="space-y-3">
              {[
                { label: "Browse Events", href: "/events" },
                { label: "Sell Tickets", href: "/register" },
                { label: "Check-In App", href: "/register" },
                { label: "Organizer Dashboard", href: "/dashboard" },
                { label: "Analytics", href: "/dashboard/analytics" },
                { label: "Promo Codes", href: "/dashboard/promo-codes" },
                { label: "Exhibitor Portal", href: "/exhibitor" },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm hover:text-primary-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Eventix + For Organisers */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-4">More Eventix</h3>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Careers", href: "/careers" },
                  { label: "Contact", href: "/contact" },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm hover:text-primary-600 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-4">For Organisers</h3>
              <ul className="space-y-3">
                {[
                  { label: "Pricing", href: "/#pricing" },
                  { label: "Create an Event", href: "/register" },
                  { label: "Contact Sales", href: "/contact" },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm hover:text-primary-600 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Direct contact + Office */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-4">Direct contact</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:hello@eventix.io" className="text-sm text-primary-600 hover:underline">
                    hello@eventix.io
                  </a>
                </li>
                <li>
                  <a href="tel:+60312345678" className="text-sm text-primary-600 hover:underline">
                    +60 3-1234 5678
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-4">Office</h3>
              <address className="not-italic text-sm text-primary-600 leading-relaxed">
                Level 12, Menara TM<br />
                Jalan Pantai Baru<br />
                59200 Kuala Lumpur<br />
                Malaysia
              </address>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-neutral-400 max-w-sm">
            Eventix is a Malaysian event ticketing platform that helps organizers sell tickets, manage attendees, and run seamless events of any scale.
          </p>
          <div className="flex gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Legal bottom */}
        <div className="py-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Eventix Sdn. Bhd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span>Privacy Statement</span>
            <span>Terms & Conditions (Buyers)</span>
            <span>Terms & Conditions (Organisers)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
