"use client";

import { ArrowLeft, Calendar, FileText, Globe, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ProjectEditorFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function ProjectEditorForm({ initialData, isEditing = false }: ProjectEditorFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    client: initialData?.client || "",
    category: initialData?.category || "Web Dev", // default
    status: initialData?.status || "In Review",
    url: initialData?.url || "",
    completionDate: initialData?.completionDate || "",
    description: initialData?.description || "",
    image: initialData?.image || ""
  });

  return (
    <div className="flex flex-col gap-3 md:gap-6 max-w-5xl mx-auto w-full min-w-0 overflow-hidden">
       {/* Actions Header */}
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Link href="/admin/projects" className="flex items-center gap-1 md:gap-2 text-white/40 hover:text-white transition-colors text-[10px] md:text-sm font-bold">
             <ArrowLeft size={12} className="md:w-4 md:h-4" />
             Back to Projects
          </Link>
          <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
             <button className="flex-1 sm:flex-initial px-3 py-1.5 md:px-4 md:py-2 rounded-[8px] bg-white/30 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all font-bold text-[10px] md:text-sm whitespace-nowrap">
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
                <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2 mb-3 md:mb-4">Core Details</h3>
                <div className="flex flex-col gap-3 md:gap-4">
                   <div className="flex flex-col gap-1 md:gap-2">
                      <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Project Title</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Global Fintech Rebrand" 
                        className="bg-white/5 border border-white/10 rounded-[8px] px-3 md:px-4 py-2 md:py-3 text-white text-sm md:text-lg font-bold outline-none focus:border-gold/50 placeholder:font-normal"
                      />
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                      <div className="flex flex-col gap-1 md:gap-2">
                         <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Client Name</label>
                         <input 
                           type="text" 
                           value={formData.client}
                           onChange={(e) => setFormData({...formData, client: e.target.value})}
                           placeholder="Client Name" 
                           className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50"
                         />
                      </div>
                      <div className="flex flex-col gap-1 md:gap-2">
                         <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Live URL</label>
                         <div className="flex items-center bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 gap-1 md:gap-2 overflow-x-auto">
                            <Globe size={12} className="md:w-3.5 md:h-3.5 text-white/40 shrink-0" />
                            <input 
                              type="url" 
                              value={formData.url}
                              onChange={(e) => setFormData({...formData, url: e.target.value})}
                              placeholder="https://..." 
                              className="bg-transparent border-none text-white text-xs md:text-sm outline-none flex-1 min-w-0"
                            />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md">
                 <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2 mb-3 md:mb-4">Case Study Content</h3>
                 <div className="flex flex-col gap-1 md:gap-2">
                    <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Description / Outcome</label>
                    <textarea 
                       rows={8}
                       value={formData.description}
                       onChange={(e) => setFormData({...formData, description: e.target.value})}
                       placeholder="Describe the challenges, solutions, and results..."
                       className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-4 py-2 md:py-3 text-white text-xs md:text-sm outline-none focus:border-gold/50 resize-y font-mono leading-relaxed placeholder:font-sans"
                    />
                 </div>
             </div>
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-3 md:gap-6 min-w-0">
             {/* Publishing Options */}
             <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2">Project Settings</h3>
                
                <div className="flex flex-col gap-1 md:gap-2">
                   <label className="text-[8px] md:text-xs font-bold text-white/60">Status</label>
                   <select 
                     value={formData.status}
                     onChange={(e) => setFormData({...formData, status: e.target.value})}
                     className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50"
                   >
                      <option value="Active">Active (In Progress)</option>
                      <option value="Completed">Completed</option>
                      <option value="In Review">In Review</option>
                      <option value="Archived">Archived</option>
                   </select>
                </div>

                <div className="flex flex-col gap-1 md:gap-2">
                   <label className="text-[8px] md:text-xs font-bold text-white/60">Service Category</label>
                   <select 
                     value={formData.category}
                     onChange={(e) => setFormData({...formData, category: e.target.value})}
                     className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50"
                   >
                      <option value="Web Dev">Web Development</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Custom Software">Custom Software</option>
                      <option value="Consulting">Consulting</option>
                   </select>
                </div>

                <div className="flex flex-col gap-1 md:gap-2">
                   <label className="text-[8px] md:text-xs font-bold text-white/60">Completion Date</label>
                   <div className="flex items-center bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 gap-1 md:gap-2">
                      <Calendar size={12} className="md:w-3.5 md:h-3.5 text-white/40 shrink-0" />
                      <input 
                        type="date"
                        value={formData.completionDate}
                        onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                        className="bg-transparent border-none text-white text-xs md:text-sm outline-none flex-1 [color-scheme:dark] min-w-0" 
                      />
                   </div>
                </div>
             </div>

             {/* Featured Image */}
             <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2">Cover Image</h3>
                
                <div className="aspect-video bg-white/5 rounded-[8px] border border-dashed border-white/20 flex flex-col items-center justify-center gap-1 md:gap-2 cursor-pointer hover:border-gold/50 hover:bg-white/5 transition-all group">
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
             
             {/* Assets */}
             <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2">Project Assets</h3>
                <div className="flex flex-col gap-1 md:gap-2">
                   <button className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold text-gold hover:text-white transition-colors">
                      <FileText size={12} className="md:w-3.5 md:h-3.5" /> Add Case Study PDF
                   </button>
                   <button className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold text-gold hover:text-white transition-colors">
                      <FileText size={12} className="md:w-3.5 md:h-3.5" /> Add Technical Docs
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
