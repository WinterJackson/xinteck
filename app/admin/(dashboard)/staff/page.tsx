"use client";

import { DataGrid } from "@/components/admin/DataGrid";
import { STAFF } from "@/lib/admin-data";
import { Check, Shield, UserPlus, X } from "lucide-react";
import { useState } from "react";

export default function StaffPage() {
  const [staffList, setStaffList] = useState(STAFF);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  // Invite Form State
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");

  const handleInvite = () => {
    if (!inviteName || !inviteEmail) return;
    
    const newMember = {
       id: Date.now(),
       name: inviteName,
       email: inviteEmail,
       role: inviteRole,
       status: "Away", // Default status
       lastActive: "Just now",
       avatar: inviteName.charAt(0)
    };

    setStaffList([...staffList, newMember]);
    setIsInviteOpen(false);
    resetForm();
    alert(`${inviteName} has been invited!`);
  };

  const handleUpdateRole = () => {
    if (!selectedStaff) return;
    setStaffList(staffList.map(s => s.id === selectedStaff.id ? { ...s, role: inviteRole } : s));
    setIsEditOpen(false);
    setSelectedStaff(null);
  };

  const handleDelete = (ids: number[]) => {
    if (confirm(`Are you sure you want to remove ${ids.length} team member(s)?`)) {
       setStaffList(staffList.filter(s => !ids.includes(s.id)));
    }
  };

  const openEdit = (member: any) => {
     setSelectedStaff(member);
     setInviteRole(member.role);
     setIsEditOpen(true);
  };

  const resetForm = () => {
     setInviteName("");
     setInviteEmail("");
     setInviteRole("Viewer");
  };

  const columns = [
    {
      key: "name",
      label: "User Profile",
      render: (row: any) => (
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/20 dark:border-white/10">
               {row.name.charAt(0)}
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
                row.status === 'Away' ? 'bg-yellow-400' : 'bg-white/20'
             }`} />
             <span className="text-white/60">{row.status}</span>
          </div>
       )
    },
    { key: "lastActive", label: "Last Active", align: "right" as const }
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg md:text-3xl font-bold text-white tracking-tight">Staff Management</h1>
          <p className="text-white/40 text-[10px] md:text-sm">Manage team access and permissions.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsInviteOpen(true)} className="bg-gold text-black font-bold px-3 py-1.5 md:px-6 md:py-3 text-[10px] md:text-sm rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-white transition-colors shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] whitespace-nowrap">
            <UserPlus size={14} className="md:w-[18px] md:h-[18px]" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
         <div className="p-3 md:p-6 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md">
            <h3 className="text-white/40 text-[10px] md:text-sm font-medium mb-1">Total Members</h3>
            <p className="text-xl md:text-3xl font-black text-white">{staffList.length}</p>
         </div>
         <div className="p-3 md:p-6 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md">
            <h3 className="text-white/40 text-[10px] md:text-sm font-medium mb-1">Active Now</h3>
            <p className="text-xl md:text-3xl font-black text-green-400 flex items-center gap-2">
               {staffList.filter(s => s.status === 'Active').length} <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </p>
         </div>
         <div className="p-3 md:p-6 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md">
            <h3 className="text-white/40 text-[10px] md:text-sm font-medium mb-1">Pending Invites</h3>
            <p className="text-xl md:text-3xl font-black text-gold">1</p>
         </div>
      </div>

      {/* Data Grid */}
      <DataGrid 
         columns={columns}
         data={staffList}
         hideSearch={false}
         actions={{
            onEdit: (id) => openEdit(staffList.find(s => s.id === id)),
            onDelete: (id) => handleDelete(id)
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
               </div>
               <div className="p-6 border-t border-white/20 dark:border-white/10 flex justify-end gap-3">
                  <button onClick={() => setIsInviteOpen(false)} className="px-4 py-2 text-white/60 hover:text-white text-sm font-bold">Cancel</button>
                  <button 
                     onClick={handleInvite}
                     disabled={!inviteName || !inviteEmail}
                     className="bg-gold text-black px-6 py-2 rounded-[8px] text-sm font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Send Invite
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
                     className="bg-white text-black px-6 py-2 rounded-[8px] text-sm font-bold hover:bg-gold transition-colors"
                  >
                     Update Role
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
