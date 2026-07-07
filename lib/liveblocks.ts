import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});
const LIVEBLOCKS_API_BASE = "https://api.liveblocks.io/v2";
const LIVEBLOCKS_SECRET =
  process.env.LIVEBLOCKS_SECRET_KEY || process.env.LIVEBLOCKS_SECRET;

interface LiveblocksUserInfo {
  name: string | null;
  image: string | null;
  cursorColor: string;
}

interface LiveblocksAuthResponse {
  status: number;
  body: string;
}

// Deterministic color palette for cursors
const PALETTE = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

function hashString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export async function mapUserIdToColor(userId: string) {
  if (!userId) return PALETTE[0];
  const idx = hashString(userId) % PALETTE.length;
  return PALETTE[idx];
}

async function apiRequest(
  path: string,
  method = "GET",
  body?: Record<string, unknown>,
) {
  if (!LIVEBLOCKS_SECRET) throw new Error("LIVEBLOCKS_SECRET not set");

  console.log("Liveblocks request:", method, path);

  const res = await fetch(`${LIVEBLOCKS_API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${LIVEBLOCKS_SECRET}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  console.log("Liveblocks status:", res.status);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Liveblocks error:", text);
    throw new Error(`Liveblocks API error ${res.status}: ${text}`);
  }

  return res.json().catch(() => ({}));
}

export async function ensureRoomExists(roomId: string) {
  try {
    await apiRequest(`/rooms/${encodeURIComponent(roomId)}`);
    return true;
  } catch {
    await apiRequest(`/rooms`, "POST", {
      id: roomId,
      defaultAccesses: ["room:write"],
    });
    return true;
  }
}
export async function createRoomSession(
  roomId: string,
  userId: string,
  userInfo: LiveblocksUserInfo,
): Promise<LiveblocksAuthResponse> {
  const session = liveblocks.prepareSession(userId, {
    userInfo,
  });

  session.allow(roomId, session.FULL_ACCESS);

  return session.authorize();
}


export async function getAuthenticatedUserMeta() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated || !userId) return null;
  const user = await currentUser();
  const displayName = user?.firstName || user?.fullName || null;
  const avatarUrl = user?.imageUrl || null;
  const color = await mapUserIdToColor(userId);
  return { userId, displayName, avatarUrl, color };
}
