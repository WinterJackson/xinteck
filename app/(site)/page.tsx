"use client";

import { HomeKeyframeLayout } from "@/components/home/HomeKeyframeLayout";
import { Hero } from "@/components/sections/Hero";
import { ServicesFeatured } from "@/components/sections/ServicesFeatured";
import { ArrowUpRight, Plus } from "lucide-react";

export default function Home() {
  return (
    <HomeKeyframeLayout>
      <Hero />
      <ServicesFeatured />
      
      {/* Featured Project Teaser */}
      <section className="py-12 md:py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="group relative bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 p-1 md:p-2 rounded-[10px] overflow-hidden shadow-lg">
             {/* Glowing Border Effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
             
            <div className="bg-white/50 dark:bg-background/50 rounded-[8px] p-6 md:p-12 flex flex-col md:flex-row items-center gap-12 relative z-10 h-full">
              <div className="flex-1 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-primary/10 w-fit">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <h2 className="text-xs font-bold tracking-widest text-primary uppercase">
                      Featured Case Study
                    </h2>
                </div>
                
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
                  REVOLUTIONIZING <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">GLOBAL FINTECH.</span>
                </h3>
                <p className="text-foreground/60 text-lg leading-relaxed max-w-md">
                  We helped a leading financial institution scale their infrastructure
                  to handle 10k transactions per second with 99.99% uptime.
                </p>
                
                <div className="flex gap-4 pt-4">
                    <div className="flex flex-col gap-1 border-l-2 border-primary/20 pl-4">
                        <span className="text-2xl font-black text-foreground">10k+</span>
                        <span className="text-xs text-foreground/40 uppercase font-bold">TPS Capped</span>
                    </div>
                    <div className="flex flex-col gap-1 border-l-2 border-primary/20 pl-4">
                        <span className="text-2xl font-black text-foreground">-40%</span>
                        <span className="text-xs text-foreground/40 uppercase font-bold">Latency</span>
                    </div>
                </div>

                <div className="pt-4">
                    <button className="px-8 py-3 bg-foreground text-background font-bold rounded-[10px] hover:bg-primary transition-colors flex items-center gap-2 group/btn">
                    Read Case Study
                    <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                </div>
              </div>
              
              <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[400px]">
                <div className="w-full h-full bg-secondary/10 rounded-[10px] border border-primary/10 flex items-center justify-center relative overflow-hidden group/image">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <span className="text-primary/10 font-black text-[10rem] select-none scale-150 group-hover/image:scale-100 transition-transform duration-700">01</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-24 px-6 relative">
        <div className="max-w-7xl mx-auto bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-8 mb-16">
            <div className="flex flex-col gap-4">
                <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
                Client Feedback
                </h2>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">
                TRUSTED BY <span className="text-foreground/40">INDUSTRY LEADERS.</span>
                </h3>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                text: "Xinteck transformed our legacy infrastructure into a high-speed cloud powerhouse. Their attention to detail is unmatched.",
                author: "Sarah Jenkins",
                role: "CTO, Fintech Solutions",
              },
              {
                text: "The UI/UX design provided by Xinteck isn't just beautiful—it actually increased our conversion rate by 40% in three months.",
                author: "David Chen",
                role: "Founder, Aura Health",
              },
              {
                text: "Professional, efficient, and technically superior. Xinteck is the only team we trust for our enterprise software needs.",
                author: "Elena Rodriguez",
                role: "EVP of Ops, Global Logistics",
              },
            ].map((testimonial, i) => (
              <div 
                key={i}
                className="p-8 rounded-[10px] bg-white/50 dark:bg-background/50 border border-primary/10 hover:border-primary/30 transition-all flex flex-col gap-6 group"
              >
                <div className="text-primary/20 group-hover:text-primary transition-colors">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
                    </svg>
                </div>
                <p className="text-foreground/80 italic leading-relaxed text-lg">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex flex-col gap-1 mt-auto pt-6 border-t border-primary/5">
                  <span className="font-bold text-base">{testimonial.author}</span>
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-24 px-6 relative">
        <div className="max-w-4xl mx-auto bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <div className="text-center mb-12 md:mb-20 flex flex-col gap-4">
            <h2 className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
              Common Questions
            </h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">
              CLEAR <span className="text-foreground/40">ANSWERS.</span>
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                q: "What is your typical project timeline?",
                a: "Timelines vary depending on complexity. Small projects take 4-6 weeks, while large-scale enterprise solutions typically range from 3-6 months.",
              },
              {
                q: "Do you offer post-launch support?",
                a: "Absolutely. We provide dedicated support packages for maintenance, updates, and 24/7 monitoring to ensure 99.99% uptime.",
              },
              {
                q: "Can you work with our existing internal team?",
                a: "Yes, we often act as an extension of internal teams, providing specialized expertise in cloud architecture, DevOps, or UI/UX.",
              },
            ].map((faq, i) => (
              <div 
                key={i}
                className="group p-6 md:p-8 rounded-[10px] border border-primary/10 bg-white/50 dark:bg-secondary/5 hover:bg-white/70 dark:hover:bg-secondary/10 hover:border-primary/20 transition-all flex flex-col gap-4 cursor-pointer"
              >
                <h4 className="text-lg font-bold flex justify-between items-center text-foreground group-hover:text-primary transition-colors">
                  {faq.q}
                  <Plus className="text-primary/20 group-hover:text-primary transition-colors" />
                </h4>
                <p className="text-foreground/60 leading-relaxed max-w-2xl">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 px-6 relative overflow-hidden">
         {/* Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
         
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-8 relative z-10 bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground">
            READY TO BUILD THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">NEXT BIG THING?</span>
          </h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Our team of world-class engineers and designers are ready to bring
            your vision to life with precision and speed.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <button className="px-12 py-4 bg-primary text-black font-black rounded-[10px] shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] hover:scale-105 transition-all">
              Book a Discovery Call
            </button>
          </div>
        </div>
      </section>
    </HomeKeyframeLayout>
  );
}
