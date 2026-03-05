import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getUserProjects } from "@/lib/projects";
import { PLANS, type PlanId } from "@/lib/plans";
import { CheckoutSuccessBanner } from "./checkout-success-banner";

export default async function DashboardPage() {
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
  const projectsResult = await getUserProjects(session.user.id);
  const projectCount = projectsResult.data?.length ?? 0;
  const limitLabel =
    planConfig.projectLimit !== null
      ? `${planConfig.projectLimit}`
      : "Unlimited";

  return (
    <div>
      <Suspense fallback={null}>
        <CheckoutSuccessBanner />
      </Suspense>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#191C1F] tracking-tight">
          Welcome back, {dbUser.name ?? "there"}
        </h1>
        <div className="mt-1.5 flex items-center gap-3 text-sm text-gray-500">
          <span>{planConfig.name} plan</span>
          {dbUser.subscriptionStatus && (
            <>
              <span className="text-gray-300">/</span>
              <span className="capitalize">{dbUser.subscriptionStatus}</span>
            </>
          )}
          {dbUser.currentPeriodEnd && (
            <>
              <span className="text-gray-300">/</span>
              <span>
                Next billing{" "}
                {new Date(dbUser.currentPeriodEnd).toLocaleDateString()}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <p className="text-sm text-gray-500">Projects</p>
          <p className="mt-2 text-2xl md:text-3xl font-semibold text-[#191C1F]">
            {projectCount}
            <span className="text-base font-normal text-gray-400">
              {" "}/ {limitLabel}
            </span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <p className="text-sm text-gray-500">Plan</p>
          <p className="mt-2 text-2xl md:text-3xl font-semibold text-[#191C1F] capitalize">
            {plan}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <p className="text-sm text-gray-500">Billing Period</p>
          <p className="mt-2 text-2xl md:text-3xl font-semibold text-[#191C1F] capitalize">
            {dbUser.planPeriod ?? "\u2014"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/projects"
          className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow duration-150"
        >
          <h3 className="text-base font-semibold text-[#191C1F]">
            Your projects
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Build something.
          </p>
        </Link>
        <Link
          href="/dashboard/billing"
          className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow duration-150"
        >
          <h3 className="text-base font-semibold text-[#191C1F]">Plan & billing</h3>
          <p className="mt-1 text-sm text-gray-500">
            See your plan. Change it if you want.
          </p>
        </Link>
      </div>
    </div>
  );
}
