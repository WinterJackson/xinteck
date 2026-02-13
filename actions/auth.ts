"use server";

import { INTERNAL_getSecret } from "@/actions/settings";
import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema, registerSchema, resetPasswordSchema, updateProfileSchema } from "@/lib/validations";
import { Role, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Resend } from "resend";

// 1. REGISTRATION
export async function registerUser(data: { name: string; email: string; password: string }) {
    const parsed = registerSchema.parse(data);

    const existingUser = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existingUser) {
        throw new Error("Email already in use");
    }

    // Check if this is the FIRST user
    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;
    const role = isFirstUser ? Role.SUPER_ADMIN : Role.SUPPORT_STAFF;

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
        data: {
            name: parsed.name,
            email: parsed.email,
            passwordHash: hashedPassword,
            role: role,
            status: UserStatus.ACTIVE,
        }
    });

    await logAudit({
        action: "user.register",
        entity: "User",
        entityId: user.id,
        metadata: { email: user.email, role }
    });

    return { success: true };
}

// 2. FORGOT PASSWORD
export async function forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // Silent fail for security, or standard message
        return { success: true, message: "If an account exists, an email has been sent." };
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token
    await prisma.passwordResetToken.deleteMany({ where: { email } }); // Clear old tokens
    await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expiresAt
        }
    });

    // Send Email via Resend
    const resendApiKey = await INTERNAL_getSecret("RESEND_API_KEY");
    const fromEmail = await INTERNAL_getSecret("RESEND_FROM_EMAIL");

    if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        // Assuming localhost for dev, but in prod ideally use env VAR for BASE_URL
        // For now, I'll use a relative path if deployed on vercel it handles it? No.
        // I need public URL.
        // Ensure APP_URL is set for production links
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!baseUrl && process.env.NODE_ENV === "production") {
            console.error("CRITICAL: NEXT_PUBLIC_APP_URL is not set. Password reset link will be broken.");
        }

        const effectiveUrl = baseUrl || "http://localhost:3000";
        const resetLink = `${effectiveUrl}/admin/reset-password?token=${token}`;

        try {
            await resend.emails.send({
                from: fromEmail || "onboarding@resend.dev",
                to: email,
                subject: "Reset Your Password - Xinteck",
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h1>Password Reset Request</h1>
                        <p>You requested to reset your password for Xinteck Admin Dashboard.</p>
                        <p>Click the link below to set a new password:</p>
                        <a href="${resetLink}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                        <p>This link expires in 1 hour.</p>
                        <p>If you didn't request this, ignore this email.</p>
                    </div>
                `
            });
        } catch (e) {
            console.error("Failed to send reset email", e);
            throw new Error("Failed to send email. Inspect server logs.");
        }
    } else {
        console.warn("Resend API Key missing. Token generated but email not sent. Token: " + token);
        // For dev purposes, maybe return token in console or debug? 
        // User explicitly asked for "FULLY IMPLEMENTED".
        if (process.env.NODE_ENV === "development") {
            // Log removed for production
        }
    }

    await logAudit({
        action: "auth.forgot_password_request",
        entity: "User",
        entityId: user.id
    });

    return { success: true, message: "If an account exists, an email has been sent." };
}

// 3. RESET PASSWORD
export async function resetPassword(token: string, newPassword: string) {
    const parsed = resetPasswordSchema.parse({ token, newPassword });

    const resetRecord = await prisma.passwordResetToken.findUnique({ where: { token: parsed.token } });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
        throw new Error("Invalid or expired token");
    }

    const user = await prisma.user.findUnique({ where: { email: resetRecord.email } });
    if (!user) {
        throw new Error("User not found");
    }

    const passwordHash = await bcrypt.hash(parsed.newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
    });

    // Cleanup
    await prisma.passwordResetToken.delete({ where: { token: parsed.token } });

    // Optional: Invalidate existing sessions?
    // Secure approach: yes.
    await prisma.session.deleteMany({ where: { userId: user.id } });

    await logAudit({
        action: "auth.reset_password",
        entity: "User",
        entityId: user.id
    });

    return { success: true };
}

// 4. CHANGE PASSWORD (Authenticated)
export async function changePassword(oldPassword: string, newPassword: string) {
    const parsed = changePasswordSchema.parse({ oldPassword, newPassword });

    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) throw new Error("User not found");

    const valid = await bcrypt.compare(parsed.oldPassword, dbUser.passwordHash);
    if (!valid) {
        throw new Error("Incorrect current password.");
    }

    const passwordHash = await bcrypt.hash(parsed.newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
    });

    await logAudit({
        action: "auth.change_password",
        entity: "User",
        entityId: user.id
    });

    return { success: true };
}

// 5. UPDATE PROFILE
export async function updateProfile(data: { name: string; email: string; avatar?: string }) {
    const parsed = updateProfileSchema.parse(data);

    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    if (parsed.email !== user.email) {
        const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
        if (existing) throw new Error("Email already taken");
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            name: parsed.name,
            email: parsed.email,
            ...(parsed.avatar && { avatar: parsed.avatar })
        }
    });

    await logAudit({
        action: "user.update_profile",
        entity: "User",
        entityId: user.id,
        metadata: { ...parsed }
    });


    return { success: true };
}
// 6. SESSION MANAGEMENT
export async function getSessions() {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Fetch active sessions
    const sessions = await prisma.session.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            ipAddress: true,
            userAgent: true,
            createdAt: true,
            expiresAt: true,
            token: true // Need this to identify *current* session
        }
    });

    return sessions;
}

export async function revokeSession(sessionId: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    // Ensure session belongs to user
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== user.id) {
        throw new Error("Session not found or access denied");
    }

    await prisma.session.delete({ where: { id: sessionId } });

    await logAudit({
        action: "auth.session_revoked",
        entity: "Session",
        entityId: sessionId,
        metadata: { ip: session.ipAddress, ua: session.userAgent }
    });

    return { success: true };
}

export async function revokeAllOtherSessions(currentSessionToken: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT_STAFF]);

    const result = await prisma.session.deleteMany({
        where: {
            userId: user.id,
            token: { not: currentSessionToken } // Keep current session
        }
    });

    await logAudit({
        action: "auth.all_other_sessions_revoked",
        entity: "Session",
        entityId: user.id,
        metadata: { count: result.count }
    });

    return { success: true, count: result.count };
}
