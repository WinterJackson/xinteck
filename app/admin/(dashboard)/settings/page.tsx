"use client";

import { Copy, Eye, EyeOff, RefreshCw, Save, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // SEO State
  const [seoTitle, setSeoTitle] = useState("Xinteck | Premium Digital Agency");
  
  // API Key State
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState("sk_live_51M..." + Math.random().toString(36).substring(7));

  const tabs = [
    { id: "general", label: "General" },
    { id: "seo", label: "SEO & Meta" },
    { id: "api", label: "API Keys" },
  ];

  const handleSave = () => {
     setIsSaving(true);
     setTimeout(() => {
        setIsSaving(false);
        // Toast simulation
        const toast = document.createElement("div");
        toast.className = "fixed bottom-8 right-8 bg-white text-black px-6 py-3 rounded-[10px] font-bold shadow-2xl animate-in slide-in-from-bottom-10 fade-in z-50 flex items-center gap-2";
        toast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg> Settings Saved Successfully`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
     }, 800);
  };

  const regenerateKey = () => {
     if (confirm("Are you sure? This will invalidate the old key immediately.")) {
        setApiKey("sk_live_" + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2));
     }
  };

  const copyKey = () => {
     navigator.clipboard.writeText(apiKey);
     alert("API Key copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">Site Settings</h1>
        <p className="text-white/40 text-[10px] md:text-sm">Configure global application parameters.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 md:gap-2 border-b border-white/20 dark:border-white/10 overflow-x-auto">
         {tabs.map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`px-2 md:px-4 py-1.5 md:py-2 text-[10px] md:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? "border-gold text-white" : "border-transparent text-white/40 hover:text-white"
               }`}
            >
               {tab.label}
            </button>
         ))}
      </div>

      {/* Form Content */}
      <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-8 backdrop-blur-md relative overflow-hidden">
         
         {/* General Tab */}
         {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  <div className="flex flex-col gap-1 md:gap-2">
                     <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Site Name</label>
                     <input type="text" defaultValue="Xinteck" className="bg-black/20 border border-white/20 dark:border-white/10 rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50" />
                  </div>
                  <div className="flex flex-col gap-1 md:gap-2">
                     <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Support Email</label>
                     <input type="email" defaultValue="support@xinteck.com" className="bg-black/20 border border-white/20 dark:border-white/10 rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50" />
                  </div>
               </div>
               
               <div className="flex flex-col gap-1 md:gap-2">
                  <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Maintenance Mode</label>
                  <div 
                     onClick={() => setMaintenanceMode(!maintenanceMode)}
                     className={`flex items-center gap-3 md:gap-4 border rounded-[8px] p-3 md:p-4 cursor-pointer transition-all ${maintenanceMode ? "bg-gold/10 border-gold/40" : "bg-black/20 border-white/20 dark:border-white/10"}`}
                  >
                     <div className="flex-1">
                        <p className={`text-xs md:text-sm font-bold ${maintenanceMode ? "text-gold" : "text-white"}`}>
                           {maintenanceMode ? "Maintenance Mode Active" : "Maintenance Mode Disabled"}
                        </p>
                        <p className="text-[10px] md:text-xs text-white/40">
                           {maintenanceMode ? "The site is currently hidden from public visitors." : "The site is fully accessible to the public."}
                        </p>
                     </div>
                     <div className={`relative w-11 h-6 rounded-full transition-colors ${maintenanceMode ? "bg-gold" : "bg-white/10"}`}>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${maintenanceMode ? "translate-x-5" : "translate-x-0"}`} />
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* SEO Tab */}
         {activeTab === "seo" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                     <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Global Meta Title</label>
                     <span className={`text-[10px] md:text-xs font-bold ${seoTitle.length > 60 ? "text-red-400" : "text-green-400"}`}>{seoTitle.length}/60</span>
                  </div>
                  <input 
                     type="text" 
                     value={seoTitle}
                     onChange={(e) => setSeoTitle(e.target.value)}
                     className="bg-black/20 border border-white/20 dark:border-white/10 rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50" 
                  />
               </div>
               <div className="flex flex-col gap-1 md:gap-2">
                  <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Meta Description</label>
                  <textarea rows={3} defaultValue="Xinteck is a leading digital agency specializing in high-performance web development and branding." className="bg-black/20 border border-white/20 dark:border-white/10 rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50 resize-none" />
               </div>
            </div>
         )}
         
         {/* API Tab */}
         {activeTab === "api" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-[8px] flex gap-3 items-start">
                  <ShieldAlert className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                  <div>
                     <p className="text-sm font-bold text-yellow-500">Security Warning</p>
                     <p className="text-xs text-white/60 mt-1">These keys grant full access to your account. Never share them publicly.</p>
                  </div>
               </div>

               <div className="flex flex-col gap-1 md:gap-2">
                  <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Secret Key</label>
                  <div className="flex gap-1 md:gap-2">
                     <div className="flex-1 bg-black/20 border border-white/20 dark:border-white/10 rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-white text-[10px] md:text-sm outline-none font-mono flex items-center justify-between overflow-hidden">
                        <span className="truncate">{showKey ? apiKey : "••••••••••••••••••••••••"}</span>
                        <button onClick={() => setShowKey(!showKey)} className="text-white/40 hover:text-white transition-colors shrink-0 ml-2">
                           {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                     </div>
                     <button onClick={copyKey} className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white hover:text-black hover:border-white transition-all text-white rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 shrink-0"><Copy size={14} className="md:w-[18px] md:h-[18px]" /></button>
                  </div>
               </div>

               <div>
                  <button onClick={regenerateKey} className="text-[10px] md:text-xs font-bold text-white/40 hover:text-red-400 flex items-center gap-1 md:gap-2 transition-colors">
                     <RefreshCw size={10} className="md:w-3 md:h-3" /> Regenerate Key
                  </button>
               </div>
            </div>
         )}
         
         {/* Global Save Button */}
         <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/20 dark:border-white/10 flex justify-end">
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="bg-gold text-black font-bold px-4 py-2 md:px-8 md:py-3 rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-white transition-colors disabled:opacity-50 text-[10px] md:text-sm"
             >
                {isSaving ? (
                   <>Saving...</>
                ) : (
                   <><Save size={14} className="md:w-[18px] md:h-[18px]" /> Save Changes</>
                )}
             </button>
         </div>
      </div>
    </div>
  );
}
