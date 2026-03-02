import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { PLANS, formatPrice, type PlanId } from "@/lib/plans";
import { ManageSubscriptionButton } from "./manage-button";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!dbUser) {
    redirect("/auth/signin");
  }

  const plan = (dbUser.plan ?? "free") as PlanId;
  const planConfig = PLANS[plan];
  const isFree = plan === "free";
  const isPastDue = dbUser.subscriptionStatus === "past_due";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing</h1>

      {isPastDue && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-800">
            Payment failed — please update your payment method to keep your
            subscription active.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {planConfig.name} Plan
            </h2>
            {!isFree && (
              <p className="mt-1 text-sm text-gray-600">
                {formatPrice(
                  dbUser.planPeriod === "yearly"
                    ? planConfig.yearlyPrice
                    : planConfig.monthlyPrice
                )}
                /{dbUser.planPeriod === "yearly" ? "year" : "month"}
              </p>
            )}
            {isFree && (
              <p className="mt-1 text-sm text-gray-600">
                Free forever — no credit card required
              </p>
            )}
          </div>
          {dbUser.subscriptionStatus && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                dbUser.subscriptionStatus === "active"
                  ? "bg-green-100 text-green-800"
                  : dbUser.subscriptionStatus === "past_due"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {dbUser.subscriptionStatus}
            </span>
          )}
        </div>

        {!isFree && (
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>
              Billing period:{" "}
              <span className="font-medium capitalize">
                {dbUser.planPeriod}
              </span>
            </p>
            {dbUser.currentPeriodEnd && (
              <p>
                Next billing date:{" "}
                <span className="font-medium">
                  {new Date(dbUser.currentPeriodEnd).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>
        )}

        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Plan features
          </h3>
          <ul className="space-y-2">
            {planConfig.featureLabels.map((label) => (
              <li key={label} className="flex items-center text-sm text-gray-600">
                <svg
                  className="mr-2 h-4 w-4 text-green-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          {isFree ? (
            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Upgrade your plan
            </Link>
          ) : (
            <ManageSubscriptionButton />
          )}
        </div>
      </div>
    </div>
  );
}
