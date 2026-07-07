import { auth } from "@clerk/nextjs/server";

import { getProjectIfUserHasAccess } from "@/lib/project-access";
import {
  createRoomSession,
  ensureRoomExists,
  getAuthenticatedUserMeta,
} from "@/lib/liveblocks";

interface LiveblocksAuthRequestBody {
  projectId?: unknown;
  room?: unknown;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Internal error";
}

async function readLiveblocksAuthBody(
  request: Request,
): Promise<LiveblocksAuthRequestBody> {
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

export async function POST(request: Request) {
  try {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated || !userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await readLiveblocksAuthBody(request);
    const projectId =
      typeof body.projectId === "string"
        ? body.projectId
        : typeof body.room === "string"
          ? body.room
          : null;

    if (!projectId) {
      return Response.json({ error: "projectId required" }, { status: 400 });
    }

    const access = await getProjectIfUserHasAccess(projectId);
    if (!access) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await ensureRoomExists(projectId);

    const meta = await getAuthenticatedUserMeta();
    if (!meta) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await createRoomSession(projectId, meta.userId, {
      name: meta.displayName,
      image: meta.avatarUrl,
      cursorColor: meta.color,
    });

    return new Response(session.body, {
      status: session.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("liveblocks-auth error:", error);
    return Response.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
