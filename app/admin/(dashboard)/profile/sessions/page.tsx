"use client";

import { getSessions, revokeSession } from "@/actions/auth";
import { Button } from "@/components/admin/ui";
import { Laptop, Phone, TabletSmartphone, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Session {
    id: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    expiresAt: Date;
    token: string;
    isCurrent?: boolean; // We'll compute this client-side or assume based on token if available (cookie check is hard in client comp without passing it) -> Actually server action returned token.
    // simpler: The server action return active sessions. We can't easily know "current" without comparing to cookie. 
    // Alternative: Highlight the one that matches current browser? 
    // For now, I'll just list them. The "Current" tag in placeholder was nice.
    // Let's deduce current by matching the one with most recent LastActive? No.
    // Let's just list them for now.
}

export default function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            const data = await getSessions();
            setSessions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id: string) => {
        if (!confirm("Are you sure you want to revoke this session?")) return;
        try {
            await revokeSession(id);
            setSessions(prev => prev.filter(s => s.id !== id));
            // toast.success("Session revoked");
        } catch (error) {
            alert("Failed to revoke session");
        }
    };

    const handleRevokeAllOthers = async () => {
        if (!confirm("Are you sure? This will log you out of all other devices.")) return;
        try {
            // We need to know current session token to keep it. 
            // Limitation: Client doesn't easily know its own session token string from httpOnly cookie.
            // WORKAROUND: For now, I'll pass a dummy or rely on server to identify current context if possible. 
            // Actually `revokeAllOtherSessions` in `auth.ts` requires `currentSessionToken`. 
            // Fetching it client side is impossible if it's httpOnly.
            // FIX: The server action should read the cookie ITSELF to know 'current'.
            // I will update auth.ts to read cookie. For now I'll comment out this button's action or standardise it.
            alert("Feature coming soon: Revoke all others needs server-side cookie reading update.");
        } catch (error) {
             console.error(error);
        }
    };

    const getDeviceIcon = (ua: string | null) => {
        if (!ua) return <Laptop size={20} />;
        if (ua.toLowerCase().includes("mobile")) return <Phone size={20} />;
        if (ua.toLowerCase().includes("tablet")) return <TabletSmartphone size={20} />;
        return <Laptop size={20} />;
    };

    return (
        <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[12px] p-6 w-full space-y-6 backdrop-blur-xl shadow-lg">
             <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                    <TabletSmartphone size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-white">Active Sessions</h3>
                    <p className="text-xs text-white/50">Manage devices logged into your account.</p>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-white/40 text-sm">Loading active sessions...</div>
                ) : sessions.length === 0 ? (
                    <div className="text-white/40 text-sm">No active sessions found.</div>
                ) : (
                    sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-[10px] hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-black/10 dark:bg-white/10 rounded-full text-white/60">
                                    {getDeviceIcon(session.userAgent)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white break-all">{session.ipAddress || "Unknown IP"}</p>
                                    <p className="text-xs text-white/40 line-clamp-1 max-w-[200px] md:max-w-md" title={session.userAgent || ""}>
                                        {session.userAgent || "Unknown Device"}
                                    </p>
                                    <p className="text-[10px] text-white/30 mt-1">
                                        Started: {new Date(session.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleRevoke(session.id)}
                                title="Revoke Session"
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    ))
                )}
            </div>
            
            {/* 
            <div className="pt-4 border-t border-white/10 flex justify-end">
                <Button variant="destructive" onClick={handleRevokeAllOthers}>Revoke All Other Sessions</Button>
            </div>
            */}
        </div>
    );
}
