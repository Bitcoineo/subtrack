import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProjects } from "@/lib/projects";
import { canAccess, PLANS, type PlanId } from "@/lib/plans";
import { ProjectsClient } from "./projects-client";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const plan = (session.user.plan ?? "free") as PlanId;
  const result = await getUserProjects(session.user.id);
  const projects = result.data ?? [];

  const access = canAccess(
    { plan, subscriptionStatus: session.user.subscriptionStatus },
    "projects",
    { currentCount: projects.length }
  );

  const planConfig = PLANS[plan];
  const limit = planConfig.projectLimit;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#191C1F] tracking-tight mb-6">Projects</h1>
      <ProjectsClient
        initialProjects={projects}
        canCreate={access.allowed}
        limit={limit}
      />
    </div>
  );
}
