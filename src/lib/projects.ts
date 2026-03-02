import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { canAccess, type PlanId } from "@/lib/plans";

export async function getUserProjects(userId: string) {
  try {
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.userId, userId),
    });
    return { data: userProjects, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch projects: ${e}` };
  }
}

export async function createProject(
  userId: string,
  userPlan: PlanId,
  subscriptionStatus: string | null,
  data: { name: string; description?: string }
) {
  try {
    const existing = await db.query.projects.findMany({
      where: eq(projects.userId, userId),
    });

    const access = canAccess(
      { plan: userPlan, subscriptionStatus },
      "projects",
      { currentCount: existing.length }
    );

    if (!access.allowed) {
      return { data: null, error: access.reason ?? "Project limit reached" };
    }

    const [project] = await db
      .insert(projects)
      .values({
        userId,
        name: data.name,
        description: data.description ?? null,
      })
      .returning();

    return { data: project, error: null };
  } catch (e) {
    return { data: null, error: `Failed to create project: ${e}` };
  }
}

export async function deleteProject(projectId: string, userId: string) {
  try {
    const deleted = await db
      .delete(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning();

    if (deleted.length === 0) {
      return { data: null, error: "Project not found" };
    }

    return { data: { success: true }, error: null };
  } catch (e) {
    return { data: null, error: `Failed to delete project: ${e}` };
  }
}
