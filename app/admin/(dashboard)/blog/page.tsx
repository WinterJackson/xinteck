import { getBlogPosts } from "@/actions/blog";
import { BlogManager } from "@/components/admin/BlogManager";

export const dynamic = "force-dynamic";

export default async function BlogPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string; category?: string; status?: string; page?: string; limit?: string }> 
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;
  
  const result = await getBlogPosts({
    search: params.search,
    category: params.category,
    status: params.status,
    page,
    pageSize: limit
  });

  return <BlogManager initialData={result} />;
}
