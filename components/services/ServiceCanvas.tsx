"use client";

import { useEffect, useRef, useState } from "react";

interface ServiceCanvasProps {
  scrollProgress: number; // 0 to 1
  frameCount: number;
  imagesDir: string;
}

export function ServiceCanvas({ scrollProgress, frameCount, imagesDir }: ServiceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images
  // Preload images safely (Sequential with batching to prevent network overload)
  useEffect(() => {
    if (imagesLoaded) return; // Prevent re-running if already done

    const loadedImages = new Array(frameCount).fill(null);
    let loadedCount = 0;
    let isMounted = true;

    const loadImage = (index: number) => {
      if (!isMounted) return;
      
      const img = new Image();
      const pad = (index + 1).toString().padStart(3, "0");
      img.src = `${imagesDir}ezgif-frame-${pad}.png?v=1`;
      
      img.onload = () => {
        if (!isMounted) return;
        loadedImages[index] = img;
        loadedCount++;
        
        // Update state periodically or when done
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setImagesLoaded(true);
        } else if (loadedCount % 10 === 0) {
           // Optional: update progress state if we want to show a loader
           setImages(prev => {
             const newImages = [...prev];
             newImages[index] = img;
             return newImages;
           });
        }
        
        // Load next
        if (index + 1 < frameCount) {
           loadImage(index + 1);
        }
      };

      img.onerror = () => {
         console.error(`Failed to load frame ${index + 1}`);
         // Skip to next even on error to avoid hanging
         if (index + 1 < frameCount) {
           loadImage(index + 1);
         }
      }
    };

    // Start loading the first batch (e.g., 3 parallel streams)
    const concurrency = 3;
    for (let i = 0; i < Math.min(concurrency, frameCount); i++) {
        // We need to space out the starting points or just have multiple workers picking from a queue.
        // Simple approach: Start 0, 1, 2... and let them chain.
        // Actually, the simple recursive approach above chains 0 -> 1 -> 2.
        // To have concurrency, we could technically start loadImage(0), loadImage(frameCount/3), etc.
        // But for safety, let's just do purely sequential for now to 100% fix the "connection reset".
        // Or simple parallel start:
    }
    
    // Starting just one stream for absolute safety
    loadImage(0);

    return () => {
      isMounted = false;
    };
  }, [frameCount, imagesDir]);

  // Draw Logic
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor(scrollProgress * frameCount)
    );
    
    // New loading strategy might leave gaps initially, though sequential shouldn't.
    // Safe check:
    if (!images[frameIndex]) return;
    
    const currentImage = images[frameIndex];
    if (!currentImage) return;

    const draw = () => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = currentImage.width;
      const ih = currentImage.height;
      
      const scale = Math.max(cw / iw, ch / ih);
      const w = iw * scale;
      const h = ih * scale;
      const x = (cw - w) / 2;
      const y = (ch - h) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(currentImage, x, y, w, h);
    };

    requestAnimationFrame(draw);
  }, [scrollProgress, imagesLoaded, images, frameCount]);

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
