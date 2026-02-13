"use client";

import { getMediaFiles } from "@/actions/media";
import { Button } from "@/components/admin/ui/Button";
import { Image as ImageIcon, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";

interface MediaPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export function MediaPicker({ isOpen, onClose, onSelect }: MediaPickerProps) {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();

    const loadFiles = () => {
        setLoading(true);
        startTransition(async () => {
            try {
                // Fetch only images, with optional search
                const result = await getMediaFiles({ 
                    type: "image", 
                    search: searchQuery, 
                    pageSize: 20 
                });
                setFiles(result.data);
            } catch (error) {
                console.error("Failed to load media:", error);
            } finally {
                setLoading(false);
            }
        });
    };

    // Trigger load on open or search change (debounced manually or by user action)
    useEffect(() => {
        if (isOpen) {
            loadFiles();
        }
    }, [isOpen]); 


    if (!isOpen) return null;

    // Portal to body to ensure it's on top
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111] border border-white/10 rounded-[16px] w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ImageIcon size={20} className="text-gold" />
                        Select Media
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && loadFiles()}
                            placeholder="Search images... (Press Enter)" 
                            className="w-full bg-white/5 border border-white/10 rounded-[8px] pl-9 pr-4 py-2 text-white text-sm outline-none focus:border-gold/50 placeholder:text-white/20"
                        />
                    </div>
                    <Button variant="outline" onClick={loadFiles} disabled={loading}>
                        Search
                    </Button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 bg-black/20">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-white/40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mr-2" />
                            Loading library...
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-white/40">
                            <ImageIcon size={32} className="mb-2 opacity-50" />
                            <p>No images found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {files.map((file) => (
                                <button
                                    key={file.id}
                                    onClick={() => {
                                        onSelect(file.url);
                                        onClose();
                                    }}
                                    className="group relative aspect-square bg-white/5 rounded-[8px] overflow-hidden border border-white/10 hover:border-gold/50 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50"
                                >
                                    <Image 
                                        src={file.url} 
                                        alt={file.name} 
                                        fill 
                                        className="object-cover transition-transform group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-gold text-black text-xs font-bold px-3 py-1 rounded-[4px]">Select</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-1 text-[10px] text-white truncate px-2">
                                        {file.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                     <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
