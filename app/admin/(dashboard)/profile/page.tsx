"use client";

import { updateProfile } from "@/actions/auth";
import { AvatarPicker } from "@/components/admin/AvatarPicker";
import { useRole } from "@/components/admin/RoleContext";
import { Button } from "@/components/admin/ui";
import { Save, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { userName, userId, setUserAvatar, setUserName } = useRole();

    // Profile form state
    const [profileData, setProfileData] = useState<{ name: string, email: string, avatar?: string }>({ name: "", email: "" });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMsg, setProfileMsg] = useState("");

    // Fetch current user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (data.user) {
                    setProfileData({ 
                        name: data.user.name || "", 
                        email: data.user.email || "",
                        avatar: data.user.avatar || ""
                    });
                }
            } catch {
                // Silently fail — user can still type
            }
        };
        fetchUser();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMsg("");
        setProfileLoading(true);
        try {
            await updateProfile(profileData);
            setUserName(profileData.name);
            if (profileData.avatar) setUserAvatar(profileData.avatar);
            setProfileMsg("Success: Profile updated successfully.");
        } catch (e: any) {
            setProfileMsg(`Error: ${e.message}`);
        } finally {
            setProfileLoading(false);
        }
    };
    return (
        <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[12px] p-4 md:p-6 space-y-4 md:space-y-6 w-full backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3 md:pb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                    <User size={14} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div>
                    <h3 className="font-bold text-base md:text-lg text-white">Personal Info</h3>
                    <p className="text-[10px] md:text-xs text-white/50">Update your name, email, and avatar.</p>
                </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4 md:space-y-6">
                {profileMsg && (
                    <div className={`p-3 rounded-[8px] text-[10px] md:text-sm ${profileMsg.startsWith("Success") ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-red-500/20 text-red-400 border border-red-500/20"}`}>
                        {profileMsg.replace(/^(Success|Error): /, "")}
                    </div>
                )}
                
                {/* Avatar Section */}
                <div className="space-y-3 md:space-y-4 pt-1 md:pt-2">
                        <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-black/5 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 mb-3 md:mb-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white/5 shadow-xl relative mb-2 md:mb-3">
                            {profileData.avatar ? (
                                <Image 
                                    src={profileData.avatar} 
                                    alt="Current Avatar" 
                                    fill 
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <User size={24} className="md:w-[32px] md:h-[32px]" />
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] md:text-xs text-white/40">Current Avatar</p>
                        </div>

                        <AvatarPicker 
                        currentAvatar={profileData.avatar}
                        seedName={profileData.name}
                        onSelect={(url) => setProfileData(prev => ({ ...prev, avatar: url }))}
                        />
                </div>

                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                        <label className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-wider">Full Name</label>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-black/50 dark:bg-black/20 border border-white/10 rounded-[8px] p-2.5 md:p-3 mt-1 text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all text-xs md:text-sm"
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={e => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-black/50 dark:bg-black/20 border border-white/10 rounded-[8px] p-2.5 md:p-3 mt-1 text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all text-xs md:text-sm"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                </div>

                <Button 
                    type="submit"
                    disabled={profileLoading}
                    variant="primary"
                    className="w-full text-xs md:text-sm"
                >
                    {profileLoading ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={14} />
                            Save Profile Changes
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
