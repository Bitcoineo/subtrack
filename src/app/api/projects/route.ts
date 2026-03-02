import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserProjects, createProject } from "@/lib/projects";
import type { PlanId } from "@/lib/plans";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await getUserProjects(session.user.id);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ data: result.data });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description } = body as {
    name?: string;
    description?: string;
  };

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Project name is required" },
      { status: 400 }
    );
  }

  const result = await createProject(
    session.user.id,
    session.user.plan as PlanId,
    session.user.subscriptionStatus,
    { name: name.trim(), description: description?.trim() }
  );

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({ data: result.data }, { status: 201 });
}
