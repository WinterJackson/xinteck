"use client";

import { registerUser } from "@/actions/auth";
import { PasswordInput } from "@/components/admin/ui/PasswordInput";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Image from "next/image";

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await registerUser(formData);
            // Redirect to login
            router.push("/admin/login?registered=true");
        } catch (err: any) {
            setError(err.message || "Registration failed");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-[#0a0a0a]">
                <div className="absolute inset-0 z-0">
                   <Image
                     src="/admin-bg/circuit.png"
                     alt="Background"
                     fill
                     priority
                     quality={100}
                     className="object-cover opacity-60"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                </div>
                
                <div className="relative z-10 p-12 flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                       <Image 
                         src="/logos/logo-dark-full.png"
                         alt="Xinteck Logo"
                         width={600}
                         height={225}
                         className="w-auto h-auto max-w-[90%] max-h-[300px]"
                         priority
                       />
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex items-center justify-center p-8 bg-black/50 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
                        <p className="mt-2 text-sm text-white/40">Join the Xinteck command center.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-[10px] p-4 text-red-500 text-sm flex items-center gap-3">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-[10px] pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:border-gold/50 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-[10px] pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:border-gold/50 outline-none transition-all"
                                    required
                                />
                            </div>
                            <PasswordInput 
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-white/5"
                                    required
                                    leftIcon={<Lock size={18} />}
                                />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gold text-black font-bold py-3 rounded-[10px] flex items-center justify-center gap-2 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-white/40">
                        Already have an account?{" "}
                        <Link href="/admin/login" className="text-gold hover:text-white transition-colors font-medium">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
