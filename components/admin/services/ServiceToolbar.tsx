"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function ServiceToolbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const currentSearch = searchParams.get("search") || "";

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) params.set("search", term);
        else params.delete("search");
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="flex flex-row items-center gap-2 justify-between bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-2 backdrop-blur-md mb-6">
            <div className="relative flex-1 min-w-0 max-w-[360px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                <input 
                    type="text" 
                    placeholder="Search services..." 
                    defaultValue={currentSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-black/20 dark:bg-white/5 border border-white/5 dark:border-white/10 rounded-[10px] pl-9 pr-3 py-2 text-sm text-white focus:border-gold/50 outline-none placeholder:text-white/20 dark:placeholder:text-white/30 transition-colors"
                />
            </div>
        </div>
    );
}
