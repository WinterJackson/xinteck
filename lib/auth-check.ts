import { verifySession } from "@/lib/auth";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireRole(allowedRoles: Role[]) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
        redirect("/admin/login");
    }

    const session = await verifySession(token);

    if (!session || !session.valid) {
        redirect("/admin/login");
    }

    if (!allowedRoles.includes(session.user.role)) {
        console.warn(`Unauthorized access attempt by ${session.user.email} (${session.user.role})`);
        redirect("/admin");
    }

    return session.user;
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) return null;

    const session = await verifySession(token);
    if (!session || !session.valid) return null;

    return session.user;
}
