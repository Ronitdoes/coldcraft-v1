"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Marquee() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(".marquee-content", {
      xPercent: -100,
      repeat: -1,
      duration: 40,
      ease: "linear"
    });
  }, { scope: container });

  return (
    <div ref={container} className="marquee-wrapper overflow-hidden whitespace-nowrap bg-black text-white/80 py-6 border-y border-[#222] flex shadow-inner">
      {[1, 2, 3].map((_, idx) => (
        <div key={idx} className="marquee-content flex font-headline text-2xl md:text-4xl font-black uppercase tracking-widest px-4 gap-8">
          {["NO MORE GHOSTING", "MORE REPLIES", "BETTER COLD MAILS", "MADE EASIER WITH COLDCRAFT"].map((text, i) => (
            <span key={i} className="flex gap-8">
              <span>{text}</span> <span>&mdash;</span>
            </span>
          ))}
          {["NO MORE GHOSTING", "MORE REPLIES", "BETTER COLD MAILS", "MADE EASIER WITH COLDCRAFT"].map((text, i) => (
            <span key={`clone-${i}`} className="flex gap-8">
              <span>{text}</span> <span>&mdash;</span>
            </span>
          ))}
          {["NO MORE GHOSTING", "MORE REPLIES", "BETTER COLD MAILS", "MADE EASIER WITH COLDCRAFT"].map((text, i) => (
            <span key={`clone2-${i}`} className="flex gap-8">
              <span>{text}</span> <span>&mdash;</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
