"use client";

import { exportAuditLogsCsv } from "@/actions/audit";
import { RoleGate } from "@/components/admin/RoleGate";
import { Role } from "@prisma/client";
import { format, parseISO } from "date-fns";
import { Calendar, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Calendar as CalendarComponent } from "./ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Select } from "./ui/Select";
import { useToast } from "./ui/Toast";

interface AuditFiltersProps {
  entities: string[];
  currentAction?: string;
  currentEntity?: string;
  currentDateFrom?: string;
  currentDateTo?: string;
}

export function AuditFilters({ entities, currentAction, currentEntity, currentDateFrom, currentDateTo }: AuditFiltersProps) {
  const router = useRouter();
  const { error } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  const buildUrl = (params: Record<string, string | undefined>) => {
    const url = new URLSearchParams();
    const merged = { action: currentAction, entity: currentEntity, dateFrom: currentDateFrom, dateTo: currentDateTo, ...params };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== "all") url.set(k, v);
    });
    return `/admin/audit${url.toString() ? `?${url}` : ""}`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csv = await exportAuditLogsCsv({
        action: currentAction,
        entity: currentEntity,
        dateFrom: currentDateFrom,
        dateTo: currentDateTo,
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      error("Export failed: " + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const actionFilters = [
    { label: "All Events", value: undefined },
    { label: "Inquiries", value: "contact.submission", color: "bg-blue-400" },
    { label: "Logins", value: "login", color: "bg-purple-400" },
    { label: "Creates", value: "create", color: "bg-green-400" },
    { label: "Deletes", value: "delete", color: "bg-red-400" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Action Filters */}
      <div className="flex flex-row items-center gap-1 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-1.5 backdrop-blur-md overflow-x-auto w-full md:w-fit no-scrollbar">
        {actionFilters.map((f, i) => (
          <span key={i}>
            {i > 0 && <span className="hidden" />}
            <a
              href={buildUrl({ action: f.value, page: undefined })}
              className={`px-2.5 py-1 rounded-[6px] text-[10px] md:text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentAction === f.value || (!currentAction && !f.value)
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {f.color && <span className={`w-1.5 h-1.5 rounded-full ${f.color}`} />}
              {f.label}
            </a>
          </span>
        ))}
      </div>

      {/* Entity + Date Filters */}
      <div className="flex flex-row items-center gap-2 flex-wrap">
        {/* Entity Dropdown */}
        <div className="flex items-center gap-1.5 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-1.5 backdrop-blur-md">
          <Select 
            value={currentEntity || "all"}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => router.push(buildUrl({ entity: e.target.value === "all" ? undefined : e.target.value, page: undefined }))}
            options={[
                { value: "all", label: "All Entities" },
                ...entities.map(e => ({ value: e, label: e }))
            ]}
            className="w-auto min-w-[120px] bg-transparent border-none p-0 h-auto min-h-0 text-[10px] md:text-xs font-bold shadow-none focus:ring-0 [&_svg]:w-3 [&_svg]:h-3 gap-1.5"
          />
        </div>

        {/* Date From */}
        <div className="flex items-center gap-1.5 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-1.5 backdrop-blur-md">
          <Calendar size={12} className="text-white/40 ml-1" />
          <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-white text-[10px] md:text-xs font-bold outline-none cursor-pointer bg-transparent min-w-[80px] text-left"
              >
                {currentDateFrom ? format(parseISO(currentDateFrom), "MMM d, yyyy") : "Start Date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-[10px]" align="start">
              <CalendarComponent
                mode="single"
                selected={currentDateFrom ? parseISO(currentDateFrom) : undefined}
                onSelect={(date: Date | undefined) => {
                  router.push(buildUrl({ dateFrom: date ? format(date, "yyyy-MM-dd") : undefined, page: undefined }));
                  setDateFromOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date To */}
        <div className="flex items-center gap-1.5 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-1.5 backdrop-blur-md">
          <Calendar size={12} className="text-white/40 ml-1" />
          <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-white text-[10px] md:text-xs font-bold outline-none cursor-pointer bg-transparent min-w-[80px] text-left"
              >
                {currentDateTo ? format(parseISO(currentDateTo), "MMM d, yyyy") : "End Date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-[10px]" align="start">
              <CalendarComponent
                mode="single"
                selected={currentDateTo ? parseISO(currentDateTo) : undefined}
                onSelect={(date: Date | undefined) => {
                  router.push(buildUrl({ dateTo: date ? format(date, "yyyy-MM-dd") : undefined, page: undefined }));
                  setDateToOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Export Button */}
        <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold text-black font-bold text-[10px] md:text-xs rounded-[8px] hover:bg-white transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Download size={12} />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </RoleGate>
      </div>
    </div>
  );
}
