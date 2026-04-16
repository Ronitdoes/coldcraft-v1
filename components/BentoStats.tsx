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

    // Slot machine count up
    const countEl = document.querySelector(".capacity-count");
    if (countEl) {
      gsap.fromTo(countEl, 
        { innerHTML: 0 }, 
        {
          innerHTML: 2500,
          duration: 2.5,
          snap: { innerHTML: 5 },
          ease: "power3.out",
          scrollTrigger: { trigger: container.current, start: "top 80%" },
          onUpdate: function() {
            if (countEl) {
              countEl.innerHTML = Number(this.targets()[0].innerHTML).toLocaleString('en-US');
            }
          }
        }
      );
    }

    // Interactive Image Parallax
    const venueImg = document.querySelector(".venue-img");
    if (venueImg) {
      gsap.fromTo(venueImg,
        { scale: 1.3, y: -50 },
        {
          scale: 1, y: 50, ease: "none",
          scrollTrigger: {
            trigger: ".venue-container", start: "top bottom", end: "bottom top", scrub: true
          }
        }
      );
    }

  }, { scope: container });

  return (
    <section ref={container} className="px-4 md:px-8 py-16 md:py-32 bg-surface-container-lowest overflow-hidden">
      <div className="bento-container max-w-7xl mx-auto grid grid-cols-12 gap-4">
        <div className="bento-slide col-span-12 md:col-span-8 bg-primary text-on-primary p-6 md:p-12 flex flex-col justify-between aspect-video md:aspect-auto min-h-64 md:min-h-96 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-shadow duration-500">
          <span className="font-headline text-xs md:text-sm font-bold tracking-widest uppercase">
            The Capacity
          </span>
          <h4 className="capacity-count font-headline text-[20vw] md:text-9xl font-black kerning-tight leading-none tracking-tighter">
            0
          </h4>
          <p className="font-body text-base md:text-xl font-bold uppercase max-w-xs mt-auto">
            Seats remaining at early bird tier pricing.
          </p>
        </div>
        <div className="bento-slide col-span-12 md:col-span-4 bg-surface-container-high p-6 md:p-12 flex flex-col justify-between min-h-64 md:h-96 group hover:bg-surface-container transition-colors duration-500">
          <span className="material-symbols-outlined text-4xl md:text-6xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 ease-out" data-icon="database">
            database
          </span>
          <div className="mt-8 md:mt-0">
            <h4 className="font-headline text-2xl md:text-4xl font-bold mb-2 md:mb-4">
              40+ SESSIONS
            </h4>
            <p className="font-body text-sm md:text-base text-on-surface-variant">
              Deep-dive technical tracks covering distributed systems, kernel
              optimization, and AI infrastructure.
            </p>
          </div>
        </div>
        <div className="bento-slide col-span-12 md:col-span-4 bg-surface-container-high p-6 md:p-12 flex flex-col justify-between min-h-64 md:h-96 group hover:bg-surface-container transition-colors duration-500">
          <span className="material-symbols-outlined text-4xl md:text-6xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 ease-out" data-icon="terminal">
            terminal
          </span>
          <div className="mt-8 md:mt-0">
            <h4 className="font-headline text-2xl md:text-4xl font-bold mb-2 md:mb-4">
              6 WORKSHOPS
            </h4>
            <p className="font-body text-sm md:text-base text-on-surface-variant">
              Hands-on architecture labs led by the engineers who built the
              tools you use daily.
            </p>
          </div>
        </div>
        <div className="venue-container col-span-12 md:col-span-8 bg-[#2a2a2a] relative overflow-hidden min-h-64 md:min-h-96 group">
          <img
            alt="Conference venue"
            className="venue-img absolute inset-0 w-full h-full object-cover opacity-60 grayscale transition-opacity duration-1000 group-hover:opacity-40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOPugCjr3XKKXIAAD_Io4OV3dazvjQ-T3eEbqQFi8ofGsFycVKdN2rsomwRvUunorZyieIbq47AuQ7qnbB4SdDLNxfjO9TW1CM9BkeOHCgiUamJNQoaORvMuuLIn6-GZHzikLZ_Du4WgujurxCZq2WRIy4htWKeG3gQd23XpBADeOeVHfJzwpuLwXHUWT3n6oZ7LFKXrT5wWteFVvefB7V7t1p3heaDaSCBadan7d6YQhhtVaNohPdUdyzbSNgd-nvBKWbZ3FNMi4"
          />
          <div className="relative z-10 p-6 md:p-12 h-full flex flex-col justify-end pointer-events-none">
            <h4 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tighter">
              THE KRAFTWERK
              <br />
              VENUE
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
}
