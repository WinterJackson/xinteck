"use client";

import { deleteIdea, generateDraft, getIdeas } from "@/actions/ai";
import { DataGrid } from "@/components/admin/DataGrid";
import { AnimatePresence, motion } from "framer-motion";
import { Grid, LayoutList, Loader2, Trash2, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function IdeaQueue() {
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const router = useRouter();

    useEffect(() => {
        loadIdeas();
    }, []);

    const loadIdeas = async () => {
        try {
            const data = await getIdeas();
            setIdeas(data);
        } catch (error) {
            toast.error("Failed to load ideas");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (idea: any) => {
        setGeneratingId(idea.id);
        toast.info("Initializing Writer Agent...");
        
        try {
            const result = await generateDraft(idea.id);
            if (result.success) {
                toast.success("Draft Generated! Redirecting to editor...");
                router.push(`/admin/blog/${result.postId}`);
            }
        } catch (error: any) {
            toast.error(error.message);
            setGeneratingId(null);
        }
    };

    const handleDelete = async (ids: string | string[]) => {
        // Handle single or bulk delete
        const idList = Array.isArray(ids) ? ids : [ids];
        // DataGrid handles confirmation, but for manual button we might need it
        if (!Array.isArray(ids)) {
             if (!confirm("Are you sure you want to discard this idea?")) return;
        }

        try {
            for (const id of idList) {
                await deleteIdea(id);
            }
            setIdeas(prev => prev.filter(i => !idList.includes(i.id)));
            toast.success("Idea(s) discarded");
        } catch (error) {
            toast.error("Failed to delete idea");
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-white/40" /></div>;

    if (ideas.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 border border-dashed border-white/20 dark:border-white/10 rounded-[12px] bg-white/5"
            >
                <Wand2 className="text-white/20 mb-4" size={48} />
                <p className="text-white/40 text-sm font-medium">The editorial queue is empty.</p>
                <p className="text-white/30 text-xs text-center max-w-xs mt-1">Use the "Newsroom" tab to scout trends and populate this queue.</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg md:text-xl font-bold text-white">Editorial Queue ({ideas.length})</h2>
                
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-[8px] p-1 self-start md:self-auto">
                    <button 
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-[6px] transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                        title="Grid View"
                    >
                        <Grid size={16} />
                    </button>
                    <button 
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-[6px] transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                        title="List View"
                    >
                        <LayoutList size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                    <motion.div 
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid gap-4"
                    >
                        {ideas.map((idea, index) => (
                            <motion.div 
                                key={idea.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 p-6 rounded-[12px] flex flex-col md:flex-row gap-6 items-start md:items-center group hover:border-gold/30 transition-all backdrop-blur-md"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                            idea.score > 80 
                                                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                        }`}>
                                            SCORE: {idea.score}
                                        </span>
                                        <span className="text-white/40 text-[10px] uppercase tracking-wider font-bold">
                                            {new Date(idea.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-base md:text-lg font-bold text-white mb-1 truncate">{idea.title}</h3>
                                    <p className="text-white/60 text-xs md:text-sm line-clamp-1">{idea.angle}</p>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                                    <button 
                                        onClick={() => handleGenerate(idea)}
                                        disabled={!!generatingId}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-xs md:text-sm rounded-[10px] hover:bg-gold transition-colors disabled:opacity-50 min-w-[140px] shadow-sm transform active:scale-95"
                                    >
                                        {generatingId === idea.id ? (
                                            <><Loader2 className="animate-spin" size={16} /> Writing...</>
                                        ) : (
                                            <><Wand2 size={16} /> Generate Draft</>
                                        )}
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleDelete(idea.id)}
                                        disabled={!!generatingId}
                                        className="p-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-[10px] transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DataGrid 
                            columns={[
                                { 
                                    key: "title", 
                                    label: "Concept", 
                                    render: (row: any) => (
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white max-w-[300px] truncate">{row.title}</span>
                                            <span className="text-xs text-white/40 max-w-[300px] truncate">{row.angle}</span>
                                        </div>
                                    ) 
                                },
                                { 
                                    key: "score", 
                                    label: "Score", 
                                    render: (row: any) => (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                            row.score > 80 
                                                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                        }`}>
                                            {row.score}
                                        </span>
                                    ) 
                                },
                                {
                                    key: "generate",
                                    label: "Action",
                                    render: (row: any) => (
                                        <button 
                                            onClick={() => handleGenerate(row)}
                                            disabled={!!generatingId}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white hover:bg-gold hover:text-black rounded-[6px] text-xs font-bold transition-all disabled:opacity-50"
                                        >
                                            {generatingId === row.id ? (
                                                <Loader2 className="animate-spin" size={12} />
                                            ) : (
                                                <Wand2 size={12} />
                                            )}
                                            Generate
                                        </button>
                                    )
                                }
                            ]}
                            data={ideas}
                            pagination={{
                                page: 1,
                                totalPages: 1, // Client side mostly
                                onPageChange: () => {},
                                total: ideas.length
                            }}
                            actions={{
                                onDelete: handleDelete
                            }}
                            hideSearch={true}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
