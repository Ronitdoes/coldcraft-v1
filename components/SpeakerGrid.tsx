"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function SpeakerGrid() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Header vert-slide
    gsap.fromTo(".speaker-header", 
      { y: 100, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 1.2, ease: "power4.out",
        scrollTrigger: { trigger: ".speaker-header", start: "top 85%" }
      }
    );

    // Cards reveal
    const cards = gsap.utils.toArray<HTMLElement>(".speaker-card");
    cards.forEach((card, i) => {
      gsap.fromTo(card, 
        { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: 75 },
        { 
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
          y: 0,
          duration: 1.4, 
          ease: "power4.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          delay: (i % 3) * 0.15
        }
      );
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-16 md:py-32 px-4 md:px-8 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto perspective-[1200px]">
         <div className="flex justify-between items-end mb-12 md:mb-24 border-b border-outline-variant pb-4 md:pb-8 speaker-header">
          <h3 className="font-headline text-4xl md:text-7xl font-black tracking-tighter uppercase relative">
            THE CORE
          </h3>
          <span className="font-body text-xs md:text-sm tracking-widest opacity-50 uppercase">
            Featured Voices
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-outline-variant">
          {/* Speaker 1 */}
          <div className="speaker-card aspect-square bg-surface-container-low p-6 md:p-8 border-r border-b border-outline-variant group hover:bg-primary transition-colors duration-500 will-change-transform">
            <div className="flex flex-col h-full justify-between group-hover:text-on-primary">
              <span className="font-headline text-4xl font-bold">01</span>
              <div className="overflow-hidden">
                <h4 className="font-headline text-2xl font-bold uppercase tracking-tight transform group-hover:translate-x-2 transition-transform duration-300">
                  KARA NIELSEN
                </h4>
                <p className="font-body text-sm opacity-60 uppercase tracking-widest mt-2 transform group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  Principal Architect / Vercel
                </p>
              </div>
            </div>
          </div>
          {/* Speaker 2 */}
          <div className="speaker-card aspect-square bg-surface-container-high p-6 md:p-8 border-r border-b border-outline-variant group hover:bg-primary transition-colors duration-500 will-change-transform">
            <div className="flex flex-col h-full justify-between group-hover:text-on-primary">
              <span className="font-headline text-4xl font-bold">02</span>
              <div className="overflow-hidden">
                <h4 className="font-headline text-2xl font-bold uppercase tracking-tight transform group-hover:translate-x-2 transition-transform duration-300">
                  MARCUS VOLL
                </h4>
                <p className="font-body text-sm opacity-60 uppercase tracking-widest mt-2 transform group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  SRE Lead / Stripe
                </p>
              </div>
            </div>
          </div>
          {/* Speaker 3 */}
          <div className="speaker-card aspect-square bg-surface-container-low p-6 md:p-8 border-r border-b border-outline-variant group hover:bg-primary transition-colors duration-500 will-change-transform">
            <div className="flex flex-col h-full justify-between group-hover:text-on-primary">
              <span className="font-headline text-4xl font-bold">03</span>
              <div className="overflow-hidden">
                <h4 className="font-headline text-2xl font-bold uppercase tracking-tight transform group-hover:translate-x-2 transition-transform duration-300">
                  ELARA KOSS
                </h4>
                <p className="font-body text-sm opacity-60 uppercase tracking-widest mt-2 transform group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  Director of Infra / Figma
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
