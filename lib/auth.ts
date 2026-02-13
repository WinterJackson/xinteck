import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'development_super_secret_key_change_me');
const SALT_ROUNDS = 10;
const SESSION_EXPIRY = '7d';

export async function hashPassword(plain: string) {
    return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
}

export async function createSession(user: Pick<User, 'id' | 'email' | 'role' | 'name'>) {
    // Create DB session
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Generate random token for session ID (opaque) or JWT?
    // Using JWT allows carrying payload for quick access
    const token = await new SignJWT({
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(SESSION_EXPIRY)
        .sign(JWT_SECRET);

    // Store token in DB
    const session = await prisma.session.create({
        data: {
            userId: user.id,
            token,
            expiresAt: expires,
        },
    });

    return { session, token };
}

export async function verifySession(token: string) {
    try {
        // 1. Verify signature
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // 2. Verify against DB session (ensure not revoked)
        // Note: This makes it stateful, which is desired for admin security
        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            return null;
        }

        return {
            valid: true,
            user: session.user,
            payload
        };
    } catch (error) {
        return null;
    }
}

export async function destroySession(token: string) {
    await prisma.session.deleteMany({
        where: { token }
    });
}
