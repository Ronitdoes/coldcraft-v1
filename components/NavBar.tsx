"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "@/components/Logo";
import { playHoverSound, playClickSound } from "@/lib/sounds";

export default function NavBar() {
  const container = useRef<HTMLElement>(null);
  const [currentDate, setCurrentDate] = useState<string>("MAY 23 2024");

  useEffect(() => {
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const now = new Date();
    setCurrentDate(`${months[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`);
  }, []);

  useGSAP(() => {
    gsap.fromTo(".nav-item",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 1.2 }
    );
  }, { scope: container });

  return (
    <nav ref={container} className="bg-[#131313]/90 backdrop-blur-md flex justify-between md:grid md:grid-cols-3 items-center w-full pl-4 md:pl-8 pr-12 md:pr-16 py-4 md:py-6 max-w-full mx-auto fixed top-0 z-50 border-b border-[#333]">
      <div className="hidden md:block font-headline uppercase tracking-widest text-xs font-bold text-[#d4d4d4] nav-item opacity-0 -translate-y-5">
        {currentDate}
      </div>
      <div className="flex justify-center items-center gap-2 md:gap-3 justify-self-center nav-item text-[#ffffff] opacity-0 -translate-y-5">
        <Logo className="w-6 h-6 md:w-8 md:h-8" />
        <span className="text-lg md:text-2xl font-bold tracking-tighter font-headline">
          C O L D C R A F T
        </span>
      </div>
      <div className="flex justify-end items-center gap-4 md:gap-6 nav-item opacity-0 -translate-y-5">
        <a
          className="hidden sm:block font-headline uppercase tracking-widest text-xs font-bold text-[#d4d4d4] hover:text-[#ffffff] transition-colors"
          href="#"
          onMouseEnter={playHoverSound}
          onMouseDown={playClickSound}
        >
          LOG IN
        </a>
        <button
          onMouseEnter={playHoverSound}
          onMouseDown={playClickSound}
          className="bg-white text-black px-4 py-2 md:px-6 md:py-2 font-headline font-bold uppercase text-[10px] md:text-xs tracking-widest hover:opacity-90 transition-all flex items-center gap-1 md:gap-2 rounded-md hover:scale-105 hover:shadow-lg group"
        >
          WRITE MY COLD MAIL
          <span className="relative overflow-hidden inline-flex items-center justify-center">
            <span className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
              →
            </span>
            <span className="absolute transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] -translate-x-[150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0">
              →
            </span>
          </span>
        </button>
      </div>
    </nav>
  );
}
