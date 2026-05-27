"use client";

import { type ReactNode, useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogsProvider } from "@/components/editor/use-project-dialogs";

interface EditorLayoutProps {
  children: ReactNode;
}

export function EditorLayout({ children }: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ProjectDialogsProvider>
      <div className="min-h-screen bg-base text-copy-primary">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((isOpen) => !isOpen)}
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
        />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      </div>
    </ProjectDialogsProvider>
  );
}
