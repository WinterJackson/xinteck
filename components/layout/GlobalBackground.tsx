"use client";

import NextImage from "next/image";

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* HD Creative Background (The Quantum Circuit) */}
      <div className="absolute inset-0">
        <NextImage
          src="/admin-bg/circuit.png"
          alt="Global Background"
          fill
          priority
          quality={100}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 z-[1]" /> {/* Reduced Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/80 z-[2]" /> {/* Vignette */}
      </div>
      
      {/* Grid overlay for tech feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}
