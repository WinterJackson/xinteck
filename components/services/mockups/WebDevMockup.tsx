"use client";

import { motion } from "framer-motion";
import { Shield, Zap } from "lucide-react";

export function WebDevMockup() {
  return (
    <div className="relative hidden lg:block perspective-1000 scale-[0.75] origin-top-left translate-y-16">
      <div className="absolute -top-12 left-0 text-white/40 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
        <span className="w-8 h-[1px] bg-white/20"></span>
        EXAMPLE: E-COMMERCE API
      </div>
      <motion.div 
       initial={{ rotateY: -10, rotateX: 5, scale: 0.9 }}
       animate={{ rotateY: 0, rotateX: 0, scale: 1 }}
       transition={{ duration: 1.5, ease: "easeOut" }}
       className="relative z-10 bg-[#0a0a0a] border border-white/10 rounded-[10px] shadow-2xl overflow-hidden"
      >
       {/* Window Controls */}
       <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
          <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500/80" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
             <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex text-xs text-white/30 font-mono gap-4">
             <span>App.tsx</span>
             <span className="text-white/10">|</span>
             <span>analytics.ts</span>
          </div>
       </div>
       
       {/* Code Area */}
       <div className="p-6 font-mono text-sm leading-relaxed text-gray-400">
          <div className="flex gap-4">
             <div className="flex flex-col text-right text-gray-700 select-none">
                {Array.from({length: 12}).map((_, i) => <span key={i}>{i+1}</span>)}
             </div>
             <div className="flex flex-col gap-1 w-full">
                <span className="text-purple-400">import</span> <span className="text-yellow-100">React</span>, {"{"} <span className="text-yellow-100">useEffect</span> {"}"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;react&apos;</span>;
                <br />
                <span className="text-blue-400">export default</span> <span className="text-blue-400">function</span> <span className="text-yellow-200">WebApp</span>() {"{"}
                <span className="pl-4 text-purple-400">const</span> [data, setData] = <span className="text-yellow-200">useState</span>(<span className="text-purple-400">null</span>);
                <br />
                <span className="pl-4 text-yellow-200">useEffect</span>(() =&gt; {"{"}
                <span className="pl-8 text-gray-400">{`// Real-time optimization`}</span>
                <span className="pl-8 text-cyan-400">initializeCore</span>({"{"}
                <span className="pl-12">mode: <span className="text-green-400">&apos;turbo&apos;</span>,</span>
                <span className="pl-12">sync: <span className="text-purple-400">true</span></span>
                <span className="pl-8">{"});"}</span>
                <span className="pl-4">{"}, []);"}</span>
                <br />
                <span className="pl-4 text-purple-400">return</span> <span className="text-blue-400">&lt;Dashboard /&gt;</span>;
                {"}"}
             </div>
          </div>
       </div>
       
       {/* Status Bar */}
       <div className="bg-primary text-black text-xs font-bold px-4 py-1 flex justify-between">
          <span>COMPILING...</span>
          <span>Ln 15, Col 2</span>
       </div>
      </motion.div>
      
      {/* Floating Badge */}
      <motion.div 
       animate={{ y: [0, -10, 0] }}
       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
       className="absolute -right-4 -top-4 p-4 bg-white backdrop-blur-xl border border-primary/20 rounded-[10px] flex items-center gap-3 shadow-lg z-20"
      >
       <div className="p-2 bg-green-500/10 rounded-[10px] text-green-400">
          <Shield size={20} />
       </div>
       <div className="flex flex-col">
          <span className="text-xs font-bold text-black">Security First</span>
          <span className="text-[10px] text-green-400 font-bold">CERTIFIED</span>
       </div>
      </motion.div>

      {/* Second Floating Badge - API Latency */}
      <motion.div 
       animate={{ y: [0, -10, 0] }}
       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
       className="absolute -left-4 -bottom-4 p-4 bg-white backdrop-blur-xl border border-primary/20 rounded-[10px] flex items-center gap-3 shadow-lg z-20"
      >
       <div className="p-2 bg-blue-500/10 rounded-[10px] text-blue-400">
          <Zap size={20} />
       </div>
       <div className="flex flex-col">
          <span className="text-xs font-bold text-black">API Latency</span>
          <span className="text-[10px] text-blue-400 font-bold">12ms (Global)</span>
       </div>
      </motion.div>
    </div>
  );
}
