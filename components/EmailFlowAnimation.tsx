"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function FloatingMail() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Reset state before starting
    gsap.set(el, {
      y: 120,
      opacity: 0,
      rotateX: -30,
      rotateY: 40,
      rotateZ: 0,
      scale: 0.7,
      transformPerspective: 1200,
    });

    const tl = gsap.timeline();

    // 1. Entrance Animation
    tl.to(el, {
      y: 0,
      opacity: 1,
      rotateX: 8,
      rotateY: -16,
      rotateZ: -4,
      scale: 1,
      duration: 2.2,
      ease: "power3.out",
    })
    // 2. Continuous Floating Loop (Seamlessly chained)
    .to(el, {
      y: -18,
      rotateX: 12,
      rotateY: -12,
      rotateZ: -2,
      duration: 2.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .mail-wrapper {
          transform-style: preserve-3d;
          will-change: transform;
        }

        .letter-content {
          background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 -8px 30px rgba(0,0,0,0.2);
        }
      `}</style>

      <div className="absolute right-[2%] lg:right-[8%] top-[18%] lg:top-[30%] pointer-events-none z-0">
        {/* Glow */}
        <div className="absolute inset-0 scale-[2] opacity-20">
          <div className="w-full h-full bg-primary/30 rounded-full blur-[80px]" />
        </div>

        {/* 3D wrapper */}
        <div
          ref={wrapperRef}
          className="relative mail-wrapper"
          style={{ opacity: 0 }} /* Start hidden to prevent flash before GSAP init */
        >
          {/* === ENVELOPE BODY === */}
          <div className="relative w-56 h-36 md:w-72 md:h-44 lg:w-80 lg:h-48">
            
            {/* ── Letter ── */}
            <div
              className="absolute left-3 right-3 md:left-4 md:right-4 bottom-[8%] rounded-sm letter-content"
              style={{
                height: "140%",
                transform: "translateZ(2px)",
              }}
            >
              <div className="p-4 md:p-5 flex flex-col gap-2.5 pt-4 md:pt-6">
                <div className="w-10 h-1.5 bg-white/40 rounded-full" />
                <div className="w-3/4 h-1 bg-white/20 rounded-full" />
                <div className="w-1/2 h-1 bg-white/20 rounded-full" />
                <div className="w-5/6 h-1 bg-white/15 rounded-full mt-2" />
                <div className="w-2/3 h-1 bg-white/15 rounded-full" />
              </div>
            </div>

            {/* ── Envelope back ── */}
            <div
              className="absolute inset-0 rounded-md"
              style={{
                transform: "translateZ(0px)",
                background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />

            {/* ── Bottom (front) fold ── */}
            <div
              className="absolute inset-0 rounded-b-md"
              style={{
                transform: "translateZ(6px)",
                clipPath: "polygon(0% 100%, 100% 100%, 50% 38%)",
                background: "linear-gradient(0deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
                backdropFilter: "blur(14px)",
                borderTop: "1px solid rgba(255,255,255,0.10)",
              }}
            />

            {/* ── Side folds ── */}
            <div
              className="absolute inset-0"
              style={{
                transform: "translateZ(4px)",
                clipPath: "polygon(0 0, 0 100%, 50% 50%)",
                background: "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(10px)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                transform: "translateZ(4px)",
                clipPath: "polygon(100% 0, 100% 100%, 50% 50%)",
                background: "linear-gradient(270deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                backdropFilter: "blur(10px)",
              }}
            />

            {/* ── Top flap (Open) ── */}
            <div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{
                height: "55%",
                transform: "translateZ(1px) rotateX(160deg)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
