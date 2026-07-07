import { type ReactNode } from "react";

import { EditorLayout } from "@/components/editor";
import { getEditorProjects } from "@/lib/project-data";

interface EditorRouteLayoutProps {
  children: ReactNode;
}

export default async function EditorRouteLayout({
  children,
}: EditorRouteLayoutProps) {
  const { ownedProjects, sharedProjects } = await getEditorProjects();

  return (
    <EditorLayout ownedProjects={ownedProjects} sharedProjects={sharedProjects}>
      {children}
    </EditorLayout>
  );
}
