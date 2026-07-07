import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

interface ProjectRouteContext {
  params: Promise<{
    projectId: string;
  }>;
}
function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export async function PATCH(
  request: Request,
  { params }: ProjectRouteContext,
) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project || project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const name = normalizeOptionalString((body as any).name);

  if (!name) {
    return Response.json({ error: "Invalid name" }, { status: 400 });
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { name },
  });

  return Response.json({ project: updated });
}

export async function DELETE(
  _request: Request,
  { params }: ProjectRouteContext,
) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project || project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return Response.json({ success: true });
}
