import { destroySession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (token) {
        // Delete from DB (best effort)
        await destroySession(token);
    }

    // Clear cookie
    cookieStore.delete('session_token');

    return NextResponse.json({ success: true });
}
