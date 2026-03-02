export type PlanId = "free" | "pro" | "enterprise";
export type BillingPeriod = "monthly" | "yearly";
export type Feature =
  | "projects"
  | "analytics"
  | "priority_support"
  | "team_members"
  | "api_access"
  | "custom_branding";

interface PlanConfig {
  id: PlanId;
  name: string;
  description: string;
  tier: number;
  monthlyPrice: number; // cents
  yearlyPrice: number; // cents
  projectLimit: number | null; // null = unlimited
  features: Feature[];
  featureLabels: string[];
  stripePriceIds: {
    monthly: string | null;
    yearly: string | null;
  };
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    description: "For solo projects and testing.",
    tier: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    projectLimit: 3,
    features: ["projects", "analytics"],
    featureLabels: ["Up to 3 projects", "Basic usage stats", "Community support"],
    stripePriceIds: { monthly: null, yearly: null },
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For teams shipping real products.",
    tier: 1,
    monthlyPrice: 1900,
    yearlyPrice: 19000,
    projectLimit: null,
    features: ["projects", "analytics", "priority_support"],
    featureLabels: [
      "Unlimited projects",
      "Full analytics dashboard",
      "Priority email support",
      "Everything in Free",
    ],
    stripePriceIds: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? null,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? null,
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "For companies that need control.",
    tier: 2,
    monthlyPrice: 4900,
    yearlyPrice: 49000,
    projectLimit: null,
    features: [
      "projects",
      "analytics",
      "priority_support",
      "team_members",
      "api_access",
      "custom_branding",
    ],
    featureLabels: [
      "Unlimited projects",
      "Full analytics dashboard",
      "Dedicated support",
      "Invite your whole team",
      "Full API access",
      "White-label branding",
      "Everything in Pro",
    ],
    stripePriceIds: {
      monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID ?? null,
      yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID ?? null,
    },
  },
};

/** Look up plan from a Stripe price ID (used in webhook handlers) */
export function getPlanByPriceId(
  priceId: string
): { planId: PlanId; period: BillingPeriod } | null {
  for (const plan of Object.values(PLANS)) {
    if (plan.stripePriceIds.monthly === priceId) {
      return { planId: plan.id, period: "monthly" };
    }
    if (plan.stripePriceIds.yearly === priceId) {
      return { planId: plan.id, period: "yearly" };
    }
  }
  return null;
}

interface AccessResult {
  allowed: boolean;
  limit?: number | null;
  reason?: string;
}

/** Feature gating check */
export function canAccess(
  user: { plan: PlanId; subscriptionStatus?: string | null },
  feature: Feature,
  context?: { currentCount?: number }
): AccessResult {
  const plan = PLANS[user.plan];

  // Paid plans require active subscription
  if (plan.tier > 0) {
    const validStatuses = ["active", "past_due"];
    if (
      !user.subscriptionStatus ||
      !validStatuses.includes(user.subscriptionStatus)
    ) {
      return canAccess(
        { plan: "free", subscriptionStatus: null },
        feature,
        context
      );
    }
  }

  if (!plan.features.includes(feature)) {
    return {
      allowed: false,
      reason: `${plan.name} plan does not include ${feature}`,
    };
  }

  // Check project limit
  if (feature === "projects" && plan.projectLimit !== null) {
    const currentCount = context?.currentCount ?? 0;
    if (currentCount >= plan.projectLimit) {
      return {
        allowed: false,
        limit: plan.projectLimit,
        reason: `${plan.name} plan is limited to ${plan.projectLimit} projects`,
      };
    }
    return { allowed: true, limit: plan.projectLimit };
  }

  return { allowed: true };
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function yearlySavingsPercent(
  monthlyPrice: number,
  yearlyPrice: number
): number {
  if (monthlyPrice === 0) return 0;
  const monthlyTotal = monthlyPrice * 12;
  return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
}
