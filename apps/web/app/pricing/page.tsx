"use client"

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { useState } from "react";

export default function PricingSection() {
  const [activePlan, setActivePlan] = useState("Free"); // Default active plan

  const pricingTiers = [
    {
      name: "Free",
      price: 0,
      period: "Forever",
      buttonText: "Get Started",
      features: [
        "Basic IDE features",
        "1GB cloud storage",
        "Public repositories only",
        "Community support",
        "Limited to 1 user",
      ],
      description: "Perfect for individuals who are just getting started with coding and want to explore the basics."
    },
    {
      name: "Basic",
      price: 129,
      originalPrice: 199,
      discount: "35% OFF",
      period: "Paid yearly",
      buttonText: "Get Basic Pro",
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
      description: "Great for freelancers or small teams looking to elevate their coding experience with collaboration and advanced tools."
    },
    {
      name: "Lifetime",
      price: 169,
      originalPrice: 299,
      discount: "43% OFF",
      period: "One-time Purchase",
      buttonText: "Get Lifetime Pro",
      featured: true,
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
      description: "Ideal for professionals and teams who want a one-time investment for lifetime access to all premium features."
    },
    {
      name: "Team",
      price: 790,
      originalPrice: 1490,
      discount: "47% OFF",
      period: "One-time Purchase",
      buttonText: "Get Teams Pro",
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
      description: "Perfect for enterprises or larger development teams requiring advanced collaboration tools and custom integrations."
    }
  ];

  return (
    <>
      <Navbar />
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Get instant access to AICodeX</h2>
          <p className="text-xl text-center mb-12 text-gray-400">
            Choose the perfect plan for your development needs, from free to enterprise-level solutions.
          </p>
          
          {/* Plan Switcher */}
          <div className="flex justify-center mb-8 space-x-4">
            {pricingTiers.map((tier, index) => (
              <button
                key={index}
                onClick={() => setActivePlan(tier.name)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  activePlan === tier.name ? "bg-[#020817] text-white" : "bg-gray-200 text-black"
                }`}
              >
                {tier.name}
              </button>
            ))}
          </div>
          
          {/* Pricing Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingTiers
              .filter(tier => tier.name === activePlan)
              .map((tier, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-8 border-2 ${
                    tier.featured ? "border-[#020817]" : "border-gray-700"
                  } flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">{tier.name}</h3>
                        <p className="text-sm text-gray-400">{tier.period}</p>
                      </div>
                      {tier.featured && (
                        <span className="bg-[#020817] text-white text-xs font-semibold px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <span className="text-5xl font-bold">${tier.price}</span>
                      {tier.originalPrice && (
                        <>
                          <span className="text-lg line-through text-gray-500 ml-2">
                            ${tier.originalPrice}
                          </span>
                          <span className="text-sm bg-green-800 text-green-200 px-2 py-1 rounded ml-2">
                            {tier.discount}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-400 mb-6">{tier.description}</p>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full" variant={tier.featured ? "default" : "outline"}>
                    {tier.buttonText}
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
