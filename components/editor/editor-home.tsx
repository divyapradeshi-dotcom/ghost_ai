"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProjectActions } from "@/hooks/use-project-actions";

export function EditorHome() {
  const { openCreateDialog } = useProjectActions();

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-semibold tracking-normal text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          Start a new architecture workspace , or choose a project from the
          sidebar
        </p>
        <Button
          type="button"
          size="lg"
          className="mt-6 gap-2"
          onClick={openCreateDialog}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </section>
  );
}
