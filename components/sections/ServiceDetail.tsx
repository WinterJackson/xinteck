"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Zap, Target, Shield, Cpu } from "lucide-react";
import Link from "next/link";

interface ServiceDetailProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  process: { title: string; desc: string }[];
  icon: any;
}

export function ServiceDetail({ title, subtitle, description, features, process, icon: Icon }: ServiceDetailProps) {
  return (
    <div className="flex flex-col gap-24 py-20 px-6">
      {/* Hero */}
      <section className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="flex flex-col gap-8"
        >
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-[10px] bg-primary/10 flex items-center justify-center text-gold">
                <Icon size={32} />
             </div>
             <h1 className="text-sm font-bold tracking-[0.3em] text-gold uppercase">{subtitle}</h1>
          </div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            {title.split(' ')[0]} <br />
            <span className="text-gold">{title.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-xl">
            {description}
          </p>
          <button className="px-10 py-5 bg-primary text-black font-black rounded-[10px] w-fit hover:bg-gold-hover transition-all">
             Start Your Project
          </button>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4">
           {features.map((feature, i) => (
             <motion.div 
               key={feature}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 + (i * 0.1) }}
               className="p-6 rounded-[10px] bg-secondary/5 border border-primary/10 flex flex-col gap-3"
             >
                <CheckCircle2 className="text-gold" size={24} />
                <span className="font-bold text-sm">{feature}</span>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-secondary/20 py-24 px-6 border-y border-primary/10">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20 flex flex-col gap-4">
              <h3 className="text-sm font-bold tracking-[0.3em] text-gold uppercase">The X-Workflow</h3>
              <h4 className="text-4xl md:text-6xl font-black tracking-tighter">HOW WE <span className="text-foreground/40">DELIVER.</span></h4>
           </div>
           
           <div className="grid md:grid-cols-4 gap-8">
              {process.map((step, i) => (
                <div key={i} className="relative flex flex-col gap-6 p-8 bg-background border border-primary/10 rounded-[10px]">
                   <span className="text-6xl font-black text-gold/10 absolute top-4 right-8 italic">0{i+1}</span>
                   <h5 className="text-xl font-bold z-10">{step.title}</h5>
                   <p className="text-sm text-foreground/60 leading-relaxed z-10">{step.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Trust & CTA */}
      <section className="max-w-4xl mx-auto text-center flex flex-col gap-12 pt-20">
         <div className="flex justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all">
            <Zap size={48} />
            <Shield size={48} />
            <Target size={48} />
            <Cpu size={48} />
         </div>
         <h3 className="text-4xl md:text-7xl font-black tracking-tighter">
            READY TO <span className="text-gold">ACCELERATE?</span>
         </h3>
         <Link 
           href="/contact"
           className="px-12 py-6 bg-primary text-black font-black text-xl rounded-[10px] hover:bg-gold-hover transition-all mx-auto"
         >
           Get a Custom Proposal
         </Link>
      </section>
    </div>
  );
}
