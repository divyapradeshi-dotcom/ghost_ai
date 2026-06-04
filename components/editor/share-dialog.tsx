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
      setStatus("Copied!");
      setTimeout(() => setStatus(null), 1500);
    } catch {
      setStatus("Copy failed");
      setTimeout(() => setStatus(null), 1500);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>Invite collaborators or copy the project link.</DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <div>
            <p className="text-xs text-copy-muted">Project link</p>
            <div className="mt-2 flex items-center gap-2">
              <Input readOnly value={projectUrl} className="text-white" />
              <Button type="button" onClick={copyLink}>
                Copy
              </Button>
            </div>
          </div>

          {owner ? (
            <div>
              <p className="text-xs text-copy-muted">Owner</p>
              <div className="mt-2 flex items-center gap-2">
                {owner.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={owner.avatarUrl} alt="owner avatar" className="h-6 w-6 rounded-full" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-surface-border grid place-items-center text-xs">{((owner.displayName || owner.email || owner.id) || "?").charAt(0)?.toUpperCase()}</div>
                )}
                <div className="text-sm">
                  <div className="font-medium">{owner.displayName || owner.email || owner.id}</div>
                  <div className="text-xs text-copy-muted">{owner.email || owner.id}</div>
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <p className="text-xs text-copy-muted">Collaborators</p>
            <div className="mt-2 space-y-2">
              {collaborators.length === 0 ? (
                <div className="text-sm text-copy-muted">No collaborators</div>
              ) : (
                collaborators.map((c: any) => (
                  <div key={c.id || c.email} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {c.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.avatarUrl} alt="avatar" className="h-6 w-6 rounded-full" />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-surface-border grid place-items-center text-xs">{(c.email || "?").charAt(0)?.toUpperCase()}</div>
                      )}
                      <div className="text-sm">
                        <div className="font-medium">{c.displayName || c.email}</div>
                        <div className="text-xs text-copy-muted">{c.email}</div>
                      </div>
                    </div>
                    <div>
                      {isOwner ? (
                        <Button variant="ghost" onClick={() => remove(c.email)}>
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
            <form onSubmit={invite} className="mt-2 flex gap-2">
              <Input placeholder="Invite by email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-white" />
              <Button type="submit">Invite</Button>
            </form>
          ) : null}

          {status ? <div className="text-sm text-copy-muted">{status}</div> : null}
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
