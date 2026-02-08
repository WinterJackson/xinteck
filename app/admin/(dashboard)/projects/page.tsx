"use client";

import { PROJECTS } from "@/lib/admin-data";
import { Edit, Eye, Grid, LayoutList, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ProjectsManagerPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [projects, setProjects] = useState(PROJECTS);

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.client.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || p.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, categoryFilter]);

  const handleDelete = (id: number) => {
     if (confirm("Are you sure you want to delete this project?")) {
        setProjects(projects.filter(p => p.id !== id));
     }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg md:text-3xl font-bold text-white tracking-tight">Project Manager</h1>
          <p className="text-white/40 text-[10px] md:text-sm">Manage your portfolio case studies.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/projects/new" className="bg-gold text-black font-bold px-3 py-1.5 md:px-6 md:py-3 text-[10px] md:text-sm rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-white transition-colors shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] whitespace-nowrap">
            <Plus size={14} className="md:w-[18px] md:h-[18px]" />
            Add Project
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-3">
        {/* Toolbar */}
        <div className="flex flex-row items-center gap-2 justify-between bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-2 backdrop-blur-md">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none rounded-[10px] pl-7 md:pl-12 pr-2 py-1.5 md:py-2 text-xs md:text-sm text-white focus:outline-none placeholder:text-white/20"
          />
        </div>
        <div className="flex items-center gap-1 md:gap-2 border-l border-white/20 dark:border-white/10 pl-2 md:pl-4 shrink-0">
           {/* Category Filter */}
           <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[6px] text-[10px] md:text-xs text-white/60 px-1.5 md:px-2 py-0.5 md:py-1 outline-none hidden md:block"
           >
              <option>All Categories</option>
              <option>Mobile App</option>
              <option>UI/UX Design</option>
              <option>Web Dev</option>
              <option>Custom Software</option>
           </select>

          <button 
            onClick={() => setViewMode("grid")}
            aria-label="Grid View"
            className={`p-1.5 md:p-2 rounded-[6px] transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Grid size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            aria-label="List View"
            className={`p-1.5 md:p-2 rounded-[6px] transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <LayoutList size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>
      
      {/* Mobile Filters Row */}
      <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden">
         {["All Categories", "Mobile App", "UI/UX Design", "Web Dev"].map((filter) => (
           <button 
             key={filter}
             onClick={() => setCategoryFilter(filter)}
             className={`px-2 md:px-4 py-1 md:py-1.5 rounded-full border text-[10px] md:text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === filter ? "bg-white text-black border-white" : "border-white/20 dark:border-white/10 text-white/60 hover:text-white hover:border-white/30"
             }`}
           >
             {filter}
           </button>
         ))}
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] overflow-hidden hover:border-gold/30 transition-all flex flex-col">
              {/* Image Area */}
              <div className="aspect-video bg-black/20 relative overflow-hidden">
                 {/* Placeholder Gradient if image fails or for mock */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                 
                 {/* Status Badge */}
                 <div className="absolute top-3 left-3">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                      project.status === "Active" ? "bg-green-500 text-black" : 
                      project.status === "Completed" ? "bg-blue-500 text-white" : "bg-white/20 text-white backdrop-blur-md"
                    }`}>
                      {project.status}
                    </span>
                 </div>

                 {/* Actions Overlay */}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                    <button onClick={() => router.push(`/portfolio/${project.id}`)} className="p-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-colors" title="View in Portfolio">
                       <Eye size={18} />
                    </button>
                    <button onClick={() => router.push(`/admin/projects/${project.id}`)} className="p-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-colors" title="Edit">
                       <Edit size={18} />
                    </button>
                 </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                 <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-1">{project.title}</h3>
                      <p className="text-xs text-white/40">{project.client}</p>
                    </div>
                 </div>
                 
                 <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-gold px-2 py-1 bg-gold/10 rounded-[4px]">{project.category}</span>
                    <button onClick={() => handleDelete(project.id)} className="text-white/40 hover:text-red-400 transition-colors">
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
          
          {/* Add New Placeholer */}
          <Link href="/admin/projects/new" className="border border-dashed border-white/20 dark:border-white/10 rounded-[10px] flex flex-col items-center justify-center gap-4 text-white/20 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all min-h-[200px]">
             <div className="w-12 h-12 rounded-full bg-white/30 dark:bg-white/5 flex items-center justify-center border border-white/5">
                <Plus size={24} />
             </div>
             <span className="font-bold text-sm">Create New Project</span>
          </Link>
        </div>
      ) : (
        /* List View */
        <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[700px]">
                <thead className="bg-black/20 text-white/40 text-[10px] md:text-xs uppercase">
                   <tr>
                      <th className="p-2 md:p-4">Project</th>
                      <th className="p-2 md:p-4">Client</th>
                      <th className="p-2 md:p-4">Category</th>
                      <th className="p-2 md:p-4">Status</th>
                      <th className="p-2 md:p-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody>
                   {filteredProjects.map(p => (
                     <tr key={p.id} className="border-b border-white/5 hover:bg-white/30 dark:bg-white/5 group">
                        <td className="p-2 md:p-4 font-bold text-white max-w-[200px] truncate text-xs md:text-base">{p.title}</td>
                        <td className="p-2 md:p-4 text-white/60 text-[10px] md:text-sm whitespace-nowrap">{p.client}</td>
                        <td className="p-2 md:p-4"><span className="text-[10px] md:text-xs bg-white/10 px-2 py-1 rounded text-white/80 whitespace-nowrap">{p.category}</span></td>
                        <td className="p-2 md:p-4 text-[10px] md:text-sm font-medium text-white">{p.status}</td>
                        <td className="p-2 md:p-4 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => router.push(`/admin/projects/${p.id}`)} className="p-2 hover:bg-white/10 rounded-[6px] text-white/60 hover:text-gold transition-colors">
                                 <Edit size={16} />
                              </button>
                              <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-white/10 rounded-[6px] text-white/60 hover:text-red-400 transition-colors">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      )}
      </div>
    </div>
  );
}
