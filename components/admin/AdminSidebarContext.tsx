"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AdminSidebarContextType {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Default hidden on mobile
  const [isCollapsed, setIsCollapsed] = useState(true); // Default collapsed for SSR safety (no flash)

  // Responsive handling - only expand on desktop after mount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // Always collapsed style on mobile
        // Keep isMobileOpen as user-controlled, don't auto-open
      } else {
        setIsCollapsed(false); // Expand on desktop
        setIsMobileOpen(true); // Always "visible" on desktop
      }
    };
    handleResize(); // Init - will expand on desktop, stay collapsed on mobile
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <AdminSidebarContext.Provider
      value={{
        isMobileOpen,
        toggleMobileSidebar,
        isCollapsed,
        toggleCollapse,
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (context === undefined) {
    throw new Error("useAdminSidebar must be used within an AdminSidebarProvider");
  }
  return context;
}
