import { getFolders, getMediaFiles } from "@/actions/media";
import { FileManagerClient } from "@/components/admin/FileManagerClient";

export const dynamic = "force-dynamic";

export default async function FilesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string; type?: "image" | "document" | "video" | "all"; page?: string; limit?: string; folderId?: string }> 
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 24;
  const search = params.search;
  const type = params.type; // image | document | video | all | undefined
  const folderId = params.folderId || null;

  // ─── LOGIC ───
  // Navigation Mode: type is 'all' or undefined
  // Filter Mode: type is 'image', 'document', 'video'
  
  const isFilterMode = type && type !== "all";
  
  // Only fetch folders in Navigation Mode (and if not searching, assuming search flattens everything or search doesn't match folders yet)
  const foldersPromise = (!isFilterMode && !search) ? getFolders(folderId) : Promise.resolve([]);
  
  const [folders, result] = await Promise.all([
      foldersPromise,
      getMediaFiles({ page, pageSize: limit, search, type, folderId })
  ]);
  
  return (
    <FileManagerClient 
        initialData={result} 
        folders={folders}
        currentFolderId={folderId}
        activeType={type || "all"}
    />
  );
}


