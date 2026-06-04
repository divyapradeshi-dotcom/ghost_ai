"use client";

import { UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ShareDialog } from "@/components/editor/share-dialog";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  projectName?: string;
  className?: string;
  currentProjectId?: string | undefined;
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
  projectName,
  className,
  currentProjectId,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareProjectId, setShareProjectId] = useState<string | undefined>(undefined);

  function handleShareClick() {
    // prefer explicitly passed project id
    if (currentProjectId) {
      setShareProjectId(currentProjectId);
      setIsShareOpen(true);
      return;
    }

    // fallback: try to derive project id from the URL (client-only)
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/").filter(Boolean);
      // expect path like /editor/:projectId
      const editorIndex = parts.indexOf("editor");
      const maybeId = parts[editorIndex >= 0 ? editorIndex + 1 : parts.length - 1];
      if (maybeId) {
        setShareProjectId(maybeId);
        setIsShareOpen(true);
        return;
      }
    }

    // nothing to do if no project id
  }

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center border-b border-surface-border bg-surface px-4",
        className
      )}
    >
      <div className="flex flex-1 items-center justify-start">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
          aria-pressed={isSidebarOpen}
          className="text-copy-secondary hover:bg-subtle hover:text-copy-primary"
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        {projectName ? (
          <div className="truncate text-sm font-medium text-copy-primary">
            {projectName}
          </div>
        ) : (
          <div aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          className="text-copy-secondary hover:bg-subtle hover:text-copy-primary"
          onClick={handleShareClick}
        >
          Share
        </Button>
        {shareProjectId ? (
          <ShareDialog
            projectId={shareProjectId}
            open={isShareOpen}
            onOpenChange={(open) => {
              setIsShareOpen(open);
              if (!open) setShareProjectId(undefined);
            }}
          />
        ) : null}
        <Button type="button" variant="ghost" className="text-copy-secondary hover:bg-subtle hover:text-copy-primary">
          AI
        </Button>
        <UserButton />
      </div>
    </header>
  );
}
