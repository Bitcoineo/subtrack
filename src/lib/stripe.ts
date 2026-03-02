import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

interface StripePlanSetupResult {
  proMonthlyPriceId: string;
  proYearlyPriceId: string;
  enterpriseMonthlyPriceId: string;
  enterpriseYearlyPriceId: string;
}

export async function setupStripePlans(): Promise<
  { data: StripePlanSetupResult; error: null } | { data: null; error: string }
> {
  try {
    // Create Pro product + prices
    const proProduct = await stripe.products.create({
      name: "SubTrack Pro",
      description: "Unlimited projects, full analytics, priority support",
    });

    const proMonthly = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 1900,
      currency: "usd",
      recurring: { interval: "month" },
    });

    const proYearly = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 19000,
      currency: "usd",
      recurring: { interval: "year" },
    });

    // Create Enterprise product + prices
    const enterpriseProduct = await stripe.products.create({
      name: "SubTrack Enterprise",
      description:
        "Everything in Pro plus team members, API access, custom branding",
    });

    const enterpriseMonthly = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 4900,
      currency: "usd",
      recurring: { interval: "month" },
    });

    const enterpriseYearly = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 49000,
      currency: "usd",
      recurring: { interval: "year" },
    });

    return {
      data: {
        proMonthlyPriceId: proMonthly.id,
        proYearlyPriceId: proYearly.id,
        enterpriseMonthlyPriceId: enterpriseMonthly.id,
        enterpriseYearlyPriceId: enterpriseYearly.id,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Stripe error";
    return { data: null, error: message };
  }
}
