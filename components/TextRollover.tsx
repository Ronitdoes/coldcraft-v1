"use client";

import { useRef, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface TextRolloverProps {
  text: string;
  className?: string;
  stagger?: number;
  duration?: number;
  trigger?: boolean; // Optional external trigger
}

export default function TextRollover({ 
  text, 
  className = "", 
  stagger = 0.015,
  duration = 0.45,
  trigger
}: TextRolloverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const charsCloneRef = useRef<HTMLElement[]>([]);

  useGSAP(() => {
    charsRef.current = gsap.utils.toArray<HTMLElement>(".roll-char", containerRef.current);
    charsCloneRef.current = gsap.utils.toArray<HTMLElement>(".roll-char-clone", containerRef.current);

    const handleMouseEnter = () => {
      gsap.killTweensOf([charsRef.current, charsCloneRef.current]);
      gsap.to(charsRef.current, { yPercent: -100, stagger: stagger, duration: duration, ease: "power3.out" });
      gsap.to(charsCloneRef.current, { yPercent: -100, stagger: stagger, duration: duration, ease: "power3.out" });
    };

    const handleMouseLeave = () => {
      gsap.killTweensOf([charsRef.current, charsCloneRef.current]);
      gsap.set(charsRef.current, { yPercent: 0 });
      gsap.set(charsCloneRef.current, { yPercent: 0 });
    };

    // If no external trigger is provided, use internal listeners
    if (trigger === undefined) {
      const currentContainer = containerRef.current;
      currentContainer?.addEventListener("mouseenter", handleMouseEnter);
      currentContainer?.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        currentContainer?.removeEventListener("mouseenter", handleMouseEnter);
        currentContainer?.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, { scope: containerRef, dependencies: [trigger] });

  // Handle external trigger updates
  useEffect(() => {
    if (trigger === undefined) return;

    if (trigger) {
      gsap.killTweensOf([charsRef.current, charsCloneRef.current]);
      gsap.to(charsRef.current, { yPercent: -100, stagger: stagger, duration: duration, ease: "power3.out" });
      gsap.to(charsCloneRef.current, { yPercent: -100, stagger: stagger, duration: duration, ease: "power3.out" });
    } else {
      gsap.killTweensOf([charsRef.current, charsCloneRef.current]);
      gsap.set(charsRef.current, { yPercent: 0 });
      gsap.set(charsCloneRef.current, { yPercent: 0 });
    }
  }, [trigger, stagger, duration]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden inline-block ${className}`}
    >
      <div className="flex relative z-10">
        {text.split("").map((char, i) => (
          <span key={i} className="roll-char inline-block whitespace-pre">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
      <div className="flex absolute top-full left-0 z-10 w-full">
        {text.split("").map((char, i) => (
          <span key={i} className="roll-char-clone inline-block whitespace-pre">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}
