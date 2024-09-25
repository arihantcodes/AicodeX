export interface Tier {
  name: string;
  id: "free" | "starter" | "pro" | "advanced";
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: Record<string, string>;
  price: number; // Added price property
}

export const PricingTier: Tier[] = [
  {
    name: "Starter",
    id: "starter",
    icon: "/assets/icons/price-tiers/free-icon.svg",
    features: [
      "All Free features",
      "1 year access to all IDE features",
      "1 year of updates and new features",
      "Access to exclusive templates and plugins",
      "Collaborative coding for up to 3 users",
      "Git integration",
      "5GB cloud storage",
      "Priority community support",
      "24/7 email support",
    ],
    description: "Great for freelancers or small teams looking to elevate their coding experience with collaboration and advanced tools.",
    featured: false,
    priceId: {
      month: "pri_01hsxyh9txq4rzbrhbyngkhy46",
      year: "pri_01hsxyh9txq4rzbrhbyngkhy46",
    },
    price: 20, // Added price
  },
  {
    name: "Pro",
    id: "pro",
    icon: "/assets/icons/price-tiers/basic-icon.svg",
    features: [
      "All Basic features",
      "Lifetime access to all IDE features",
      "Lifetime updates and new features",
      "Exclusive lifetime templates and plugins",
      "Collaborative coding for up to 10 users",
      "Advanced Git integration with CI/CD",
      "20GB cloud storage",
      "Custom domain for your workspace",
      "Priority access to community forums",
      "24/7 email and chat support",
    ],
    description: "Ideal for professionals and teams who want a one-time investment for lifetime access to all premium features.",
    featured: true,
    priceId: {
      month: "pri_01hsxycme6m95sejkz7sbz5e9g",
      year: "pri_01hsxyeb2bmrg618bzwcwvdd6q",
    },
    price: 60, // Added price
  },
  {
    name: "Team",
    id: "advanced",
    icon: "/assets/icons/price-tiers/pro-icon.svg",
    features: [
      "All Lifetime features",
      "25 team members",
      "Dedicated community forum for your team",
      "24/7 priority support with a dedicated account manager",
      "Advanced collaboration tools",
      "Enterprise-grade security features",
      "100GB cloud storage",
      "Custom integrations and API access",
    ],
    description: "Perfect for enterprises or larger development teams requiring advanced collaboration tools and custom integrations.",
    featured: false,
    priceId: {
      month: "pri_01hsxyff091kyc9rjzx7zm6yqh",
      year: "pri_01hsxyfysbzf90tkh2wqbfxwa5",
    },
    price: 100, // Added price
  },
];