"use client";

import { PasswordInput } from "@/components/admin/ui/PasswordInput";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Success - Redirect
      router.push('/admin');
      
    } catch (err) {
      setError('An unexpected system error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0">
           <NextImage
             src="/admin-bg/circuit.png"
             alt="Login Background"
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
               <NextImage 
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

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-white/40">
              Please enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-[10px] p-4 flex items-center gap-3 text-red-500 text-sm">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@xinteck.com"
                  className="w-full bg-white/5 border border-white/10 rounded-[10px] pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/80" htmlFor="password">Password</label>
                <Link href="/admin/forgot-password" className="text-sm text-gold hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>
                <PasswordInput 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white/5"
                  required
                  leftIcon={<Lock size={18} />}
                />
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded-[4px] w-4 h-4 border-white/10 bg-white/5 text-gold focus:ring-offset-black focus:ring-gold/50 cursor-pointer" 
              />
              <label htmlFor="remember" className="text-sm text-white/60 select-none cursor-pointer hover:text-white transition-colors">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold text-black font-bold py-3 rounded-[10px] flex items-center justify-center gap-2 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/40">
            Don't have an account?{" "}
            <Link href="/admin/register" className="text-gold hover:text-white transition-colors font-medium">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

