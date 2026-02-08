"use client";

import { useEffect, useRef, useState } from "react";

interface AboutCanvasProps {
  scrollProgress: number; // 0 to 1
}

const FRAME_COUNT = 192;
const IMAGES_DIR = "/images/about-ui/";
const IMAGE_NAME_TEMPLATE = "ezgif-frame-"; // e.g. ezgif-frame-001.jpg

export function AboutCanvas({ scrollProgress }: AboutCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];
    const totalFrames = FRAME_COUNT;

    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        // Format: 001, 002, ... 240
        const pad = i.toString().padStart(3, "0");
        // Add cache buster to force reload if needed (matching homepage pattern)
        img.src = `${IMAGES_DIR}${IMAGE_NAME_TEMPLATE}${pad}.png?v=1`;
        
        img.onload = () => {
          loadedCount++;
          if (loadedCount >= totalFrames) {
             setImagesLoaded(true);
          }
        };
        loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Draw Logic
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate frame index
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(scrollProgress * FRAME_COUNT)
    );
    
    // Safety check
    const currentImage = images[frameIndex];
    if (!currentImage) return;

    // Responsive "Cover" fit (Background style)
    const draw = () => {
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = currentImage.width;
        const ih = currentImage.height;
        
        // Use max to cover
        const scale = Math.max(cw / iw, ch / ih);
        const w = iw * scale;
        const h = ih * scale;
        const x = (cw - w) / 2;
        const y = (ch - h) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(currentImage, x, y, w, h);
    };

    requestAnimationFrame(draw);

  }, [scrollProgress, imagesLoaded, images]);

  // Handle Resize
  useEffect(() => {
      const handleResize = () => {
          if (canvasRef.current) {
              canvasRef.current.width = window.innerWidth;
              canvasRef.current.height = window.innerHeight;
          }
      };
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] opacity-60"
    />
  );
}
