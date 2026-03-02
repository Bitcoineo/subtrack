import { auth } from "@/auth";
import { PLANS } from "@/lib/plans";
import { PricingClient } from "./pricing-client";

export default async function PricingPage() {
  const session = await auth();

  const user = session?.user
    ? {
        id: session.user.id,
        plan: session.user.plan,
        subscriptionStatus: session.user.subscriptionStatus,
      }
    : null;

  // Pass server-side price IDs to client
  const priceIds = {
    pro: {
      monthly: PLANS.pro.stripePriceIds.monthly ?? "",
      yearly: PLANS.pro.stripePriceIds.yearly ?? "",
    },
    enterprise: {
      monthly: PLANS.enterprise.stripePriceIds.monthly ?? "",
      yearly: PLANS.enterprise.stripePriceIds.yearly ?? "",
    },
  };

  return <PricingClient user={user} priceIds={priceIds} />;
}
