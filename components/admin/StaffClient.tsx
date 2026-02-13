"use client";

import { deleteUser, deleteUsers, inviteUser, reactivateUser, suspendUser, updateUserRole } from "@/actions/user";
import { DataGrid } from "@/components/admin/DataGrid";
import { RoleGate } from "@/components/admin/RoleGate";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { Role } from "@prisma/client";
import { Ban, Check, RefreshCw, Shield, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "./ui/Toast";

interface StaffClientProps {
  initialStaff: any[];
}

export function StaffClient({ initialStaff }: StaffClientProps) {
  const router = useRouter();
  const { error } = useToast();
  const [isPending, startTransition] = useTransition();
  const [staffList, setStaffList] = useState(initialStaff);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  // Invite Form State
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");

  const handleInvite = () => {
    if (!inviteName || !inviteEmail) return;
    
    startTransition(async () => {
        try {
            await inviteUser({ name: inviteName, email: inviteEmail, role: inviteRole });
            
            setIsInviteOpen(false);
            resetForm();
            router.refresh();
        } catch (e: any) {
            error("Failed to invite user: " + e.message);
        }
    });
  };

  const handleUpdateRole = () => {
    if (!selectedStaff) return;
    
    startTransition(async () => {
        try {
            await updateUserRole(selectedStaff.id, inviteRole);
            
            setIsEditOpen(false);
            setSelectedStaff(null);
            router.refresh();
        } catch (e: any) {
            error("Failed to update role: " + e.message);
        }
    });
  };

  const handleDelete = (ids: string | string[]) => {
       startTransition(async () => {
           try {
               if (Array.isArray(ids)) {
                   await deleteUsers(ids);
               } else {
                   await deleteUser(ids);
               }
               router.refresh();
           } catch (e: any) {
               alert("Failed to delete user: " + e.message);
           }
       });
  };

  const openEdit = (member: any) => {
     setSelectedStaff(member);
     setInviteRole(member.role); // Pre-select current role
     setIsEditOpen(true);
  };

  const resetForm = () => {
     setInviteName("");
     setInviteEmail("");
     setInviteRole("Viewer");
  };

  const handleSuspend = (id: string) => {
    if (confirm("Suspend this user? They will be logged out immediately.")) {
      startTransition(async () => {
        try {
          await suspendUser(id);
          router.refresh();
        } catch (e: any) {
          error("Failed to suspend: " + e.message);
        }
      });
    }
  };

  const handleReactivate = (id: string) => {
    startTransition(async () => {
      try {
        await reactivateUser(id);
        router.refresh();
      } catch (e: any) {
        error("Failed to reactivate: " + e.message);
      }
    });
  };

  const columns = [
    {
      key: "name",
      label: "User Profile",
      render: (row: any) => (
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/20 dark:border-white/10 overflow-hidden relative">
               {row.avatar?.startsWith('http') ? (
                  <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
               ) : (
                  <span>{row.avatar}</span>
               )}
            </div>
            <div>
               <p className="font-bold text-white">{row.name}</p>
               <p className="text-xs text-white/40">{row.email}</p>
            </div>
         </div>
      )
    },
    {
      key: "role",
      label: "Role",
      render: (row: any) => (
         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs font-medium border ${
            row.role === 'Super Admin' ? 'bg-gold/10 text-gold border-gold/20' : 
            row.role === 'Editor' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
            'bg-white/30 dark:bg-white/5 text-white/60 border-white/20 dark:border-white/10'
         }`}>
            <Shield size={12} />
            {row.role}
         </span>
      )
    },
    {
       key: "status",
       label: "Status",
       render: (row: any) => (
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${
                row.status === 'Active' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' :
                row.status === 'Away' ? 'bg-yellow-400' : 
                row.status === 'Suspended' ? 'bg-red-400' : 'bg-white/20'
             }`} />
             <span className="text-white/60">{row.status}</span>
          </div>
       )
    },
    { key: "lastActive", label: "Last Active", align: "right" as const },
    {
      key: "actions",
      label: "",
      align: "right" as const,
      render: (row: any) => (
        <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
          {row.role !== 'Super Admin' && (
            row.status === 'Suspended' ? (
              <button
                onClick={() => handleReactivate(row.id)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} /> Reactivate
              </button>
            ) : row.status === 'Active' ? (
              <button
                onClick={() => handleSuspend(row.id)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                <Ban size={12} /> Suspend
              </button>
            ) : null
          )}
        </RoleGate>
      )
    }
  ];

  return (
    <PageContainer>
      {/* Actions Header */}
      <PageHeader 
        title="Staff Management" 
        subtitle="Manage team access and permissions."
        actions={
          <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
            <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setIsInviteOpen(true)} 
                className="flex-1 sm:flex-initial px-3 py-1.5 md:px-6 md:py-2 rounded-[8px] bg-gold text-black font-bold text-[10px] md:text-sm hover:bg-white transition-colors flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]"
              >
                <UserPlus size={14} className="md:w-[16px] md:h-[16px]" />
                Invite Member
              </button>
            </div>
          </RoleGate>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
         <div className="p-3 md:p-6 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md">
            <h3 className="text-white/60 text-[10px] md:text-xs font-bold uppercase mb-1">Total Members</h3>
            <p className="text-2xl md:text-4xl font-black text-white">{initialStaff.length}</p>
         </div>
         <div className="p-3 md:p-6 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md">
            <h3 className="text-white/60 text-[10px] md:text-xs font-bold uppercase mb-1">Active Now</h3>
            <p className="text-2xl md:text-4xl font-black text-green-400 flex items-center gap-2">
               {initialStaff.filter(s => s.status === 'Active').length} <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            </p>
         </div>
         <div className="p-3 md:p-6 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md">
            <h3 className="text-white/60 text-[10px] md:text-xs font-bold uppercase mb-1">Suspended</h3>
            <p className="text-2xl md:text-4xl font-black text-red-400">
                {initialStaff.filter(s => s.status === 'Suspended').length}
            </p>
         </div>
      </div>

      {/* Data Grid */}
      <DataGrid 
         columns={columns}
         data={initialStaff}
         hideSearch={false}
         actions={{
            onEdit: (id) => openEdit(initialStaff.find(s => s.id === id)),
            onDelete: (id: any) => handleDelete(id)
         }}
      />

      {/* Invite Modal */}
      {isInviteOpen && (
         <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/20 dark:border-white/10 w-full max-w-md rounded-[16px] shadow-2xl animate-in fade-in zoom-in duration-300">
               <div className="flex justify-between items-center p-6 border-b border-white/20 dark:border-white/10">
                  <h3 className="text-xl font-bold text-white">Invite Team Member</h3>
                  <button onClick={() => setIsInviteOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
               </div>
               <div className="p-6 flex flex-col gap-4">
                  <div>
                     <label className="text-xs font-bold text-white/60 uppercase mb-1 block">Full Name</label>
                     <input 
                        type="text" 
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[8px] p-3 text-white outline-none focus:border-gold"
                     />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-white/60 uppercase mb-1 block">Email Address</label>
                     <input 
                        type="email" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="e.g. john@xinteck.com"
                        className="w-full bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[8px] p-3 text-white outline-none focus:border-gold"
                     />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-white/60 uppercase mb-1 block">Role</label>
                     <div className="grid grid-cols-3 gap-2">
                        {["Super Admin", "Editor", "Viewer"].map(role => (
                           <button 
                              key={role}
                              onClick={() => setInviteRole(role)}
                              className={`p-2 rounded-[8px] text-xs font-bold border transition-all ${
                                 inviteRole === role ? "bg-gold text-black border-gold" : "bg-white/30 dark:bg-white/5 text-white/60 border-white/20 dark:border-white/10 hover:border-white/30"
                              }`}
                           >
                              {role}
                           </button>
                        ))}
                     </div>
                  </div>
                  <p className="text-xs text-white/40">Default password will be <strong>xinteck123</strong></p>
               </div>
               <div className="p-6 border-t border-white/20 dark:border-white/10 flex justify-end gap-3">
                  <button onClick={() => setIsInviteOpen(false)} className="px-4 py-2 text-white/60 hover:text-white text-sm font-bold">Cancel</button>
                  <button 
                     onClick={handleInvite}
                     disabled={!inviteName || !inviteEmail || isPending}
                     className="bg-gold text-black px-6 py-2 rounded-[8px] text-sm font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isPending ? "Sending..." : "Send Invite"}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Edit Role Modal */}
      {isEditOpen && selectedStaff && (
         <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/20 dark:border-white/10 w-full max-w-sm rounded-[16px] shadow-2xl animate-in fade-in zoom-in duration-300">
               <div className="flex justify-between items-center p-6 border-b border-white/20 dark:border-white/10">
                  <h3 className="text-lg font-bold text-white">Edit Role: <span className="text-gold">{selectedStaff.name}</span></h3>
                  <button onClick={() => setIsEditOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
               </div>
               <div className="p-6">
                  <label className="text-xs font-bold text-white/60 uppercase mb-2 block">Select New Role</label>
                  <div className="flex flex-col gap-2">
                     {["Super Admin", "Editor", "Viewer"].map(role => (
                        <button 
                           key={role}
                           onClick={() => setInviteRole(role)}
                           className={`p-3 rounded-[8px] text-sm font-bold border text-left flex justify-between items-center transition-all ${
                              inviteRole === role ? "bg-gold/10 text-gold border-gold" : "bg-white/30 dark:bg-white/5 text-white/60 border-white/20 dark:border-white/10 hover:bg-white/10"
                           }`}
                        >
                           {role}
                           {inviteRole === role && <Check size={16} />}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="p-6 border-t border-white/20 dark:border-white/10 flex justify-end gap-3">
                  <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-white/60 hover:text-white text-sm font-bold">Cancel</button>
                  <button 
                     onClick={handleUpdateRole}
                     disabled={isPending}
                     className="bg-white text-black px-6 py-2 rounded-[8px] text-sm font-bold hover:bg-gold transition-colors disabled:opacity-50"
                  >
                     {isPending ? "Updating..." : "Update Role"}
                  </button>
               </div>
            </div>
         </div>
      )}
    </PageContainer>
  );
}
