"use client";

import { FILES } from "@/lib/admin-data";
import { CloudUpload, FileText, Folder, Grid, Image as ImageIcon, LayoutList, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function FileManagerPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFolder, setActiveFolder] = useState("All Files");
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState(FILES);

  const folders = ["All Files", "Images", "Documents", "Project Assets", "Archives"];

  // Filter Logic
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFolder = true;
      if (activeFolder === "Images") matchesFolder = file.type === "image";
      else if (activeFolder === "Documents") matchesFolder = file.type === "document";
      else if (activeFolder === "Project Assets") matchesFolder = true; // Simulating mixed content
      else if (activeFolder === "Archives") matchesFolder = false; // Empty state simulation
      
      return matchesSearch && matchesFolder;
    });
  }, [files, searchQuery, activeFolder]);

  const handleDelete = (id: number) => {
    if (confirm("Permanently delete this file?")) {
      setFiles(files.filter(f => f.id !== id));
    }
  };

  const handleUpload = () => {
    // Simulated Upload
    const newFile = {
      id: Date.now(),
      name: `upload-${Math.floor(Math.random() * 1000)}.jpg`,
      size: "2.4 MB",
      type: "image",
      date: "Just now",
      url: ""
    };
    setFiles([newFile, ...files]);
    alert("File uploaded successfully!");
  };

  // Calculate simulated storage
  const storageUsed = useMemo(() => {
     // Mock calculation: 6.5GB base + 0.1GB per file
     return (6.5 + (files.length * 0.05)).toFixed(1);
  }, [files]);

  return (
    <div className="flex flex-col gap-4 md:gap-6 h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg md:text-3xl font-bold text-white tracking-tight">File Manager</h1>
          <p className="text-white/40 text-[10px] md:text-sm">Centralized media library.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] text-white hover:text-gold hover:border-gold/30 transition-colors flex items-center gap-2 text-[10px] md:text-sm font-bold">
            <Folder size={14} />
            New Folder
          </button>
          <button onClick={handleUpload} className="bg-gold text-black font-bold px-4 py-1.5 md:px-6 md:py-2 text-[10px] md:text-sm rounded-[10px] flex items-center gap-2 hover:bg-white transition-colors">
            <CloudUpload size={14} />
            Upload
          </button>
        </div>
      </div>

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
                 <p className="text-xs text-white/40 mb-2">Storage Used</p>
                 <div className="w-full h-1.5 bg-white/10 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${(parseFloat(storageUsed) / 10) * 100}%` }} />
                 </div>
                 <p className="text-xs font-bold text-white">{storageUsed} GB <span className="text-white/40 font-normal">/ 10 GB</span></p>
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
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/30 dark:bg-white/5 border border-white/5 rounded-[6px] pl-7 md:pl-9 pr-2 md:pr-3 py-1 md:py-1.5 text-xs md:text-sm text-white focus:border-gold/50 outline-none"
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
                 {filteredFiles.map((file) => (
                   <div key={file.id} className="group cursor-pointer animate-in fade-in zoom-in duration-300">
                      <div className="aspect-square bg-white/30 dark:bg-white/5 border border-white/5 rounded-[10px] flex items-center justify-center relative overflow-hidden group-hover:border-gold/50 transition-colors mb-2">
                         {file.type === 'image' ? (
                            <ImageIcon size={32} className="text-white/20 group-hover:text-gold transition-colors" />
                         ) : (
                            <FileText size={32} className="text-white/20 group-hover:text-blue-400 transition-colors" />
                         )}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} className="text-white hover:text-red-400 p-2"><Trash2 size={18} /></button>
                         </div>
                      </div>
                      <p className="text-xs md:text-sm text-white truncate px-1" title={file.name}>{file.name}</p>
                      <p className="text-xs text-white/30 px-1">{file.size}</p>
                   </div>
                 ))}
                 {filteredFiles.length === 0 && (
                    <div className="col-span-full h-40 flex items-center justify-center text-white/40 text-sm">
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
                      {filteredFiles.map(file => (
                        <tr key={file.id} className="border-b border-white/5 hover:bg-white/30 dark:bg-white/5 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                           <td className="p-2 md:p-3 font-medium text-white flex items-center gap-2 whitespace-nowrap">
                              {file.type === 'image' ? <ImageIcon size={14} className="text-gold" /> : <FileText size={14} className="text-blue-400" />}
                              {file.name}
                           </td>
                           <td className="p-2 md:p-3 text-white/50 whitespace-nowrap">{file.size}</td>
                           <td className="p-2 md:p-3 text-white/50 capitalize whitespace-nowrap">{file.type}</td>
                           <td className="p-2 md:p-3 text-white/50 text-right whitespace-nowrap">{file.date}</td>
                           <td className="p-2 md:p-3 text-right">
                              <button onClick={() => handleDelete(file.id)} className="text-white/20 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                           </td>
                        </tr>
                      ))}
                      {filteredFiles.length === 0 && (
                          <tr><td colSpan={5} className="p-8 text-center text-white/40">No files found.</td></tr>
                      )}
                    </tbody>
                 </table>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
