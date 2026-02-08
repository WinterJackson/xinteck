"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 relative overflow-hidden bg-background">
      {/* Background Text Decor */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
         <span className="text-[30rem] font-black tracking-tighter">404</span>
      </div>

      <div className="max-w-xl w-full text-center flex flex-col items-center gap-12 relative z-10">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 rounded-[10px] bg-secondary/20 flex items-center justify-center text-gold border border-primary/20"
        >
           <Search size={48} />
        </motion.div>

        <div className="flex flex-col gap-6">
           <h1 className="text-sm font-bold tracking-[0.4em] text-gold uppercase">
              Signal Lost in Transit
           </h1>
           <h2 className="text-6xl md:text-7xl font-black tracking-tighter italic">
              PAGE <span className="text-foreground/40">DECRYPTED.</span>
           </h2>
           <p className="text-xl text-foreground/60 leading-relaxed">
             The coordinates you provided lead to a void in the digital space. 
             The resource you're looking for was either repositioned or never existed.
           </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
           <Link href="/" className="">
            <div className="px-10 py-2 bg-primary text-black font-black rounded-full hover:bg-gold-hover transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
               <Home size={20} /> Back to Nexus
            </div>
           </Link>
           <button 
             onClick={() => window.history.back()}
             className="px-10 py-2 border border-primary/20 text-foreground/40 font-bold rounded-full hover:text-gold hover:border-gold transition-all flex items-center justify-center gap-3"
           >
              <ArrowLeft size={20} /> Revert History
           </button>
        </div>
      </div>
    </div>
  );
}
