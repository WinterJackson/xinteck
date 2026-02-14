"use client";

import { InvitationList } from "@/components/admin/team/InvitationList";
import { InviteUserModal } from "@/components/admin/team/InviteUserModal";
import { Button } from "@/components/admin/ui/Button";
import { PageContainer } from "@/components/admin/ui/PageContainer";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { InvitationStatus, Role, UserStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Plus, Shield, User as UserIcon } from "lucide-react";
import { useState } from "react";

type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    lastActiveAt: Date | null;
    avatar: string | null;
};

type InvitationWithInviter = {
    id: string;
    email: string;
    role: Role;
    status: InvitationStatus;
    createdAt: Date;
    expiresAt: Date;
    token: string;
    invitedBy: {
        name: string;
        email: string;
    };
};

/*
Purpose: Client-side orchestrator for the Team Management view.
Decision: We accept initial data as props (SSR) to ensure SEO and fast initial load, then manage modal state locally for interactivity.
*/
export function TeamManagementClient({ users, invitations }: { users: User[]; invitations: InvitationWithInviter[] }) {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    return (
        <PageContainer>
            <PageHeader 
                title="Team Management" 
                subtitle="Manage access, roles, and invitations."
                actions={
                    <Button onClick={() => setIsInviteModalOpen(true)} icon={<Plus size={16} />}>
                        Invite Member
                    </Button>
                }
            />

            <InviteUserModal 
                open={isInviteModalOpen} 
                onClose={() => setIsInviteModalOpen(false)} 
            />

            <div className="flex flex-col gap-8 mt-8">
                {/* 
                Purpose: Display active team members.
                Decision: Separated from invitations to cleanly distinguish between current access and pending access.
                */}
                <section>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-gold" />
                        Active Members ({users.length})
                    </h3>
                    <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-white/60">
                                <thead className="bg-white/5 text-xs uppercase font-medium text-white/40">
                                    <tr>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Last Active</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold overflow-hidden">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <UserIcon size={14} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{user.name}</div>
                                                        <div className="text-xs text-white/40">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyles[user.status]}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs">
                                                {user.lastActiveAt ? formatDistanceToNow(new Date(user.lastActiveAt), { addSuffix: true }) : "Never"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 
                Purpose: Display pending and historical invitations.
                Decision: This section provides audit visibility into who has been invited and the status of those links.
                */}
                <section>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MailIcon />
                        Invitations ({invitations.filter(i => i.status === "PENDING").length} Pending)
                    </h3>
                    <InvitationList invitations={invitations} />
                </section>
            </div>
        </PageContainer>
    );
}

function RoleBadge({ role }: { role: Role }) {
    const styles = {
        SUPER_ADMIN: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        ADMIN: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        SUPPORT_STAFF: "bg-white/10 text-white/60 border-white/10",
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[role]}`}>
            {role.replace("_", " ")}
        </span>
    );
}

const statusStyles = {
    ACTIVE: "bg-green-500/20 text-green-300 border-green-500/30",
    SUSPENDED: "bg-red-500/20 text-red-300 border-red-500/30",
    AWAY: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    DELETED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

function MailIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    );
}
