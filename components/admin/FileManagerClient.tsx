"use client";

import { deleteFile, uploadFile } from "@/actions/media";
import { RoleGate } from "@/components/admin/RoleGate";
import { PageContainer, PageHeader, Pagination, useToast } from "@/components/admin/ui";
import { Role } from "@prisma/client";
import { CloudUpload, FileText, Folder, Grid, Image as ImageIcon, LayoutList, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { PaginatedResponse } from "@/lib/pagination";
import { useSearchParams } from "next/navigation";

interface FileManagerClientProps {
  initialData: PaginatedResponse<any>;
}

export function FileManagerClient({ initialData }: FileManagerClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  // Map folder "names" to "type" filter
  // "All Files" -> type=all
  // "Images" -> type=image
  // "Documents" -> type=document
  const currentType = searchParams.get("type") || "all";
  const mapTypeToFolder = (type: string) => {
      if (type === "image") return "Images";
      if (type === "document") return "Documents";
      return "All Files";
  };
  
  const [activeFolder, setActiveFolder] = useState(mapTypeToFolder(currentType));
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const folders = ["All Files", "Images", "Documents"];

  const files = initialData.data;
  const meta = {
      page: initialData.page,
      totalPages: initialData.totalPages,
      total: initialData.total
  };

  const handleFolderChange = (folder: string) => {
      setActiveFolder(folder);
      const params = new URLSearchParams(searchParams.toString());
      if (folder === "Images") params.set("type", "image");
      else if (folder === "Documents") params.set("type", "document");
      else params.delete("type");
      
      params.set("page", "1");
      router.push(`/admin/files?${params.toString()}`);
  };

  const handleSearchChange = (val: string) => {
      setSearchQuery(val);
      // Debounce logic should go here ideally or handle on keypress/blur
      // For now, simpler: user presses enter or we debounce effect
  };
  
  // Use effect for search debounce
  useEffect(() => {
     const timer = setTimeout(() => {
         const params = new URLSearchParams(searchParams.toString());
         if (searchQuery) params.set("search", searchQuery);
         else params.delete("search");
         
         // Only push if changed
         const currentSearch = searchParams.get("search") || "";
         if (currentSearch !== searchQuery) {
             params.set("page", "1");
             router.push(`/admin/files?${params.toString()}`);
         }
     }, 500);
     return () => clearTimeout(timer);
  }, [searchQuery]);

  // Removed client-side files memo logic as we now filter server-side

  const handleDelete = (id: string) => {
    if (confirm("Permanently delete this file?")) {
       startTransition(async () => {
           try {
               await deleteFile(id);
               toast("File deleted", "success");
               router.refresh();
           } catch (e: any) {
               toast("Delete failed: " + e.message, "error");
           }
       });
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      
      setUploading(true);
      const formData = new FormData();
      formData.append("file", files[0]); // Handle single file for now

      try {
          await uploadFile(formData);
          toast("File uploaded successfully", "success");
          router.refresh();
      } catch (e: any) {
          toast("Upload failed: " + e.message, "error");
      } finally {
          setUploading(false);
      }
  };

  // Simulated storage calc
  const storageUsed = useMemo(() => {
     // Parse "X MB", "Y KB" etc manually or use bytes from props if available?
     // Props pass formatted size string. 
     // Simplify: Just count items for now as mock metric
     return (files.length * 0.5).toFixed(1); // Avg 0.5 MB ?
  }, [files]);

  return (
    <PageContainer className="h-[calc(100vh-140px)]" onDragEnter={() => setDragActive(true)}>
      {/* Drag Overlay */}
      {dragActive && (
          <div 
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm border-2 border-dashed border-gold flex flex-col items-center justify-center animate-in fade-in duration-200"
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFileUpload(e.dataTransfer.files);
            }}
          >
             <CloudUpload size={48} className="text-gold mb-4" />
             <h3 className="text-2xl font-bold text-white">Drop files to upload</h3>
          </div>
      )}

      <PageHeader 
        title="File Manager" 
        subtitle="Centralized media library."
        actions={
          <div className="flex gap-3">
             <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] text-white hover:text-gold hover:border-gold/30 transition-colors flex items-center gap-2 text-[10px] md:text-sm font-bold">
              <Folder size={14} />
              New Folder
             </button>
             
             <div className="relative">
                 <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                   <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e.target.files)}
                      disabled={uploading}
                   />
                   <label htmlFor="file-upload" className={`bg-gold text-black font-bold px-4 py-1.5 md:px-6 md:py-2 text-[10px] md:text-sm rounded-[10px] flex items-center gap-2 hover:bg-white transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                     {uploading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/> : <CloudUpload size={14} />}
                     Upload
                   </label>
                 </RoleGate>
             </div>
          </div>
        }
      />

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md p-4 gap-2">
           <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 px-2">Library</h3>
           {folders.map(folder => (
             <button
               key={folder}
               onClick={() => setActiveFolder(folder)}
               className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm font-medium transition-all ${
                 activeFolder === folder ? "bg-gold text-black shadow-lg shadow-gold/20" : "text-white/60 hover:text-white hover:bg-white/30 dark:bg-white/5"
               }`}
             >
               <Folder size={16} />
               {folder}
             </button>
           ))}
           
           <div className="mt-auto">
              <div className="bg-white/30 dark:bg-white/5 rounded-[8px] p-4 text-center">
                 <p className="text-xs text-white/40 mb-2">Storage Used (Est.)</p>
                 <div className="w-full h-1.5 bg-white/10 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `10%` }} /> 
                    {/* Dummy percent for now */}
                 </div>
                 <p className="text-xs font-bold text-white">{storageUsed} MB <span className="text-white/40 font-normal">/ 1 GB</span></p>
              </div>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md overflow-hidden">
          {/* Toolbar */}
          <div className="p-2 md:p-4 border-b border-white/20 dark:border-white/10 flex justify-between items-center gap-2 bg-black/20">
             <div className="relative flex-1 min-w-0 max-w-sm">
                <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                <input 
                  type="text" 
                  placeholder="Search files..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/20 dark:bg-white/5 border border-white/5 dark:border-white/10 rounded-[10px] pl-7 md:pl-9 pr-2 md:pr-3 py-1.5 md:py-2 text-xs md:text-sm text-white focus:border-gold/50 outline-none placeholder:text-white/20 dark:placeholder:text-white/30 transition-colors"
                />
             </div>
             <div className="flex items-center gap-1 md:gap-2 shrink-0">
                <button 
                  onClick={() => setViewMode("grid")} 
                  className={`p-1.5 md:p-2 rounded-[6px] ${viewMode === 'grid' ? "text-white bg-white/10" : "text-white/40 hover:text-white"}`}
                >
                   <Grid size={14} className="md:w-[18px] md:h-[18px]" />
                </button>
                <button 
                  onClick={() => setViewMode("list")} 
                  className={`p-1.5 md:p-2 rounded-[6px] ${viewMode === 'list' ? "text-white bg-white/10" : "text-white/40 hover:text-white"}`}
                >
                   <LayoutList size={14} className="md:w-[18px] md:h-[18px]" />
                </button>
             </div>
          </div>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6">
            {viewMode === "grid" ? (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                 {files.map((file: any) => (
                   <div key={file.id} className="group cursor-pointer animate-in fade-in zoom-in duration-300">
                      <div className="aspect-square bg-white/30 dark:bg-white/5 border border-white/5 rounded-[10px] flex items-center justify-center relative overflow-hidden group-hover:border-gold/50 transition-colors mb-2">
                         {file.type === 'image' ? (
                            // Use img for local file if possible, or Next/Image
                            // Since we save to public, `url` is relative path
                            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                         ) : (
                            <FileText size={32} className="text-white/20 group-hover:text-blue-400 transition-colors" />
                         )}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} className="text-white hover:text-red-400 p-2"><Trash2 size={18} /></button>
                            </RoleGate>
                         </div>
                      </div>
                      <p className="text-xs md:text-sm text-white truncate px-1" title={file.name}>{file.name}</p>
                      <p className="text-xs text-white/30 px-1">{file.size}</p>
                   </div>
                 ))}
                 {files.length === 0 && (
                    <div className="col-span-full h-40 flex items-center justify-center text-white/40 text-sm flex-col gap-2">
                       <CloudUpload size={24} className="opacity-50" />
                       No files found. 
                    </div>
                 )}
               </div>
            ) : (
               <div className="overflow-x-auto pb-2">
                 <table className="w-full text-left min-w-[700px]">
                    <thead className="text-white/40 text-xs uppercase border-b border-white/20 dark:border-white/10">
                      <tr>
                         <th className="p-3">Name</th>
                         <th className="p-3">Size</th>
                         <th className="p-3">Type</th>
                         <th className="p-3 text-right">Date</th>
                         <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody className="text-[10px] md:text-sm">
                      {files.map((file: any) => (
                        <tr key={file.id} className="border-b border-white/5 hover:bg-white/30 dark:bg-white/5 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                           <td className="p-2 md:p-3 font-medium text-white flex items-center gap-2 whitespace-nowrap">
                              {file.type === 'image' ? <ImageIcon size={14} className="text-gold" /> : <FileText size={14} className="text-blue-400" />}
                              <a href={file.url} target="_blank" className="hover:underline">{file.name}</a>
                           </td>
                           <td className="p-2 md:p-3 text-white/50 whitespace-nowrap">{file.size}</td>
                           <td className="p-2 md:p-3 text-white/50 capitalize whitespace-nowrap">{file.type}</td>
                           <td className="p-2 md:p-3 text-white/50 text-right whitespace-nowrap">{file.date}</td>
                           <td className="p-2 md:p-3 text-right">
                              <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                                <button onClick={() => handleDelete(file.id)} className="text-white/20 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                              </RoleGate>
                           </td>
                        </tr>
                      ))}
                      {files.length === 0 && (
                          <tr><td colSpan={5} className="p-8 text-center text-white/40">No files found.</td></tr>
                      )}
                    </tbody>
                 </table>
               </div>
            )}
           <div className="p-4 border-t border-white/10 flex justify-center sticky bottom-0 bg-black/40 backdrop-blur-md z-10">
                <Pagination 
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    baseUrl="/admin/files"
                />
           </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
