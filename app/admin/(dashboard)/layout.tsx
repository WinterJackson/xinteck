import { AdminBackground } from "@/components/admin/AdminBackground";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSidebarProvider } from "@/components/admin/AdminSidebarContext";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSidebarProvider>
      <div className="min-h-screen flex bg-transparent text-white font-sans selection:bg-gold/30">
        <AdminBackground />
        
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden">
          <AdminTopbar />
          <main className="flex-1 p-2 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
