"use client";

import {
  createContext,
  type FormEvent,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { EditorDialogPattern } from "@/components/editor/editor-dialog-pattern";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { EditorProject } from "@/lib/project-data";

const DEFAULT_PROJECT_NAME = "Untiled Project";

interface ProjectActionTarget {
  id: string;
  name: string;
}

type ProjectDialogType = "create" | "rename" | "delete";

interface ProjectDialogState {
  type: ProjectDialogType;
  project?: ProjectActionTarget;
}

interface ProjectActionsContextValue {
  isLoading: boolean;
  errorMessage: string | null;
  projectName: string;
  roomIdPreview: string;
  openCreateDialog: () => void;
  openRenameDialog: (project: ProjectActionTarget) => void;
  openDeleteDialog: (project: ProjectActionTarget) => void;
  setProjectName: (projectName: string) => void;
}

interface ProjectActionsProviderProps {
  children: ReactNode;
}

interface ProjectResponse {
  project?: EditorProject;
}

const ProjectActionsContext =
  createContext<ProjectActionsContextValue | null>(null);

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-project";
}

function generateShortSuffix() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }

  return Math.random().toString(36).slice(2, 10);
}

function buildRoomId(projectName: string, suffix: string) {
  return `${slugify(projectName || DEFAULT_PROJECT_NAME)}-${suffix}`;
}

async function parseProjectResponse(response: Response) {
  const body: unknown = await response.json().catch(() => null);

  if (body && typeof body === "object" && "project" in body) {
    return body as ProjectResponse;
  }

  return null;
}

function useProjectActionsState() {
  const router = useRouter();
  const pathname = usePathname();
  const [dialog, setDialog] = useState<ProjectDialogState | null>(null);
  const [projectName, setProjectName] = useState("");
  const [createSuffix, setCreateSuffix] = useState(() => generateShortSuffix());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const roomIdPreview = useMemo(
    () => buildRoomId(projectName, createSuffix),
    [createSuffix, projectName],
  );

  function closeDialog() {
    setDialog(null);
    setProjectName("");
    setIsLoading(false);
    setErrorMessage(null);
  }

  function openCreateDialog() {
    setCreateSuffix(generateShortSuffix());
    setProjectName("");
    setErrorMessage(null);
    setDialog({ type: "create" });
  }

  function openRenameDialog(project: ProjectActionTarget) {
    setProjectName(project.name);
    setErrorMessage(null);
    setDialog({ type: "rename", project });
  }

  function openDeleteDialog(project: ProjectActionTarget) {
    setProjectName("");
    setErrorMessage(null);
    setDialog({ type: "delete", project });
  }

  async function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const name = projectName.trim() || DEFAULT_PROJECT_NAME;
    const projectId = buildRoomId(name, createSuffix);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: projectId, name }),
    });

    if (!response.ok) {
      setIsLoading(false);
      setErrorMessage("Project could not be created.");
      return;
    }

    const body = await parseProjectResponse(response);
    closeDialog();
    router.push(`/editor/${body?.project?.id ?? projectId}`);
  }

  async function handleRenameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!dialog?.project) {
      return;
    }

    const name = projectName.trim();

    if (!name) {
      setErrorMessage("Project name is required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const response = await fetch(`/api/projects/${dialog.project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      setIsLoading(false);
      setErrorMessage("Project could not be renamed.");
      return;
    }

    closeDialog();
    router.refresh();
  }

  async function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!dialog?.project) {
      return;
    }

    const projectId = dialog.project.id;
    setIsLoading(true);
    setErrorMessage(null);

    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setIsLoading(false);
      setErrorMessage("Project could not be deleted.");
      return;
    }

    closeDialog();

    if (pathname === `/editor/${projectId}`) {
      router.replace("/editor");
      return;
    }

    router.refresh();
  }

  const contextValue = useMemo<ProjectActionsContextValue>(
    () => ({
      isLoading,
      errorMessage,
      projectName,
      roomIdPreview,
      openCreateDialog,
      openRenameDialog,
      openDeleteDialog,
      setProjectName,
    }),
    [errorMessage, isLoading, projectName, roomIdPreview],
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

export function ProjectActionsProvider({
  children,
}: ProjectActionsProviderProps) {
  const {
    contextValue,
    dialog,
    closeDialog,
    handleCreateSubmit,
    handleRenameSubmit,
    handleDeleteSubmit,
  } = useProjectActionsState();
  const {
    errorMessage,
    isLoading,
    projectName,
    roomIdPreview,
    setProjectName,
  } = contextValue;

  return (
    <ProjectActionsContext.Provider value={contextValue}>
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
                className="border-surface-border bg-base text-copy-primary placeholder:text-copy-faint"
              />
            </div>
            <div className="rounded-xl border border-surface-border bg-base px-3 py-2 text-xs text-copy-muted">
              Room ID preview:{" "}
              <span className="font-mono text-brand">{roomIdPreview}</span>
            </div>
            {errorMessage ? (
              <p className="text-xs text-state-error">{errorMessage}</p>
            ) : null}
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
            {errorMessage ? (
              <p className="text-xs text-state-error">{errorMessage}</p>
            ) : null}
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
          <form
            id="delete-project-form"
            className="space-y-3"
            onSubmit={handleDeleteSubmit}
          >
            {dialog?.project ? (
              <p className="rounded-xl border border-surface-border bg-base px-3 py-2 text-sm text-copy-primary">
                {dialog.project.name}
              </p>
            ) : null}
            {errorMessage ? (
              <p className="text-xs text-state-error">{errorMessage}</p>
            ) : null}
          </form>
        </EditorDialogPattern>
      </Dialog>
    </ProjectActionsContext.Provider>
  );
}

export function useProjectActions() {
  const context = useContext(ProjectActionsContext);

  if (!context) {
    throw new Error("useProjectActions must be used within ProjectActionsProvider.");
  }

  return context;
}
