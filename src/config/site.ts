export const siteConfig = {
  name: "Eventix",
  tagline: "Sell Tickets. Manage Events. Grow Your Audience.",
  description:
    "The all-in-one SaaS platform for event ticketing, registration, and on-site check-in. Create your event in minutes.",
  url: "https://eventix.io",
  ogImage: "https://eventix.io/og.png",
  links: {
    twitter: "https://twitter.com/eventix",
    github: "https://github.com/eventix",
  },
  nav: {
    marketing: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "For Exhibitors", href: "/exhibitors" },
      { label: "Blog", href: "/blog" },
    ],
    dashboard: [
      { label: "Dashboard", href: "/dashboard", icon: "home" },
      { label: "Events", href: "/events", icon: "calendar" },
      { label: "Orders", href: "/orders", icon: "package" },
      { label: "Attendees", href: "/attendees", icon: "users" },
      { label: "Analytics", href: "/analytics", icon: "bar-chart" },
      { label: "Promo Codes", href: "/promo-codes", icon: "tag" },
      { label: "Payouts", href: "/payouts", icon: "dollar-sign" },
      { label: "Team", href: "/team", icon: "user-plus" },
      { label: "Settings", href: "/settings", icon: "settings" },
    ],
  },
} as const;
