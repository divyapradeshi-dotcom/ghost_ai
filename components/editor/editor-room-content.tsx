"use client";

import CanvasWrapper from "@/components/editor/canvas-wrapper";
import { useAIPanel } from "@/contexts/ai-panel-context";

interface EditorRoomContentProps {
  roomId: string;
}

export default function EditorRoomContent({ roomId }: EditorRoomContentProps) {
  const { isAIPanelOpen } = useAIPanel();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <div className="flex-1 min-h-[calc(100vh-3.5rem)]">
        <CanvasWrapper roomId={roomId} />
      </div>

      {isAIPanelOpen && (
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
      )}
    </div>
  );
}
