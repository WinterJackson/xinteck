import { getMediaFiles } from "@/actions/media";
import { FileManagerClient } from "@/components/admin/FileManagerClient";

export const dynamic = "force-dynamic";

export default async function FilesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string; type?: "image" | "document" | "all"; page?: string; limit?: string }> 
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 24; // Higher limit for grid view
  const search = params.search;
  const type = params.type;

  const result = await getMediaFiles({ page, pageSize: limit, search, type });
  
  return <FileManagerClient initialData={result} />;
}
