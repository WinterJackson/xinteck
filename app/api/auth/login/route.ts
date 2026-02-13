import { logAudit } from '@/lib/audit';
import { createSession, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email("Valid email required"),
    password: z.string().min(1, "Password required"),
    rememberMe: z.boolean().optional(),
});

export async function POST(req: Request) {
    try {
        const rawData = await req.json();

        // 1. Validate input with Zod
        const validation = loginSchema.safeParse(rawData);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
        }

        const { email, password, rememberMe } = validation.data;

        // ... (User finding and validation steps remain the same) ...
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        // 4. Create Session (Logic passed to lib could account for expiry, but here we control cookie)
        const { session, token } = await createSession(user);

        // 5. Update lastActiveAt
        await prisma.user.update({
            where: { id: user.id },
            data: { lastActiveAt: new Date() }
        });

        // 6. Audit Log
        await logAudit({
            action: "user.login",
            entity: "User",
            entityId: user.id,
            metadata: {
                email: user.email,
                userAgent: req.headers.get("user-agent") || "unknown",
                rememberMe
            }
        });

        // 7. Set Cookie
        // 30 days if rememberMe, else 1 day (or session)
        const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

        const cookieStore = await cookies();
        cookieStore.set('session_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: maxAge,
            path: '/',
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

