"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { playHoverSound } from "@/lib/sounds";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(container.current,
      { y: 100, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.2, ease: "power4.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 95%",
        },
      }
    );
  }, { scope: container });

  const socialLinks = [
    { label: "GITHUB", href: "#" },
    { label: "LINKEDIN", href: "#" },
    { label: "TWITTER / X", href: "#" },
  ];

  return (
    <footer ref={container} className="w-full px-8 md:px-12 py-16 md:py-24 flex flex-col md:flex-row justify-between items-start gap-8 bg-[#0e0e0e] text-[#ffffff] font-body text-xs tracking-widest uppercase relative z-20 border-t border-[#222]">
      <div className="flex flex-col gap-8 flex-1 max-w-sm">
        <div className="text-lg font-bold text-[#ffffff] font-headline">COLDCRAFT</div>
        <p className="opacity-50 font-body uppercase leading-relaxed">
          An AI cold mail tool built for MUJ students by a MUJ student.
        </p>
        <div className="text-[#ffffff]">
          ©2026 COLDCRAFT. ALL RIGHTS RESERVED.
        </div>
      </div>
      <div className="flex flex-wrap gap-12 md:gap-24">
        <div className="flex flex-col gap-4">
          <span className="opacity-30">Product</span>
          <a className="text-[#c6c6c6] hover:text-[#ffffff] transition-colors" href="#" onMouseEnter={playHoverSound}>
            How it works
          </a>
          <a className="text-[#c6c6c6] hover:text-[#ffffff] transition-colors" href="#" onMouseEnter={playHoverSound}>
            Resume parser
          </a>
          <a className="text-[#c6c6c6] hover:text-[#ffffff] transition-colors" href="#" onMouseEnter={playHoverSound}>
            Mail composer
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="opacity-30">Social</span>
          {socialLinks.map(({ label, href }) => (
            <a
              key={label}
              className="group text-[#c6c6c6] hover:text-[#ffffff] transition-colors flex items-center gap-1"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHoverSound}
            >
              {label}
              <span className="material-symbols-outlined text-xs relative -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                arrow_forward
              </span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
