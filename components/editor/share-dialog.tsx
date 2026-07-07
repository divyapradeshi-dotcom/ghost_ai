"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ projectId, open, onOpenChange }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Array<any>>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [owner, setOwner] = useState<any | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [projectUrl, setProjectUrl] = useState("");

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    (async () => {
      const res = await fetch(`/api/project/${projectId}/collaborators`);
      if (!mounted) return;
      if (!res.ok) return;
      const data = await res.json();
      setCollaborators(data.collaborators || []);
      setIsOwner(Boolean(data.isOwner));
      setOwner(data.owner || null);
    })();

    return () => {
      mounted = false;
    };
  }, [open, projectId]);

  useEffect(() => {
    if (!open) return;
    if (typeof window !== "undefined") {
      setProjectUrl(`${window.location.origin}/editor/${projectId}`);
    } else {
      setProjectUrl("");
    }
  }, [open, projectId]);

  async function invite(e?: React.FormEvent) {
    e?.preventDefault();
    setStatus(null);
    // basic client-side validation
    const normalized = (email || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) {
      setStatus("Enter a valid email");
      return;
    }
    if (owner?.email && owner.email.toLowerCase() === normalized) {
      setStatus("Cannot invite the project owner");
      return;
    }

    const res = await fetch(`/api/project/${projectId}/collaborators`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus(err?.error || "Failed to invite");
      return;
    }

    const data = await res.json();
    if (data?.error) {
      setStatus(data.error);
      return;
    }
    setCollaborators((s) => [...s, data.collaborator]);
    setEmail("");
    setStatus("Invited");
    setTimeout(() => setStatus(null), 2000);
  }

  async function remove(emailToRemove: string) {
    setStatus(null);
    const res = await fetch(`/api/project/${projectId}/collaborators`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailToRemove }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setStatus(err?.error || "Failed to remove");
      return;
    }

    setCollaborators((s) => s.filter((c) => c.email !== emailToRemove));
    setStatus("Removed");
    setTimeout(() => setStatus(null), 2000);
  }

  async function copyLink() {
    try {
      const url = projectUrl || "";
      if (!url || typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error("clipboard-unavailable");
      }
      await navigator.clipboard.writeText(url);
      setCopyStatus("Copied to clipboard!");
      setTimeout(() => setCopyStatus(null), 2000);
    } catch {
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(null), 2000);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>Invite collaborators or copy the project link.</DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {/* Workspace Link Section */}
          <div className="rounded-lg border border-border-default bg-bg-subtle p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-primary">Workspace Link</p>
                <p className="text-xs text-text-secondary">Share this link with collaborators</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Input
                readOnly
                value={projectUrl}
                className="text-sm text-text-primary"
              />
              <Button
                type="button"
                onClick={copyLink}
                variant={copyStatus ? "default" : "outline"}
                className="shrink-0"
              >
                {copyStatus ? "✓ Copied" : "Copy"}
              </Button>
            </div>
            {copyStatus && (
              <p className="mt-2 text-xs text-state-success">{copyStatus}</p>
            )}
          </div>

          {owner ? (
            <div className="rounded-lg border border-border-default bg-bg-subtle p-4">
              <p className="mb-3 text-sm font-semibold text-text-primary">Owner</p>
              <div className="flex items-center gap-2">
                {owner.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={owner.avatarUrl} alt="owner avatar" className="h-6 w-6 rounded-full" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-surface-border grid place-items-center text-xs text-text-primary">{((owner.displayName || owner.email || owner.id) || "?").charAt(0)?.toUpperCase()}</div>
                )}
                <div className="text-sm">
                  <div className="font-medium text-text-primary">{owner.displayName || owner.email || owner.id}</div>
                  <div className="text-xs text-text-secondary">{owner.email || owner.id}</div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-lg border border-border-default bg-bg-subtle p-4">
            <p className="mb-3 text-sm font-semibold text-text-primary">Collaborators</p>
            <div className="space-y-2">
              {collaborators.length === 0 ? (
                <div className="text-sm text-text-secondary">No collaborators yet</div>
              ) : (
                collaborators.map((c: any) => (
                  <div key={c.id || c.email} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {c.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.avatarUrl} alt="avatar" className="h-6 w-6 rounded-full" />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-surface-border grid place-items-center text-xs text-text-primary">{(c.email || "?").charAt(0)?.toUpperCase()}</div>
                      )}
                      <div className="text-sm">
                        <div className="font-medium text-text-primary">{c.displayName || c.email}</div>
                        <div className="text-xs text-text-secondary">{c.email}</div>
                      </div>
                    </div>
                    <div>
                      {isOwner ? (
                        <Button variant="ghost" size="sm" onClick={() => remove(c.email)}>
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {isOwner ? (
            <form onSubmit={invite} className="rounded-lg border border-border-default bg-bg-subtle p-4">
              <p className="mb-3 text-sm font-semibold text-text-primary">Invite by email</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-text-primary"
                />
                <Button type="submit">Invite</Button>
              </div>
              {status && (
                <p className={`mt-2 text-xs ${status.includes("Cannot") || status.includes("Failed") ? "text-state-error" : "text-state-success"}`}>
                  {status}
                </p>
              )}
            </form>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;
