import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Use same secret as backend
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'development_super_secret_key_change_me');

// Public admin auth routes that don't require authentication
const PUBLIC_AUTH_ROUTES = [
    '/admin/login',
    '/admin/register',
    '/admin/forgot-password',
    '/admin/reset-password',
];


import { authLimiter, contactLimiter, newsletterLimiter } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // Fix: Cast to any because NextRequest type might miss 'ip' in some versions
    const ip = (request as any).ip || request.headers.get('x-forwarded-for') || '127.0.0.1';

    // 1. Rate Limiting for Public APIs
    if (pathname === '/api/auth/login') {
        const { success, limit, remaining, reset } = await authLimiter.limit(ip);
        if (!success) {
            return new NextResponse('Too Many Requests', {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': reset.toString(),
                },
            });
        }
    }

    if (pathname === '/api/contact') {
        const { success, limit, remaining, reset } = await contactLimiter.limit(ip);
        if (!success) {
            return new NextResponse('Too Many Requests', { status: 429, headers: { 'Retry-After': reset.toString() } });
        }
    }

    if (pathname === '/api/newsletter') {
        const { success, limit, remaining, reset } = await newsletterLimiter.limit(ip);
        if (!success) {
            return new NextResponse('Too Many Requests', { status: 429 });
        }
    }

    // 2. Protect Admin Routes
    if (pathname.startsWith('/admin')) {
        // Check if this is a public auth route
        const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));

        if (isPublicAuthRoute) {
            // For login page specifically, redirect to dashboard if already authenticated
            if (pathname === '/admin/login') {
                const token = request.cookies.get('session_token')?.value;
                if (token) {
                    try {
                        await jwtVerify(token, JWT_SECRET);
                        return NextResponse.redirect(new URL('/admin', request.url));
                    } catch (e) {
                        // invalid token, allow access to login page
                    }
                }
            }
            return NextResponse.next();
        }

        // Checking authentication for protected routes
        const token = request.cookies.get('session_token')?.value;

        if (!token) {
            // Store return URL for better UX later? (omitted for now)
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            // Verify JWT signature (stateless check for speed)
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (e) {
            // Invalid token (expired or tampered)
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('session_token'); // Clear invalid cookie
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Apply to all admin routes
        '/admin/:path*',
        // Apply to specific API routes for rate limiting
        '/api/auth/login',
        '/api/contact',
        '/api/newsletter',
    ],
};
