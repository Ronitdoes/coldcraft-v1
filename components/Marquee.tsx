"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Marquee() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(".marquee-content", {
      xPercent: -100,
      repeat: -1,
      duration: 15,
      ease: "linear"
    });
  }, { scope: container });

  return (
    <div ref={container} className="marquee-wrapper overflow-hidden whitespace-nowrap bg-black text-white/80 py-6 border-y border-[#222] flex shadow-inner">
      {[1, 2, 3].map((_, idx) => (
        <div key={idx} className="marquee-content flex font-headline text-2xl md:text-4xl font-black uppercase tracking-widest px-4 gap-8">
          <span>COLDCRAFT</span> <span>&mdash;</span> <span>BERLIN</span> <span>&mdash;</span> <span>2024</span> <span>&mdash;</span>
          <span>COLDCRAFT</span> <span>&mdash;</span> <span>BERLIN</span> <span>&mdash;</span> <span>2024</span> <span>&mdash;</span>
          <span>COLDCRAFT</span> <span>&mdash;</span> <span>BERLIN</span> <span>&mdash;</span> <span>2024</span> <span>&mdash;</span>
        </div>
      ))}
    </div>
  );
}
