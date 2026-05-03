"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import TextRollover from "@/components/TextRollover";

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
    <footer ref={container} className="w-full px-8 md:px-12 py-16 md:py-24 flex flex-col md:flex-row justify-between items-start gap-8 bg-background text-on-background font-body text-xs tracking-widest uppercase relative z-20 border-t border-outline-variant">
      <div className="flex flex-col gap-8 flex-1 max-w-sm">
        <div className="text-lg font-bold text-on-background font-headline">COLDCRAFT</div>
        <p className="opacity-50 font-body uppercase leading-relaxed">
          An AI cold mail tool built for MUJ students by a MUJ student.
        </p>
        <div className="text-on-background">
          ©2026 COLDCRAFT. ALL RIGHTS RESERVED.
        </div>
      </div>
      <div className="flex flex-wrap gap-12 md:gap-24">
        <div className="flex flex-col gap-6">
          <span className="opacity-30 text-sm">Product</span>
          <a className="text-on-surface-variant hover:text-on-background transition-colors text-lg font-headline font-bold" href="#">
            <TextRollover text="How it works" />
          </a>
          <a className="text-on-surface-variant hover:text-on-background transition-colors text-lg font-headline font-bold" href="#">
            <TextRollover text="Resume parser" />
          </a>
          <a className="text-on-surface-variant hover:text-on-background transition-colors text-lg font-headline font-bold" href="#">
            <TextRollover text="Mail composer" />
          </a>
        </div>
        <div className="flex flex-col gap-6">
          <span className="opacity-30 text-sm">Social</span>
          {socialLinks.map(({ label, href }) => (
            <a
              key={label}
              className="group text-on-surface-variant hover:text-on-background transition-colors flex items-center gap-1 text-lg font-headline font-bold"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TextRollover text={label} />
              <span className="material-symbols-outlined text-sm relative -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                arrow_forward
              </span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
