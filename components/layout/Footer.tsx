"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Web Development", href: "/services/web-development" },
    { label: "Mobile Apps", href: "/services/mobile-app-development" },
    { label: "Cloud & DevOps", href: "/services/cloud-devops" },
    { label: "UI/UX Design", href: "/services/ui-ux-design" },
    { label: "Custom Software", href: "/services/custom-software-development" },
  ],
  resources: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Case Studies", href: "/portfolio" },
    { label: "Services", href: "/services" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/xinteck", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/xinteck", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/xinteck", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com/xinteck", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="relative bg-black pt-24 pb-8 overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col gap-16">
        {/* CTA Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-16 border-b border-white/10">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95]">
              LET'S BUILD <br />
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">IMPOSSIBLE.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Ready to transform your vision into reality? Let's create something extraordinary together.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href="/contact" className="group relative">
              <div className="px-8 py-4 bg-primary rounded-[10px] flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform">
                <span className="text-lg font-black text-black whitespace-nowrap">START PROJECT</span>
                <ArrowUpRight className="text-black group-hover:rotate-45 transition-transform" size={24} />
              </div>
            </Link>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm">Or email us at</span>
              <a href="mailto:hello@xinteck.com" className="text-lg font-bold text-white hover:text-primary transition-colors">
                hello@xinteck.com
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <motion.div
                initial={{ width: "120px", borderRadius: "9999px" }}
                whileHover={{ width: "280px", borderRadius: "20px" }}
                animate={{ 
                  boxShadow: ["0 0 0px rgba(212,175,55,0.2)", "0 0 15px rgba(212,175,55,0.6)", "0 0 0px rgba(212,175,55,0.2)"],
                  borderColor: ["rgba(212,175,55,0.3)", "rgba(212,175,55,1)", "rgba(212,175,55,0.3)"]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  width: { type: "spring", stiffness: 300, damping: 20 },
                  borderRadius: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="relative border-2 border-primary p-2 bg-white/30 dark:bg-black/70 overflow-hidden h-[120px] flex items-center justify-center"
              >
                {/* Light Mode Container */}
                <div className="absolute inset-0 flex items-center justify-center dark:hidden">
                    <div className="relative w-[100px] h-[100px] transition-opacity duration-300 group-hover:opacity-0">
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
                    <div className="relative w-[100px] h-[100px] transition-opacity duration-300 group-hover:opacity-0">
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
            <p className="text-gray-400 max-w-xs leading-relaxed">
              Engineering the digital future.
            </p>
            
            {/* Contact Info */}
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:hello@xinteck.com" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                <Mail size={16} />
                hello@xinteck.com
              </a>
              <a href="tel:+15550000000" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors">
                <Phone size={16} />
                +1 (555) 000-0000
              </a>
              <span className="flex items-center gap-3 text-gray-400">
                <MapPin size={16} />
                Nairobi, Kenya
              </span>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-[10px] bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Company</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Services</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.services.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Resources</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.resources.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Legal</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Xinteck Inc. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
