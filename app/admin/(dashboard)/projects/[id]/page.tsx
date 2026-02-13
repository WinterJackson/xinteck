import { getProject } from "@/actions/project";
import { ProjectEditorForm } from "@/components/admin/ProjectEditorForm";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

  if (params.id === 'new') {
      return <ProjectEditorForm />; // New Project
  }

  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  return <ProjectEditorForm initialData={project} isEditing={true} />;
}
