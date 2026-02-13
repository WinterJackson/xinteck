import { prisma } from "@/lib/prisma";

export type AuditAction =
    | "user.login"
    | "user.logout"
    | "contact.submission"
    | "contact.archive"
    | "contact.delete"
    | "contact.mark_read"
    | "contact.mark_unread"
    | "contact.star"
    | "contact.unstar"
    | "contact.reply"
    | "newsletter.subscribe"
    | "newsletter.unsubscribe"
    | "newsletter.delete"
    | "post.create"
    | "post.update"
    | "post.delete"
    | "project.create"
    | "project.update"
    | "project.delete"
    | "setting.update"
    | "setting.delete"
    | "user.invite"
    | "user.update"
    | "user.delete"
    | "media.upload"
    | "media.delete"
    | "service.create"
    | "service.update"
    | "service.delete"
    | "service.status_change"
    | "user.register"
    | "user.update_profile"
    | "auth.forgot_password_request"
    | "auth.reset_password"
    | "auth.change_password"
    | "auth.session_revoked"
    | "auth.all_other_sessions_revoked"
    | "user.update_notification_prefs"
    | "user.bulk_delete"
    | "service.restore"
    | "newsletter.restore"
    | "contact.restore"
    | "service.reorder"
    | "secret_update";

interface AuditLogParams {
    action: AuditAction;
    entity: string;
    entityId?: string;
    userId?: string;
    metadata?: Record<string, any>;
}

export async function logAudit({ action, entity, entityId, userId, metadata }: AuditLogParams) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                userId,
                metadata,
            },
        });
    } catch (error) {
        // Fail silently to strict non-blocking of main flow, but log to console
        console.error("Audit Log Failure:", error);
    }
}
