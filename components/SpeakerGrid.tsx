"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const SPEAKERS = [
  {
    id: "01",
    title: "73% of cold mails never get opened.",
    desc: "Your subject line is the real interview. Most candidates fail before the recruiter reads a word.",
    bgClass: "bg-surface-container-low",
  },
  {
    id: "02",
    title: "Recruiters decide in 8 seconds.",
    desc: "Most mails get deleted before the second line. Generic openers kill your chances instantly.",
    bgClass: "bg-surface-container-high",
  },
  {
    id: "03",
    title: (
      <>
        Generic mails<br />sent = no replies.
      </>
    ),
    desc: "Personalization is what gets you in the door. One good mail beats ten copy-pasted ones.",
    bgClass: "bg-surface-container-low",
  },
];

export default function SpeakerGrid() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".speaker-header",
      { y: 100, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.2, ease: "power4.out",
        scrollTrigger: {
          trigger: ".speaker-header",
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      }
    );

    const cards = gsap.utils.toArray<HTMLElement>(".speaker-card");
    gsap.fromTo(cards,
      { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: 75 },
      {
        clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
        y: 0,
        duration: 1.4,
        ease: "power4.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".speaker-grid",
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="pt-8 pb-16 md:pt-16 md:pb-32 px-4 md:px-8 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto perspective-[1200px]">
        <div className="flex justify-between items-end mb-12 md:mb-24 border-b border-outline-variant pb-4 md:pb-8 speaker-header">
          <h3 className="font-headline text-4xl md:text-7xl font-black tracking-tighter uppercase relative">
            THE PROBLEM
          </h3>
          <div className="flex flex-col items-end text-right">
            <span className="font-headline font-bold text-lg md:text-2xl uppercase tracking-tight">
              WHY YOU&apos;RE BEING IGNORED
            </span>
            <span className="font-body text-xs md:text-sm tracking-widest opacity-50 uppercase mt-1">
              Cold Truths
            </span>
          </div>
        </div>
        <div className="speaker-grid grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-outline-variant">
          {SPEAKERS.map((speaker) => (
            <div key={speaker.id} className={`speaker-card aspect-[4/5] md:aspect-square ${speaker.bgClass} p-6 md:p-8 border-r border-b border-outline-variant group hover:bg-primary transition-colors duration-500 will-change-[background-color]`}>
              <div className="flex flex-col h-full group-hover:text-on-primary">
                <span className="font-headline text-4xl font-bold opacity-30 md:opacity-100 flex-shrink-0 mb-8 md:mb-12">{speaker.id}</span>
                <h4 className="font-headline text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mt-auto pb-6 md:pb-8 group-hover:translate-x-2 transition-transform duration-300">
                  {speaker.title}
                </h4>
                <div className="h-[120px] md:h-[140px] flex-shrink-0 border-t border-outline-variant/30 pt-6">
                  <p className="font-body text-sm opacity-60 uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300 delay-75 leading-relaxed">
                    {speaker.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
