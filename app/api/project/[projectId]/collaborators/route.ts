import { auth, clerkClient } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

interface ProjectRouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

async function readJsonBody(request: Request) {
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object") return body as Record<string, unknown>;
  } catch {}

  return {} as Record<string, unknown>;
}

export async function GET(
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

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  // Only owners or collaborators may view the list
  try {
    const requester = await clerkClient.users.getUser(userId);
    const emails = (requester?.emailAddresses || []).map((e: any) => e.emailAddress).filter(Boolean);
    const isCollaborator = collaborators.some((c) => emails.includes(c.email));
    if (project.ownerId !== userId && !isCollaborator) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    // If Clerk lookup fails, be conservative and deny access when not owner
    if (project.ownerId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Enrich collaborators with Clerk user data when available
  // Also fetch owner user info for display
  let ownerInfo = null;
  try {
    ownerInfo = await clerkClient.users.getUser(project.ownerId);
  } catch {}

  const enriched = await Promise.all(
    collaborators.map(async (c) => {
      try {
        const users = await clerkClient.users.getUserList({ email: [c.email] });
        const user = users && users.length > 0 ? users[0] : null;

        return {
          id: c.id,
          email: c.email,
          displayName: user?.firstName || user?.fullName || null,
          avatarUrl: user?.imageUrl || null,
          createdAt: c.createdAt,
        };
      } catch {
        return {
          id: c.id,
          email: c.email,
          displayName: null,
          avatarUrl: null,
          createdAt: c.createdAt,
        };
      }
    }),
  );

  const owner = ownerInfo
    ? {
        id: ownerInfo.id,
        email: (ownerInfo.emailAddresses || [])[0]?.emailAddress || null,
        displayName: ownerInfo.firstName || ownerInfo.fullName || null,
        avatarUrl: ownerInfo.imageUrl || null,
      }
    : { id: project.ownerId };

  return Response.json({
    collaborators: enriched,
    owner,
    ownerId: project.ownerId,
    isOwner: project.ownerId === userId,
  });
}

export async function POST(
  request: Request,
  { params }: ProjectRouteContext,
) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const body = await readJsonBody(request);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "Valid email is required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Prevent inviting the owner email if we can resolve it via Clerk
  try {
    const ownerUser = await clerkClient.users.getUser(project.ownerId);
    const ownerEmail = (ownerUser.emailAddresses || [])[0]?.emailAddress?.toLowerCase();
    if (ownerEmail && ownerEmail === email) {
      return Response.json({ error: "Cannot invite the project owner" }, { status: 400 });
    }
  } catch {}

  // Check for existing collaborator
  const exists = await prisma.projectCollaborator.findFirst({ where: { projectId, email } });
  if (exists) {
    return Response.json({ error: "Collaborator already invited" }, { status: 409 });
  }

  try {
    const collaborator = await prisma.projectCollaborator.create({ data: { projectId, email } });

    // Try to enrich with Clerk but don't fail on error
    try {
      const users = await clerkClient.users.getUserList({ email: [email] });
      const user = users && users.length > 0 ? users[0] : null;

      return Response.json({
        collaborator: {
          id: collaborator.id,
          email: collaborator.email,
          displayName: user?.firstName || user?.fullName || null,
          avatarUrl: user?.imageUrl || null,
          createdAt: collaborator.createdAt,
        },
      }, { status: 201 });
    } catch {
      return Response.json({ collaborator }, { status: 201 });
    }
  } catch (e: any) {
    return Response.json({ error: e?.message ?? "Could not add collaborator" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: ProjectRouteContext,
) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const body = await readJsonBody(request);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;

  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.projectCollaborator.deleteMany({ where: { projectId, email } });

  return Response.json({ success: true });
}
