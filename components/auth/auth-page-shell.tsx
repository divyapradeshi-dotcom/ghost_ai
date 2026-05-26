import { type ReactNode } from "react";
import { Bot, FileText, Network } from "lucide-react";

interface AuthPageShellProps {
  children: ReactNode;
  heading: string;
}

const features = [
  {
    icon: Bot,
    title: "AI Architecture Generation",
    description:
      "Describe your system, and Ghost AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Network,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export function AuthPageShell({ children, heading }: AuthPageShellProps) {
  return (
    <main className="min-h-screen bg-base font-sans text-copy-primary">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden border-r border-surface-border bg-accent-dim px-10 py-8 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 text-sm font-semibold text-copy-primary">
            <span
              aria-hidden="true"
              className="h-6 w-6 rounded-md bg-brand shadow-[0_0_24px_var(--accent-primary-dim)]"
            />
            <span>Ghost AI</span>
          </div>

          <div className="my-auto max-w-lg space-y-9">
            <div className="space-y-4">
              <h1 className="max-w-sm text-3xl font-semibold leading-tight text-copy-primary">
                Design systems at the speed of thought.
              </h1>
              <p className="max-w-md text-sm leading-6 text-copy-muted">
                Describe your architecture in plain English. Ghost AI maps it to
                a shared canvas your whole team can refine in real time.
              </p>
            </div>

            <ul className="space-y-6">
              {features.map(({ description, icon: Icon, title }) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-brand bg-accent-dim text-brand">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="space-y-1">
                    <span className="block text-sm font-medium text-copy-secondary">
                      {title}
                    </span>
                    <span className="block max-w-md text-xs leading-5 text-copy-muted">
                      {description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-copy-faint">
            &copy; 2026 Ghost AI. All rights reserved.
          </p>
        </section>

        <section
          aria-label={heading}
          className="flex min-h-screen items-center justify-center bg-base px-5 py-8"
        >
          <div className="w-full max-w-[24rem]">{children}</div>
        </section>
      </div>
    </main>
  );
}
