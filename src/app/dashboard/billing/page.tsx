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

  const statusColors: Record<string, string> = {
    active: "bg-green-50 text-[#00B85E]",
    past_due: "bg-red-50 text-[#E5484D]",
    canceled: "bg-gray-100 text-gray-500",
    incomplete: "bg-gray-100 text-gray-500",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#191C1F] tracking-tight mb-6">
        Plan & billing
      </h1>

      {isPastDue && (
        <div className="mb-6 rounded-xl bg-red-50 px-5 py-4">
          <p className="text-sm font-medium text-[#E5484D]">
            Your last payment didn&apos;t go through. Update your card to keep your access.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#191C1F]">
              {planConfig.name} Plan
            </h2>
            {!isFree && (
              <p className="mt-1 text-sm text-gray-500">
                {formatPrice(
                  dbUser.planPeriod === "yearly"
                    ? planConfig.yearlyPrice
                    : planConfig.monthlyPrice
                )}
                /{dbUser.planPeriod === "yearly" ? "year" : "month"}
              </p>
            )}
            {isFree && (
              <p className="mt-1 text-sm text-gray-500">
                Free. No card needed. No tricks.
              </p>
            )}
          </div>
          {dbUser.subscriptionStatus && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                statusColors[dbUser.subscriptionStatus] ?? statusColors.incomplete
              }`}
            >
              {dbUser.subscriptionStatus}
            </span>
          )}
        </div>

        {!isFree && (
          <div className="mt-5 space-y-2 text-sm text-gray-500">
            <p>
              Billing period:{" "}
              <span className="font-medium text-[#191C1F] capitalize">
                {dbUser.planPeriod}
              </span>
            </p>
            {dbUser.currentPeriodEnd && (
              <p>
                Next billing date:{" "}
                <span className="font-medium text-[#191C1F]">
                  {new Date(dbUser.currentPeriodEnd).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-medium text-[#191C1F] mb-3">
            What you get
          </h3>
          <ul className="space-y-2.5">
            {planConfig.featureLabels.map((label) => (
              <li key={label} className="flex items-center text-sm text-gray-500">
                <svg
                  className="mr-2.5 h-4 w-4 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
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
              className="inline-flex items-center px-6 py-2.5 bg-[#191C1F] text-white text-sm font-medium rounded-full hover:bg-[#2a2d31] transition-colors duration-150"
            >
              See paid plans
            </Link>
          ) : (
            <ManageSubscriptionButton />
          )}
        </div>
      </div>
    </div>
  );
}
