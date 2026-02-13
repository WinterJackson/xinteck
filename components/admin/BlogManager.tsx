"use client";

import { deleteBlogPost } from "@/actions/blog";
import { DataGrid } from "@/components/admin/DataGrid";
import { RoleGate } from "@/components/admin/RoleGate";
import { ConfirmDialog, PageContainer, PageHeader } from "@/components/admin/ui";
import { Select } from "@/components/admin/ui/Select";
import { Role } from "@prisma/client";
import { FileText, LayoutGrid, List, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

import { BlogPostSummary } from "@/types";

import { Pagination } from "@/components/admin/ui/Pagination";
import { PaginatedResponse } from "@/lib/pagination";

interface BlogManagerProps {
  initialData: PaginatedResponse<BlogPostSummary>;
}

export function BlogManager({ initialData }: BlogManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<string[] | null>(null);

  // State derived from URL
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "All Categories";
  const statusFilter = searchParams.get("status") || "All Status";

  const posts = initialData.data;
  const meta = {
      page: initialData.page,
      totalPages: initialData.totalPages,
      total: initialData.total
  };

  const handlePageChange = (page: number) => {
     const params = new URLSearchParams(searchParams.toString());
     params.set("page", page.toString());
     router.push(`?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("search", term);
    else params.delete("search");
    params.set("page", "1"); // Reset page
    router.replace(`?${params.toString()}`);
  }, 300);

  const handleFilter = (key: string, value: string) => {
     const params = new URLSearchParams(searchParams.toString());
     if (value && value !== "All Categories" && value !== "All Status") params.set(key, value);
     else params.delete(key);
     params.set("page", "1"); // Reset page
     router.replace(`?${params.toString()}`);
  };

  const performDelete = async (ids: string[]) => {
      startTransition(async () => {
         for (const id of ids) {
             await deleteBlogPost(id);
         }
         setSelectedIds([]); 
         setConfirmDeleteIds(null);
         router.refresh(); 
      });
  };

  const handleConfirmedDelete = async () => {
      if (!confirmDeleteIds) return;
      await performDelete(confirmDeleteIds);
  };
  
  const columns = [
    {
      key: "title",
      label: "Article Details",
      render: (row: BlogPostSummary) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[6px] bg-white/10 flex-shrink-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-white/20">
              <FileText size={20} />
            </div>
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-white leading-tight">{row.title}</span>
             <span className="text-xs text-white/40">{row.author}</span>
          </div>
        </div>
      )
    },
    { key: "category", label: "Category" },
    {
      key: "status",
      label: "Status",
      render: (row: BlogPostSummary) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
          row.status === "Published" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Published" ? "bg-green-400" : "bg-yellow-400"}`} />
          {row.status}
        </span>
      )
    },
    { key: "views", label: "Views", align: "right" as const },
    { key: "date", label: "Date", align: "right" as const },
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Blog Manager" 
        subtitle={`Create, edit, and manage your articles. Total: ${meta.total}`}
        actions={
          <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
              <Link href="/admin/blog/new" className="bg-gold text-black font-bold px-3 py-1.5 md:px-6 md:py-3 text-[10px] md:text-sm rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-white transition-colors shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] whitespace-nowrap">
                <Plus size={14} className="md:w-[18px] md:h-[18px]" />
                New Post
              </Link>
          </RoleGate>
        }
      />

      <div className="flex flex-col gap-3">
        {/* Toolbar */}
        <div className="flex flex-row gap-2 md:gap-4 justify-between items-center bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-2 backdrop-blur-md">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input 
            type="text" 
            placeholder="Search articles..." 
            defaultValue={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-black/20 dark:bg-white/5 border border-white/5 dark:border-white/10 rounded-[10px] pl-7 md:pl-9 pr-2 md:pr-3 py-1.5 md:py-2 text-xs md:text-sm text-white focus:border-gold/50 outline-none placeholder:text-white/20 dark:placeholder:text-white/30 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 md:gap-2 border-l border-white/20 dark:border-white/10 pl-2 md:pl-4 shrink-0">
            {/* Moved Delete Button Here */}
            {selectedIds.length > 0 && (
                <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                    <button 
                        onClick={() => setConfirmDeleteIds(selectedIds)}
                        className="p-1.5 md:p-2 rounded-[6px] bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        title="Delete Selected"
                    >
                        <Trash2 size={14} className="md:w-[16px] md:h-[16px]" />
                    </button>
                </RoleGate>
            )}

            <Select 
               value={statusFilter}
               onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilter("status", e.target.value)}
               options={[
                 { value: "All Status", label: "All Status" },
                 { value: "Published", label: "Published" },
                 { value: "Draft", label: "Draft" },
                 { value: "Archived", label: "Archived" }
               ]}
               className="w-auto min-w-[120px]"
            />

          <button 
            onClick={() => setViewMode("grid")}
            className={`p-1.5 md:p-2 rounded-[6px] transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <LayoutGrid size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-1.5 md:p-2 rounded-[6px] transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <List size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>
      
      {/* Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
         {["All Categories", "Technology", "Design", "DevOps", "Sustainability", "Engineering"].map((filter) => (
           <button 
             key={filter}
             onClick={() => handleFilter("category", filter)}
             className={`px-4 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === filter 
                ? "bg-gold text-black border-gold font-bold shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]" 
                : "bg-white/30 dark:bg-white/5 border-white/20 dark:border-white/10 text-white/60 hover:bg-white/50 dark:hover:bg-white/10 hover:text-white hover:border-white/40 dark:hover:border-white/20 backdrop-blur-sm"
             }`}
           >
             {filter}
           </button>
         ))}
      </div>

      <ConfirmDialog 
        open={!!confirmDeleteIds}
        onClose={() => setConfirmDeleteIds(null)}
        onConfirm={handleConfirmedDelete}
        title="Delete Posts?"
        message="Are you sure you want to delete the selected posts? This action cannot be undone."
      />

      {/* Data Grid */}
      {viewMode === "list" ? (
        <DataGrid 
          columns={columns} 
          data={posts}
          hideSearch={true}
          hideBulkActions={true} // Hidden in DataGrid, handled in Toolbar
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          actions={{
            onEdit: (id) => router.push(`/admin/blog/${id}`),
            onDelete: performDelete, // DataGrid handles confirmation, then calls this
            onView: (id) => {},
          }} 
          pagination={{
            page: meta.page,
            totalPages: meta.totalPages,
            total: meta.total,
            onPageChange: handlePageChange
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {posts.map(post => (
                    <div key={post.id} className="group bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] overflow-hidden hover:border-gold/30 transition-all flex flex-col">
                        <div className="aspect-video bg-black/20 relative flex items-center justify-center text-white/10">
                        <FileText size={48} />
                        <div className="absolute top-3 left-3">
                            <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider border ${
                                post.status === "Published" ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-white/5 text-foreground/50 border-white/10"
                            }`}>
                                {post.status}
                            </span>
                        </div>
                        </div>
                        
                        <div className="p-4 flex flex-col flex-1 gap-2">
                        <div>
                            <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{post.category}</span>
                            <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-2 mt-1">{post.title}</h3>
                            <p className="text-xs text-white/40 mt-1">By {post.author} • {post.date}</p>
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs text-white/40">{post.views} views</span>
                            <div className="flex gap-2">
                                <button onClick={() => router.push(`/admin/blog/${post.id}`)} className="p-1.5 hover:bg-white/10 rounded-[6px] text-white/60 hover:text-gold transition-colors">
                                    <span className="sr-only">Edit</span>
                                    <div className="w-4 h-4 rounded bg-current opacity-50" />
                                </button>
                                <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                                <button onClick={() => setConfirmDeleteIds([post.id])} className="p-1.5 hover:bg-white/10 rounded-[6px] text-white/60 hover:text-red-400 transition-colors">
                                    <span className="sr-only">Delete</span>
                                    <div className="w-4 h-4 rounded bg-current opacity-50" />
                                </button>
                                </RoleGate>
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
             </div>
             
             {/* Grid View Pagination */}
             <div className="flex justify-center mt-4">
                 <Pagination 
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={handlePageChange}
                 />
             </div>
        </div>
      )}
      </div>
    </PageContainer>
  );
}
