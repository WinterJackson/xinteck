"use client";

import { deleteSubscriber, resubscribeSubscriber, unsubscribeSubscriber } from "@/actions/newsletter";
import { RoleGate } from "@/components/admin/RoleGate";
import { Button, ConfirmDialog, EmptyState, PageContainer, PageHeader, useToast } from "@/components/admin/ui";
import { Role } from "@prisma/client";
import { Mail, Search, Trash2, UserMinus, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { NewsletterSubscriber } from "@/types";

import { Pagination } from "@/components/admin/ui/Pagination";
import { PaginatedResponse } from "@/lib/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface NewsletterClientProps {
  initialData: PaginatedResponse<NewsletterSubscriber>;
  stats: { total: number; active: number; unsubscribed: number };
}

export function NewsletterClient({ initialData, stats }: NewsletterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Sync state with URL params
  const currentSearch = searchParams.get("search") || "";
  const currentFilter = (searchParams.get("filter") as "all" | "active" | "unsubscribed") || "all";
  
  const [search, setSearch] = useState(currentSearch);
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">(currentFilter);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const subscribers = initialData.data;
  const meta = {
      page: initialData.page,
      totalPages: initialData.totalPages,
      total: initialData.total
  };

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
        params.set(name, value);
    } else {
        params.delete(name);
    }
    // Reset page to 1 on filter change
    if (name !== "page") {
        params.set("page", "1");
    }
    return params.toString();
  };

  const handleSearchDebounced = useDebouncedCallback((term: string) => {
     router.push(pathname + "?" + createQueryString("search", term));
  }, 300);

  const handleSearchChange = (val: string) => {
      setSearch(val);
      handleSearchDebounced(val);
  };

  const handleFilterChange = (val: "all" | "active" | "unsubscribed") => {
      setFilter(val);
      router.push(pathname + "?" + createQueryString("filter", val));
  };
  
  const handlePageChange = (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(pathname + "?" + params.toString());
  };

  const handleUnsubscribe = (id: string) => {
    startTransition(async () => {
      await unsubscribeSubscriber(id);
      toast("Subscriber unsubscribed", "success");
      router.refresh();
    });
  };

  const handleResubscribe = (id: string) => {
    startTransition(async () => {
      await resubscribeSubscriber(id);
      toast("Subscriber resubscribed", "success");
      router.refresh();
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteSubscriber(deleteId);
      toast("Subscriber permanently deleted", "success");
      router.refresh();
      setDeleteId(null);
    });
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Newsletter" 
        subtitle="Manage your newsletter subscribers based on activity."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          icon={<Users size={14} />} 
          label="Total" 
          value={stats.total} 
          colorClass="text-blue-400 bg-blue-500/10" 
          valueClass="text-white"
        />
        <StatsCard 
          icon={<Mail size={14} />} 
          label="Active" 
          value={stats.active} 
          colorClass="text-green-400 bg-green-500/10" 
          valueClass="text-green-400"
        />
        <StatsCard 
          icon={<UserMinus size={14} />} 
          label="Unsubscribed" 
          value={stats.unsubscribed} 
          colorClass="text-red-400 bg-red-500/10" 
          valueClass="text-red-400"
        />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="w-full sm:w-auto bg-white/30 dark:bg-black/20 border border-white/20 dark:border-white/10 p-1.5 rounded-[10px] backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={14} />
              <input 
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                className="w-full bg-black/20 dark:bg-white/5 border border-white/5 dark:border-white/10 rounded-[10px] pl-9 pr-4 py-2 text-xs md:text-sm text-white placeholder:text-white/20 dark:placeholder:text-white/30 focus:border-gold/50 focus:outline-none transition-colors"
              />
            </div>
          </div>
        <div className="flex gap-1 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[8px] p-1 w-full sm:w-auto justify-center sm:justify-end backdrop-blur-md">
          {(["all", "active", "unsubscribed"] as const).map(f => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-[6px] capitalize transition-all ${
                filter === f 
                  ? 'bg-gold text-black shadow-sm' 
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] overflow-hidden shadow-sm backdrop-blur-md">
        {subscribers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider hidden md:table-cell">Source</th>
                  <th className="p-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider hidden md:table-cell">Subscribed</th>
                  <th className="p-4 text-right text-xs font-bold text-white/40 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscribers.map(sub => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <span className="text-sm font-medium text-white">{sub.email}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${sub.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {sub.isActive ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/40 hidden md:table-cell">{sub.source}</td>
                    <td className="p-4 text-sm text-white/40 hidden md:table-cell">{sub.subscribedAt}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                          {sub.isActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnsubscribe(sub.id)}
                              loading={isPending}
                              icon={<UserMinus size={14} />}
                              className="text-white hover:text-amber-500"
                              title="Unsubscribe"
                            />
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResubscribe(sub.id)}
                              loading={isPending}
                              icon={<UserPlus size={14} />}
                              className="text-white hover:text-green-500"
                              title="Resubscribe"
                            />
                          )}
                        </RoleGate>
                        <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(sub.id)}
                            loading={isPending}
                            icon={<Trash2 size={14} />}
                            className="text-white hover:text-red-500"
                            title="Delete permanently"
                          />
                        </RoleGate>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-4 border-t border-white/10 flex justify-center">
                <Pagination 
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
          </div>
        ) : (
            <EmptyState
                icon={<Mail size={24} />}
                message={search ? "No subscribers match your search." : "No subscribers found."}
                action={search ? <Button variant="outline" size="sm" onClick={() => handleSearchChange("")}>Clear Search</Button> : undefined}
            />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Subscriber?"
        message="This action cannot be undone. The subscriber will be permanently removed from the database."
        loading={isPending}
      />
    </PageContainer>
  );
}

function StatsCard({ icon, label, value, colorClass, valueClass }: { icon: any, label: string, value: number, colorClass: string, valueClass: string }) {
    return (
        <div className="p-3 md:p-6 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md">
           <div className="flex items-center gap-3 mb-1">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
               {icon}
             </div>
             <span className="text-white/60 text-[10px] md:text-xs font-bold uppercase">{label}</span>
           </div>
           <p className={`text-2xl md:text-4xl font-black ${valueClass}`}>{value}</p>
        </div>
    );
}
