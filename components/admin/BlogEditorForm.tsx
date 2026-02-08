"use client";

import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface BlogEditorFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function BlogEditorForm({ initialData, isEditing = false }: BlogEditorFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Technology", // default
    status: initialData?.status || "Draft",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    image: initialData?.image || ""
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug // Only auto-gen slug on create
    }));
  };

  return (
    <div className="flex flex-col gap-3 md:gap-6 max-w-5xl mx-auto w-full min-w-0 overflow-hidden">
       {/* Actions Header */}
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Link href="/admin/blog" className="flex items-center gap-1 md:gap-2 text-white/40 hover:text-white transition-colors text-[10px] md:text-sm font-bold">
             <ArrowLeft size={12} className="md:w-4 md:h-4" />
             Back to Blog
          </Link>
          <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
             <button className="flex-1 sm:flex-initial px-3 py-1.5 md:px-4 md:py-2 rounded-[8px] bg-white/30 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 text-black dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all font-bold text-[10px] md:text-sm whitespace-nowrap">
                Save Draft
             </button>
             <button className="flex-1 sm:flex-initial px-3 py-1.5 md:px-6 md:py-2 rounded-[8px] bg-gold text-black font-bold text-[10px] md:text-sm hover:bg-white transition-colors flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap">
                <Save size={12} className="md:w-4 md:h-4" />
                {isEditing ? "Update" : "Publish"}
             </button>
          </div>
       </div>

       <div className="grid lg:grid-cols-3 gap-3 md:gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 flex flex-col gap-3 md:gap-6 min-w-0">
             <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md overflow-hidden">
                <div className="flex flex-col gap-4">
                   <div className="flex flex-col gap-2">
                      <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Post Title</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="Enter article title..." 
                        className="bg-white/5 border border-white/10 rounded-[8px] px-3 md:px-4 py-2 md:py-3 text-white text-sm md:text-lg font-bold outline-none focus:border-gold/50 placeholder:font-normal"
                      />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Slug</label>
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 gap-1 md:gap-2 overflow-x-auto">
                         <span className="text-white/40 text-[10px] md:text-sm whitespace-nowrap">xinteck.com/blog/</span>
                         <input 
                           type="text" 
                           value={formData.slug}
                           onChange={(e) => setFormData({...formData, slug: e.target.value})}
                           className="bg-transparent border-none text-white text-xs md:text-sm outline-none flex-1 font-mono min-w-0"
                        />
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex flex-col gap-1 md:gap-2 min-w-0 overflow-hidden">
                <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase ml-1">Content</label>
                <MarkdownEditor 
                   value={formData.content} 
                   onChange={(val) => setFormData({...formData, content: val})} 
                />
             </div>
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-3 md:gap-6 min-w-0">
             {/* Publishing Options */}
             <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2">Publishing</h3>
                
                <div className="flex flex-col gap-2">
                   <label className="text-[8px] md:text-xs font-bold text-white/60">Status</label>
                   <select 
                     value={formData.status}
                     onChange={(e) => setFormData({...formData, status: e.target.value})}
                     className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50"
                   >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Archived">Archived</option>
                   </select>
                </div>

                <div className="flex flex-col gap-2">
                   <label className="text-[8px] md:text-xs font-bold text-white/60">Category</label>
                   <select 
                     value={formData.category}
                     onChange={(e) => setFormData({...formData, category: e.target.value})}
                     className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50"
                   >
                      <option value="Technology">Technology</option>
                      <option value="Design">Design</option>
                      <option value="Engineering">Engineering</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Sustainability">Sustainability</option>
                   </select>
                </div>
             </div>

             {/* Featured Image */}
             <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2">Featured Image</h3>
                
                <div className="aspect-video bg-white/5 rounded-[8px] border border-dashed border-white/20 flex flex-col items-center justify-center gap-1 md:gap-2 cursor-pointer hover:border-gold/50 hover:bg-white/10 transition-all group">
                   <Upload size={18} className="md:w-6 md:h-6 text-white/40 group-hover:text-gold transition-colors" />
                   <span className="text-[8px] md:text-xs text-white/40 font-medium">Click to upload</span>
                </div>
                <input 
                   type="text" 
                   value={formData.image}
                   onChange={(e) => setFormData({...formData, image: e.target.value})}
                   placeholder="Or enter image URL..." 
                   className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-white text-[10px] md:text-xs outline-none focus:border-gold/50"
                />
             </div>
             
             {/* Excerpt */}
             <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2">Excerpt</h3>
                <textarea 
                   rows={3}
                   value={formData.excerpt}
                   onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                   placeholder="Short summary for SEO and previews..."
                   className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-white text-[10px] md:text-xs outline-none focus:border-gold/50 resize-none"
                />
             </div>
          </div>
       </div>
    </div>
  );
}
