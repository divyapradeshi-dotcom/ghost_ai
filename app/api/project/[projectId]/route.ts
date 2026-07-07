import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

interface ProjectRouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

interface RenameProjectBody {
  name?: unknown;
}

async function readRenameProjectBody(
  request: Request,
): Promise<RenameProjectBody | null> {
  try {
    const body: unknown = await request.json();

    if (body && typeof body === "object") {
      return body;
    }
  } catch {
    return null;
  }

  return null;
}

function normalizeRequiredName(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const name = value.trim();
  return name.length > 0 ? name : null;
}

export async function PATCH(
  request: Request,
  { params }: ProjectRouteContext,
) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await readRenameProjectBody(request);
  const name = normalizeRequiredName(body?.name);

  if (!name) {
    return Response.json({ error: "Project name is required" }, { status: 400 });
  }

  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project || project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { name },
  });

  return Response.json({ project: updatedProject });
}
