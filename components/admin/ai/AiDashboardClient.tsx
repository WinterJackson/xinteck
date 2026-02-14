"use client";

import { AiSettingsForm } from "@/components/admin/ai/AiSettingsForm";
import { IdeaQueue } from "@/components/admin/ai/IdeaQueue";
import { TrendScout } from "@/components/admin/ai/TrendScout";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { Newspaper, Settings, Sparkles } from "lucide-react";
import { useState } from "react";

interface AiDashboardProps {
    initialSettings: any;
}

export function AiDashboardClient({ initialSettings }: AiDashboardProps) {
    const [activeTab, setActiveTab] = useState<"newsroom" | "queue" | "settings">("newsroom");

    return (
        <PageContainer>
            <PageHeader 
                title="AI Editorial Assistant" 
                subtitle="Automated trend discovery and drafting engine powered by Gemini 1.5 Flash."
                actions={
                    <div className="bg-white/30 dark:bg-white/5 p-1 rounded-[8px] flex gap-1 backdrop-blur-md border border-white/20 dark:border-white/10">
                        <button
                            onClick={() => setActiveTab("newsroom")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all",
                                activeTab === "newsroom" 
                                    ? "bg-white/20 text-white shadow-sm" 
                                    : "text-white/40 hover:text-white"
                            )}
                        >
                            <Sparkles size={14} />
                            Newsroom
                        </button>
                        <button
                            onClick={() => setActiveTab("queue")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all",
                                activeTab === "queue" 
                                    ? "bg-white/20 text-white shadow-sm" 
                                    : "text-white/40 hover:text-white"
                            )}
                        >
                            <Newspaper size={14} />
                            Queue
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all",
                                activeTab === "settings" 
                                    ? "bg-white/20 text-white shadow-sm" 
                                    : "text-white/40 hover:text-white"
                            )}
                        >
                            <Settings size={14} />
                            Config
                        </button>
                    </div>
                }
            />

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === "newsroom" && <TrendScout />}
                {activeTab === "queue" && <IdeaQueue />}
                {activeTab === "settings" && <AiSettingsForm initialSettings={initialSettings} />}
            </div>
        </PageContainer>
    );
}
