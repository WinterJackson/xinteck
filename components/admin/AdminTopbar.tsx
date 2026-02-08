"use client";

import { useAdminSidebar } from "@/components/admin/AdminSidebarContext";
import { Bell, ChevronLeft, ChevronRight, Search, User } from "lucide-react";

export function AdminTopbar() {
  const { toggleMobileSidebar, isMobileOpen } = useAdminSidebar();

  return (
    <header 
      className="h-16 md:h-20 p-[2px] md:px-8 md:py-0 flex items-center justify-between border border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-xl sticky top-[5px] z-40 rounded-[10px] m-[5px] shadow-lg text-white gap-4"
    >
      <div className="flex items-center gap-4">
          {/* Mobile Toggle Icon */}
          <button 
            onClick={toggleMobileSidebar}
            className="p-2 ml-[5px] rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors md:hidden"
          >
            {isMobileOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>

          {/* Search - Hidden on Mobile to save space */}
          <div className="relative w-64 lg:w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-white/5 border border-white/10 rounded-[10px] pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none transition-colors"
            />
          </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative text-white/60 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black" />
        </button>

        <div className="h-8 w-[1px] bg-white/10" />

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white group-hover:text-gold transition-colors">Admin User</p>
            <p className="text-xs text-white/40">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-[10px] bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-gold/50 transition-colors">
            <User size={20} className="text-white group-hover:text-gold" />
          </div>
        </div>
      </div>
    </header>
  );
}
