"use client";

import type { ReactNode } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EditorDialogPatternProps {
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function EditorDialogPattern({
  title,
  description,
  children,
  footer,
  className,
}: EditorDialogPatternProps) {
  return (
    <DialogContent
      className={cn(
        "rounded-3xl border border-surface-border bg-elevated text-copy-primary shadow-2xl backdrop-blur",
        className
      )}
    >
      <DialogHeader>
        <DialogTitle className="text-base text-copy-primary">{title}</DialogTitle>
        {description ? (
          <DialogDescription className="text-copy-muted">
            {description}
          </DialogDescription>
        ) : null}
      </DialogHeader>

      {children ? <div className="text-sm text-copy-secondary">{children}</div> : null}

      {footer ? (
        <DialogFooter className="border-surface-border bg-subtle/70">
          {footer}
        </DialogFooter>
      ) : null}
    </DialogContent>
  );
}
