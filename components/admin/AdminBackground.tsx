"use client";

import NextImage from "next/image";
import { useEffect } from "react";



export function AdminBackground() {
  // Force transparent body background for Admin pages to reveal the fixed background image
  // This overrides the global 'bg-background' which would otherwise block the image
  useEffect(() => {
    document.body.style.backgroundColor = "transparent";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* HD Creative Background (The Quantum Circuit) */}
      <div className="absolute inset-0">
        <NextImage
          src="/admin-bg/circuit.png"
          alt="Admin Background"
          fill
          priority
          quality={100}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 z-[1]" /> {/* Consistent Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-transparent to-black/90 z-[2]" /> {/* Consistent Vignette */}
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}
