"use server";

import "server-only";

import AccessDenied from "@/components/editor/access-denied";
import CanvasWrapper from "@/components/editor/canvas-wrapper";
import { getProjectIfUserHasAccess } from "@/lib/project-access";
import EditorRoomContent from "@/components/editor/editor-room-content";

interface EditorRoomPageProps {
  params: { roomId: string };
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const { roomId } = await params;

  const access = await getProjectIfUserHasAccess(roomId);

  if (!access) {
    return <AccessDenied />;
  }

  const project = access.project;

  return (
    <EditorRoomContent roomId={roomId} />
  );
}
