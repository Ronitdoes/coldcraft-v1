"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function BentoStats() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Vertical Slides
    const slides = gsap.utils.toArray<HTMLElement>(".bento-slide");
    slides.forEach((slide) => {
      gsap.fromTo(slide, 
        { y: 100, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1.2, ease: "power4.out",
          scrollTrigger: { trigger: slide, start: "top 85%" }
        }
      );
    });

    // Speed count up
    const countEl = document.querySelector(".efficiency-count");
    if (countEl) {
      gsap.fromTo(countEl, 
        { innerHTML: 0 }, 
        {
          innerHTML: 90,
          duration: 2.5,
          snap: { innerHTML: 1 },
          ease: "power3.out",
          scrollTrigger: { trigger: container.current, start: "top 80%" }
        }
      );
    }
  }, { scope: container });

  return (
    <section ref={container} className="px-4 md:px-8 py-16 md:py-32 bg-surface-container-lowest overflow-hidden">
      <div className="bento-container max-w-7xl mx-auto grid grid-cols-12 gap-4">
        
        {/* Box 1 (White Box) */}
        <div className="bento-slide col-span-12 md:col-span-8 bg-primary text-on-primary p-6 md:p-12 flex flex-col justify-between aspect-video md:aspect-auto min-h-64 md:min-h-96 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-shadow duration-500">
          <div>
            <span className="font-headline text-xs md:text-sm font-bold tracking-widest uppercase block mb-4 md:mb-6 opacity-80">
              The Speed
            </span>
            <h4 className="font-headline text-[20vw] md:text-9xl font-black kerning-tight leading-none tracking-tighter inline-flex items-baseline">
              <span className="efficiency-count">90</span>
              <span className="text-[10vw] md:text-6xl tracking-tight ml-1">sec</span>
            </h4>
            <p className="font-body text-base md:text-xl font-bold uppercase mt-2 opacity-80">
              TO YOUR FIRST COLD MAIL.
            </p>
          </div>
          
          <p className="font-body text-sm md:text-base font-bold uppercase max-w-[280px] opacity-70 mt-auto md:self-end md:text-right md:pb-2">
            Upload resume · Fill in details · Get a personalized mail ready to send.
          </p>
        </div>

        {/* Box 2 (3x Reply Rate) */}
        <div className="bento-slide col-span-12 md:col-span-4 bg-surface-container-high p-6 md:p-12 flex flex-col justify-between min-h-64 md:h-96 group hover:bg-surface-container transition-colors duration-500">
          <span className="material-symbols-outlined text-4xl md:text-6xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 ease-out" data-icon="schedule">
            schedule
          </span>
          <div className="mt-8 md:mt-0">
            <h4 className="font-headline text-[15vw] md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-2 md:mb-4">
              3x
            </h4>
            <p className="font-headline text-lg md:text-xl font-bold uppercase tracking-widest mb-4 opacity-90">
              HIGHER REPLY RATE
            </p>
            <p className="font-body text-sm md:text-base text-on-surface-variant">
              Compared to copy-pasted generic templates sent by most applicants.
            </p>
          </div>
        </div>

        {/* Box 3 (AI Parsed) */}
        <div className="bento-slide col-span-12 md:col-span-4 bg-surface-container-high p-6 md:p-12 flex flex-col justify-between min-h-64 md:h-96 group hover:bg-surface-container transition-colors duration-500">
          <span className="material-symbols-outlined text-4xl md:text-6xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 ease-out" data-icon="alt_route">
            alt_route
          </span>
          <div className="mt-8 md:mt-0">
            <h4 className="font-headline text-[15vw] md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-2 md:mb-4">
              AI
            </h4>
            <p className="font-headline text-lg md:text-xl font-bold uppercase tracking-widest mb-4 opacity-90">
              RESUME PARSED IN 3S
            </p>
            <p className="font-body text-sm md:text-base text-on-surface-variant">
              Claude Haiku extracts your name, links, projects, and skills automatically.
            </p>
          </div>
        </div>

        {/* Box 4 (Mail Composer) */}
        <div className="bento-slide col-span-12 md:col-span-8 bg-surface-container-high p-6 md:p-12 relative overflow-hidden flex flex-col justify-between gap-4 md:gap-6 min-h-64 md:h-96 group">
          
          <div className="w-full max-w-2xl lg:ml-6 -mt-2 md:-mt-6">
            <h4 className="font-headline text-xl md:text-2xl font-bold uppercase tracking-widest opacity-40">
              MAIL COMPOSER PREVIEW
            </h4>
          </div>
          
          {/* Faux Mail UI Window */}
          <div className="relative z-10 w-full max-w-2xl bg-surface-container border border-outline-variant/30 rounded p-5 md:p-6 shadow-2xl transform transition-transform duration-700 hover:scale-[1.02] hover:-translate-y-2 lg:ml-6">
            <div className="flex flex-col gap-2 font-mono text-xs md:text-sm text-on-surface-variant mb-6 border-b border-outline-variant/30 pb-4">
              <p>TO: <span className="text-on-surface opacity-80">ronit@razorpay.com</span></p>
              <p>SUB: <span className="text-on-surface opacity-80">Frontend Intern - MUJ CSE, 2025</span></p>
            </div>
            
            <div className="flex flex-col gap-3 mb-8 opacity-40">
              <div className="h-2 w-full bg-outline-variant rounded"></div>
              <div className="h-2 w-[85%] bg-outline-variant rounded"></div>
              <div className="h-2 w-[90%] bg-outline-variant rounded"></div>
              <div className="h-2 w-[60%] bg-outline-variant rounded"></div>
            </div>
            
            <button className="bg-primary text-on-primary font-body text-xs font-bold uppercase tracking-widest py-2.5 px-6 hover:opacity-90 transition-opacity rounded flex items-center gap-2 w-max shadow-sm">
              Send via Gmail 
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
          
          {/* Subtle Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
}
