"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function GetOverlaySVG() {
  const containerRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll(".get-char");

    // Same animation as HIRED: rise from below with 3D rotateX flip
    gsap.fromTo(
      chars,
      {
        y: 150,
        opacity: 0,
        rotateX: -90,
        transformOrigin: "bottom center",
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0,
      }
    );
  }, []);

  return (
    <span
      ref={containerRef}
      className="absolute pointer-events-none z-20 flex top-[-45%] left-[14%] md:top-[-38%] md:left-[20%]"
      style={{ perspective: "1000px" }}
    >
      {"Get".split("").map((char, i) => (
        <span
          key={i}
          className="get-char inline-block opacity-0 italic"
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "clamp(2.5rem, 8vw, 10rem)",
            lineHeight: 1,
            fontWeight: 900,
            color: "rgba(255, 255, 255, 0.9)",
            transformStyle: "preserve-3d",
            letterSpacing: "-0.04em",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
