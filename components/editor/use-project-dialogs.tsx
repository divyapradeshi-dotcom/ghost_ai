"use client";

import {
  createContext,
  type FormEvent,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import { EditorDialogPattern } from "@/components/editor/editor-dialog-pattern";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ProjectDialogProject {
  id: string;
  name: string;
}

type ProjectDialogType = "create" | "rename" | "delete";

interface ProjectDialogState {
  type: ProjectDialogType;
  project?: ProjectDialogProject;
}

interface ProjectDialogsContextValue {
  isLoading: boolean;
  projectName: string;
  slugPreview: string;
  openCreateDialog: () => void;
  openRenameDialog: (project: ProjectDialogProject) => void;
  openDeleteDialog: (project: ProjectDialogProject) => void;
  setProjectName: (projectName: string) => void;
}

interface ProjectDialogsProviderProps {
  children: ReactNode;
}

const ProjectDialogsContext = createContext<ProjectDialogsContextValue | null>(
  null
);

function buildSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-project";
}

function useProjectDialogsState() {
  const [dialog, setDialog] = useState<ProjectDialogState | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const slugPreview = useMemo(() => buildSlug(projectName), [projectName]);

  function closeDialog() {
    setDialog(null);
    setIsLoading(false);
    setProjectName("");
  }

  function completeMockSubmit() {
    setIsLoading(true);
    window.setTimeout(closeDialog, 200);
  }

  function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    completeMockSubmit();
  }

  function handleRenameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    completeMockSubmit();
  }

  function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    completeMockSubmit();
  }

  const contextValue = useMemo<ProjectDialogsContextValue>(
    () => ({
      isLoading,
      projectName,
      slugPreview,
      openCreateDialog: () => {
        setProjectName("");
        setDialog({ type: "create" });
      },
      openRenameDialog: (project) => {
        setProjectName(project.name);
        setDialog({ type: "rename", project });
      },
      openDeleteDialog: (project) => {
        setProjectName("");
        setDialog({ type: "delete", project });
      },
      setProjectName,
    }),
    [isLoading, projectName, slugPreview]
  );

  return {
    contextValue,
    dialog,
    closeDialog,
    handleCreateSubmit,
    handleRenameSubmit,
    handleDeleteSubmit,
  };
}

export function ProjectDialogsProvider({
  children,
}: ProjectDialogsProviderProps) {
  const {
    contextValue,
    dialog,
    closeDialog,
    handleCreateSubmit,
    handleRenameSubmit,
    handleDeleteSubmit,
  } = useProjectDialogsState();
  const { isLoading, projectName, setProjectName, slugPreview } = contextValue;

  return (
    <ProjectDialogsContext.Provider value={contextValue}>
      {children}

      <Dialog
        open={dialog?.type === "create"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <EditorDialogPattern
          title="Create project"
          description="Name the workspace before opening it."
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" form="create-project-form" disabled={isLoading}>
                Create project
              </Button>
            </>
          }
        >
          <form
            id="create-project-form"
            className="space-y-4"
            onSubmit={handleCreateSubmit}
          >
            <div className="space-y-2">
              <label
                htmlFor="project-name"
                className="text-sm font-medium text-copy-primary"
              >
                Project name
              </label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Architecture workspace"
                required
                className="border-surface-border bg-base text-copy-primary placeholder:text-copy-faint"
              />
            </div>
            <div className="rounded-xl border border-surface-border bg-base px-3 py-2 text-xs text-copy-muted">
              Slug preview:{" "}
              <span className="font-mono text-brand">{slugPreview}</span>
            </div>
          </form>
        </EditorDialogPattern>
      </Dialog>

      <Dialog
        open={dialog?.type === "rename"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <EditorDialogPattern
          title="Rename project"
          description={
            dialog?.project
              ? `Current project name: ${dialog.project.name}`
              : undefined
          }
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" form="rename-project-form" disabled={isLoading}>
                Rename project
              </Button>
            </>
          }
        >
          <form
            id="rename-project-form"
            className="space-y-2"
            onSubmit={handleRenameSubmit}
          >
            <label
              htmlFor="rename-project-name"
              className="text-sm font-medium text-copy-primary"
            >
              Project name
            </label>
            <Input
              id="rename-project-name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              autoFocus
              required
              className="border-surface-border bg-base text-copy-primary"
            />
          </form>
        </EditorDialogPattern>
      </Dialog>

      <Dialog
        open={dialog?.type === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <EditorDialogPattern
          title="Delete project"
          description={
            dialog?.project
              ? `This will delete ${dialog.project.name}. This action cannot be undone.`
              : undefined
          }
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="delete-project-form"
                variant="destructive"
                disabled={isLoading}
              >
                Delete project
              </Button>
            </>
          }
        >
          <form id="delete-project-form" onSubmit={handleDeleteSubmit} />
        </EditorDialogPattern>
      </Dialog>
    </ProjectDialogsContext.Provider>
  );
}

export function useProjectDialogs() {
  const context = useContext(ProjectDialogsContext);

  if (!context) {
    throw new Error("useProjectDialogs must be used within ProjectDialogsProvider.");
  }

  return context;
}
