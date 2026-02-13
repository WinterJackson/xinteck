import { getService } from "@/actions/service";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
    const { id } = await params;
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    const service = await getService(id);

    if (!service) {
        notFound();
    }

    return <ServiceForm service={service} />;
}
