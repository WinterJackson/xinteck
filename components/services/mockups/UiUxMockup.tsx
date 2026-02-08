"use client";

import { motion } from "framer-motion";
import { Lightbulb, Monitor, Sparkles, Thermometer, ToggleRight, UserCheck } from "lucide-react";

export function UiUxMockup() {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute -top-8 left-0 text-white/40 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
        <span className="w-8 h-[1px] bg-white/20"></span>
        EXAMPLE: SMART HOME HUB
      </div>
      {/* Smart Home Hub Mockup */}
      <motion.div 
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.8 }}
       className="aspect-square bg-[#0a0a0a] backdrop-blur-xl rounded-[30px] border border-white/10 overflow-hidden shadow-2xl relative p-6 flex flex-col justify-between"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
           <div>
              <h4 className="text-white font-bold text-lg">Living Room</h4>
              <span className="text-white/40 text-xs">Connected • 4 Devices</span>
           </div>
           <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           </div>
        </div>

        {/* Main Visual - Temp Control */}
        <div className="relative flex-1 flex items-center justify-center my-4">
           <div className="relative w-48 h-48 rounded-full border-4 border-white/5 flex items-center justify-center">
              {/* Active Arc */}
             <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="96" cy="96" r="90" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gold" strokeDasharray="565" strokeDashoffset="140" strokeLinecap="round" />
              </svg>
              
              <div className="text-center">
                 <span className="text-xs text-white/40 block">TEMP</span>
                 <span className="text-5xl font-black text-white tracking-tighter">72°</span>
                 <span className="text-xs text-gold block mt-1">Heating...</span>
              </div>
           </div>
           
           {/* Floating Elements */}
           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-10 right-4 p-2 bg-white/5 rounded-lg border border-white/10 backdrop-blur-md"
           >
             <Thermometer size={16} className="text-gold" />
           </motion.div>
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 group hover:border-gold/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                 <Lightbulb size={20} className="text-white/60 group-hover:text-gold transition-colors" />
                 <ToggleRight size={24} className="text-gold" />
              </div>
              <div>
                 <span className="text-white font-bold block text-sm">Focus Mode</span>
                 <span className="text-white/40 text-xs">On • 80%</span>
              </div>
           </div>
           <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-3 group hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                 <Monitor size={20} className="text-white/60" />
                 <div className="w-8 h-4 bg-white/10 rounded-full relative">
                    <div className="absolute left-1 top-1 w-2 h-2 bg-white/20 rounded-full" />
                 </div>
              </div>
              <div>
                 <span className="text-white font-bold block text-sm">TV Ambient</span>
                 <span className="text-white/40 text-xs">Off</span>
              </div>
           </div>
        </div>
      </motion.div>
      
      {/* Floating Badge - Experience */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 top-12 p-4 bg-white backdrop-blur-xl border border-primary/20 rounded-[10px] flex items-center gap-3 shadow-lg z-20"
      >
        <div className="p-2 bg-primary/10 rounded-[10px] text-gold">
          <Sparkles size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-black">Experience</span>
          <span className="text-[10px] text-gold font-bold">PREMIUM</span>
        </div>
      </motion.div>

      {/* Floating Badge - Accessibility */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-8 bottom-1/3 p-4 bg-white backdrop-blur-xl border border-primary/20 rounded-[10px] flex items-center gap-3 shadow-lg z-20"
      >
        <div className="p-2 bg-blue-500/10 rounded-[10px] text-blue-400">
          <UserCheck size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-black">Accessibility</span>
          <span className="text-[10px] text-blue-400 font-bold">WCAG 2.1 AA</span>
        </div>
      </motion.div>
    </div>
  );
}
