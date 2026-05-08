"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Logo from "@/components/Logo";

interface PreloaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Preloader({ message = "CRAFTING", fullScreen = true }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text glitch/flicker effect
      gsap.to(textRef.current, {
        opacity: 0.5,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        ease: "none",
        repeatDelay: 0.5 + Math.random() * 2
      });

      // Progress bar animation
      gsap.to(progressRef.current, {
        scaleX: 1,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center gap-8"
    : "w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-6 bg-black/50 backdrop-blur-sm";

  return (
    <div ref={containerRef} className={containerClasses}>
      <div className="relative">
        <Logo className="w-12 h-12 md:w-16 md:h-16 text-white" />
        <div className="absolute inset-0 bg-white/10 blur-xl rounded-full -z-10 animate-pulse" />
      </div>

      <div className="flex flex-col items-center gap-3">
        <div 
          ref={textRef}
          className="font-headline font-bold text-xl md:text-2xl tracking-[0.3em] text-white uppercase select-none"
        >
          {message}
        </div>
        
        {/* Brutalist Progress Line */}
        <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden">
          <div 
            ref={progressRef}
            className="absolute inset-0 bg-white origin-left scale-x-0"
          />
        </div>
      </div>

      <div className="font-mono text-[10px] tracking-[0.2em] text-white/20 uppercase mt-4">
        PLEASE STAND BY
      </div>
    </div>
  );
}
