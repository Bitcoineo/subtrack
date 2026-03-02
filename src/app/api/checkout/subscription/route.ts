import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSubscriptionCheckout } from "@/lib/subscriptions";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { priceId } = body as { priceId?: string };

  if (!priceId || typeof priceId !== "string") {
    return NextResponse.json(
      { error: "priceId is required" },
      { status: 400 }
    );
  }

  const result = await createSubscriptionCheckout(
    session.user.id,
    session.user.email,
    priceId
  );

  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ url: result.data.checkoutUrl });
}
