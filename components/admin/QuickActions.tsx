"use client";

import { QUICK_ACTIONS } from "@/lib/admin-data";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
      {QUICK_ACTIONS.map((action, index) => {
        const Icon = action.icon;
        return (
          <Link href={action.href} key={action.label} className="block h-full">
            <div
              className="group flex flex-col items-center justify-center gap-2 md:gap-3 p-2 md:p-4 rounded-[10px] bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-gold/10 hover:border-gold/30 transition-all text-center h-full"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-gold group-hover:text-black text-gold transition-colors">
                <Icon size={16} className="md:w-6 md:h-6" />
              </div>
              <div>
                <span className="block text-xs md:text-sm font-bold text-white mb-0.5">{action.label}</span>
                <span className="block text-[10px] md:text-xs text-white/40 leading-tight">{action.desc}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
