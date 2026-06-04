"use client";

import { type ReactNode, useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectActionsProvider } from "@/hooks/use-project-actions";
import type { EditorProject } from "@/lib/project-data";

interface EditorLayoutProps {
  children: ReactNode;
  ownedProjects: EditorProject[];
  sharedProjects: EditorProject[];
  projectName?: string;
  currentProjectId?: string;
}

export function EditorLayout({
  children,
  ownedProjects,
  sharedProjects,
  projectName,
  currentProjectId,
}: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ProjectActionsProvider>
      <div className="min-h-screen bg-base text-copy-primary">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((isOpen) => !isOpen)}
          projectName={projectName}
          currentProjectId={currentProjectId}
        />
        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Close project sidebar"
            className="fixed inset-0 z-30 bg-base/70 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          currentProjectId={currentProjectId}
        />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      </div>
    </ProjectActionsProvider>
  );
}
