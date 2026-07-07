"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { EditorProject } from "@/lib/project-data";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects: EditorProject[];
  sharedProjects: EditorProject[];
  currentProjectId?: string;
  className?: string;
}

function EmptyProjectsState() {
  return (
    <div className="flex h-full min-h-40 items-center justify-center rounded-2xl border border-dashed border-surface-border bg-base/40 px-6 text-center">
      <p className="text-sm text-copy-muted">No projects to show.</p>
    </div>
  );
}

interface ProjectListProps {
  projects: EditorProject[];
  onRenameProject: (project: EditorProject) => void;
  onDeleteProject: (project: EditorProject) => void;
  currentProjectId?: string;
}

function formatProjectDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function ProjectList({
  projects,
  onRenameProject,
  onDeleteProject,
  currentProjectId,
}: ProjectListProps) {
  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => {
        const isOwned = project.ownerType === "owned";

        const isActive = currentProjectId === project.id;

        return (
          <div
            key={project.id}
            className={cn(
              "flex min-h-16 items-center gap-3 rounded-xl border px-3 py-2",
              "transition-colors",
              isActive
                ? "bg-gradient-to-r from-brand/70 to-brand/60 text-white border-transparent"
                : "border-surface-border bg-base/50",
            )}
          >
            <Link
              href={`/editor/${project.id}`}
              className={cn(
                "min-w-0 flex-1 rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/50",
                isActive ? "text-white" : "text-copy-primary"
              )}
            >
              <p className="truncate text-sm font-medium text-copy-primary">
                {project.name}
              </p>
              {project.description ? (
                <p className="truncate text-xs text-copy-muted">
                  {project.description}
                </p>
              ) : null}
              <p className="truncate text-xs text-copy-faint">
                Updated {formatProjectDate(project.updatedAt)}
              </p>
            </Link>

            {isOwned ? (
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Rename ${project.name}`}
                  className="text-copy-muted hover:bg-subtle hover:text-copy-primary"
                  onClick={() => onRenameProject(project)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${project.name}`}
                  className="text-copy-muted hover:bg-subtle hover:text-state-error"
                  onClick={() => onDeleteProject(project)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  currentProjectId,
  className,
}: ProjectSidebarProps) {
  const { openCreateDialog, openRenameDialog, openDeleteDialog } =
    useProjectActions();

  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "fixed left-4 top-[4.5rem] z-40 flex h-[calc(100vh-5rem)] w-80 flex-col rounded-2xl border border-surface-border bg-surface/95 shadow-2xl backdrop-blur transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]",
        className
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-surface-border px-4">
        <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close project sidebar"
          className="text-copy-secondary hover:bg-subtle hover:text-copy-primary"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

        <Tabs defaultValue="my-projects" className="min-h-0 flex-1 gap-4 p-4">
        <TabsList className="grid w-full grid-cols-2 bg-subtle text-copy-muted">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects" className="min-h-0 flex-1">
          <ProjectList
            projects={ownedProjects}
            onRenameProject={openRenameDialog}
            onDeleteProject={openDeleteDialog}
            currentProjectId={currentProjectId}
          />
        </TabsContent>
        <TabsContent value="shared" className="min-h-0 flex-1">
          <ProjectList
            projects={sharedProjects}
            onRenameProject={openRenameDialog}
            onDeleteProject={openDeleteDialog}
            currentProjectId={currentProjectId}
          />
        </TabsContent>
      </Tabs>

      <div className="border-t border-surface-border p-4">
        <Button type="button" className="w-full gap-2" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
