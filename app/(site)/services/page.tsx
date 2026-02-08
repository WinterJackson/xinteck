"use client";

import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { VIDEO_STATS } from "@/lib/videoStats";
import { motion } from "framer-motion";
import {
    BarChart,
    ChevronRight,
    Cloud,
    Code,
    Globe,
    Layers,
    Lock,
    Palette,
    Smartphone,
    Zap
} from "lucide-react";
import Link from "next/link";

const allServices = [
  {
    title: "Web Development",
    slug: "web-development",
    description: "High-performance websites and web applications built with the latest technologies like React, Next.js, and Node.js.",
    features: ["Custom Web Apps", "E-commerce Solutions", "Progressive Web Apps (PWAs)", "API Integration"],
    icon: Globe,
  },
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    description: "Stunning mobile experiences for iOS and Android, focusing on performance, usability, and deep system integration.",
    features: ["iOS Development", "Android Development", "React Native", "Flutter Solutions"],
    icon: Smartphone,
  },
  {
    title: "Custom Software",
    slug: "custom-software-development",
    description: "Tailor-made software solutions that address your unique business challenges and streamline operations.",
    features: ["Enterprise Software", "CRM & ERP Systems", "SaaS Development", "Legacy Modernization"],
    icon: Layers,
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description: "User-centered design that is both beautiful and functional, ensuring your products are a joy to use.",
    features: ["User Research", "Wireframing & Prototyping", "Design Systems", "Usability Testing"],
    icon: Palette,
  },
  {
    title: "Cloud & DevOps",
    slug: "cloud-devops",
    description: "Cloud-native solutions and automation that ensure your infrastructure is secure, scalable, and resilient.",
    features: ["Cloud Migration", "Infrastructure as Code", "CI/CD Pipelines", "Site Reliability Engineering"],
    icon: Cloud,
  },
];

export default function ServicesPage() {
  return (
    <VideoScrollLayout 
      videoSrc={VIDEO_STATS.services.src}
      videoStats={VIDEO_STATS.services}
    >
      <div className="flex flex-col gap-24 py-20 ">
      {/* Header Section */}
      <section className="px-6 text-center max-w-4xl mx-auto pt-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="flex flex-col gap-8 bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]"
        >
          <h1 className="text-sm font-bold tracking-[0.3em] text-gold uppercase">
            Our Capabilities
          </h1>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground">
            FULL-STACK <br />
            <span className="text-gold">EXCELLENCE.</span>
          </h2>
          <p className="text-xl text-foreground/60 leading-relaxed">
            We provide end-to-end technology solutions. From initial architectural 
            prototyping to global cloud deployment, we cover every byte of the 
            development lifecycle.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {allServices.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-4 ${
                i % 2 !== 0 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Text Card */}
              <div className={`lg:col-span-9 ${i % 2 !== 0 ? "lg:order-2" : "lg:order-1"}`}>
                <div className="h-full p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl hover:border-primary/40 transition-all shadow-lg">
                  <div className="flex flex-col gap-6 h-full">
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-lg text-foreground/60 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3 text-sm text-foreground">
                          <div className="w-2 h-2 rounded-full bg-gold shrink-0" />
                          <span className="font-semibold">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-auto pt-4 flex items-center gap-2 text-gold font-bold hover:gap-4 transition-all w-fit"
                    >
                      Explore Details <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Icon Card - Hidden on mobile */}
              <div className={`hidden lg:block lg:col-span-3 ${i % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}>
                <div className="h-full min-h-[200px] lg:min-h-full p-8 rounded-[10px] border border-primary/10 bg-black/70 dark:bg-white/20 backdrop-blur-xl hover:border-gold/40 transition-all shadow-lg flex items-center justify-center group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <service.icon 
                      size={120} 
                      className="text-gold group-hover:text-gold transition-colors" 
                      strokeWidth={1}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Icons */}
      <section className="py-24 px-6 bg-white/30 dark:bg-black/80 backdrop-blur-xl border-y border-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: Code, title: "Clean Code", desc: "Maintainable, scalable, documented." },
              { icon: Zap, title: "High Speed", desc: "Optimized for performance." },
              { icon: Lock, title: "Elite Security", desc: "Bank-grade data protection." },
              { icon: BarChart, title: "Data Driven", desc: "Built with analytics in mind." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-4 text-center items-center">
                 <div className="w-20 h-20 rounded-[10px] border border-primary/20 flex items-center justify-center text-gold mb-4 group-hover:bg-primary transition-all">
                    <item.icon size={32} />
                 </div>
                  <h4 className="font-bold text-lg text-foreground">{item.title}</h4>
                  <p className="text-sm text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Prompt */}
      <section className="px-6 mb-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-10 bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-8 md:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
            <h3 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground">
              NEED A CUSTOM <br />
              <span className="text-gold">TECH SOLUTION?</span>
            </h3>
            <Link 
              href="/contact"
              className="px-12 py-2 bg-foreground text-background font-black text-xl rounded-[10px] hover:bg-gold-hover transition-all mx-auto"
            >
              Contact Our Engineers
            </Link>
        </div>
      </section>
    </div>
    </VideoScrollLayout>
  );
}
