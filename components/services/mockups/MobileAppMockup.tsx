"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import NextImage from "next/image";

export function MobileAppMockup() {
  return (
    <div className="relative hidden lg:block h-full min-h-[500px] flex items-center justify-center translate-x-12 translate-y-16">
      <div className="absolute top-0 left-0 text-white/40 text-xs font-bold tracking-widest uppercase flex items-center gap-2 z-20">
        <span className="w-8 h-[1px] bg-white/20"></span>
        EXAMPLE: FINTECH APP
      </div>
      {/* Floating Smartphone Mockup */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[280px] h-[560px] bg-black rounded-[3rem] border-4 border-gray-800 shadow-2xl overflow-hidden"
          >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl z-20 flex items-center justify-center gap-2">
                <div className="w-12 h-1 bg-gray-800 rounded-full" />
                <div className="w-1 h-1 bg-blue-900/50 rounded-full" />
              </div>

              {/* Screen Content */}
              <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  {/* Grid Pattern Overlay */}
                  <div className="absolute inset-0 opacity-20" 
                       style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }} 
                  />
                  
                  {/* Static App Logo */}
                  <div className="relative w-32 h-32">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <NextImage 
                        src="/logos/logo-dark.png" 
                        alt="App Icon" 
                        width={128}
                        height={128}
                        className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                     />
                  </div>

                  {/* UI Elements Mockup */}
                  <div className="absolute bottom-12 left-6 right-6 flex flex-col gap-3">
                      <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                      <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                      <div className="h-12 w-full bg-white/5 rounded-xl mt-4 border border-white/10 backdrop-blur-sm" />
                  </div>
              </div>
          </motion.div>
      </motion.div>
      
      {/* Floating Badge - Performance */}
      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -left-12 top-1/3 p-4 bg-white backdrop-blur-xl border border-primary/20 rounded-[10px] flex items-center gap-3 shadow-lg z-20"
      >
        <div className="p-2 bg-blue-500/10 rounded-[10px] text-blue-400">
          <Zap size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-black">Performance</span>
          <span className="text-[10px] text-blue-400 font-bold">60 FPS NATIVE</span>
        </div>
      </motion.div>
    </div>
  );
}
