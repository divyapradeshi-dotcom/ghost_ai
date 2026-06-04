import Link from "next/link";

export default function AccessDenied() {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="max-w-xl rounded-3xl border border-surface-border bg-surface/80 px-6 py-8 text-center shadow-2xl backdrop-blur">
        <div className="text-6xl">🔒</div>
        <h2 className="mt-4 text-xl font-semibold text-copy-primary">Access denied</h2>
        <p className="mt-2 text-sm leading-6 text-copy-muted">
          You don’t have access to this project or it doesn’t exist.
        </p>
        <div className="mt-4">
          <Link
            href="/editor"
            className="inline-flex rounded-md border border-transparent bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
          >
            Back to editor
          </Link>
        </div>
      </div>
    </section>
  );
}
