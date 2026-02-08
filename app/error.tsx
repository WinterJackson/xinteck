"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent opacity-50" />
      
      <div className="max-w-xl w-full text-center flex flex-col items-center gap-12 relative z-10">
        <motion.div
           initial={{ rotate: 0 }}
           animate={{ rotate: [0, -10, 10, -10, 0] }}
           transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
           className="w-24 h-24 rounded-[10px] bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20"
        >
           <AlertTriangle size={48} />
        </motion.div>

        <div className="flex flex-col gap-6">
           <h1 className="text-sm font-bold tracking-[0.4em] text-red-500 uppercase">
              System Breach Detected
           </h1>
           <h2 className="text-6xl md:text-7xl font-black tracking-tighter italic italic">
              CRITICAL <span className="text-foreground/40">FAILURE.</span>
           </h2>
           <p className="text-xl text-foreground/60 leading-relaxed">
             A sequence of instructions caused a crash in the core logic. 
             Our engineers have been alerted and are debugging the frequency.
           </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
           <button 
             onClick={() => reset()}
             className="px-10 py-2 bg-primary text-black font-black rounded-full hover:bg-gold-hover transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
           >
              <RefreshCcw size={20} /> Attempt Reboot
           </button>
           <Link href="/" className="px-10 py-2 border border-primary/20 text-foreground/40 font-bold rounded-full hover:text-gold hover:border-gold transition-all flex items-center justify-center gap-3">
              <Home size={20} /> Emergency Exit
           </Link>
        </div>
      </div>
    </div>
  );
}
