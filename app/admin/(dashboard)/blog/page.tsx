"use client";

import { DataGrid } from "@/components/admin/DataGrid";
import { BLOG_POSTS } from "@/lib/admin-data";
import { FileText, LayoutGrid, List, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function BlogManagerPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [posts, setPosts] = useState(BLOG_POSTS);

  // Filter Logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || post.category === categoryFilter;
      const matchesStatus = statusFilter === "All Status" || post.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, searchQuery, categoryFilter, statusFilter]);

  const handleDelete = (ids: number[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} post(s)?`)) {
      setPosts(posts.filter(p => !ids.includes(p.id)));
      // In a real app, you would make an API call here
    }
  };

  const columns = [
    {
      key: "title",
      label: "Article Details",
      render: (row: any) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[6px] bg-white/10 flex-shrink-0 overflow-hidden relative">
            {/* Placeholder for real image */}
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
      render: (row: any) => (
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
    <div className="flex flex-col gap-4 md:gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg md:text-3xl font-bold text-white tracking-tight">Blog Manager</h1>
          <p className="text-white/40 text-[10px] md:text-sm">Create, edit, and manage your articles.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/blog/new" className="bg-gold text-black font-bold px-3 py-1.5 md:px-6 md:py-3 text-[10px] md:text-sm rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-white transition-colors shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] whitespace-nowrap">
            <Plus size={14} className="md:w-[18px] md:h-[18px]" />
            New Post
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Toolbar */}
        <div className="flex flex-row gap-2 md:gap-4 justify-between items-center bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-2 backdrop-blur-md">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none rounded-[10px] pl-7 md:pl-12 pr-2 md:pr-4 py-1.5 md:py-2 text-xs md:text-sm text-white focus:outline-none placeholder:text-white/20"
          />
        </div>
        <div className="flex items-center gap-1 md:gap-2 border-l border-white/20 dark:border-white/10 pl-2 md:pl-4 shrink-0">
            {/* Status Filter - Visible on all screens */}
            <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[6px] text-xs text-white/60 px-2 py-1 outline-none"
            >
               <option>All Status</option>
               <option>Published</option>
               <option>Draft</option>
            </select>

          <button 
            onClick={() => setViewMode("grid")}
            aria-label="Grid View"
            className={`p-1.5 md:p-2 rounded-[6px] transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <LayoutGrid size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            aria-label="List View"
            className={`p-1.5 md:p-2 rounded-[6px] transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <List size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>
      
      {/* Quick Filters Row (Mobile/Desktop) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
         {["All Categories", "Technology", "Design", "DevOps"].map((filter) => (
           <button 
             key={filter}
             onClick={() => setCategoryFilter(filter)}
             className={`px-4 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === filter ? "bg-white text-black border-white" : "border-white/20 dark:border-white/10 text-white/60 hover:text-white hover:border-white/30"
             }`}
           >
             {filter}
           </button>
         ))}
      </div>

      {/* Data Grid */}
      {viewMode === "list" ? (
        <DataGrid 
          columns={columns} 
          data={filteredPosts}
          hideSearch={true}
          hideBulkActions={true}
          actions={{
            onEdit: (id) => router.push(`/admin/blog/${id}`),
            onDelete: handleDelete,
            onView: (id) => router.push(`/blog/post-${id}`)
          }} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
           {filteredPosts.map(post => (
             <div key={post.id} className="group bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] overflow-hidden hover:border-gold/30 transition-all flex flex-col">
                {/* Image Placeholder */}
                <div className="aspect-video bg-black/20 relative flex items-center justify-center text-white/10">
                   <FileText size={48} />
                   <div className="absolute top-3 left-3">
                      <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider border ${
                        post.status === "Published" ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
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
                             {/* Use Lucide icon here if not imported, assumed imported at top */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                         </button>
                         <button onClick={() => handleDelete([post.id])} className="p-1.5 hover:bg-white/10 rounded-[6px] text-white/60 hover:text-red-400 transition-colors">
                            <span className="sr-only">Delete</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           ))}
           
           {/* Add New Card */}
            <Link href="/admin/blog/new" className="border border-dashed border-white/20 dark:border-white/10 rounded-[10px] flex flex-col items-center justify-center gap-4 text-white/20 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all min-h-[200px]">
              <div className="w-12 h-12 rounded-full bg-white/30 dark:bg-white/5 flex items-center justify-center border border-white/5">
                 <Plus size={24} />
              </div>
              <span className="font-bold text-sm">New Article</span>
           </Link>
        </div>
      )}
      </div>
    </div>
  );
}
