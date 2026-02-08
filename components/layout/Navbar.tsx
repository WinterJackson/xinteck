"use client";

import { cn } from "@/components/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Shared animation config for synchronized pulsing
const pulseAnimation = {
  animate: {
    boxShadow: ["0 0 0px rgba(212,175,55,0.2)", "0 0 15px rgba(212,175,55,0.6)", "0 0 0px rgba(212,175,55,0.2)"],
    borderColor: ["rgba(212,175,55,0.3)", "rgba(212,175,55,1)", "rgba(212,175,55,0.3)"]
  },
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-2 md:p-4 lg:p-6 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
          "pointer-events-auto",
          "w-full max-w-7xl mx-auto rounded-[10px]",
          "flex items-center justify-between",
          "px-6 py-3 transition-all duration-300",
          scrolled 
            ? "bg-black/80 dark:bg-white/30 backdrop-blur-xl border border-primary/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]" 
            : "bg-transparent border border-transparent"
        )}
      >
        {/* Logo with circular border and animation */}
        <Link href="/" className="flex items-center gap-2 group relative z-50">
          <motion.div
            initial={{ width: "58px", borderRadius: "9999px" }}
            whileHover={{ width: "140px", borderRadius: "12px" }}
            animate={pulseAnimation.animate}
            transition={{
              ...pulseAnimation.transition,
              width: { type: "spring", stiffness: 300, damping: 20 },
              borderRadius: { type: "spring", stiffness: 300, damping: 20 }
            }}
            className="relative border-2 border-primary p-1 bg-white/30 dark:bg-black/70 overflow-hidden h-[58px] flex items-center justify-center"
          >
            {/* Light Mode Container */}
            <div className="absolute inset-0 flex items-center justify-center dark:hidden">
              <div className="relative w-[50px] h-[50px] transition-opacity duration-300 group-hover:opacity-0">
                  <Image
                    src="/logos/logo-light.png"
                    alt="Xinteck"
                    fill
                    className="object-contain"
                  />
              </div>
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <Image
                    src="/logos/logo-light-full.png"
                    alt="Xinteck Full"
                    fill
                    className="object-cover" 
                  />
              </div>
            </div>

            {/* Dark Mode Container */}
            <div className="absolute inset-0 flex items-center justify-center hidden dark:flex">
              <div className="relative w-[50px] h-[50px] transition-opacity duration-300 group-hover:opacity-0">
                  <Image
                    src="/logos/logo-dark.png"
                    alt="Xinteck"
                    fill
                    className="object-contain"
                  />
              </div>
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <Image
                    src="/logos/logo-dark-full.png"
                    alt="Xinteck Full"
                    fill
                    className="object-cover"
                  />
              </div>
            </div>
          </motion.div>
        </Link>
        
        {/* Right Actions */}
        <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/contact" className="hidden md:block group relative">
                <motion.div 
                  animate={pulseAnimation.animate}
                  transition={pulseAnimation.transition}
                  className="px-6 py-2.5 rounded-[10px] border-2 border-primary bg-white/30 dark:bg-black/70 hover:scale-105 transition-transform"
                >
                   <span className="flex items-center gap-2 text-sm font-bold text-gold dark:text-white">
                     Get Started <Rocket size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </span>
                </motion.div>
            </Link>
        </div>
      </motion.div>
    </nav>
  );
}
