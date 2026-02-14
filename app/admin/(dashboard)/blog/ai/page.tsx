import { getAiSettings } from "@/actions/ai";
import { AiDashboardClient } from "@/components/admin/ai/AiDashboardClient";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AiDashboardPage() {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    
    const settings = await getAiSettings();
    
    // Default fallback if no settings exist yet
    const initialSettings = settings || {
        targetNiches: [],
        excludedKeywords: [],
        brandVoice: ""
    };

    return <AiDashboardClient initialSettings={initialSettings} />;
}
