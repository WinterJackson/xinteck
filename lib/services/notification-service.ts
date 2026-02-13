import { prisma } from "@/lib/prisma";
import { NotificationPriority, NotificationType, Role } from "@prisma/client";

/**
 * NOTIFICATION SERVICE
 * Centralized logic for all notification operations.
 * Enforces "Single Source of Truth" and RBAC delivery.
 */

interface CreateNotificationParams {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    priority?: NotificationPriority;
    link?: string;
    metadata?: Record<string, any>;
    expiresAt?: Date;
}

interface BroadcastParams {
    roles: Role[];
    title: string;
    message: string;
    type?: NotificationType;
    priority?: NotificationPriority;
    link?: string;
    metadata?: Record<string, any>;
}

export class NotificationService {

    /**
     * Create a single notification for a specific user.
     */
    static async create(params: CreateNotificationParams) {
        return prisma.notification.create({
            data: {
                userId: params.userId,
                title: params.title,
                message: params.message,
                type: params.type || NotificationType.INFO,
                priority: params.priority || NotificationPriority.NORMAL,
                link: params.link,
                metadata: params.metadata || {},
                expiresAt: params.expiresAt
            }
        });
    }

    /**
     * Broadcast a notification to all users with specific roles.
     * Uses createMany for efficiency.
     */
    static async broadcastToRoles(params: BroadcastParams) {
        // 1. Fetch target users
        const users = await prisma.user.findMany({
            where: {
                role: { in: params.roles },
                status: "ACTIVE",
                deletedAt: null
            },
            select: { id: true }
        });

        if (users.length === 0) return { count: 0 };

        // 2. Prepare payload
        const data = users.map(user => ({
            userId: user.id,
            title: params.title,
            message: params.message,
            type: params.type || NotificationType.INFO,
            priority: params.priority || NotificationPriority.NORMAL,
            link: params.link,
            metadata: params.metadata || {},
            // Default expiration: 30 days for normal, 90 for high transparency? 
            // Letting DB default handles expiresAt=null unless specified.
        }));

        // 3. Bulk insert
        const result = await prisma.notification.createMany({
            data
        });

        return { count: result.count };
    }

    /**
     * Mark a notification as read.
     * Enforces ownership check implicitly by where clause in Server Action, 
     * but here we just update.
     */
    static async markAsRead(id: string) {
        return prisma.notification.update({
            where: { id },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });
    }

    /**
     * Mark all notifications as read for a user.
     */
    static async markAllAsRead(userId: string) {
        return prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });
    }

    /**
     * Cleanup expired notifications.
     * Should be called by a cron job or periodical trigger.
     */
    static async cleanupExpired() {
        const now = new Date();
        return prisma.notification.deleteMany({
            where: {
                expiresAt: { lt: now }
            }
        });
    }
}
