import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

const DEFAULT_PROJECT_NAME = "Untiled Project";
const EMPTY_CANVAS_JSON_PATH = "";

interface CreateProjectBody {
  id?: unknown;
  name?: unknown;
  description?: unknown;
}

async function readCreateProjectBody(request: Request): Promise<CreateProjectBody> {
  try {
    const body: unknown = await request.json();

    if (body && typeof body === "object") {
      return body;
    }
  } catch {
    return {};
  }

  return {};
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function normalizeProjectId(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();

  if (!/^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$/.test(normalized)) {
    return undefined;
  }

  return normalized;
}

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ projects });
}

export async function POST(request: Request) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await readCreateProjectBody(request);
  const id = normalizeProjectId(body.id);
  const name = normalizeOptionalString(body.name) ?? DEFAULT_PROJECT_NAME;
  const description = normalizeOptionalString(body.description);

  const project = await prisma.project.create({
    data: {
      id,
      ownerId: userId,
      name,
      description,
      canvasJsonPath: EMPTY_CANVAS_JSON_PATH,
    },
  });

  return Response.json({ project }, { status: 201 });
}
