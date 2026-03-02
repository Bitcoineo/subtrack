import { auth } from "@/auth";
import { PLANS } from "@/lib/plans";
import { Nav } from "../nav";
import { PricingClient } from "./pricing-client";

export default async function PricingPage() {
  const session = await auth();

  const navUser = session?.user
    ? { name: session.user.name, email: session.user.email }
    : null;

  const pricingUser = session?.user
    ? {
        id: session.user.id,
        plan: session.user.plan,
        subscriptionStatus: session.user.subscriptionStatus,
      }
    : null;

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

  return (
    <div className="min-h-screen bg-white">
      <Nav user={navUser} />
      <PricingClient user={pricingUser} priceIds={priceIds} />
    </div>
  );
}
