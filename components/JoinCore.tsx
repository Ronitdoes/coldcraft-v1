"use client";

import { useRef } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import TextRollover from "@/components/TextRollover";

export default function JoinCore() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".core-bg-text",
      { y: 100 },
      {
        y: -100,
        ease: "none",
        scrollTrigger: { trigger: container.current, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="join-core-section py-32 md:py-64 px-4 md:px-8 bg-black text-white text-center flex flex-col items-center justify-center overflow-hidden relative">
      <h2 className="core-bg-text font-headline text-[16vw] md:text-[11vw] font-black leading-[0.85] mb-8 md:mb-12 kerning-tight opacity-20 pointer-events-none mix-blend-overlay absolute w-full">
        STOP GETTING<br />GHOSTED.
      </h2>
      <h2 className="core-bg-text font-headline text-[16vw] md:text-[11vw] font-black leading-[0.85] mb-8 md:mb-12 kerning-tight relative z-10 w-full">
        STOP GETTING<br />GHOSTED.
      </h2>

      <div className="flex flex-col items-center gap-4 relative z-20 mt-8 md:mt-12">
        <p className="font-headline text-lg md:text-2xl font-bold uppercase tracking-widest opacity-80 mb-4 md:mb-8">
          YOUR NEXT REPLY IS ONE MAIL AWAY
        </p>

        <PrimaryButton title="Write my cold mail" subtitle="Internship / Full-time" />

        <a
          className="mt-6 md:mt-8 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
          href="#"
        >
          ALREADY HAVE AN ACCOUNT? <span className="font-bold">LOG IN</span>
        </a>
      </div>
    </section>
  );
}
