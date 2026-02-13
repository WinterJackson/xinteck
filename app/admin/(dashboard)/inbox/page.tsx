import { getMessages } from "@/actions/inbox";
import { InboxClient } from "@/components/admin/InboxClient";

export const dynamic = "force-dynamic";

export default async function InboxPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ filter?: string; search?: string; page?: string; limit?: string }> 
}) {
  const params = await searchParams;
  const filter = (params.filter as "all" | "unread" | "starred" | "archived") || "all";
  const search = params.search;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;

  const result = await getMessages({ filter, search, page, pageSize: limit });

  return <InboxClient initialData={result} />;
}
