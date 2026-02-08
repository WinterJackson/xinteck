"use client";

import { useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AboutCanvas } from "./AboutCanvas";

export function AboutScrollLayout({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });
    
    // Smooth scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (latest) => {
            setProgress(latest);
        });
        return () => unsubscribe();
    }, [smoothProgress]);

    return (
        <div ref={containerRef} className="relative w-full min-h-[300vh]">
            {/* The Background - Locked to Dark/Black as per Homepage consistency */}
            <div className="fixed inset-0 w-full h-full z-[-10] bg-black">
                 {/* Dark overlay to ensure text readability */}
                 <div className="absolute inset-0 bg-black/70 z-[-1]" />
                 <AboutCanvas scrollProgress={progress} />
            </div>

            {/* The Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
