import { destroySession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/*
Purpose: Handle session destruction (logout).
Decision: We clear both the database record and the client-side cookie to ensure a complete termination of access.
*/
export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (token) {
        // Delete from DB (best effort)
        await destroySession(token);
    }

    // Purpose: Clear the HTTP-only cookie to effectively log the user out on the client side immediately.
    // Clear cookie
    cookieStore.delete('session_token');

    return NextResponse.json({ success: true });
}
