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
    : "absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/80 backdrop-blur-sm rounded-none";

  return (
    <div ref={containerRef} className={containerClasses}>
      <div className="relative">
        <Logo className="w-10 h-10 md:w-12 md:h-12 text-white" />
        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full -z-10 animate-pulse" />
      </div>

      <div className="flex flex-col items-center gap-3 px-6 w-full">
        <div 
          ref={textRef}
          className="font-headline font-bold text-xs md:text-sm tracking-[0.3em] text-white uppercase select-none text-center leading-tight"
        >
          {message}
        </div>
        
        {/* Brutalist Progress Line */}
        <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
          <div 
            ref={progressRef}
            className="absolute inset-0 bg-white origin-left scale-x-0"
          />
        </div>
      </div>

      <div className="font-mono text-[9px] tracking-[0.2em] text-white/20 uppercase mt-2">
        PLEASE STAND BY
      </div>
    </div>
  );
}
