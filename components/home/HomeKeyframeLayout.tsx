"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface HomeKeyframeLayoutProps {
  children: React.ReactNode;
}

// Home UI keyframe stats
const KEYFRAME_STATS = {
  imagesDir: "/images/home-ui",
  frameCount: 121,
  filePrefix: "ezgif-frame-",
  fileExtension: ".png",
};

const getFrameSrc = (frameIndex: number) => {
  const frameNum = String(frameIndex + 1).padStart(3, "0");
  return `${KEYFRAME_STATS.imagesDir}/${KEYFRAME_STATS.filePrefix}${frameNum}${KEYFRAME_STATS.fileExtension}`;
};

export function HomeKeyframeLayout({ children }: HomeKeyframeLayoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(KEYFRAME_STATS.frameCount).fill(null));
  const loadedRef = useRef<boolean[]>(new Array(KEYFRAME_STATS.frameCount).fill(false));
  const currentFrameRef = useRef(0);
  const [isMounted, setIsMounted] = useState(false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  // SSR safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load a single frame
  const loadFrame = useCallback((index: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (loadedRef.current[index] && imagesRef.current[index]) {
        resolve(imagesRef.current[index]!);
        return;
      }

      const img = new Image();
      img.onload = () => {
        imagesRef.current[index] = img;
        loadedRef.current[index] = true;
        resolve(img);
      };
      img.onerror = reject;
      img.src = getFrameSrc(index);
    });
  }, []);

  // Find nearest loaded frame
  const findNearestLoadedFrame = useCallback((targetIndex: number): number => {
    // Check exact frame first
    if (loadedRef.current[targetIndex]) return targetIndex;
    
    // Search outward from target
    for (let offset = 1; offset < KEYFRAME_STATS.frameCount; offset++) {
      if (targetIndex - offset >= 0 && loadedRef.current[targetIndex - offset]) {
        return targetIndex - offset;
      }
      if (targetIndex + offset < KEYFRAME_STATS.frameCount && loadedRef.current[targetIndex + offset]) {
        return targetIndex + offset;
      }
    }
    return 0;
  }, []);

  // Progressive loading strategy
  useEffect(() => {
    if (!isMounted) return;

    // 1. Load first frame immediately (critical)
    loadFrame(0).then(() => setFirstFrameReady(true));

    // 2. Load last frame (for scroll end)
    loadFrame(KEYFRAME_STATS.frameCount - 1);

    // 3. Load keyframes at 25%, 50%, 75% for quick coverage
    const keyframes = [30, 60, 90];
    keyframes.forEach((i) => loadFrame(i));

    // 4. Load remaining frames in background using requestIdleCallback
    let cancelled = false;
    const loadRemaining = async () => {
      for (let i = 0; i < KEYFRAME_STATS.frameCount; i++) {
        if (cancelled) break;
        if (!loadedRef.current[i]) {
          await loadFrame(i);
          // Small delay to prevent blocking
          await new Promise((r) => setTimeout(r, 10));
        }
      }
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(() => loadRemaining());
    } else {
      setTimeout(loadRemaining, 100);
    }

    return () => {
      cancelled = true;
    };
  }, [isMounted, loadFrame]);

  // Draw frame to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Find actual frame to draw (nearest loaded if target not ready)
    const actualIndex = findNearestLoadedFrame(frameIndex);
    const img = imagesRef.current[actualIndex];
    if (!img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate cover sizing
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // If we drew a fallback, try to load the actual frame
    if (actualIndex !== frameIndex && !loadedRef.current[frameIndex]) {
      loadFrame(frameIndex).then(() => {
        // Redraw if we're still on this frame
        if (currentFrameRef.current === frameIndex) {
          drawFrame(frameIndex);
        }
      });
    }
  }, [findNearestLoadedFrame, loadFrame]);

  // Scroll handler
  useEffect(() => {
    if (!isMounted || !firstFrameReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Draw first frame immediately
    drawFrame(0);

    const onScroll = () => {
      const scrollY = Math.max(0, window.scrollY);
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      
      // Calculate frame index (0 to frameCount - 1)
      const frameIndex = Math.round(progress * (KEYFRAME_STATS.frameCount - 1));
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    };

    const onResize = () => {
      resizeCanvas();
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isMounted, firstFrameReady, drawFrame]);

  return (
    <div className="relative w-full min-h-[300vh]">
      {/* Canvas Background */}
      <div className="fixed inset-0 w-full h-full z-[-10] bg-black">
        <div className="absolute inset-0 bg-black/30 z-[1]" />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: firstFrameReady ? 0.85 : 0 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
