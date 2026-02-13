"use client";

import { deleteSiteSetting, upsertSiteSetting } from "@/actions/site-settings";
import { useRole } from "@/components/admin/RoleContext";
import { RoleGate } from "@/components/admin/RoleGate";
import { useToast } from "@/components/admin/ui";
import { Button } from "@/components/admin/ui/Button";
import { Modal } from "@/components/admin/ui/Modal";
import { Select } from "@/components/admin/ui/Select";
import { Role } from "@prisma/client";
import { Globe, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface SiteSetting {
    id: string;
    key: string;
    value: string;
    type: string;
    category: string;
    isPublic: boolean;
    description: string | null;
}

interface SiteSettingsTabProps {
    initialSettings: SiteSetting[];
    categories: string[];
}

export function SiteSettingsTab({ initialSettings, categories }: SiteSettingsTabProps) {
    const router = useRouter();
    const { userRole } = useRole();
    const { success, error } = useToast();
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState<SiteSetting[]>(initialSettings);
    const [filterCategory, setFilterCategory] = useState("all");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");
    const [newCategory, setNewCategory] = useState("general");
    const [newIsPublic, setNewIsPublic] = useState(false);
    const [newDescription, setNewDescription] = useState("");

    // Editing state
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const filtered = filterCategory === "all" ? settings : settings.filter(s => s.category === filterCategory);

    const handleAdd = () => {
        if (!newKey || !newValue) return;
        startTransition(async () => {
            try {
                await upsertSiteSetting({
                    key: newKey,
                    value: newValue,
                    category: newCategory,
                    isPublic: newIsPublic,
                    description: newDescription || undefined,
                });
                setIsAddOpen(false);
                setNewKey(""); setNewValue(""); setNewCategory("general"); setNewIsPublic(false); setNewDescription("");
                router.refresh();
            } catch (e: any) {
                error("Failed: " + e.message);
            }
        });
    };

    const handleSave = (key: string) => {
        startTransition(async () => {
            try {
                await upsertSiteSetting({ key, value: editValue });
                setEditingKey(null);
                router.refresh();
                success("Setting updated successfully");
            } catch (e: any) {
                error("Failed: " + e.message);
            }
        });
    };

    const handleDelete = (key: string) => {
        if (!confirm(`Delete setting "${key}"?`)) return;
        startTransition(async () => {
            try {
                await deleteSiteSetting(key);
                setSettings(prev => prev.filter(s => s.key !== key));
                router.refresh();
                success("Setting deleted successfully");
            } catch (e: any) {
                error("Failed: " + e.message);
            }
        });
    };

    const uniqueCategories = ["all", ...new Set(categories)];

    return (
        <div className="flex flex-col gap-3 md:gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Globe size={14} className="md:w-4 md:h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-xs md:text-sm">Site Settings</h3>
                        <p className="text-[8px] md:text-xs text-white/40">Key-value configuration for your site.</p>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    {/* Category Filter */}
                    <Select 
                        value={filterCategory}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value)}
                        options={uniqueCategories.map(c => ({
                            value: c,
                            label: c === "all" ? "All Categories" : c
                        }))}
                        className="w-auto min-w-[140px]"
                    />

                    <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
                        <Button
                            variant="primary"
                            size="sm"
                            icon={<Plus size={12} />}
                            onClick={() => setIsAddOpen(true)}
                        >
                            Add Setting
                        </Button>
                    </RoleGate>
                </div>
            </div>

            {/* Settings List */}
            <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] overflow-hidden backdrop-blur-md">
                {filtered.length === 0 ? (
                    <div className="p-8 text-center text-white/40 italic text-xs">
                        No site settings found. Add one to get started.
                    </div>
                ) : (
                    filtered.map((setting) => (
                        <div key={setting.id} className="border-b border-white/5 last:border-0 p-3 md:p-4 hover:bg-white/5 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold font-mono text-white">{setting.key}</span>
                                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/10">{setting.category}</span>
                                        {setting.isPublic && (
                                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">public</span>
                                        )}
                                    </div>
                                    {setting.description && (
                                        <p className="text-[10px] text-white/30 truncate">{setting.description}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {editingKey === setting.key ? (
                                        <>
                                            <input
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-[6px] px-2 py-1 text-white text-xs outline-none focus:border-gold/50 w-40 md:w-60"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleSave(setting.key)}
                                                disabled={isPending}
                                                className="p-1.5 rounded-[6px] bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <Save size={12} />
                                            </button>
                                            <button
                                                onClick={() => setEditingKey(null)}
                                                className="p-1.5 rounded-[6px] bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {userRole === Role.SUPER_ADMIN ? (
                                                <span
                                                    onClick={() => { setEditingKey(setting.key); setEditValue(setting.value); }}
                                                    className="text-xs font-mono text-white/60 bg-white/5 px-2 py-1 rounded-[6px] cursor-pointer hover:bg-white/10 transition-colors max-w-[200px] truncate"
                                                    title="Click to edit"
                                                >
                                                    {setting.value}
                                                </span>
                                            ) : (
                                                <span
                                                    className="text-xs font-mono text-white/60 bg-white/5 px-2 py-1 rounded-[6px] max-w-[200px] truncate cursor-default"
                                                    title={setting.value}
                                                >
                                                    {setting.value}
                                                </span>
                                            )}
                                            <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
                                                <button
                                                    onClick={() => handleDelete(setting.key)}
                                                    disabled={isPending}
                                                    className="p-1.5 rounded-[6px] text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </RoleGate>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="New Site Setting"
                footer={
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" onClick={handleAdd} disabled={!newKey || !newValue} loading={isPending}>Create</Button>
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-bold text-white/60 uppercase mb-1 block">Key</label>
                        <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="SITE_NAME" className="w-full bg-white/5 border border-white/10 rounded-[8px] px-4 py-3 text-white text-sm outline-none focus:border-gold/50 font-mono" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-white/60 uppercase mb-1 block">Value</label>
                        <textarea value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Xinteck" rows={3} className="w-full bg-white/5 border border-white/10 rounded-[8px] px-4 py-3 text-white text-sm outline-none focus:border-gold/50 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase mb-1 block">Category</label>
                            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-[8px] px-4 py-3 text-white text-sm outline-none focus:border-gold/50" />
                        </div>
                        <div className="flex flex-col gap-2 justify-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={newIsPublic} onChange={(e) => setNewIsPublic(e.target.checked)} className="w-4 h-4 rounded border-white/20 accent-gold" />
                                <span className="text-xs text-white/60 font-bold">Public</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-white/60 uppercase mb-1 block">Description (optional)</label>
                        <input value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Brief description..." className="w-full bg-white/5 border border-white/10 rounded-[8px] px-4 py-3 text-white text-sm outline-none focus:border-gold/50" />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
