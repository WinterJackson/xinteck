"use client";

import { Button } from "@/components/admin/ui/Button";
import { Check, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AvatarPickerProps {
    currentAvatar?: string;
    onSelect: (url: string) => void;
    seedName: string; // Used for default generation
}

export function AvatarPicker({ currentAvatar, onSelect, seedName }: AvatarPickerProps) {
    const [seeds, setSeeds] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>(currentAvatar || "");
    const [isShuffling, setIsShuffling] = useState(false);

    // Generate random seeds
    const generateSeeds = () => {
        setIsShuffling(true);
        const newSeeds = Array.from({ length: 20 }, () => Math.random().toString(36).substring(7));
        setSeeds(newSeeds);
        setTimeout(() => setIsShuffling(false), 500);
    };

    // Initial load
    useEffect(() => {
        generateSeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update local state if prop changes
    useEffect(() => {
        if (currentAvatar) setSelected(currentAvatar);
    }, [currentAvatar]);

    const handleSelect = (url: string) => {
        setSelected(url);
        onSelect(url);
    };

    const getUrl = (seed: string) => `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">
                    Choose Avatar
                </label>
                <Button 
                    variant="glass" 
                    size="sm" 
                    onClick={(e) => { e.preventDefault(); generateSeeds(); }}
                    disabled={isShuffling}
                    className="text-white/60 hover:text-white"
                >
                    <RefreshCw size={14} className={`mr-2 ${isShuffling ? "animate-spin" : ""}`} />
                    Shuffle
                </Button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
                {seeds.map((seed) => {
                    const url = getUrl(seed);
                    const isSelected = selected === url;
                    
                    return (
                        <button
                            key={seed}
                            onClick={(e) => { e.preventDefault(); handleSelect(url); }}
                            className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all ${isSelected ? "border-primary shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-110 z-10" : "border-white/10 hover:border-white/30 hover:scale-105"}`}
                        >
                            <div className="bg-white/5 w-full h-full">
                                <Image 
                                    src={url} 
                                    alt="Avatar option" 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                            {isSelected && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
                                    <Check size={16} className="text-white drop-shadow-md" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            
            <p className="text-[10px] text-white/30 text-center pt-2">
                Powered by DiceBear Avatars
            </p>
        </div>
    );
}
