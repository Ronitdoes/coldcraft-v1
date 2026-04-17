"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { playHoverSound, playClickSound } from "@/lib/sounds";
import TextRollover from "@/components/TextRollover";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function JoinCore() {
  const container = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

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

        <button
          onMouseEnter={() => {
            playHoverSound();
            setIsHovered(true);
          }}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={playClickSound}
          className="bg-white text-black px-8 py-6 md:px-12 md:py-8 transition-all duration-300 hover:bg-gray-200 active:scale-95 group shadow-xl flex flex-col items-center justify-center min-w-[280px] md:min-w-[400px] rounded-xl hover:scale-105 hover:shadow-2xl relative z-10"
        >
          <span className="block font-headline font-bold text-2xl md:text-3xl mb-1">
            Write my cold mail
          </span>
          <span className="block font-body text-base md:text-lg opacity-70 font-medium flex items-center gap-2">
            <TextRollover text="Internship / Full-time" trigger={isHovered} />
            <span className="relative overflow-hidden inline-flex items-center justify-center">
              <span className="material-symbols-outlined text-xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
                arrow_forward
              </span>
              <span className="material-symbols-outlined text-xl absolute transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] -translate-x-[150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0">
                arrow_forward
              </span>
            </span>
          </span>
        </button>

        <a
          onMouseEnter={playHoverSound}
          onMouseDown={playClickSound}
          className="mt-6 md:mt-8 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
          href="#"
        >
          ALREADY HAVE AN ACCOUNT? <span className="font-bold">LOG IN</span>
        </a>
      </div>
    </section>
  );
}
