"use client";

import { deleteService, toggleServiceStatus } from "@/actions/service";
import { RoleGate } from "@/components/admin/RoleGate";
import { Role } from "@prisma/client";
import { CheckCircle2, Pencil, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

interface ServiceActionsProps {
  serviceId: string;
  isActive: boolean;
}

export function ServiceActions({ serviceId, isActive }: ServiceActionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
        <button
          onClick={() => startTransition(async () => { await toggleServiceStatus(serviceId, !isActive); })}
          disabled={isPending}
          className={`w-10 h-10 rounded-[8px] flex items-center justify-center border transition-all disabled:opacity-50 ${isActive ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-white/5 border-white/10 text-white/20 hover:text-white/60'}`}
          title={isActive ? "Deactivate" : "Activate"}
        >
          {isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        </button>

        <Link
          href={`/admin/services/${serviceId}`}
          className="w-10 h-10 rounded-[8px] bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          title="Edit"
        >
          <Pencil size={18} />
        </Link>

        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete this service?")) {
              startTransition(async () => { await deleteService(serviceId); });
            }
          }}
          disabled={isPending}
          className="w-10 h-10 rounded-[8px] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </RoleGate>
    </div>
  );
}
