"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CustomScrollbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(100);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  const thumbRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isMounted && containerRef.current) {
      gsap.to(containerRef.current,
        { x: 0, opacity: 1, duration: 1.2, delay: 1.5, ease: "power4.out" }
      );
    }
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);
    let animationFrameId: number;
    let currentProgress = 0;

    const renderLoop = () => {
      // Synchronous layout bypass directly hooked into the GSAP rendering pipeline
      if (thumbRef.current) {
        // Source directly from the Lenis virtual instance if available for frame-perfect sync
        const lenisInst = (window as any).lenis;
        const winScroll = lenisInst ? lenisInst.scroll : (document.documentElement.scrollTop || document.body.scrollTop);
        
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
          currentProgress = winScroll / height;
          setScrollProgress(currentProgress); // Keep state synced
          
          const thumbH = Math.max(60, window.innerHeight * (window.innerHeight / document.body.scrollHeight));
          const topOffset = currentProgress * (window.innerHeight - Math.max(thumbH, 140));
          thumbRef.current.style.transform = `translateY(${topOffset}px)`;
        }
      }
    };

    gsap.ticker.add(renderLoop);

    const handleScrollEvent = () => {
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 700);
    };

    const handleResize = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      const heightRatio = winHeight / docHeight;
      setThumbHeight(Math.max(60, winHeight * heightRatio));
    };

    window.addEventListener("scroll", handleScrollEvent, { passive: true });
    window.addEventListener("resize", handleResize);
    
    setTimeout(handleResize, 100);

    return () => {
      gsap.ticker.remove(renderLoop);
      window.removeEventListener("scroll", handleScrollEvent);
      window.removeEventListener("resize", handleResize);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    const startY = e.clientY;
    const startProgress = scrollProgress;
    
    const handlePointerMove = (evt: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaY = evt.clientY - startY;
      
      const trackHeight = window.innerHeight;
      const scrollableTrackHeight = trackHeight - thumbHeight;
      
      if (scrollableTrackHeight > 0) {
        const progressDelta = deltaY / scrollableTrackHeight;
        let newProgress = startProgress + progressDelta;
        newProgress = Math.max(0, Math.min(1, newProgress)); // Clamp 0-1
        
        setScrollProgress(newProgress);
        
        const docScrollableHeight = document.body.scrollHeight - window.innerHeight;
        const targetScroll = newProgress * docScrollableHeight;
        
        window.scrollTo({
          top: targetScroll,
          behavior: 'instant'
        });
      }
    };
    
    const handlePointerUp = () => {
      isDragging.current = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 700);
    };
    
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  if (!isMounted) return null;

  return (
    <div ref={containerRef} className="fixed top-0 right-0 h-screen w-[40px] pointer-events-none z-[9999] mix-blend-difference hidden md:block opacity-0 translate-x-[50px]">
      <div 
        ref={thumbRef}
        className={`absolute top-0 right-0 bg-white pointer-events-auto cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden origin-right will-change-transform
          ${isScrolling ? "w-[6px] rounded-none mr-2 opacity-80" : "w-[36px] rounded-none mr-0 opacity-100"}
        `}
        style={{
          height: `${Math.max(thumbHeight, 140)}px`,
          transitionProperty: "width, margin, border-radius, opacity",
          transitionDuration: "500ms",
          transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)"
        }}
        onPointerDown={handlePointerDown}
      >
        <div 
          className={`whitespace-nowrap font-headline font-black text-[14px] kerning-tight uppercase text-black transition-opacity duration-300 select-none
            ${isScrolling ? "opacity-0" : "opacity-100"}
          `}
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          ● C O L D C R A F T
        </div>
      </div>
    </div>
  );
}
