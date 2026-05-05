"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Logo from "@/components/Logo";
import TextRollover from "@/components/TextRollover";
import { useAuth } from "@/hooks/useAuth";

export default function NavBar() {
  const container = useRef<HTMLElement>(null);
  const [currentDate, setCurrentDate] = useState<string>("MAY 23 2024");
  const { email, signOut } = useAuth();

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
    <nav ref={container} className="bg-background/90 backdrop-blur-md flex justify-between md:grid md:grid-cols-3 items-center w-full pl-4 md:pl-8 pr-12 md:pr-16 py-4 md:py-6 max-w-full mx-auto fixed top-0 z-50 border-b border-outline-variant">
      <div className="hidden md:block font-headline uppercase tracking-widest text-xs font-bold text-on-surface-variant nav-item opacity-0 -translate-y-5">
        {currentDate}
      </div>
      <div 
        onClick={() => (window as any).lenis?.scrollTo(0)}
        className="flex justify-center items-center gap-2 md:gap-3 justify-self-center nav-item text-on-background opacity-0 -translate-y-5 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Logo className="w-6 h-6 md:w-8 md:h-8" />
        <span className="text-lg md:text-2xl font-bold tracking-tighter font-headline">
          C O L D C R A F T
        </span>
      </div>
      <div className="flex justify-end items-center gap-4 md:gap-6 nav-item opacity-0 -translate-y-5">
        {email ? (
          <div className="flex items-center gap-4 md:gap-6">
            <span className="hidden sm:block font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
              {email}
            </span>
            <button
              onClick={async () => {
                await signOut();
                window.location.reload();
              }}
              className="font-headline uppercase tracking-widest text-xs font-bold text-on-surface-variant hover:text-on-background transition-colors"
            >
              <TextRollover text="LOG OUT" />
            </button>
          </div>
        ) : (
          <a
            className="font-headline uppercase tracking-widest text-xs font-bold text-on-surface-variant hover:text-on-background transition-colors"
            href="/login"
          >
            <TextRollover text="LOG IN" />
          </a>
        )}
      </div>
    </nav>
  );
}
