import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface EditorProject {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  ownerType: "owned" | "shared";
}

export interface EditorProjects {
  ownedProjects: EditorProject[];
  sharedProjects: EditorProject[];
}

function serializeProject(
  project: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  },
  ownerType: EditorProject["ownerType"],
): EditorProject {
  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    ownerType,
  };
}

export async function getEditorProjects(): Promise<EditorProjects> {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return {
      ownedProjects: [],
      sharedProjects: [],
    };
  }

  const user = await currentUser();
  const collaboratorEmail = user?.primaryEmailAddress?.emailAddress;

  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    collaboratorEmail
      ? prisma.project.findMany({
          where: {
            ownerId: { not: userId },
            collaborators: {
              some: {
                email: collaboratorEmail,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return {
    ownedProjects: ownedProjects.map((project) =>
      serializeProject(project, "owned"),
    ),
    sharedProjects: sharedProjects.map((project) =>
      serializeProject(project, "shared"),
    ),
  };
}
