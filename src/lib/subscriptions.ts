import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function createSubscriptionCheckout(
  userId: string,
  userEmail: string,
  priceId: string
): Promise<
  { data: { checkoutUrl: string }; error: null } | { data: null; error: string }
> {
  try {
    // Look up or create Stripe customer
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    let stripeCustomerId = user?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;

      await db
        .update(users)
        .set({ stripeCustomerId })
        .where(eq(users.id, userId));
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: { userId },
    });

    if (!session.url) {
      return { data: null, error: "Failed to create checkout session" };
    }

    return { data: { checkoutUrl: session.url }, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown checkout error";
    return { data: null, error: message };
  }
}

export async function createBillingPortalSession(
  stripeCustomerId: string
): Promise<
  { data: { portalUrl: string }; error: null } | { data: null; error: string }
> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing`,
    });

    return { data: { portalUrl: session.url }, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown portal error";
    return { data: null, error: message };
  }
}
