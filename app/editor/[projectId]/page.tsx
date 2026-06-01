interface ProjectWorkspacePageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const { projectId } = await params;

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="max-w-xl rounded-3xl border border-surface-border bg-surface/80 px-6 py-8 text-center shadow-2xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-copy-faint">
          Workspace
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-copy-primary">
          {projectId}
        </h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          The collaborative canvas mounts here in the next feature unit.
        </p>
      </div>
    </section>
  );
}
