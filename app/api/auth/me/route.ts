import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/*
Purpose: Endpoint for the client to verify its current session state.
Decision: Returns minimal user profile data to allow the UI to adapt (e.g., show avatar/name) without exposing sensitive fields.
*/
export async function GET(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await verifySession(token);

    if (!result || !result.valid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = result;

    return NextResponse.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        },
    });
}
