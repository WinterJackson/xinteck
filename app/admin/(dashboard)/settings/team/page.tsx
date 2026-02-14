import { getInvitations, getUsers } from "@/actions/team";
import { TeamManagementClient } from "@/components/admin/team/TeamManagementClient";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
    await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

    const [users, invitations] = await Promise.all([
        getUsers(),
        getInvitations()
    ]);

    return <TeamManagementClient users={users} invitations={invitations} />;
}
