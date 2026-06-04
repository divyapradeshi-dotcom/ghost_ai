import { EditorHome } from "@/components/editor";
import { getEditorProjects } from "@/lib/project-data";

export default async function EditorPage() {
  const { ownedProjects, sharedProjects } = await getEditorProjects();

  return <EditorHome />;
}
