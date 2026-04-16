"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";

const EmailFlowAnimation = dynamic(() => import("@/components/EmailFlowAnimation"), {
  ssr: false,
  loading: () => null // Prevents layout shifts and keeps it lightweight while loading
});

export default function Hero() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(".hero-char", {
      y: 150,
      opacity: 0,
      rotateX: -90,
      transformOrigin: "bottom center"
    }, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 1.5,
      stagger: 0.1
    })
      .fromTo(".hero-line", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.2, ease: "expo.inOut" }, "-=1.0")
      .fromTo(".hero-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2 }, "-=0.8")
      .to(".hero-arrow-path", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.2 }, "+=0.4")
      .fromTo(".hero-arrow-text", { opacity: 0, y: -10, rotate: -20 }, { opacity: 1, y: 0, rotate: -12, duration: 0.6, ease: "back.out(2)" }, "-=0.3");
  }, { scope: container });

  return (
    <section
      ref={container}
      className="min-h-screen flex flex-col justify-center px-4 md:px-8 pb-16 md:pb-32 pt-32 md:pt-48 overflow-hidden bg-black perspective-[1000px] relative"
      data-stitch-vh="min-h-[884px]===min-h-screen"
    >
      <EmailFlowAnimation />
      <div className="relative w-full text-center py-4 flex flex-col items-center justify-center pointer-events-none z-10">
        <h1 className="font-headline font-black text-huge kerning-tight text-primary select-none pointer-events-none relative mb-0 inline-block w-full">
          <span className="flex justify-center overflow-visible">
            {"MAIL".split("").map((char, i) => (
              <span key={i} className="hero-char inline-block opacity-0" style={{ transformStyle: 'preserve-3d' }}>{char}</span>
            ))}
          </span>
          <div className="absolute bottom-[0.06em] left-1/2 -translate-x-1/2 bg-primary/40 h-[1px] w-[80vw] md:w-[40vw] max-w-3xl z-[-1] hero-line transform-origin-left opacity-0 scale-x-0"></div>
        </h1>
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-12 w-full text-left mt-12 mb-12 hero-sub opacity-0 translate-y-[30px]">
            <div className="col-span-12 md:col-span-4">
              <p className="font-body text-sm leading-relaxed opacity-60 uppercase tracking-widest">
                THE GLOBAL CONFERENCE HIGHLIGHTING FRONTEND CLOUD
                ADVANCEMENTS. CONNECT WITH THE ECOSYSTEM BUILDING THE WEB'S
                BEST PRODUCTS CENTERED ON SCALE, RELIABILITY, AND SPEED.
              </p>
            </div>
            <div className="hidden md:block col-span-4"></div>
          </div>
          <div className="flex flex-col items-center gap-4 md:gap-6 mt-8 md:-mt-24 relative z-20 hero-sub opacity-0 translate-y-[30px] pointer-events-auto">
            {/* Elegant Hand-drawn Arrow (From Envelope to Button) */}
            <div className="absolute left-1/2 top-1/2 hidden md:block pointer-events-none opacity-80 z-[-1] translate-x-[8rem] lg:translate-x-[9rem] -translate-y-[85%]">
              <span className="hero-arrow-text absolute bottom-[20%] left-[15%] lg:left-[20%] text-white text-xl lg:text-3xl tracking-widest font-bold opacity-0 whitespace-nowrap" style={{ fontFamily: '"Caveat", "Comic Sans MS", cursive', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                it's free!
              </span>
              <svg className="w-[20rem] h-[16rem] lg:w-[28rem] lg:h-[22rem]" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Organic swoop from top-right to bottom-left */}
                <path className="hero-arrow-path" style={{ strokeDasharray: 600, strokeDashoffset: 600 }} d="M 320 60 C 220 70, 150 280, 15 280" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Arrowhead pointing towards right side of the button */}
                <path className="hero-arrow-path" style={{ strokeDasharray: 100, strokeDashoffset: 100 }} d="M 35 265 L 15 280 L 35 295" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <button className="bg-white text-black px-8 py-6 md:px-12 md:py-8 transition-all duration-300 hover:bg-gray-200 active:scale-95 group shadow-xl flex flex-col items-center justify-center min-w-[280px] md:min-w-[320px] rounded-xl hover:scale-105 hover:shadow-2xl relative z-10">
              <span className="block font-headline font-bold text-2xl md:text-3xl mb-1">
                Get Tickets
              </span>
              <span className="block font-body text-base md:text-lg opacity-70 font-medium flex items-center gap-2">
                In-person / Virtual
                <div className="relative overflow-hidden flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
                    arrow_forward
                  </span>
                  <span className="material-symbols-outlined text-xl absolute transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] -translate-x-[150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0">
                    arrow_forward
                  </span>
                </div>
              </span>
            </button>
            <a
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
              href="#"
            >
              ALREADY REGISTERED? <span className="font-bold">LOG IN</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
