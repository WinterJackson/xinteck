import { ServiceForm } from "@/components/admin/ServiceForm";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export default async function NewServicePage() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    return <ServiceForm />;
}
