"use client";

import { createProject, updateProject } from "@/actions/project";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { PageContainer, PageHeader, useToast } from "@/components/admin/ui";
import { Select } from "@/components/admin/ui/Select";
import { projectSchema } from "@/lib/validations";
import { Calendar, FileText, Globe, Image as ImageIcon, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface ProjectEditorFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function ProjectEditorForm({ initialData, isEditing = false }: ProjectEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    client: initialData?.client || "",
    category: initialData?.category || "Web Dev",
    status: initialData?.status || "In Review",
    url: initialData?.url || "",
    completionDate: initialData?.completionDate || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    version: initialData?.version
  });

   const handleSave = async () => {
     setError("");
     
     // C2: Client-side validation using shared schema
     // Note: we don't validate version here as it's not in the base schema input, it's optional
     const validation = projectSchema.safeParse(formData);
     if (!validation.success) {
         const firstError = validation.error.issues[0].message;
         setError(firstError);
         return;
     }

     startTransition(async () => {
         try {
             let result;
             if (isEditing && initialData?.id) {
                 result = await updateProject(initialData.id, formData);
             } else {
                 result = await createProject(formData);
             }

             if (result && (result.success || result.id)) {
                 toast(isEditing ? "Project updated successfully" : "Project created successfully", "success");
                 router.push("/admin/projects");
                 router.refresh();
             }
         } catch (e: any) {
             const msg = e.message || "Failed to save project";
             
             if (msg.includes("Concurrency conflict")) {
                 if (confirm("This project has been modified by another user. Reload to get the latest version?")) {
                     window.location.reload();
                     return;
                 }
             }

             setError(msg);
             toast(msg, "error");
         }
     });
   };

  return (
    <PageContainer>
       <MediaPicker 
           isOpen={showMediaPicker} 
           onClose={() => setShowMediaPicker(false)} 
           onSelect={(url) => setFormData({ ...formData, image: url })} 
       />

       {/* Actions Header */}
       <PageHeader
         title={isEditing ? "Edit Project" : "New Project"}
         backUrl="/admin/projects"
         backLabel="Back to Projects"
         actions={
           <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
              <button 
                 onClick={() => { setFormData({...formData, status: "In Review"}); handleSave(); }}
                 disabled={isPending}
                 className="flex-1 sm:flex-initial px-3 py-1.5 md:px-4 md:py-2 rounded-[8px] bg-white/30 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all font-bold text-[10px] md:text-sm whitespace-nowrap disabled:opacity-50"
              >
                 Save Draft
              </button>
              <button 
                 onClick={handleSave}
                 disabled={isPending}
                 className="flex-1 sm:flex-initial px-3 py-1.5 md:px-6 md:py-2 rounded-[8px] bg-gold text-black font-bold text-[10px] md:text-sm hover:bg-white transition-colors flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap disabled:opacity-50"
              >
                 {isPending ? (
                     <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/>
                 ) : (
                     <>
                         <Save size={12} className="md:w-4 md:h-4" />
                         {isEditing ? "Update" : "Publish"}
                     </>
                 )}
              </button>
           </div>
         }
       />

       {error && (
           <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-[8px] text-sm">
               {error}
           </div>
       )}

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
                   <Select 
                     value={formData.status}
                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, status: e.target.value})}
                     options={[
                       { value: "Active", label: "Active (In Progress)" },
                       { value: "Completed", label: "Completed" },
                       { value: "In Review", label: "In Review" },
                       { value: "Archived", label: "Archived" }
                     ]}
                   />
                </div>

                <div className="flex flex-col gap-1 md:gap-2">
                   <label className="text-[8px] md:text-xs font-bold text-white/60">Service Category</label>
                   <Select 
                     value={formData.category}
                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, category: e.target.value})}
                     options={[
                       { value: "Web Dev", label: "Web Development" },
                       { value: "Mobile App", label: "Mobile App" },
                       { value: "UI/UX Design", label: "UI/UX Design" },
                       { value: "Custom Software", label: "Custom Software" },
                       { value: "Consulting", label: "Consulting" }
                     ]}
                   />
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
                
                {formData.image ? (
                    <div className="relative aspect-video bg-black/50 rounded-[8px] overflow-hidden border border-white/10 group">
                        <Image 
                            src={formData.image} 
                            alt="Cover" 
                            fill 
                            className="object-cover" 
                        />
                        <button 
                            onClick={() => setFormData({...formData, image: ""})}
                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                         <button 
                            onClick={() => setShowMediaPicker(true)}
                            className="absolute bottom-2 right-2 bg-black/60 hover:bg-gold text-white hover:text-black px-2 py-1 rounded-[4px] text-xs font-bold opacity-0 group-hover:opacity-100 transition-all"
                        >
                            Change
                        </button>
                    </div>
                ) : (
                    <div 
                        onClick={() => setShowMediaPicker(true)}
                        className="aspect-video bg-white/5 rounded-[8px] border border-dashed border-white/20 flex flex-col items-center justify-center gap-1 md:gap-2 cursor-pointer hover:border-gold/50 hover:bg-white/5 transition-all group"
                    >
                       <Upload size={18} className="md:w-6 md:h-6 text-white/40 group-hover:text-gold transition-colors" />
                       <span className="text-[8px] md:text-xs text-white/40 font-medium">Click to upload</span>
                    </div>
                )}

                <div className="relative">
                    <input 
                       type="text" 
                       value={formData.image}
                       onChange={(e) => setFormData({...formData, image: e.target.value})}
                       placeholder="Or paste URL..." 
                       className="w-full bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-white text-[10px] md:text-xs outline-none focus:border-gold/50 pr-8"
                    />
                     <button
                        onClick={() => setShowMediaPicker(true)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
                        title="Open Media Library"
                     >
                        <ImageIcon size={14} />
                     </button>
                </div>
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
    </PageContainer>
  );
}
