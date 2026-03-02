"use client";

import { useState } from "react";
import Link from "next/link";

type BillingPeriod = "monthly" | "yearly";

interface UserInfo {
  id: string;
  plan: string;
  subscriptionStatus: string | null;
}

interface PriceIds {
  pro: { monthly: string; yearly: string };
  enterprise: { monthly: string; yearly: string };
}

const plans = [
  {
    id: "free" as const,
    name: "Free",
    description: "Get started with the basics",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["Up to 3 projects", "Basic analytics", "Community support"],
    popular: false,
  },
  {
    id: "pro" as const,
    name: "Pro",
    description: "Everything you need to grow",
    monthlyPrice: 1900,
    yearlyPrice: 19000,
    features: [
      "Unlimited projects",
      "Full analytics",
      "Priority support",
      "Everything in Free",
    ],
    popular: true,
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    description: "For teams that need it all",
    monthlyPrice: 4900,
    yearlyPrice: 49000,
    features: [
      "Unlimited projects",
      "Full analytics",
      "Priority support",
      "Team members",
      "API access",
      "Custom branding",
      "Everything in Pro",
    ],
    popular: false,
  },
];

const badgeColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  pro: "bg-blue-50 text-accent",
  enterprise: "bg-purple-50 text-purple-600",
};

function formatPrice(cents: number): string {
  return cents === 0 ? "Free" : `$${(cents / 100).toFixed(0)}`;
}

function savingsPercent(monthly: number, yearly: number): number {
  if (monthly === 0) return 0;
  return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100);
}

export function PricingClient({
  user,
  priceIds,
}: {
  user: UserInfo | null;
  priceIds: PriceIds;
}) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const isCurrentPlan = (planId: string) => {
    if (!user) return false;
    if (planId === "free" && user.plan === "free") return true;
    return (
      planId === user.plan &&
      !!user.subscriptionStatus &&
      ["active", "past_due"].includes(user.subscriptionStatus)
    );
  };

  const handleSubscribe = async (planId: "pro" | "enterprise") => {
    if (!user) return;

    const priceId = priceIds[planId][period];
    if (!priceId) return;

    setLoading(planId);
    try {
      const res = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(null);
    }
  };

  return (
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-[#191C1F] tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Period toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex rounded-full bg-[#F7F7F7] p-1">
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                period === "monthly"
                  ? "bg-white text-[#191C1F] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                period === "yearly"
                  ? "bg-white text-[#191C1F] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const price =
              period === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const savings = savingsPercent(plan.monthlyPrice, plan.yearlyPrice);
            const isCurrent = isCurrentPlan(plan.id);
            const isProCard = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl p-7 flex flex-col ${
                  isProCard
                    ? "border-2 border-[#191C1F] shadow-sm"
                    : "border border-gray-200"
                }`}
              >
                {isProCard && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${badgeColors[plan.id]}`}>
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-[#191C1F]">
                    {plan.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-[#191C1F]">
                      {formatPrice(price)}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-400 text-sm">
                        /{period === "monthly" ? "mo" : "yr"}
                      </span>
                    )}
                  </div>
                  {period === "yearly" && savings > 0 && (
                    <span className="inline-block mt-2 text-xs font-medium text-[#00B85E] bg-green-50 px-2.5 py-0.5 rounded-full">
                      Save {savings}%
                    </span>
                  )}
                </div>

                {/* CTA */}
                {isCurrent ? (
                  <div className="text-center py-2.5 px-4 rounded-full font-medium text-sm mb-6 bg-gray-100 text-gray-400 cursor-default">
                    Current Plan
                  </div>
                ) : plan.id === "free" ? (
                  <Link
                    href={user ? "/dashboard" : "/auth/signin"}
                    className="block text-center py-2.5 px-4 rounded-full font-medium text-sm transition-colors duration-150 mb-6 bg-[#191C1F] text-white hover:bg-[#2a2d31]"
                  >
                    {user ? "Dashboard" : "Get Started"}
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      user
                        ? handleSubscribe(plan.id as "pro" | "enterprise")
                        : (window.location.href = "/auth/signin")
                    }
                    disabled={loading === plan.id}
                    className="w-full text-center py-2.5 px-4 rounded-full font-medium text-sm transition-colors duration-150 mb-6 disabled:opacity-50 bg-[#191C1F] text-white hover:bg-[#2a2d31]"
                  >
                    {loading === plan.id ? "Redirecting..." : "Subscribe"}
                  </button>
                )}

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-gray-500"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 text-gray-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </main>
  );
}
