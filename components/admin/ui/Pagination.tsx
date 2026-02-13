import Link from "next/link";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl?: string;
    onPageChange?: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, baseUrl, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    // Show at most 7 page buttons around current
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    return (
        <div className="flex justify-center gap-1.5">
            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-white/30 text-xs">…</span>
                ) : baseUrl ? (
                    <Link
                        key={p}
                        href={`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${p}`}
                        className={`w-8 h-8 flex items-center justify-center rounded-[8px] text-xs font-bold border transition-all ${
                            currentPage === p
                                ? "bg-gold text-black border-gold"
                                : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        {p}
                    </Link>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange?.(p as number)}
                        className={`w-8 h-8 flex items-center justify-center rounded-[8px] text-xs font-bold border transition-all ${
                            currentPage === p
                                ? "bg-gold text-black border-gold"
                                : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}
        </div>
    );
}
