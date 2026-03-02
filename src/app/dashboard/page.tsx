import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getUserProjects } from "@/lib/projects";
import { PLANS, type PlanId } from "@/lib/plans";

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
      : "unlimited";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {dbUser.name ?? "there"}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {planConfig.name} plan
          </span>
          {dbUser.subscriptionStatus && (
            <span className="text-sm text-gray-500">
              &middot; {dbUser.subscriptionStatus}
            </span>
          )}
          {dbUser.currentPeriodEnd && (
            <span className="text-sm text-gray-500">
              &middot; Next billing:{" "}
              {new Date(dbUser.currentPeriodEnd).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Projects</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {projectCount}
            <span className="text-lg font-normal text-gray-500">
              {" "}
              / {limitLabel}
            </span>
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Plan</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 capitalize">
            {plan}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Billing Period</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 capitalize">
            {dbUser.planPeriod ?? "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/projects"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-400 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Manage Projects
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create, view, and delete your projects
          </p>
        </Link>
        <Link
          href="/dashboard/billing"
          className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-400 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">Billing</h3>
          <p className="mt-1 text-sm text-gray-500">
            View plan details and manage your subscription
          </p>
        </Link>
      </div>
    </div>
  );
}
