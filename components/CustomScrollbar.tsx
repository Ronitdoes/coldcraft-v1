"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function CustomScrollbar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging = useRef(false);
  const progressRef = useRef(0);
  const thumbRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isMounted && containerRef.current) {
      gsap.to(containerRef.current, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        delay: 1.5,
        ease: "power4.out",
      });
    }
  }, [isMounted]);

  const getThumbHeight = useCallback(() => {
    const ratio = window.innerHeight / document.body.scrollHeight;
    return Math.max(140, window.innerHeight * ratio);
  }, []);

  const updateThumbPosition = useCallback((progress: number) => {
    if (!thumbRef.current) return;
    const thumbH = getThumbHeight();
    const offset = progress * (window.innerHeight - thumbH);
    thumbRef.current.style.transform = `translateY(${offset}px)`;
  }, [getThumbHeight]);

  useEffect(() => {
    setIsMounted(true);

    const renderLoop = () => {
      if (!thumbRef.current) return;
      const lenisInst = (window as any).lenis;
      const winScroll = lenisInst
        ? lenisInst.scroll
        : document.documentElement.scrollTop;
      const maxScroll =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (maxScroll > 0) {
        progressRef.current = winScroll / maxScroll;
        updateThumbPosition(progressRef.current);
      }
    };

    gsap.ticker.add(renderLoop);

    const markScrolling = () => {
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 700);
    };

    window.addEventListener("scroll", markScrolling, { passive: true });

    return () => {
      gsap.ticker.remove(renderLoop);
      window.removeEventListener("scroll", markScrolling);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [updateThumbPosition]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      isDragging.current = true;
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      const startY = e.clientY;
      const startProgress = progressRef.current;
      const thumbH = getThumbHeight();
      const trackRange = window.innerHeight - thumbH;

      const onMove = (evt: PointerEvent) => {
        if (!isDragging.current || trackRange <= 0) return;
        const delta = (evt.clientY - startY) / trackRange;
        const clamped = Math.max(0, Math.min(1, startProgress + delta));
        progressRef.current = clamped;

        const maxScroll =
          document.body.scrollHeight - window.innerHeight;
        window.scrollTo({ top: clamped * maxScroll, behavior: "instant" as ScrollBehavior });
      };

      const onUp = () => {
        isDragging.current = false;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        scrollTimeout.current = setTimeout(() => setIsScrolling(false), 700);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [getThumbHeight]
  );

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 right-0 h-screen w-[40px] pointer-events-none z-[9999] mix-blend-difference hidden md:block opacity-0 translate-x-[50px]"
    >
      <div
        ref={thumbRef}
        className={`absolute top-0 right-0 bg-white pointer-events-auto cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden will-change-transform
          ${isScrolling ? "w-[6px] mr-2 opacity-80" : "w-[36px] mr-0 opacity-100"}
        `}
        style={{
          height: `${getThumbHeight()}px`,
          transitionProperty: "width, margin, opacity",
          transitionDuration: "500ms",
          transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
        }}
        onPointerDown={handlePointerDown}
      >
        <div
          className={`whitespace-nowrap font-headline font-black text-[14px] kerning-tight uppercase text-black select-none
            ${isScrolling ? "opacity-0" : "opacity-100"}
          `}
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            transitionProperty: "opacity",
            transitionDuration: "300ms",
          }}
        >
          ● C O L D C R A F T
        </div>
      </div>
    </div>
  );
}
