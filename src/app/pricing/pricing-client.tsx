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
    highlighted: false,
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
    highlighted: true,
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
    highlighted: false,
  },
];

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
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold text-foreground">
          SubTrack
        </Link>
        {user ? (
          <Link
            href="/dashboard"
            className="text-sm font-medium text-foreground hover:opacity-80"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-foreground hover:opacity-80"
          >
            Sign in
          </Link>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade at
            any time.
          </p>
        </div>

        {/* Billing period toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex rounded-full border border-foreground/10 p-1">
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                period === "monthly"
                  ? "bg-foreground text-background"
                  : "text-foreground/40 hover:text-foreground/60"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("yearly")}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                period === "yearly"
                  ? "bg-foreground text-background"
                  : "text-foreground/40 hover:text-foreground/60"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const price =
              period === "monthly"
                ? plan.monthlyPrice
                : plan.yearlyPrice;
            const savings = savingsPercent(
              plan.monthlyPrice,
              plan.yearlyPrice
            );
            const isCurrent = isCurrentPlan(plan.id);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.highlighted
                    ? "border-2 border-blue-600 shadow-lg shadow-blue-600/10"
                    : "border border-foreground/10"
                }`}
              >
                {plan.popular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    {plan.name}
                  </h2>
                  <p className="text-sm text-foreground/60">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {formatPrice(price)}
                    </span>
                    {price > 0 && (
                      <span className="text-foreground/40 text-sm">
                        /{period === "monthly" ? "mo" : "yr"}
                      </span>
                    )}
                  </div>
                  {period === "yearly" && savings > 0 && (
                    <span className="inline-block mt-2 text-xs font-medium text-green-600 bg-green-600/10 px-2 py-0.5 rounded-full">
                      Save {savings}%
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                {isCurrent ? (
                  <div className="block text-center py-2.5 px-4 rounded-lg font-medium text-sm mb-8 bg-foreground/5 text-foreground/40 cursor-default">
                    Current Plan
                  </div>
                ) : plan.id === "free" ? (
                  <Link
                    href={user ? "/dashboard" : "/auth/signin"}
                    className="block text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors mb-8 bg-foreground text-background hover:opacity-90"
                  >
                    {user ? "Dashboard" : "Get Started"}
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      user
                        ? handleSubscribe(
                            plan.id as "pro" | "enterprise"
                          )
                        : (window.location.href = "/auth/signin")
                    }
                    disabled={loading === plan.id}
                    className={`block w-full text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors mb-8 disabled:opacity-50 ${
                      plan.highlighted
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-foreground text-background hover:opacity-90"
                    }`}
                  >
                    {loading === plan.id
                      ? "Redirecting..."
                      : "Subscribe"}
                  </button>
                )}

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 text-blue-600 shrink-0"
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
    </div>
  );
}
