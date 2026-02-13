

import { ProjectEditorForm } from "@/components/admin/ProjectEditorForm";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export default async function NewProjectPage() {
  await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
  return <ProjectEditorForm />;
}
