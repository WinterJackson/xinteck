"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

// FETCH ACTIVITY
export async function getUserActivity(limit = 20) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    const logs = await prisma.auditLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
            id: true,
            action: true,
            createdAt: true,
            metadata: true
        }
    });

    return logs;
}

// UPDATE NOTIFICATIONS
export async function getNotificationPreferences() {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Return default prefs if null
    return (user.notificationPreferences as any) || {
        security: true,
        updates: true,
        comments: false,
        marketing: false
    };
}

export async function updateNotificationPreferences(prefs: any) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    await prisma.user.update({
        where: { id: user.id },
        data: { notificationPreferences: prefs }
    });

    await logAudit({
        action: "user.update_notification_prefs",
        entity: "User",
        entityId: user.id,
        metadata: prefs
    });

    return { success: true };
}
