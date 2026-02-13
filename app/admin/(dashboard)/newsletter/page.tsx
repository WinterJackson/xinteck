import { getNewsletterStats, getNewsletterSubscribers } from "@/actions/newsletter";
import { NewsletterClient } from "@/components/admin/NewsletterClient";

export const dynamic = "force-dynamic";

export default async function NewsletterPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ search?: string; filter?: "all" | "active" | "unsubscribed"; page?: string; limit?: string }> 
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 12;
    const search = typeof params.search === 'string' ? params.search : undefined;
    const filter = params.filter;

    const [subscribers, stats] = await Promise.all([
        getNewsletterSubscribers({ page, pageSize: limit, search, filter }),
        getNewsletterStats()
    ]);

    return <NewsletterClient initialData={subscribers} stats={stats} />;
}
