"use client";

import { AuditLogWithUser } from "@/actions/audit";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Modal } from "@/components/admin/ui/Modal";
import { Pagination } from "@/components/admin/ui/Pagination";
import { format } from "date-fns";
import { Copy, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AuditLogTableProps {
  logs: AuditLogWithUser[];
  currentPage: number;
  totalPages: number;
}

export function AuditLogTable({ logs, currentPage, totalPages }: AuditLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLogWithUser | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Table / Card View */}
      <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] overflow-hidden backdrop-blur-md">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/40 bg-black/20">
          <div className="col-span-3">Actor</div>
          <div className="col-span-2">Action</div>
          <div className="col-span-3">Entity</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Details</div>
        </div>

        {/* Rows */}
        {logs.length === 0 ? (
          <EmptyState
            icon={<Copy size={20} className="opacity-50" />}
            message="No audit logs found matching your criteria."
          />
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="group border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
            >
              {/* Desktop Row */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-xs font-bold border border-white/10">
                    {log.user?.avatar ? (
                      <Image src={log.user.avatar} alt="User" fill className="rounded-full object-cover" />
                    ) : (
                      log.user?.name?.[0] || "?"
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">
                      {log.user?.name || "System"}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono truncate">
                      {log.user?.email || log.ipAddress || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider border ${getActionColor(log.action)}`}>
                    {log.action.split('.')[1] || log.action}
                  </span>
                </div>

                <div className="col-span-3 flex flex-col min-w-0">
                  <span className="text-xs font-mono text-white/80 truncate">{log.entity}</span>
                  <span className="text-[10px] text-white/30 font-mono truncate max-w-[150px]" title={log.entityId || ""}>
                     {log.entityId}
                  </span>
                </div>

                <div className="col-span-2 text-xs font-mono text-white/50">
                  {format(new Date(log.createdAt), "MMM d, HH:mm")}
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-1.5 rounded-[6px] hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Mobile Card */}
              <div className="md:hidden p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold border border-white/10">
                        {log.user?.name?.[0] || "?"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{log.user?.name || "System"}</div>
                        <div className="text-xs text-white/40">{format(new Date(log.createdAt), "MMM d, HH:mm")}</div>
                      </div>
                   </div>
                   <button onClick={() => setSelectedLog(log)} className="p-2 text-white/60 hover:text-white">
                     <Eye size={18} />
                   </button>
                </div>
                <div className="flex flex-wrap gap-2 items-center text-xs">
                    <span className={`px-2 py-0.5 rounded-[4px] font-bold uppercase border ${getActionColor(log.action)}`}>
                        {log.action}
                    </span>
                    <span className="text-white/40">on</span>
                    <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded text-white/60">{log.entity}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/admin/audit" />

      {/* Detail Modal */}
      <Modal
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Log Details"
        subtitle={selectedLog?.id}
      >
        {selectedLog && (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-[10px] border border-white/5">
                <label className="text-[10px] uppercase text-white/40 font-bold block mb-1">Actor</label>
                <div className="text-sm font-mono text-white">{selectedLog.user?.email || "System"}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-[10px] border border-white/5">
                <label className="text-[10px] uppercase text-white/40 font-bold block mb-1">Timestamp</label>
                <div className="text-sm font-mono text-white">{format(new Date(selectedLog.createdAt), "PPpp")}</div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-[10px] border border-white/5">
              <label className="text-[10px] uppercase text-white/40 font-bold block mb-2">Change Metadata</label>
              <div className="bg-black/40 rounded-[8px] p-3 border border-white/5 overflow-x-auto custom-scrollbar">
                <pre className="text-xs font-mono text-green-400">
                    {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="bg-white/5 p-3 rounded-[10px] border border-white/5 flex justify-between items-center">
              <div>
                <label className="text-[10px] uppercase text-white/40 font-bold block mb-1">Entity Reference</label>
                <div className="text-xs font-mono text-white/80">{selectedLog.entity} : {selectedLog.entityId}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function getActionColor(action: string): string {
  if (action.includes("delete")) return "bg-red-500/10 text-red-500 border-red-500/20";
  if (action.includes("create")) return "bg-green-500/10 text-green-500 border-green-500/20";
  if (action.includes("update")) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  if (action.includes("login")) return "bg-purple-500/10 text-purple-500 border-purple-500/20";
  return "bg-white/10 text-foreground/70 border-white/10";
}
