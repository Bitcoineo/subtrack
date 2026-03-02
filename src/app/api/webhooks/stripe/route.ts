import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getPlanByPriceId } from "@/lib/plans";
import type Stripe from "stripe";

function mapStripeStatus(
  status: string
): "active" | "past_due" | "canceled" | "incomplete" {
  switch (status) {
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    default:
      return "incomplete";
  }
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscriptionId = session.subscription as string;
  if (!subscriptionId) return;

  const subscription =
    await stripe.subscriptions.retrieve(subscriptionId);

  const item = subscription.items.data[0];
  if (!item) return;

  const priceId = item.price.id;
  const planInfo = getPlanByPriceId(priceId);
  if (!planInfo) return;

  await db
    .update(users)
    .set({
      plan: planInfo.planId,
      planPeriod: planInfo.period,
      subscriptionStatus: "active",
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: session.customer as string,
      currentPeriodEnd: new Date(
        item.current_period_end * 1000
      ).toISOString(),
    })
    .where(eq(users.id, userId));
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const item = subscription.items.data[0];
  if (!item) return;

  const priceId = item.price.id;
  const planInfo = getPlanByPriceId(priceId);
  if (!planInfo) return;

  await db
    .update(users)
    .set({
      plan: planInfo.planId,
      planPeriod: planInfo.period,
      subscriptionStatus: mapStripeStatus(subscription.status),
      currentPeriodEnd: new Date(
        item.current_period_end * 1000
      ).toISOString(),
    })
    .where(eq(users.stripeSubscriptionId, subscription.id));
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  await db
    .update(users)
    .set({
      plan: "free",
      planPeriod: null,
      subscriptionStatus: "canceled",
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
    })
    .where(eq(users.stripeSubscriptionId, subscription.id));
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  if (!customerId) return;

  await db
    .update(users)
    .set({ subscriptionStatus: "active" })
    .where(eq(users.stripeCustomerId, customerId));
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  if (!customerId) return;

  await db
    .update(users)
    .set({ subscriptionStatus: "past_due" })
    .where(eq(users.stripeCustomerId, customerId));
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Webhook verification failed";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(
        event.data.object as Stripe.Subscription
      );
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(
        event.data.object as Stripe.Subscription
      );
      break;
    case "invoice.payment_succeeded":
      await handleInvoicePaymentSucceeded(
        event.data.object as Stripe.Invoice
      );
      break;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(
        event.data.object as Stripe.Invoice
      );
      break;
  }

  return NextResponse.json({ received: true });
}
