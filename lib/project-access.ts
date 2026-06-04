"use server";

import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface Identity {
  userId: string | null;
  email: string | null;
}

export async function getCurrentIdentity(): Promise<Identity> {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return { userId: null, email: null };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  return { userId, email };
}

export async function getProjectIfUserHasAccess(projectId?: string) {
  if (!projectId) return null;
  const identity = await getCurrentIdentity();

  console.debug("[project-access] checking access for projectId:", projectId);
  console.debug("[project-access] identity:", identity);

  if (!identity.userId) {
    console.debug("[project-access] no identity.userId - denying access");
    return null;
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      description: true,
      ownerId: true,
      collaborators: { select: { email: true } },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!project) return null;

  console.debug("[project-access] found project:", { id: project.id, ownerId: project.ownerId, collaborators: project.collaborators });

  if (project.ownerId === identity.userId) {
    console.debug("[project-access] owner match - granting owner access");
    return { project, access: "owner" as const };
  }

  if (identity.email) {
    const isCollaborator = project.collaborators.some(
      (c) => c.email.toLowerCase() === identity.email!.toLowerCase(),
    );

    console.debug("[project-access] identity.email:", identity.email, "isCollaborator:", isCollaborator);

    if (isCollaborator) {
      return { project, access: "collaborator" as const };
    }
  }

  return null;
}

export async function userHasProjectAccess(projectId?: string) {
  if (!projectId) return false;
  const r = await getProjectIfUserHasAccess(projectId);
  return !!r;
}
