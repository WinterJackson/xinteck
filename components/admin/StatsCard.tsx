"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ElementType;
  href?: string;
}

export function StatsCard({ title, value, trend, isPositive, icon: Icon, href }: StatsCardProps) {
  const Content = (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`p-3 md:p-6 rounded-[10px] bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md relative overflow-hidden group h-full ${href ? 'cursor-pointer hover:border-gold/30' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] md:text-sm font-medium text-white/60 mb-1">{title}</p>
          <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">{value}</h3>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-[10px] bg-gold/10 flex items-center justify-center text-gold border border-gold/20 group-hover:bg-gold group-hover:text-black transition-colors">
          <Icon size={16} className="md:hidden" />
          <Icon size={20} className="hidden md:block" />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-[4px] ${
          isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        }`}>
          {isPositive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
          {trend}
        </span>
        <span className="text-xs text-white/40">vs last month</span>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href}>
        {Content}
      </Link>
    );
  }

  return Content;
}
