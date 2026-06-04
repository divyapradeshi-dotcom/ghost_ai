"use server";

import "server-only";

import AccessDenied from "@/components/editor/access-denied";
import { getProjectIfUserHasAccess } from "@/lib/project-access";

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
    <div className="flex min-h-[calc(100vh-3.5rem)]">
        <div
          className="flex-1 flex items-center justify-center"
          style={{
            backgroundColor: "#071018",
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 48px)",
            backgroundSize: "48px 48px, 48px 48px",
          }}
        >
          <div className="text-center text-white/90 px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-brand/30 to-brand/20 border border-white/5">
              <span className="text-xl">◎</span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/50">Workspace Shell</p>
            <h1 className="mt-3 text-2xl font-semibold">{project.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Canvas and collaboration tooling land here next. This room is ready for the shared architecture canvas, durable AI workflows, and real-time presence. For now, the shell is wired with project context and navigation only.
            </p>
          </div>
        </div>

        <aside className="w-80 border-l border-surface-border bg-surface/80 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-copy-primary">AI Copilot</p>
              <p className="text-xs text-copy-muted">Placeholder panel</p>
            </div>
            <div className="text-copy-faint">⚙️</div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-dashed border-surface-border bg-base/40 p-4">
              <p className="text-sm font-medium">Chat surface pending</p>
              <p className="mt-2 text-xs text-copy-muted">The toggle is wired. Messaging and generation are intentionally out of scope here.</p>
            </div>

            <div className="rounded-2xl border border-surface-border bg-surface/70 p-3">
              <p className="text-xs text-copy-muted uppercase">Future Hooks</p>
              <p className="mt-2 text-sm text-copy-muted">Prompt composer, run status, and architecture guidance will attach to this sidebar.</p>
            </div>
          </div>
        </aside>
      </div>
  );
}
