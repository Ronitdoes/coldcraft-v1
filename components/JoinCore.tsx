"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function JoinCore() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".core-bg-text", 
      { y: 100 },
      { 
        y: -100, ease: "none", 
        scrollTrigger: { trigger: container.current, start: "top bottom", end: "bottom top", scrub: true } 
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="join-core-section py-32 md:py-64 px-4 md:px-8 bg-black text-white text-center flex flex-col items-center justify-center overflow-hidden relative">
      <h2 className="core-bg-text font-headline text-[15vw] font-black leading-none mb-8 md:mb-12 kerning-tight whitespace-nowrap opacity-20 pointer-events-none mix-blend-overlay absolute">
        JOIN THE CORE
      </h2>
      <h2 className="core-bg-text font-headline text-[15vw] font-black leading-none mb-8 md:mb-12 kerning-tight whitespace-nowrap relative z-10">
        JOIN THE CORE
      </h2>
      <div className="flex flex-col items-center gap-4 relative z-20">
        <button className="bg-[#e2e2e2] text-black px-12 py-6 md:px-24 md:py-10 transition-all duration-300 hover:bg-white active:scale-95 group shadow-lg rounded-lg hover:scale-105 hover:shadow-2xl">
          <span className="block font-headline font-bold text-2xl md:text-4xl mb-2 flex items-center justify-center gap-2">
            Get Tickets
            <div className="relative overflow-hidden flex items-center justify-center h-6 w-6 md:h-8 md:w-8">
              <span className="material-symbols-outlined text-2xl md:text-4xl transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
                arrow_forward
              </span>
              <span className="material-symbols-outlined text-2xl md:text-4xl absolute transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] -translate-x-[150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0">
                arrow_forward
              </span>
            </div>
          </span>
          <span className="block font-body text-base md:text-xl opacity-70 font-medium">
            In-person / Virtual
          </span>
        </button>
        <a
          className="mt-8 font-headline text-sm tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
          href="#"
        >
          ALREADY REGISTERED?{" "}
          <span className="font-bold border-b border-white hover:border-transparent transition-colors duration-300">LOG IN</span>
        </a>
      </div>
    </section>
  );
}
