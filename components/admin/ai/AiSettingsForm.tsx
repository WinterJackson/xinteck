"use client";

import { updateAiSettings } from "@/actions/ai";
import { CORE_NICHES, SECONDARY_NICHES } from "@/lib/ai/config";
import { Loader2, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SettingsProps {
    initialSettings: any;
}

export function AiSettingsForm({ initialSettings }: SettingsProps) {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        targetNiches: initialSettings?.targetNiches || [],
        brandVoice: initialSettings?.brandVoice || "Professional, Authoritative, Elite",
        excludedKeywords: initialSettings?.excludedKeywords || [],
    });

    const [newNiche, setNewNiche] = useState("");
    const [newExclusion, setNewExclusion] = useState("");

    const availableNiches = [...CORE_NICHES, ...SECONDARY_NICHES].filter(
        n => !settings.targetNiches.includes(n)
    );

    const handleAddNiche = (niche: string) => {
        if (!settings.targetNiches.includes(niche)) {
            setSettings({ ...settings, targetNiches: [...settings.targetNiches, niche] });
        }
    };

    const handleRemoveNiche = (niche: string) => {
        setSettings({ ...settings, targetNiches: settings.targetNiches.filter((n: string) => n !== niche) });
    };

    const handleAddExclusion = () => {
        if (newExclusion && !settings.excludedKeywords.includes(newExclusion)) {
            setSettings({ ...settings, excludedKeywords: [...settings.excludedKeywords, newExclusion] });
            setNewExclusion("");
        }
    };

    const handleRemoveExclusion = (kw: string) => {
        setSettings({ ...settings, excludedKeywords: settings.excludedKeywords.filter((k: string) => k !== kw) });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateAiSettings(settings);
            toast.success("AI Configuration Saved");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Target Niches */}
            <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[12px] p-6 backdrop-blur-md">
                <h3 className="text-white/60 font-bold text-xs uppercase tracking-widest pl-2 border-l-2 border-gold/50 mb-4">Target Niches</h3>
                <p className="text-white/60 text-sm mb-6 max-w-2xl">
                    Select the engineering domains the AI should focus on. These drive the trend scouting engine.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {settings.targetNiches.map((niche: string) => (
                        <span key={niche} className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full text-xs font-bold flex items-center gap-2">
                            {niche}
                            <button onClick={() => handleRemoveNiche(niche)} className="hover:text-white transition-colors"><X size={12} /></button>
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableNiches.map(niche => (
                        <button 
                            key={niche}
                            onClick={() => handleAddNiche(niche)}
                            className="px-3 py-2 text-left bg-white/5 hover:bg-white/10 rounded-[8px] text-xs md:text-sm text-white/60 hover:text-white transition-colors flex items-center justify-between group border border-transparent hover:border-white/5"
                        >
                            {niche}
                            <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Brand Voice */}
            <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[12px] p-6 backdrop-blur-md">
                <h3 className="text-white/60 font-bold text-xs uppercase tracking-widest pl-2 border-l-2 border-purple-500/50 mb-4">Brand Voice & Tone</h3>
                <p className="text-white/60 text-sm mb-4">
                    Describe how the AI should write. Be specific about the persona (e.g., "Senior Engineer", "CTO").
                </p>
                <textarea 
                    value={settings.brandVoice}
                    onChange={(e) => setSettings({ ...settings, brandVoice: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-[8px] p-4 text-white text-sm outline-none focus:border-gold/50 min-h-[100px] transition-colors placeholder:text-white/20"
                    placeholder="E.g. Professional, authoritative, yet accessible..."
                />
            </div>

            {/* Exclusions */}
            <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[12px] p-6 backdrop-blur-md">
                <h3 className="text-white/60 font-bold text-xs uppercase tracking-widest pl-2 border-l-2 border-red-500/50 mb-4">Excluded Topics/Keywords</h3>
                <p className="text-white/60 text-sm mb-4">
                    Terms the AI is strictly forbidden from using (competitors, cheap words, etc).
                </p>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        value={newExclusion}
                        onChange={(e) => setNewExclusion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddExclusion()}
                        placeholder="Add exclusion..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-[8px] px-4 py-2 text-white text-sm outline-none focus:border-gold/50 transition-colors placeholder:text-white/20"
                    />
                    <button onClick={handleAddExclusion} className="bg-white/10 px-4 rounded-[8px] hover:bg-white/20 text-white transition-colors"><Plus size={16} /></button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {settings.excludedKeywords.map((kw: string) => (
                        <span key={kw} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold flex items-center gap-2">
                            {kw}
                            <button onClick={() => handleRemoveExclusion(kw)} className="hover:text-red-200 transition-colors"><X size={12} /></button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gold text-black font-bold text-sm rounded-[10px] hover:bg-white transition-colors disabled:opacity-50 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Configuration
                </button>
            </div>
        </div>
    );
}
