"use client";

import { cn } from "@/components/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    Briefcase,
    Cloud,
    FileText,
    Globe,
    Home,
    Layers,
    Mail,
    Palette,
    Smartphone,
    User,
    Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { 
    name: "Services", 
    href: "/services", 
    icon: Zap,
    trigger: true 
  },
  { name: "Portfolio", href: "/portfolio", icon: Layers },
  { name: "Blog", href: "/blog", icon: FileText },
  { name: "Contact", href: "/contact", icon: Mail },
];

const services = [
  { name: "Web Dev", href: "/services/web-development", icon: Globe },
  { name: "Mobile Apps", href: "/services/mobile-app-development", icon: Smartphone },
  { name: "Custom Software", href: "/services/custom-software-development", icon: Briefcase },
  { name: "UI/UX Design", href: "/services/ui-ux-design", icon: Palette },
  { name: "Cloud & DevOps", href: "/services/cloud-devops", icon: Cloud },
];

export function FloatingDock() {
  const pathname = usePathname();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <div className="fixed z-50 flex flex-col gap-4 w-full pointer-events-none">
        {/* Services Side Menu - Staggered from Left */}
        <AnimatePresence>
          {isServicesOpen && (
            <div className="fixed top-1/2 -translate-y-1/2 left-[20px] flex flex-col gap-3 pointer-events-auto items-start">
              {services.map((service, i) => (
                <motion.div
                  key={service.name}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ 
                    delay: i * 0.1, 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25 
                  }}
                >
                  <Link
                    href={service.href}
                    onClick={() => setIsServicesOpen(false)}
                    className="flex items-center gap-4 px-6 py-3 rounded-[10px] bg-primary border border-primary/20 hover:bg-gold-hover transition-all group shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)]"
                  >
                      <div className="p-2 rounded-[10px] bg-black/10 dark:bg-white/20 text-black dark:text-white transition-colors">
                        <service.icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-black dark:text-white tracking-wide">
                          {service.name}
                      </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main Dock */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <motion.div 
          animate={{ 
            boxShadow: ["0 0 0px rgba(212,175,55,0.2)", "0 0 15px rgba(212,175,55,0.6)", "0 0 0px rgba(212,175,55,0.2)"],
            borderColor: ["rgba(212,175,55,0.3)", "rgba(212,175,55,1)", "rgba(212,175,55,0.3)"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2 p-2 bg-black/80 dark:bg-white/30 backdrop-blur-xl border-2 border-primary rounded-[10px]"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {links.map((link, i) => {
            const isActive = pathname === link.href;
            const IsIcon = link.icon;

            return (
              <div key={link.name} className="relative">
                {link.trigger ? (
                    <button
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        onMouseEnter={() => setHoveredIndex(i)}
                        className={cn(
                            "relative w-12 h-12 flex items-center justify-center rounded-[8px] transition-all duration-300",
                            isServicesOpen || isActive ? "bg-primary text-black" : "text-primary hover:text-white dark:hover:text-black hover:bg-white/10 dark:hover:bg-black/10"
                        )}
                    >
                        <IsIcon size={24} />
                        {(isServicesOpen || isActive) && (
                            <motion.div layoutId="dock-active" className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                        )}
                    </button>
                ) : (
                    <Link
                        href={link.href}
                        onMouseEnter={() => setHoveredIndex(i)}
                        className={cn(
                        "relative w-12 h-12 flex items-center justify-center rounded-[8px] transition-all duration-300",
                        isActive ? "bg-primary text-black" : "text-primary hover:text-white dark:hover:text-black hover:bg-white/10 dark:hover:bg-black/10"
                        )}
                    >
                        <IsIcon size={24} />
                    </Link>
                )}
                
                {/* Peer Name Tooltip */}
                <AnimatePresence>
                    {hoveredIndex === i && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: -45 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                        >
                            <div className="px-3 py-1 bg-black border border-white/20 text-white text-xs font-bold rounded-[6px] whitespace-nowrap shadow-xl">
                                {link.name}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
        </div>
      </div>
    </>
  );
}
