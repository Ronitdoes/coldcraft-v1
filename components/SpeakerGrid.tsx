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
            THE PROBLEM
          </h3>
          <div className="flex flex-col items-end text-right">
            <span className="font-headline font-bold text-lg md:text-2xl uppercase tracking-tight">
              WHY YOU'RE BEING IGNORED
            </span>
            <span className="font-body text-xs md:text-sm tracking-widest opacity-50 uppercase mt-1">
              Cold Truths
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-outline-variant">
          {/* Speaker 1 */}
          <div className="speaker-card aspect-[4/5] md:aspect-square bg-surface-container-low p-6 md:p-8 border-r border-b border-outline-variant group hover:bg-primary transition-colors duration-500 will-change-transform">
            <div className="flex flex-col h-full group-hover:text-on-primary">
              <span className="font-headline text-4xl font-bold opacity-30 md:opacity-100 flex-shrink-0 mb-8 md:mb-12">01</span>
              <h4 className="font-headline text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mt-auto pb-6 md:pb-8 transform group-hover:translate-x-2 transition-transform duration-300">
                73% of cold mails never get opened.
              </h4>
              <div className="h-[120px] md:h-[140px] flex-shrink-0 border-t border-outline-variant/30 pt-6">
                <p className="font-body text-sm opacity-60 uppercase tracking-widest transform group-hover:translate-x-2 transition-transform duration-300 delay-75 leading-relaxed">
                  Your subject line is the real interview. Most candidates fail before the recruiter reads a word.
                </p>
              </div>
            </div>
          </div>
          {/* Speaker 2 */}
          <div className="speaker-card aspect-[4/5] md:aspect-square bg-surface-container-high p-6 md:p-8 border-r border-b border-outline-variant group hover:bg-primary transition-colors duration-500 will-change-transform">
            <div className="flex flex-col h-full group-hover:text-on-primary">
              <span className="font-headline text-4xl font-bold opacity-30 md:opacity-100 flex-shrink-0 mb-8 md:mb-12">02</span>
              <h4 className="font-headline text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mt-auto pb-6 md:pb-8 transform group-hover:translate-x-2 transition-transform duration-300">
                Recruiters decide in 8 seconds.
              </h4>
              <div className="h-[120px] md:h-[140px] flex-shrink-0 border-t border-outline-variant/30 pt-6">
                <p className="font-body text-sm opacity-60 uppercase tracking-widest transform group-hover:translate-x-2 transition-transform duration-300 delay-75 leading-relaxed">
                  Most mails get deleted before the second line. Generic openers kill your chances instantly.
                </p>
              </div>
            </div>
          </div>
          {/* Speaker 3 */}
          <div className="speaker-card aspect-[4/5] md:aspect-square bg-surface-container-low p-6 md:p-8 border-r border-b border-outline-variant group hover:bg-primary transition-colors duration-500 will-change-transform">
            <div className="flex flex-col h-full group-hover:text-on-primary">
              <span className="font-headline text-4xl font-bold opacity-30 md:opacity-100 flex-shrink-0 mb-8 md:mb-12">03</span>
              <h4 className="font-headline text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mt-auto pb-6 md:pb-8 transform group-hover:translate-x-2 transition-transform duration-300">
                Generic mails<br />sent = no replies.
              </h4>
              <div className="h-[120px] md:h-[140px] flex-shrink-0 border-t border-outline-variant/30 pt-6">
                <p className="font-body text-sm opacity-60 uppercase tracking-widest transform group-hover:translate-x-2 transition-transform duration-300 delay-75 leading-relaxed">
                  Personalization is what gets you in the door. One good mail beats ten copy-pasted ones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
