"use client";

import { motion } from "framer-motion";
import { Globe, SignalHigh } from "lucide-react";

export function CloudDevOpsMockup() {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute -top-12 left-0 text-white/40 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
        <span className="w-8 h-[1px] bg-white/20"></span>
        EXAMPLE: GLOBAL CDN
      </div>
      
      {/* Global CDN Network Mockup */}
      <motion.div 
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.8 }}
       className="aspect-square bg-[#0a0a0a] backdrop-blur-xl rounded-[20px] border border-white/10 overflow-hidden shadow-2xl relative"
      >
        {/* World Map Background */}
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 800 400" className="w-full h-full text-white/10 fill-current">
             <path d="M68.6,83.1 C58.9,94.9 44.1,89.5 35.5,102.3 C30.6,109.6 38.3,121.3 35.5,129.5 C34.6,132.2 28.5,134.1 27.2,136.6 C19.2,151.7 51,159.2 56.4,171.6 C58.4,176.2 54.1,180.7 54.9,185.6 C60.9,223.3 103.5,296.8 126.7,330.1 C133.2,339.4 153.2,320.6 157.9,313.3 C165.7,301.1 161.4,269.4 163.6,256.7 L163.7,256.5 C164.8,249.8 168.3,243.6 173.8,239.5 C187.3,229.4 207.3,235.1 223.3,230.1 C229.4,228.2 233.1,222.3 234.3,216.0 C238.1,195.9 252.1,173.9 237.9,157.1 C223.4,139.9 187.9,141.6 177.3,122.3 C172.9,114.3 177.9,101.9 184.8,96.3 C208,77.4 266.3,47.8 245.9,14.5 C242.3,8.7 236.4,4.4 229.8,2.2 C206.1,-5.6 179.9,20.0 162.7,34.8 C144.9,50.1 114.7,42.5 94.7,53.4 C84.8,58.8 77.2,72.6 68.6,83.1 Z M410.2,74.9 C404.9,64.4 429.3,55.9 434.9,47.8 C446.7,30.7 493.5,39.9 500.5,23.3 C502.8,17.9 501.9,11.8 498.0,7.2 C488.7,-3.7 447.8,12.5 435.6,8.2 C424.1,4.1 411.7,-4.0 401.7,3.9 C375.4,24.7 344.2,39.6 348.6,76.5 C349.5,84.0 355.6,89.5 362.4,92.5 C364.6,104.5 354.3,118.0 357.5,130.6 C359.3,137.9 366.4,142.9 373.1,146.1 C397.4,157.7 388.9,191.0 401.0,210.6 C409.9,225.0 411.3,253.2 431.1,257.6 C433.9,258.2 436.8,258.4 439.7,258.2 L440.0,258.1 C462.6,255.4 446.3,222.0 464.3,209.6 C477.5,200.5 498.4,213.9 513.1,211.2 C528.8,208.3 543.1,192.1 549.9,178.6 C553.3,171.8 554.4,164.2 552.9,156.7 C550.0,141.5 533.3,133.0 523.6,121.7 C515.2,111.9 527.1,95.5 519.8,85.2 C514.8,78.2 505.4,75.0 497.3,77.3 C483.9,81.1 475.2,85.4 461.3,86.6 C447.8,87.7 416.7,87.7 410.2,74.9 Z M655.2,106.6 C669.9,113.8 679.5,129.5 695.1,133.4 C709.6,137.0 725.3,128.8 738.7,134.7 C743.1,136.6 746.5,140.2 748.5,144.5 C758.5,165.7 732.6,180.1 727.6,200.0 C724.7,211.5 733.9,224.6 726.6,233.8 C717.0,245.9 696.0,244.5 683.4,236.4 C673.2,229.8 668.0,223.7 662.6,213.3 C657.4,203.3 656.7,192.3 653.6,181.6 C643.0,144.5 596.2,143.9 610.9,102.3 C617.9,82.4 640.4,99.3 655.2,106.6 Z" />
          </svg>
        </div>
        
        {/* SVG Connections Layer - ViewBox 0 0 400 400 matching % positions */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(212,175,55,0)" />
              <stop offset="50%" stopColor="rgba(212,175,55,0.4)" />
              <stop offset="100%" stopColor="rgba(212,175,55,0)" />
            </linearGradient>
          </defs>

          {/* Paths */}
          <g stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" strokeDasharray="3 3">
            {/* SFO -> NYC */}
            <path d="M48 120 L80 140" id="path-us" />
            {/* NYC -> LON (Curved) */}
            <path d="M80 140 Q135 90 188 112" id="path-atlantic" />
            {/* LON -> FRA */}
            <path d="M188 112 L208 100" id="path-eu" />
            {/* FRA -> DBX */}
            <path d="M208 100 L240 160" id="path-mideast" />
             {/* DBX -> SIN */}
            <path d="M240 160 L312 180" id="path-india" />
             {/* SIN -> TKY */}
            <path d="M312 180 L340 140" id="path-asia" />
            {/* SIN -> SYD */}
            <path d="M312 180 L360 280" id="path-oceania" />
             {/* NYC -> GRU */}
            <path d="M80 140 L112 280" id="path-americas" />
          </g>

          {/* Active Traffic - Multiple Packets */}
          {/* Atlantic Route Packets */}
          <circle r="1.5" fill="#D4AF37">
            <animateMotion dur="2s" repeatCount="indefinite" begin="0s">
               <mpath href="#path-atlantic" />
            </animateMotion>
          </circle>
           <circle r="1.5" fill="#D4AF37">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.2s">
               <mpath href="#path-atlantic" />
            </animateMotion>
          </circle>

           {/* Asia Route Packets */}
          <circle r="1.5" fill="#D4AF37">
            <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s">
               <mpath href="#path-india" />
            </animateMotion>
          </circle>
          <circle r="1.5" fill="#D4AF37">
            <animateMotion dur="1.5s" repeatCount="indefinite" begin="0s">
               <mpath href="#path-asia" />
            </animateMotion>
          </circle>

          {/* US-SA Packet */}
          <circle r="1.5" fill="#D4AF37">
            <animateMotion dur="3s" repeatCount="indefinite" begin="0.8s">
               <mpath href="#path-americas" />
            </animateMotion>
          </circle>
        </svg>

        {/* Nodes - approx positions on 400x400 container mapping to map coords */}
        {[
          { x: "20%", y: "35%", label: "NYC" },     // USA East
          { x: "12%", y: "30%", label: "SFO" },     // USA West
          { x: "47%", y: "28%", label: "LON" },     // UK
          { x: "52%", y: "25%", label: "FRA" },     // Europe (Frankfurt)
          { x: "60%", y: "40%", label: "DBX" },     // Dubai
          { x: "85%", y: "35%", label: "TKY" },     // Japan
          { x: "78%", y: "45%", label: "SIN" },     // Singapore
          { x: "28%", y: "70%", label: "GRU" },     // Brazil
          { x: "90%", y: "70%", label: "SYD" },     // Australia
        ].map((node, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2"
            style={{ left: node.x, top: node.y }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="absolute -inset-2 bg-gold/20 rounded-full animate-pulse" />
            <div className="w-full h-full bg-[#0a0a0a] border border-gold rounded-full z-10 relative" />
          </motion.div>
        ))}

        {/* Center Status */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-500 text-xs font-bold font-mono">SYSTEM: ONLINE</span>
        </div>
      </motion.div>
      
      {/* Floating Badge - Network Status */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 top-12 p-4 bg-white backdrop-blur-xl border border-primary/20 rounded-[10px] flex items-center gap-3 shadow-lg z-20"
      >
        <div className="p-2 bg-green-500/10 rounded-[10px] text-green-500">
          <SignalHigh size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-black">Uptime</span>
          <span className="text-[10px] text-green-500 font-bold">99.99% GUARANTEED</span>
        </div>
      </motion.div>

      {/* Floating Badge - Global Reach */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-8 bottom-12 p-4 bg-white backdrop-blur-xl border border-primary/20 rounded-[10px] flex items-center gap-3 shadow-lg z-20"
      >
        <div className="p-2 bg-primary/10 rounded-[10px] text-gold">
          <Globe size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-black">Global Edge</span>
          <span className="text-[10px] text-gold font-bold">24 REGIONS</span>
        </div>
      </motion.div>
    </div>
  );
}
